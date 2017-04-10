<template>
    <div class="console-title console-title-border margin-bottom-24">
        <div class="pull-left">
            <h5 >
                <slot> </slot>
            </h5>
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
