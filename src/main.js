import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUserSecret,
  faChevronUp,
  faChevronDown,
  faPlus,
  faTrash,
  faSearch,
  faWindowClose,
  faRocket,
  faPen,
  faDownload,
  faUpload,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import { faGithubAlt, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import store from './store'

library.add(
  faUserSecret,
  faChevronDown,
  faChevronUp,
  faPlus,
  faTrash,
  faSearch,
  faWindowClose,
  faGithubAlt,
  faGithub,
  faRocket,
  faPen,
  faUpload,
  faDownload,
  faEye,
  faEyeSlash)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)

Vue.config.productionTip = false
Vue.prototype.$log = console.log

store.commit('loadLocally')
store.subscribe((mutation, state) => {
  if (mutation.type != 'saveLocally') {
    store.commit('saveLocally')
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
