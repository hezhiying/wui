<template>
	<div class="dropdown topbar-info-item" v-if="hasChild">
		<a class="topbar-btn" href="javascript:void(0);" data-toggle="dropdown">
			<span :class="menu.iconCls" :style="menu.iconStyle" v-html="returnIcon(menu.icon)" v-if="menu.icon"></span>
			<span :class="menu.textCls" :style="menu.textStyle" v-cloak> {{menu.name}} </span>
			<span class="topbar-btn-label" v-if='menu.badge'>{{menu.badge}}</span>
			<span class="caret"></span>
		</a>

		<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
			<li role="presentation" v-for="subMenu in menu.child" :class="{'disabled':subMenu.disabled}">
				<a role="menuitem" tabindex="-1"
				   :href="subMenu.disabled?'javascript:void(0);':showMenuUrl(subMenu.url,subMenu.target)"
				   :target="subMenu.target" v-bind="subMenu.data">
					<span :class="subMenu.iconCls" :style="subMenu.iconStyle" v-html="returnIcon(subMenu.icon)"  v-if="subMenu.icon"></span>
					<span :class="subMenu.textCls" :style="subMenu.textStyle" v-cloak> {{subMenu.name}} </span>
					<span class="topbar-submenu-badge" v-if='subMenu.badge'>{{subMenu.badge}}</span>
				</a>
			</li>
		</ul>
	</div>
	<div class="topbar-info-item" v-else>
		<a class="topbar-btn" :href="showMenuUrl(menu.url,menu.target)" :target="menu.target" v-bind="menu.data">
			<span :class="menu.iconCls" :style="menu.iconStyle" v-html="returnIcon(menu.icon)" v-if="menu.icon"></span>
			<span :class="menu.textCls" :style="menu.textStyle" v-cloak> {{menu.name}} </span>
			<span class="topbar-btn-label" v-if='menu.badge'>{{menu.badge}}</span>
		</a>
	</div>
</template>
<script  lang="babel">
    import {fnMenu} from '../../utils/fn'

	export default{
		props   : {
			menu: {
				type    : Object,
				required: true
			}
		},
		computed: {
			hasChild: function () {
				return fnMenu.hasChild(this.menu.child);
			}
		},
		methods : {
		    //显示ICON，支持html和class直接内容
			returnIcon : function (icon) {
			    return fnMenu.showMenuIcon(icon);
			},
			//格式化菜单URL
			showMenuUrl: function (url, target) {
			    return fnMenu.showMenuUrl(url,target);
			}
		}
	}
</script>
