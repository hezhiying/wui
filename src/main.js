import Vue from 'vue'
import jQuery from 'jquery'

import iView from './iview'
import components from './components'
import dashboard from './pages/dashboard'
import Dialog from './components/dialog'
import ajax from './utils/ajax'
Vue.use(iView);
Vue.use(components);
window.Vue = Vue;
window.iView = iView;
Vue.prototype.$Ajax = ajax;

window.Dialog = Dialog;
window.jQuery = window.$ = jQuery;
window.Wula = {
	dashboard
};
