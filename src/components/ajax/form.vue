<template>
    <Form
            ref = "ajaxForm"
            :rules="formData.rules"
            :model="formData.forms"
            :label-width="labelWidth"
            :label-position="labelPosition"
            :inline="inline"
            :show-message="showMessage">
        <slot> </slot>

        <slot name="submit">
            <Form-item>
                <Button type="primary" @click="submit" :loading="loading" v-if="showSubmit">{{submitText}}</Button>
                <Button type="ghost" @click="reset" class="margin-left-8" v-if="showReset">{{resetText}}</Button>
                <slot name="extra">

                </slot>
            </Form-item>
        </slot>
    </Form>
</template>
<script>
    import $ from 'jquery'
    import {oneOf} from '../../utils/fn'
    import ajax from '../../utils/ajax'

    export default{
        name:'AjaxForm',
        props: {
            formData:{
                type:Object,
                required:true,
                default: {forms:{},rules:{}}
            },
            ajax:{
                type:Boolean,
                default:true
            },
            url:{
                type:String,
                required:true
            },
            method:{
                type:String,
                validator (value) {
                    return oneOf(value, ['get', 'post', 'put', 'delete']);
                },
                default:'post'
            },
            showReset:{
                type:Boolean,
                default:false

            },
            showSubmit:{
                type:Boolean,
                default:true

            },
            labelWidth: {
                type: Number
            },
            labelPosition: {
                type:String,
            },
            inline: {
                type: Boolean,
                default: false
            },
            showMessage: {
                type: Boolean,
                default: true
            },
            submitText:{
                type:String,
                default:'提交'
            },
            resetText:{
                type:String,
                default:'重置'
            }
        },
        data(){
            return{
                loading:false
            }
        },
        created(){
          //console.log(this.$props,);
        },
        methods:{
            submit(){
                this.$refs.ajaxForm.validate((valid) => {
                    if (valid) {
                        if(this.ajax){
                            this.submitAjax();
                        }else{
                            this.$refs.ajaxForm.$el.submit();
                        }
                    } else {
                        console.log('表单验证失败!');
                    }
                })
            },
            reset(){
                this.$refs.ajaxForm.resetFields();
            },
            /**
             *
             * @param errors
             * {"field":"错误提示","field":["错误提示1","错误提示2"]}
             */
            onValidate(errors = {}){
                let form = this.$refs['ajaxForm'];
                form.fields.forEach(field => {
                    if(field.prop && errors[field.prop]){
                        field.validateState = "error";
                        field.validateMessage = typeof errors[field.prop]=='object'?errors[field.prop][0]:errors[field.prop];
                    }
                });
            },

            submitAjax(){
                let ops ={};
                ops.loading = false;
                ops.vm = this;
                ops.url = this.url;
                ops.method = this.method;
                ops.params = this.formData.forms;
                this.loading = true;
                ajax.any(ops).json((data)=>{
                  if(Number.parseInt(data.code) == 200){
                    this.$emit('on-submit',data);
                  }
                }).always((data)=>{this.loading = false;});
            },
            submitAjax2(){
                this.loading = true;
                $.ajax(this.url,{
                    method: this.method,
                    data:this.formData.forms,
                    dataType:'json'
                }).done( data=>{
                    if(data.action == "validate")
                    {
                        let fields = this.$refs.ajaxForm.fields;
                        let errors = data.args.errors||{};
                        this.$refs.ajaxForm.fields.forEach(field => {
                            if(errors[field.prop]){
                                field.validateState = "error";
                                field.validateMessage = typeof errors[field.prop]=='object'?errors[field.prop][0]:errors[field.prop];
                            }
                        });
                    }else if(data.code == 200){
                        this.$emit('on-submit',data);
                    }
                }).fail(data=>{
                    this.$Modal.error({
                        title: '错误',
                        content: data.responseText?data.responseText.getBody():'网络异常'
                    });

                }).always(()=>{this.loading = false;})
            }
        },
        components:{}
    }
</script>
