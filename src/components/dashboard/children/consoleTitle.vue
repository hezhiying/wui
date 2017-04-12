<template>
    <div class="console-title console-title-border margin-bottom-24">
        <div class="pull-left">
            <h3>
                <slot> </slot>
            </h3>
        </div>
        <div class="pull-right">
            <slot name="right"> </slot>
        </div>
    </div>
</template>

<script lang="babel">
    export default{
        name:'ConsoleTitle',
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
        }
    }
</script>
