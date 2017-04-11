<template>
    <Poptip :placement="placement"
            confirm
            :title="confirm"
            @on-ok="openUrl"
            v-if="confirm && !confirmTitle && !disabled">
        <a 
           :class="className"
           :href="url"
           :target="target"
           @click.prevent="">
            <slot></slot>
        </a>
    </Poptip>
    <a v-else
       :class="className"
       :href="url"
       :target="target"
       @click.prevent="handleClick">
        <slot></slot>
    </a>
</template>
<script lang="babel">
    import Dialog from '../dialog'
    import ajax from '../../utils/ajax'
    import {oneOf,handleAjaxResult} from '../../utils/fn'
    export default{
        name:'AjaxLink',
        props: {
            url      : {
                type    : String,
                default : ''
            },
            target   : String,
            className   : String,
            disabled : {
                type:Boolean,
                default:false
            },
            method:{
                default: 'get',
                validator (value) {
                    return oneOf(value, ['get', 'post', 'put', 'delete']);
                }
            },
            params:{
                type:Object
            },
            confirm:{
                type:String
            },
            confirmTitle:{
                type:String
            },
            placement:String,
            dialog:{
                type:Boolean,
                default:false
            },
            dialogData:{
                type:Object,
                default(){return {}}
            }
        },
        data(){
            return{
                loading:false
            }
        },
        methods:{
            handleClick(event){
                let that = this;
                if(this.disabled){
                    return false;
                }
     
                if(this.confirmTitle){
                    this.$Modal.confirm({
                        title:this.confirmTitle,
                        content:this.confirm,
                        onOk:()=>{
                            setTimeout(() => {this.openUrl()}, 300);
                        }
                    })
                }else{
                    this.openUrl(event)
                }
                    
                
            },
            openUrl(){
                if(this.target == 'dialog' || this.dialog){
                    Dialog.open(Object.assign({
                        url:this.url
                    },this.dialogData));
                }else if(this.target == 'ajax'){
                    this.loading = true
                    ajax.any({
                        url     : this.url,
                        dataType: 'json',
                        method  : this.method
                    }).json().always(data=>{this.loading = false})
                }else if(this.target == '_blank'){
                    window.open(this.url)
                }else{
                    location.href=this.url;
                }
            }

        },
        components:{}
    }
</script>
