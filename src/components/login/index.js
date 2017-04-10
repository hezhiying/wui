import login from './login.vue'
import {defaultPrefix} from '../../utils/config'

export default {
	install(Vue, prefix){
		prefix = prefix || defaultPrefix;
		Vue.component(prefix + login.name, login)
	}
}