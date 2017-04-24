import $ from 'jquery';
let modalInstance;
let Dialog = {};
let modals = {};
let DialogCount = 1;

let dialogObj = function(properties) {
    let dIndex = DialogCount++;
    modals[dIndex] = this;
    const _props = properties || {};
    const div = document.createElement('div');
    div.id="wula-dialog";
    div.dataset.index = dIndex

    div.innerHTML = `
		<Modal v-model="visible" :width="width" :title="title" @on-ok="ok" :footer-hide="footerHide" :mask-closable="maskClosable" :closable="closable" @on-cancel="cancel" @on-remove-dialog="cancel">
		    <div style="position: relative;min-height: 30px;">
		        <div id="dialog-body-${dIndex}"> </div>
		        <div class="ivu-modal-confirm-footer" v-if="showOk || showCancel">
		            <i-button type="text" v-if="showCancel" @click.native="cancel">{{ cancelText }}</i-button>
		            <i-button type="primary" v-if="showOk" @click.native="ok">{{ okText }}</i-button>
		        </div>
		        <Spin fix v-if="spinShow"></Spin>
		    </div>
		</Modal>
    `;
    document.body.appendChild(div);
    const modal = new Vue({
        el: div,
        data: Object.assign({
            visible: false,
            width: 520,
            title: '',
            okText: '确定',
            cancelText: '取消',
            showCancel: false,
            showOk: true,
            footerHide: true,
            closable: true,
            maskClosable: false,
            url: '',
            content: '',
            spinShow: false
        }, _props),
        watch: {
            content(val, oldVal) {
                this.setContent(val);
            }
        },
        mounted() {
            if (this.url) {
                let that = this;
                $.ajax({
                    url: this.url,
                    dataType: 'html',
                    method: 'get',
                    beforeSend() {
                        that.spinShow = true
                    }
                }).done((response) => {
                    this.setContent(response.getBody());
                }).fail((error) => {
                    this.setContent(error.responseText.getBody());
                }).always(() => {
                    this.spinShow = false
                });
            } else if (this.content) {
                this.setContent(this.content);
            }
        },
        methods: {
            setContent(content) {
                let dID = "#dialog-body-" + dIndex;
                $(dID).html(content)
                let dialogTitle = $(dID).find("#dialog-title").html();
                if(dialogTitle){
                    this.title = dialogTitle;
                    $(dID).find("#dialog-title").remove();
                }
                if (!$(dID).find("script").html()) {
                    /**
                     * 如果没有脚本自动加上vue初始化
                     */
                    new Vue({
                        el: dID
                    })
                }
            },
            cancel() {
                this.$children[0].visible = false;
                this.onCancel();
                this.remove();
            },
            ok() {
                if (this.loading) {
                    this.buttonLoading = true;
                } else {
                    this.$children[0].visible = false;
                    this.remove();
                }
                this.onOk();
            },
            onOk() {},
            onCancel() {},
            remove() {
                this.destroy();
            },
            destroy() {
                delete modals[dIndex];
                this.visible = false;
                this.$destroy();
                document.body.removeChild(this.$el);
                modalInstance = null;
                this.onRemove();
            },
            onRemove() {}
        }
    }).$children[0];
    this.modalInstance = modal;
    return this;
};

dialogObj.prototype.show = function() {
    if (!this.modalInstance) { // at loading status, remove after Cancel
        return false;
    }
    this.modalInstance.visible = true;
    return this;
}
dialogObj.prototype.remove = function() {
    if (!this.modalInstance) { // at loading status, remove after Cancel
        return false;
    }
    this.modalInstance.visible = false;
    this.modalInstance.$parent.remove();
    return this;
}

Dialog.open = function(props = {}) {
    return new dialogObj(props).show();
}

Dialog.remove = function(index = null) {
    if(index){
      if(modals[index]){
        modals[index].remove();
      }
    }else{
      for (let modal of Object.values(modals)) {
          if (modal) {
              modal.remove();
          }
      }
    }

};

export default Dialog;
