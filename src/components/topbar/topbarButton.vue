<template>
    <div class="wula-topbar-item">
        <wula-ajax-link class="wula-topbar-btn" :url="showUrl" :target="target" v-bind="data">
            <span :class="iconCls" :style="iconStyle" v-html="iconHtml" v-if="icon"></span>
            <span :class="textCls" :style="textStyle" v-cloak> {{name}} </span>
            <span class="wula-badge" v-if='badge'>{{badge}}</span>
        </wula-ajax-link>
    </div>

</template>


<script lang="babel">
    import {fnMenu} from '../../utils/fn'
    export default{
        name : 'TopbarButton',
        props: {
            name     : {
                type    : String,
                required: true
            },
            url     : {
                type    : String,
                required: true
            },
            data     : {
                type    : Object,
                default: ()=>{ return {};},
            },
            icon     : String,
            iconCls  : String,
            iconStyle: String,
            textCls  : String,
            textStyle: String,
            badge    : String,
            target    : String

        },
        computed:{
            iconHtml(){
                return fnMenu.showMenuIcon(this.icon);
            },
            showUrl(){
                return fnMenu.showMenuUrl(this.url,this.target);
            }
        },
        components: {}
    }
</script>
