import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'
import VueSession from 'vue-session'
import dayjs from 'dayjs'
// import VueCookie from 'vue-cookie'
import excel from 'vue-excel-export'
let options = { persist: true }
Vue.use(VueSession, options)
Vue.use(dayjs)
// Vue.use(VueCookie)
Vue.use(excel)