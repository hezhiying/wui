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
    dashboard,
    mixins: {
        methods: {
            url: function(url, hash) {
                if (typeof(url) == "string") {
                    let config = Wula.appConfig;
                    let chunks = url.split('/');
                    if (chunks[0].match(/^([~!@#%\^&\*])(.+)$/)) {
                        let id = RegExp.$2,
                            prefix = RegExp.$1;
                        if (config.ids && config.ids[id]) {
                            id = config.ids[id];
                        }
                        if (config.groups && config.groups.char) {
                            for (var i = 0; i < config.groups.char.length; i++) {
                                if (config.groups.char[i] == prefix) {
                                    prefix = config.groups.prefix[i];
                                    break;
                                }
                            }
                        }
                        chunks[0] = prefix + id;
                    } else {
                        let id = chunks[0];
                        if (config.ids && config.ids[id]) {
                            id = config.ids[id];
                            chunks[0] = id;
                        }
                    }
                    chunks[0] = (hash ? '#' : '') + config.base + chunks[0];
                    url = chunks.join('/');
                }
                return url;
            }
        }
    }
};