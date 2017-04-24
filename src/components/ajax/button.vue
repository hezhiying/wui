<template>
    <Poptip :placement="placement" confirm :title="confirm" @on-ok="handleClick"  v-if="confirm">
        <Button
                ref = "ajaxButton"
                :type="type"
                :shape="shape"
                :size="size"
                :loading="loading && showLoading"
                :disabled="disabled"
                :html-type="htmlType"
                :icon="icon"
                :long="long" > <slot> </slot> </Button>
    </Poptip>

    <Button
            v-else
            ref = "ajaxButton"
            :type="type"
            :shape="shape"
            :size="size"
            :loading="loading"
            :disabled="disabled"
            :html-type="htmlType"
            :icon="icon"
            :long="long" @click="handleClick"><slot> </slot> </Button>



</template>
<style>

</style>
<script>
    import Dialog from '../dialog'
    import ajax from '../../utils/ajax'
    import {oneOf} from '../../utils/fn'
    export default{
        name:'AjaxButton',
        props: {
            callback:{
				type: Function
            },
            method:{
                default: 'get',
                validator (value) {
                    return oneOf(value, ['get', 'post', 'put', 'delete']);
                }
            },
            url:{
                type:String,
                required:true
            },
            confirm:{
                type:String
            },
            params:{
                type:Object
            },
            dialog:{
                type:[Boolean,Object],
                default:false
            },
            showLoading:{
            	type:Boolean,
                default:true
            },
            //poptip组件
            placement:String,

            //button组件
            type:String,	//按钮类型，可选值为primary、ghost、dashed、text、info、success、warning、error或者不设置	String	-
            size:String,	//按钮大小，可选值为large和small或者不设置	String	-
            shape:String,	//按钮形状，可选值为circle或者不设置	String	-
            long:Boolean,	//开启后，按钮的长度为 100%	Boolean	false
            htmlType:String,	//设置button原生的type，可选值为button、submit、reset	String	button
            disabled:Boolean,	//设置按钮为禁用状态	Boolean	false
            icon:String,
        },
        data(){
            return{
                loading:false
            }
        },
        created(){
            console.log(this.$props)
        },
        methods:{
            handleClick(){
                let that = this;
                if ( this.loading ){
                    return ;
                }

                if(this.dialog){
                    Dialog.open(Object.assign({
                        url:this.url
                    },this.dialog));
                }else{
                    this.loading = true
                    ajax.any({
                        url     : this.url,
                        dataType: 'json',
                        method  : this.method,
                        data    : this.params
                    }).json((responseJson)=>{
                    	if(responseJson.code === 200 && typeof that.callback === 'function'){
                    		that.callback.call(that.$parent);
                        }
                    }).always(data=>{this.loading = false})

                }

            }

        },
        components:{}
    }
</script>
