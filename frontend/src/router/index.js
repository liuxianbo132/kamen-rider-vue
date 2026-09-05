// 路由配置 + 全局守卫（登录校验、管理员权限校验）
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { title: '登录' } },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue'), meta: { title: '注册' } },
  { path: '/', name: 'Home', component: () => import('../views/Home.vue'), meta: { title: '首页' } },
  {
    path: '/admin',
    component: () => import('../views/admin/Admin.vue'),
    redirect: '/admin/goods',
    children: [
      { path: 'goods', name: 'AdminGoods', component: () => import('../views/admin/GoodsManage.vue'), meta: { title: '商品管理', admin: true } },
      { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/UsersManage.vue'), meta: { title: '用户管理', admin: true } },
      { path: 'banners', name: 'AdminBanners', component: () => import('../views/admin/BannersManage.vue'), meta: { title: '轮播图管理', admin: true } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' } // 兜底重定向到首页
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  const whitelist = ['/login', '/register'] // 未登录可访问的页面

  // 未登录访问受保护页面 → 跳转登录
  if (!whitelist.includes(to.path) && !userStore.isLoggedIn) {
    return '/login'
  }

  // 已登录访问登录/注册页 → 跳转首页
  if (whitelist.includes(to.path) && userStore.isLoggedIn) {
    return '/'
  }

  // 管理后台仅 admin 角色可进入
  if (to.meta.admin && !userStore.isAdmin) {
    return '/'
  }
})

// 页面标题
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 假面骑士商城` : '假面骑士商城'
})

export default router
