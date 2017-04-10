import '../utils/polyfill' // es6 polyfill
import '../utils/string' //字符串方法扩展
import {defaultPrefix} from '../utils/config'

import topbar from './topbar'
import dashboard from './dashboard'
import ajax from './ajax'
import rightBar from './rightBar'
import login from './login'
import demoBox from './demoBox'
import Dialog from './dialog'

const components = {
	topbar, topbarButton: topbar.button, topbarGroup: topbar.group,
	dashboard,
	ajax,
	rightBar,
	login,
	demoBox
};

for (let item of Object.values(components)) {
	if (!item.install && item.name) {
		item.install = function (Vue, prefix) {
			prefix = prefix || defaultPrefix;
			Vue.component(prefix + item.name, item)
		}
	}
}

const install = function (Vue, opts = {}) {
	if (install.installed) return;
	for (let item of Object.values(components)) {
		if (item.install) {
			Vue.use(item, opts.prefix)
		}
	}
	//注册全局方法
	Vue.prototype.$Dialog = Dialog;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	version: '1.0.0',
	install,
	...components
}
