<template >
    <div class="wula-topbar-item wula-topbar-dropdown" style="position: relative;" :class={open:isOpen}>
        <a class="wula-topbar-btn" href="javascript:void(0);" @click="handleOpenDropdown">
            <span :class="iconCls" :style="iconStyle" v-html="iconHtml" v-if="icon"></span>
            <span :class="textCls" :style="textStyle" v-cloak> {{name}} </span>
            <span class="wula-badge" v-if='badge'>{{badge}}</span>
            <i class="fa fa-caret-down icon-arrow-down"> </i>
            <!--<span class="wula-caret"></span>-->
        </a>
        <ul class="wula-topbar-dropdown-menu" v-if="isOpen" >
            <wula-topbar-dropdown-item v-for="(menu,index) in child"
                                       :name="menu.name"
                                       :url="menu.url"
                                       :icon="menu.icon"
                                       :icon-cls="menu.iconCls"
                                       :icon-style="menu.iconStyle"
                                       :text-cls="menu.textCls"
                                       :text-style="menu.textStyle"
                                       :text-target="menu.target"
                                       :badge="menu.badge"
                                       :target="menu.target"
                                       :disabled="menu.disabled"
                                       :data="menu.data" :key="index">

            </wula-topbar-dropdown-item>
        </ul>
    </div>

</template>

<script lang="babel">
    import {fnMenu,oneOf} from '../../utils/fn'
    import wulaTopbarDropdownItem from './topbarDropdownItem.vue'
    import emitter from '../../mixins/emitter'
    export default{
        name : 'TopbarDropdown',
        mixins: [ emitter ],
        props: {
            name     : {
                type    : String,
                required: true
            },
            url     : {
                type    : String
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
            target    : String,
            child:{
                type:Array,
            },
            trigger: {
                validator (value) {
                    return oneOf(value, ['click', 'hover', 'custom']);
                },
                default: 'hover'
            },

        },
        computed:{
            iconHtml(){
                return fnMenu.showMenuIcon(this.icon);
            },
            showUrl(){
                return fnMenu.showMenuUrl(this.url,this.target);
            }
        },

        data(){
            return {
                isOpen:false
            }
        },
        created(){
            const that = this;
            this.$on( 'self-dropdown.closeMenu', function (uid) {
                if(uid != that._uid){
                    that.isOpen = false;
                }
            });
            document.addEventListener('click', this.close);
        },
        beforeDestroy(){
            document.removeEventListener('click', this.close);
        },
        methods:{
            close(event){
                event.stopPropagation();
                if(this.isOpen){
                    this.isOpen = false;
                }
            },
            handleOpenDropdown(){
                event.stopPropagation();
                this.isOpen = !this.isOpen;
                //通过父组通知同级组件关闭
                this.$parent.broadcast('TopbarDropdown','self-dropdown.closeMenu',this._uid)
            }
        },
        components: {wulaTopbarDropdownItem}
    }
</script>
