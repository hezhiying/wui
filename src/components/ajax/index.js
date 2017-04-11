import form from './form.vue';
import button from './button.vue';
import select from './select.vue';
import table from './table.vue';
import upload from './upload.vue';
import link from './link.vue';
import {defaultPrefix} from '../../utils/config'

const components = {
	form,button,select,table,upload,link
};

export default {
	install(Vue, prefix){
		prefix = prefix || defaultPrefix;
		for (let item of Object.values(components)) {
			Vue.component(prefix + item.name, item)
		}
	}
}
