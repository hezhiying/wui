<template>
    <li  :class="{ 'active':isActive }">
        <Tooltip :content="tips" placement="right" class="wula-tips" :disabled="sidebarFull">
            <a :href="showMenuUrl" :target="menu.target" @click="openSubMenus" v-bind="menu.data">
                <span class="sidebar-item-icon" :class="menu.iconCls" :style="menu.iconStyle" v-html="icon"></span>
                <span class="sidebar-item-title" :class="menu.textCls" :style="menu.textStyle" v-cloak> {{menu.name}} </span>
            </a>
        </Tooltip>

    </li>
</template>

<script>
    import {fnMenu} from '../../utils/fn'

    export default{
        name:'LeftMenuItem',
        props:{
            menu:{type: Object,required: true},
            //默认的ICON
            menuIcon:{type:String,default:'<i class="fa fa-file-o"></i>'},
            sidebarFull:{type:Boolean,required: true}
        },
        computed:{
            //判断当前二级菜单是否应该为激活状态
            isActive:function(){
                return this.$parent.$parent.activeMenu.uid == this._uid;

            },
            //隐藏时的提示内容
            tips:function(){
                if(this.menu.desc){
                    return this.menu.desc;
                }else{
                    return this.menu.name;
                }
            },
            //如果menu没有icon,使用默认的icon设置
            icon:function(){
                let icon = fnMenu.showMenuIcon(this.menu.icon);
                return icon?icon:this.menuIcon;
            },
            //格式化url 如果target=_blank || http开头网址不操作，否则网址前加上#
            showMenuUrl:function(){
                return fnMenu.showMenuUrl(this.menu.url,this.menu.target);
            }
        },
        created:function(){
            this.menu.uid=this._uid;
            const that = this;

            this.$on('dashboard-leftMenuItem-openByUID', function (uid) {
                //收到激活状态，通知展开父级菜单
                if(uid == that._uid){
                    that.$parent.expand = true;
                }
            });
        },
        methods:{
			openSubMenus:function(){
			    this.$parent.$parent.activeMenu = this.menu;
			}
        }
    }
</script>
