import Vue from 'vue'
import jQuery from 'jquery'

import iView from './iview'
import components from './components'
import dashboard from './pages/dashboard'
import Dialog from './components/dialog'

Vue.use(iView);
Vue.use(components);
window.Vue = Vue;

window.Dialog = Dialog;
window.jQuery = window.$ = jQuery;
window.Wula = {
	dashboard
};
