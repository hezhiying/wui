<template>
    <div class="wula-dashboard " :class="{ 'app-sidebar-full':isSidebarFull }">
        <!--sidebar start-->
        <div class="wula-sidebar">
            <div class="wula-sidebar-inner">
                <!--控制sidebar 展开缩小-->
                <div class="wula-sidebar-fold fa wula-sidebar-header" @click="isSidebarFull=!isSidebarFull"></div>
                <!--一、二级菜单显示-->
                <wula-left-menus v-for="(menu,index) in menus" :menu="menu" :sidebar-full="isSidebarFull"
                                 :group-index="index" ref="menugroup" :key="index"> </wula-left-menus>
            </div>
        </div>
        <!--sidebar end-->

        <div class="wula-dashboard-right " :class="{'app-product-navbar-full':isSidebarSubMenuFull && isShowSubMenus}" >
            <!--二级菜单折叠按钮-->
            <div class="wula-dashboard-right-sidebar" v-show="isShowSubMenus">
                <div class="wula-dashboard-right-sidebar-menu" >
                    <div class="wula-sidebar-header">
                        {{ activeMenu.name }}
                    </div>
                    <div class="wula-sidebar-list">
                        <ul>
                            <wula-right-menus v-for="(sub,index) in activeMenu.child" :menu="sub" :opened-menu="openedMenu"
                                              ref="rightMenu" :key="index"> </wula-right-menus>
                        </ul>
                    </div>
                </div>
                
                <div class="wula-collapse">
                    <div class="wula--collapse-inner">
                        <div class="wula-collapse-icon fa" @click="isSidebarSubMenuFull=!isSidebarSubMenuFull"></div>
                    </div>
                </div>
               
            </div>
            <div class="wula-dashboard-body">
                <div class="wula-dashboard-body-inner" id="wula-body" ref="wulaBody" v-html="bodyContent">
                    <!-- 工作内容区 -->
                </div>
                <div class="loading">
                    <Spin v-if="spinShow" fix> </Spin>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="babel">

    import wulaLeftMenus from './leftMenus.vue'
    import wulaRightMenus from './rightMenus.vue'
    import {fnMenu} from '../../utils/fn'
    import emitter from '../../mixins/emitter'
    import $ from 'jquery'
    export default{
        name      : 'Dashboard',
        mixins    : [emitter],
        props     : {
            //菜单数据
            menuUrl    : {type: String, required: false},
            //侧边栏默认是否打开
            sidebarFull: {type: Boolean, default: true},
            //侧边栏菜单默认是否全部展开还是折合
            sidebarOpen: {type: Boolean, default: true},
            //侧边伴菜单默认是否只保持一个菜单组展开
            sidebarOnly: {type: Boolean, default: true}
        },
        data(){
            return {
                isSidebarFull       : this.sidebarFull, //控制侧栏菜单显示隐藏
                isSidebarSubMenuFull: true,      //侧边栏子菜单是否为打开
                menus               : [],//菜单数据
                //激活动的菜单组
                activeMenu          : {},
                //已打开URL菜单
                openedMenu          : {},
                spinShow            : false,
                bodyContent         : ''
            }
        },
        computed  : {
            isShowSubMenus: function () {
                return fnMenu.hasChild(this.activeMenu.child);
            }
        },
        watch     : {
            isSidebarFull(){

                this.$nextTick(()=>{this.broadcaseTable();});
            },
            isSidebarSubMenuFull(){
                this.$nextTick(()=>{this.broadcaseTable();});
            },
            //监控当前打开的父菜单是否有变化，有变化后重置子菜单栏为打开状态
            activeMenu: function (newVal, oldVal) {
                if (newVal != oldVal) {
                    this.isSidebarSubMenuFull = true;
                    //通知LeftMenuItem更新为激活状态
                    this.$nextTick(()=> {
                        if (this.activeMenu.uid) {
                            this.broadcast('LeftMenuItem', 'dashboard-leftMenuItem-openByUID', this.activeMenu.uid);
                        }
                    });
                }
            }
        },
        created   : function () {
            var that = this;
            //如果有菜单URL，创建时加载菜单数据
            if (this.menuUrl) {
                $.getJSON(this.menuUrl, function (data) {
                    that.menus = data;
                    that.setMenuStatus();
                });
            }
        },
        mounted   : function () {
            let that = this;
            this.loadHashPage();
            this.setMenuStatus();
            window.addEventListener('hashchange', (event)=> {
                this.loadHashPage();
                this.setMenuStatus();
            });
        
           this.$nextTick(()=>{this.broadcaseTable();});
        },
        methods   : {
            //通知表格组件重新计算宽度
            broadcaseTable(){
                if( document.createEvent) { 
                    var event = document.createEvent ("HTMLEvents"); 
                    event.initEvent("resize", true, true); 
                    window.dispatchEvent(event); 
                } else if(document.createEventObject){ 
                    window.fireEvent("onresize"); 
                } 
            },
            //提供对外方法，手工设置菜单数据
            setMenus: function (menus) {
                this.menus = menus;
                this.setMenuStatus();
            },

            /**
             * hash改变加载页面
             * @returns {boolean}
             */
            loadHashPage: function (url) {
                var hashUrl = fnMenu.formatHashUrl(url ? url : fnMenu.getCurrentHashUrl());
                this.subUrl = hashUrl;
                if (hashUrl == "/") {
                    return false;
                }
                let that = this;
                $.ajax({
                    url     : hashUrl,
                    dataType: 'html',
                    method  : 'get',
                    beforeSend(){
                        that.$Loading.config({ color: '#1ab394',failedColor: '#f0ad4e',height:5});
                        that.$Loading.start();
                        that.spinShow = true
                    }
                }).done((response)=> {
                    $('#wula-body').html(response.getBody());
                    if (!$('#wula-body').find("script").html()) {
                        /**
                         * 如果没有脚本自动加上vue初始化
                         */
                        new Vue({
                            el: '#wula-body'
                        })
                    }
                    that.$Loading.finish();
                }).fail((error)=> {
                    $('#wula-body').html(error.responseText.getBody());
                    that.$Loading.error();
                }).always(()=> {
                    this.spinShow = false;
                });
            },

            setMenuStatus: function () {
                if (fnMenu.getCurrentHashUrl() == "/") {
                    return false;
                }
                this.refreshMenu();

            },
            refreshMenu  : function (menus, level) {
                //递归第一层
                if (typeof menus == 'undefined') {
                    menus = this.menus;
                }
                if (typeof level == 'undefined') {
                    level = 1;
                }
                var that = this;
                //下面使用each进行遍历
                for (var i = 0; i < menus.length; i++) {
                    //console.log([i,menus[i].url,fnMenu.formatHashUrl(menus[i].url),this.getCurrentHashUrl()]);
                    //如果匹配，返回
                    if (fnMenu.formatHashUrl(menus[i].url) == fnMenu.getCurrentHashUrl()) {

                        //记录当前打开的菜单项
                        that.openedMenu = menus[i];
                        //如果当前url为2级导航，计算当前二级导航的子菜单并记录当前访问为父菜单
                        if (level == 2 || (level == 1 && !fnMenu.hasChild(menus[i].child))) {
                            that.activeMenu = menus[i];
                            if (typeof menus[i].child == 'object' && menus[i].child.length > 0) {
                                var rst = that.refreshMenu(menus[i].child, level + 1);
                            }
                        }
                        return menus[i];

                    }
                    //如果有子元素递归检查
                    if (typeof menus[i].child == 'object' && menus[i].child.length > 0) {
                        var rst = that.refreshMenu(menus[i].child, level + 1);
                        if (typeof rst == 'object') {
                            if (level == 2) {
                                that.activeMenu = menus[i];
                            }
                            return rst;
                        }
                    }

                }
            },
            setBodyContent(html){
                $("#wula-body").html(html)
            }
        },
        components: {wulaLeftMenus, wulaRightMenus}
    }

</script>
