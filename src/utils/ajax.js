import $ from 'jquery';
import iView from '../iview'
import Dialog from '../components/dialog'

let Loading = iView.LoadingBar;
let Message = iView.Message;
let Notice = iView.Notice;
let Modal = iView.Modal;

$.ajaxSetup({
    beforeSend(jqXHR, opts) {
        jqXHR.options = opts;
        Loading.config({
            color: '#1ab394',
            failedColor: '#f0ad4e',
            height: 5
        });
        Loading.start();
    },
    //Anything data, String textStatus, jqXHR jqXHR
    success(data, textStatus, jqXHR) {
        Loading.finish();
    },
    //jqXHR jqXHR, String textStatus, String errorThrown
    error(jqXHR, textStatus, errorThrown) {
        Loading.error();
    },
    //jqXHR jqXHR, String textStatus
    complete(jqXHR, textStatus) { }
});

var ajaxObj = function (method, url, params, opts) {
    this.vm = opts.vm || null;
    this.responseJson = {};
    this.opts = Object.assign({}, {
        url: url,
        method: method,
        data: params,
        dataType: 'json',
    }, opts);

};

ajaxObj.prototype.handleAction = {
    validate(errors = null) {
        errors = errors ? errors : this.responseJson.args ? this.responseJson.args.errors : null;
        if (typeof this.opts.vm.onValidate == 'function' && errors) {
            this.opts.vm.onValidate(errors)
        } else {
            Modal.error({
                title: '错误',
                content: '数据提交验证失败'
            });
        }
    },
    redirect(targetUrl = null) {
        targetUrl = targetUrl ? targetUrl : this.responseJson.target;
        this.handleMsg[this.msgType()].call(this, function () {
            if (targetUrl) {
                if (targetUrl.startsWith('#')) {
                    window.location.hash = targetUrl;
                } else {
                    window.location.href = targetUrl;
                }
            }

        })

    },
    dialog(dialogConfig = null) {
        let data = this.responseJson.args || {};
        dialogConfig = dialogConfig ? dialogConfig : {
            title: data.title || '',
            content: data.content || '',
            width: data.width || 520,
            url: data.ajax || ''
        }
        let that = this;
        this.handleMsg[this.msgType()].call(this, function () {
            that.dialog = Dialog.open(dialogConfig);
        })
    }
}
ajaxObj.prototype.handleMsg = {
    message(cb = null) {
        if (!this.msgContent()) {
            if (cb) {
                cb.call()
            }
            return false;
        }
        Message[this.msgTextStatus()](this.msgContent());
        if (cb) {
            cb.call()
        }
    },
    notice(cb = null) {
        if (!this.msgContent()) {
            if (cb) {
                cb.call()
            }
            return false;
        }
        Notice[this.msgTextStatus()]({
            title: this.msgTitle(),
            desc: this.msgContent()
        });
        if (cb) {
            cb.call()
        }
    },
    confirm(cb = null) {
        if (!this.msgContent()) {
            if (cb) {
                cb.call()
            }
            return false;
        }
        Modal.confirm({
            title: '确认操作',
            content: this.msgContent(),
            loading: false,
            onOk: () => {
                if (typeof (cb) == "function") {
                    cb(true);
                }
            }
        });
    }
}

ajaxObj.prototype.msgType = function () {
    return this.responseJson.style || 'message';
}
ajaxObj.prototype.msgTextStatus = function () {
    let code = this.responseJson.code || '200';
    let codeType;
    switch (code.toString().substring(0, 1)) {
        case '2':
            codeType = 'success';
            break;
        case '3':
            codeType = 'info';
            break;
        case '4':
            codeType = 'warning';
            break;
        case '5':
        default:
            codeType = 'error';
            break;
    }
    return codeType;
};
ajaxObj.prototype.msgContent = function () {
    return this.responseJson.message || '';
};
ajaxObj.prototype.msgTitle = function () {
    let title = '';
    let msgTextStatus = this.msgTextStatus();
    if (msgTextStatus == 'success') {
        title = '操作成功';
    } else if (msgTextStatus == 'info') {
        title = '';
    } else if (msgTextStatus == 'warning') {
        title = '警告';
    } else if (msgTextStatus == 'error') {
        title = '错误';
    }
    return title;
};


ajaxObj.prototype.json = function (cb = null) {
    this.opts.dataType = 'json';
    return $.ajax(this.opts).done(data => {
        if (typeof data.code == 'number' || typeof data.code == 'string') {
            this.responseJson = data;
            let action = data.action;
            if (action && typeof this.handleAction[action] == 'function') {
                this.handleAction[action].call(this);
            } else {
                this.handleMsg[this.msgType()].call(this);
            }

        } else {
            console.warn('json格式不正确');
        }
    }).done(data => {
        if (cb) {
            cb.call(this, data);
        }
    }).fail((jqXHR) => {
        if (jqXHR.status == 422) {
            var errors = jqXHR.responseJSON || jqXHR.responseText || {};
            var validateObj = this.elm.data('validateObj');
            this.handleAction.validate.call(this, errors)
        }
        //iview Bug,需要延时300秒显示，否则可能被上一个窗口关闭
        setTimeout(() => {
            Modal.error({
                title: '错误',
                width: 650,
                content: jqXHR.responseText ? jqXHR.responseText.getBody() : '网络异常'
            });
        }, 300);

    });
};

ajaxObj.prototype.html = function (cb) {
    this.opts.dataType = 'html';
    return $.ajax(this.opts).done(cb);
};

export default {
    put(url, params = {}, opts = {}) {
        return new ajaxObj('put', url, params, opts);
    },
    get(url, params = {}, opts = {}) {
        console.log(this.ajax);
        return new ajaxObj('get', url, params, opts);
    },
    post(url, params = {}, opts = {}) {
        return new ajaxObj('post', url, params, opts);
    },
    del(url, params = {}, opts = {}) {
        return new ajaxObj('delete', url, params, opts);
    },
    head(url, params = {}, opts = {}) {
        return new ajaxObj('head', url, params, opts);
    },
    any(opts) {
        let url;
        let method = 'get';
        let params = {};
        if (typeof opts == 'string') {
            url = opts;
        } else if (typeof opts == 'object') {
            url = opts.url;
            method = opts.method || method;
            params = opts.params || params;
        }
        return new ajaxObj(method, url, params, opts);

    },
    req(opts) {
        let url, params;
        if (typeof opts == 'string') {
            url = opts;
        } else if (typeof opts == 'object') {
            url = opts.url;
            params = opts.params;
        }

        return new ajaxObj('get', url).json((d) => {
            console.log(d)
        });
    }
};
