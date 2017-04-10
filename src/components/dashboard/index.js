import dashboard from './dashboard.vue'
import consoleTitle from './children/consoleTitle.vue'
import {defaultPrefix} from '../../utils/config'

const components = {
	dashboard, consoleTitle
}

export default {
	install(Vue, prefix){
		prefix = prefix || defaultPrefix;
		for (let item of Object.values(components)) {
			Vue.component(prefix + item.name, item)
		}
	}
}