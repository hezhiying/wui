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
    import {oneOf,handleAjaxResult} from '../../utils/fn'
    export default{
        name:'AjaxButton',
        props: {
            callback:{
				type: Function
            },
            type: {
                validator (value) {
                    return oneOf(value, ['primary', 'ghost', 'dashed', 'text', 'info', 'success', 'warning', 'error']);
                }
            },
            shape: {
                validator (value) {
                    return oneOf(value, ['circle', 'circle-outline']);
                }
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            disabled: Boolean,
            htmlType: {
                default: 'button',
                validator (value) {
                    return oneOf(value, ['button', 'submit', 'reset']);
                }
            },
            icon: String,
            long: {
                type: Boolean,
                default: false
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
            placement:String,
            dialog:{
                type:Boolean,
                default:false
            },
            dialogData:{
                type:Object,
                default(){return {}}
            },
            showLoading:{
            	type:Boolean,
                default:true
            }
        },
        data(){
            return{
                loading:false
            }
        },
        methods:{
            handleClick(){
                let that = this;
                if(this.dialog){
                    Dialog.open(Object.assign({
                        url:this.url
                    },this.dialogData));
                }else{
                    this.loading = true
                    ajax.any({
                        url     : this.url,
                        dataType: 'json',
                        method  : this.method
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
