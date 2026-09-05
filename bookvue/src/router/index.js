import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home.vue'
import Book from '@/components/book.vue'
import Xinwen from '@/components/xinwen.vue'
import Login from '@/components/login.vue'
import Register from '@/components/register.vue'
import Xilie from '@/components/xilie.vue'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/book', component: Book },
    { path: '/xinwen', component: Xinwen },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/xilie', component: Xilie },
    { path: '*', redirect: '/home' }
  ]
})
