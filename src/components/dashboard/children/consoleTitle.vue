<template>
    <div class="console-title console-title-border margin-bottom-24">
        <div class="pull-left">
              <template v-if="haveHTag"><slot></slot></template>
              <template v-else><h3><slot></slot></h3></template>
        </div>
        <div class="pull-right">
            <slot name="right"> </slot>
        </div>
    </div>
</template>

<script lang="babel">
import {oneOf} from '../../../utils/fn.js'
    export default{
        name:'ConsoleTitle',
        data(){
            return{
                haveHTag:false
            }
        },
        created(){
            //如果未包含H元素，默认添加h3
            if(this.$slots.default){
                this.$slots.default.map(item=>{
                    if(oneOf(item.tag,['h1','h2','h3','h4','h5'])){
                        this.haveHTag = true;
                    }
                })
            }
        },
        components:{
        }
    }
</script>
