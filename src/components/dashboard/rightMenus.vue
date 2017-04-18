<template>
    <li :class="{ 'active':isActive,'nav-showchild':isExpand }">
        <a :href="showMenuUrl" :target="menu.target" :class="{ 'active':isActive}" @click="handleOpen"  v-bind="menu.data">
            <div class="nav-icon" :style="{'margin-left': 10+(level)*8+'px'}">
                <div v-if="hasChild(menu.child)">
                    <i class="fa fa-caret-down" v-if="isExpand"></i>
                    <i class="fa fa-caret-right" v-else></i>
                </div>

                <div v-if="!hasChild(menu.child)" :class="menu.iconCls" :style="menu.iconStyle" v-html="returnIcon(menu.icon)"  ></div>
            </div>
            <div class="nav-title" :class="menu.textCls" :style="menu.textStyle">{{ menu.name }}</div>
        </a>

        <ul v-if="hasChild(menu.child)">
            <right-menus v-for="(sub,index) in menu.child" :menu="sub" :opened-menu="openedMenu" :level="level+1" :key="index"> </right-menus>
        </ul>

    </li>

</template>
<script>
    import {fnMenu} from '../../utils/fn'
    export default{
        name:'RightMenus',
        props: {
            menu:{type:Object,required:true},
            //已打开的菜单
            openedMenu:{type:Object,required:true},
            //当前菜单层级 默认从0开始
            level:{type:Number,default:0}
        },
        computed:{
            //是否激活状态
            isActive(){
                return  this.menu.name==this.openedMenu.name && this.menu.url==this.openedMenu.url ;
            },
            //格式化url 如果target=_blank || http开头网址不操作，否则网址前加上#
            showMenuUrl:function(){
                return fnMenu.showMenuUrl(this.menu.url,this.menu.target);
            }
        },
        data(){
            return {isExpand:true}
        },
        methods:{
            returnIcon : function (icon) {
			    return fnMenu.showMenuIcon(icon);
			},
            //判断菜单是否有子菜单
			hasChild: function (objChild) {
				return fnMenu.hasChild(objChild);
			},
			handleOpen:function(){
			    this.isExpand=!this.isExpand
			}
		}
    }

</script>
