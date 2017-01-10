import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'

import Dashboard from './components/Dashboard'
import Users from './components/Users'
import Content from './components/Content'
import ContentDetails from './components/ContentDetails'

import $ from 'jquery'
import jQuery from 'jquery'
window.jQuery = jQuery
import slick from 'slick-carousel'
require('../static/semantic')

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Dashboard },
  { path: '/users', component: Users },
  { path: '/content', component: Content },
  { path: '/content/:guid', component: ContentDetails }
]

const router = new VueRouter({ routes })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
