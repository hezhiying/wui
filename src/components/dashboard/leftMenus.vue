<template>
    <div class="sidebar-nav" :class="{'sidebar-nav-fold':!expand && childLength > 0 && menu.name}">
        <!--如果有多级菜单-->
        <div class="sidebar-nav-head" @click="expand=!expand" v-if="childLength > 0 && menu.name">
            <span class="sidebar-title-icon"> <i class="fa fa-caret-down"></i> </span>
            <span class="sidebar-title-text" v-cloak>{{ menu.name }}</span>
            <span class="sidebar-title-manage"><!-- Todo:: --></span>
        </div>
        <ul class="sidebar-nav-body"  :style="{height:childLength*40+'px'}" v-if="childLength > 0">
            <wula-left-menu-item
                    v-for="(subMenu,index) in menu.child"
                    :menu="subMenu"
                    :sidebar-full="SidebarFull" :key="index"> </wula-left-menu-item>
        </ul>

        <!--如果菜单只要一级-->
        <ul class="sidebar-nav-body" v-if="childLength == 0">
            <wula-left-menu-item :menu="menu" :sidebarFull="SidebarFull"> </wula-left-menu-item>
        </ul>
    </div>

</template>

<script lang="babel">
    //当前为菜单组
    import wulaLeftMenuItem from './leftMenuItem.vue'
    import emitter from '../../mixins/emitter'
    import {fnMenu} from '../../utils/fn'

    export default{
        name      : 'LeftMenus',
        mixins    : [emitter],
        components: {wulaLeftMenuItem},
        props     : {
            menu       : {type: Object, required: true},
            SidebarFull: {type: Boolean, required: true},
            //当前菜单组索引，用于通知其它组关闭自己
            groupIndex : {type: Number},
        },
        computed  : {
            //菜单组子菜单数量
            childLength: function () {
                if (this.menu.child instanceof Array) {
                    return this.menu.child.length;
                } else {
                    return 0;
                }
            },

        },
        data(){
            return {
                expand  : this.$parent.sidebarOpen,    //展开状态
                keepOnly: this.$parent.sidebarOnly,   //只保留一级菜单打开
            }
        },
        watch     : {
            //发送事件
            //监控菜单组展开状态，用于菜单组同时只展开一组模式，如果当前菜单组展开，发送事件通知其它组合并
            expand: function (val, oldVal) {
                if (val && fnMenu.hasChild(this.menu.child) && this.keepOnly) {
                    //调用父组广播事件通知自己同级组件
                    this.$parent.broadcast('LeftMenus','self-leftMenus-open',this._uid);
                }
            },
        },
        created   : function () {
            this.menu.uid = this._uid;
            const that = this;
            //接收事件
            //如果有菜单组打开事件，判断当前如果是只保留一个菜单组模式，并且当前为多级菜单，并且打开的菜单不是本菜单组，则把当前菜单组隐藏
            //事件名称：谁发起通知 - 通知谁 - 动作
            this.$on('self-leftMenus-open', function (uid) {
                if (that.keepOnly && that.childLength > 0 && uid != that._uid) {
                    that.expand = false;
                }
            });
        }
    }
</script>
