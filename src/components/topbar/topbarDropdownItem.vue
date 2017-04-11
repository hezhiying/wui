<template>
    <li class="divider"
        v-if="name=='divider'">
    </li>
    <li :class="{'wula-dropdown-item-disabled':disabled}"
        v-else>
        <wula-ajax-link :url="showUrl" :target="target" v-bind="data" :disabled="disabled">
            <span :class="iconCls" :style="iconStyle" v-html="iconHtml" v-if="icon"></span>
            <span :class="textCls" :style="textStyle" v-cloak> {{name}} </span>
            <span class="topbar-submenu-badge" v-if='badge'>{{badge}}</span>
        </wula-ajax-link>
    </li>
</template>

<script lang="babel">
    import {fnMenu} from '../../utils/fn'
    import ajax from '../../utils/ajax'
    export default{
        name      : 'TopbarDropdownItem',
        props     : {
            name     : {
                type    : String,
                required: true
            },
            url      : {
                type    : String,
                default : ''
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
        methods:{
            handleClick(){
          
                let url = this.url;
                let target = this.target;
                if (target == '_self') {
                    location.href = url;
                } else if (target == '_blank') {
                    window.open(url);
                } else if (/^https?:\/\/.+/i.test(url)) {
                    location.href = url;
                } else if (target == 'ajax') {
                    ajax.any({
                        url     : fnMenu.formatHashUrl(url),
                        dataType: 'json',
                        method  : this.data.method?this.data.method:'get'
                    }).json((data)=>{
                        console.log(data)
                    });

                } else {
                    location.href = url;
                }

            },
            handleConfirm(){
                console.log('confirm')
                let title = this.data.confirmTitle?this.data.confirmTitle:'确认';
                this.$Modal.confirm({title:title,content:this.data.confirm,onOk:()=>{this.handleClick()}})
            }
        },
        components: {}
    }
</script>
