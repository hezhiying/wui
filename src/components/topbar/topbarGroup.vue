<template>
    <div>
        <div class="wula-topbar-group">
            <slot></slot>
            <template v-for="menu in menus" >
                <wula-topbar-button v-if="noChild(menu)"
                        :name="menu.name"
                        :url="menu.url"
                        :icon="menu.icon"
                        :icon-cls="menu.iconCls"
                        :icon-style="menu.iconStyle"
                        :text-cls="menu.textCls"
                        :text-style="menu.textStyle"
                        :text-target="menu.target"
                        :badge="menu.badge"
                        :data="menu.data"> </wula-topbar-button>

                <wula-topbar-dropdown v-if="hasChild(menu)"
                                    :name="menu.name"
                                    :url="menu.url"
                                    :icon="menu.icon"
                                    :icon-cls="menu.iconCls"
                                    :icon-style="menu.iconStyle"
                                    :text-cls="menu.textCls"
                                    :text-style="menu.textStyle"
                                    :text-target="menu.target"
                                    :badge="menu.badge"
                                    :child="menu.child"
                                    :trigger="menu.trigger"
                                    :data="menu.data"> </wula-topbar-dropdown>
            </template>
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script lang="babel">
    import {fnMenu} from '../../utils/fn'
    import wulaTopbarButton from './topbarButton.vue'
    import wulaTopbarDropdown from './topbarDropdown.vue'
    import emitter from '../../mixins/emitter'

    export default{
        name:'TopbarGroup',
        mixins:[emitter],
        components:{ wulaTopbarButton,wulaTopbarDropdown },
        props:{
            menuUrl:{
                type:String,
                default:null
            }
        },
        computed:{

        },
        data(){
            return{
                menus:[]
            }
        },
        created:function(){
        	var that = this;
			//加载菜单
			if(this.menuUrl){
                $.getJSON(this.menuUrl, function (data) {
                    that.menus = data;
                });
			}
        },
        methods:{
            setMenus:function(menus){
                this.menus = menus;
            },
            noChild(menu){
                return !fnMenu.hasChild(menu.child);
            },
            hasChild(menu){
                return fnMenu.hasChild(menu.child);
            },

        }


    }
</script>
