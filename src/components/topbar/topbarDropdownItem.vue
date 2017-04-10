<template>
    <li class="divider" v-if="name=='divider'"></li>
    <li :class="{'wula-dropdown-item-disabled':disabled}" v-else>
        <a tabindex="-1" :href="disabled?'javascript:void(0);':showUrl" :target="target" v-bind="data">
            <span :class="iconCls" :style="iconStyle" v-html="iconHtml" v-if="icon"></span>
            <span :class="textCls" :style="textStyle" v-cloak> {{name}} </span>
            <span class="topbar-submenu-badge" v-if='badge'>{{badge}}</span>
        </a>
    </li>
</template>

<script lang="babel">
    import {fnMenu} from '../../utils/fn'
    export default{
        name      : 'TopbarDropdownItem',
        props     : {
            name     : {
                type    : String,
                required: true
            },
            url      : {
                type    : String,
            },
            data     : {
                type   : Object,
                default: ()=> {
                    return {};
                },
            },
            icon     : String,
            iconCls  : String,
            iconStyle: String,
            textCls  : String,
            textStyle: String,
            badge    : String,
            target   : String,
            disabled : {
                type:Boolean,
                default:false
            }
        },
        computed  : {
            iconHtml(){
                if (this.icon && this.icon.substring(0, 1) != '<') {
                    return '<i class="' + this.icon + '"></i>';
                } else if (this.icon) {
                    return this.icon;
                } else {
                    return '';
                }
            },
            showUrl(){
                return fnMenu.showMenuUrl(this.url, this.target);
            }
        },
        data(){
            return {
                msg: 'hello vue'
            }
        },
        components: {}
    }
</script>
