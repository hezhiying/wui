<template>
    <div class="console-right-sidebar">
        <div class="right-sidebar" :class="{'right-sidebar-full':visible}">
            <div class="right-sidebar-body">
                <h3>{{label}}</h3>
                <div class="right-sidebar-form">
                    <slot></slot>
                </div>
            </div>
            <div class="right-sidebar-close">
                <div class="right-sidebar-close-inner">
                    <div class="right-sidebar-close-icon fa" @click="close"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="babel">
    export default{
        name:'RightBar',
        props:{
            label:{
                type:String,
                default:'高级搜索'
            },
            value: {
                type: Boolean,
                default: false
            },
        },
        data(){
            return {
                visible:this.value
            }
        },
        watch:{
            value (val) {
                this.visible = val;
            },
            visible(val){
                if(val){
                    this.$emit('on-open',val);
                }else{
                    this.$emit('on-close',val);
                }
            }
        },
        methods:{
            close(){
                this.visible = !this.visible;

            }
        }
    }
</script>
