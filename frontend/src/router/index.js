// 路由配置 + 全局守卫（登录校验、管理员权限校验）
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { title: '登录' } },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue'), meta: { title: '注册' } },
  { path: '/', name: 'Home', component: () => import('../views/Home.vue'), meta: { title: '首页', public: true } },
  { path: '/shop', name: 'Shop', component: () => import('../views/Shop.vue'), meta: { title: '商城', public: true } },
  { path: '/shop/:id', name: 'ShopDetail', component: () => import('../views/ShopDetail.vue'), meta: { title: '商品详情', public: true } },
  { path: '/archive', name: 'Archive', component: () => import('../views/Archive.vue'), meta: { title: '假面骑士图鉴', public: true } },
  { path: '/archive/:id', name: 'RiderDetail', component: () => import('../views/RiderDetail.vue'), meta: { title: '骑士详情', public: true } },
  // 收藏室内容化：/leisure 旧路径重定向到 /collections（保留 URL 兼容）
  { path: '/leisure', redirect: '/collections' },
  { path: '/collections', name: 'Collections', component: () => import('../views/Collections.vue'), meta: { title: '收藏室', public: true } },
  { path: '/collections/:id', name: 'CollectionDetail', component: () => import('../views/CollectionDetail.vue'), meta: { title: '收藏详情', public: true } },
  { path: '/news', name: 'News', component: () => import('../views/News.vue'), meta: { title: '文章与资讯', public: true } },
  { path: '/posts/:slug', name: 'PostDetail', component: () => import('../views/PostDetail.vue'), meta: { title: '文章详情', public: true } },
  {
    path: '/admin',
    component: () => import('../views/admin/Admin.vue'),
    redirect: '/admin/goods',
    children: [
      { path: 'goods', name: 'AdminGoods', component: () => import('../views/admin/GoodsManage.vue'), meta: { title: '商品管理', admin: true } },
      { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/UsersManage.vue'), meta: { title: '用户管理', admin: true } },
      { path: 'banners', name: 'AdminBanners', component: () => import('../views/admin/BannersManage.vue'), meta: { title: '轮播图管理', admin: true } },
      { path: 'news', name: 'AdminNews', component: () => import('../views/admin/NewsManage.vue'), meta: { title: '新闻管理', admin: true } },
      { path: 'posts', name: 'AdminPosts', component: () => import('../views/admin/PostsManage.vue'), meta: { title: '文章管理', admin: true } },
      { path: 'collections', name: 'AdminCollections', component: () => import('../views/admin/CollectionsManage.vue'), meta: { title: '收藏管理', admin: true } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' } // 兜底重定向到首页
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 锚点定位（如首页 #about），预留粘性导航高度偏移
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, top: 88 }
    return { top: 0 }
  }
})

// 全局前置守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  // 公开页面（首页/闲暇/新闻）+ 登录/注册 未登录可访问；其余（后台等）需登录
  const isPublic = to.meta.public || ['/login', '/register'].includes(to.path)

  // 未登录访问受保护页面 → 跳转登录
  if (!isPublic && !userStore.isLoggedIn) {
    return '/login'
  }

  // 已登录访问登录/注册页 → 跳转首页
  if (['/login', '/register'].includes(to.path) && userStore.isLoggedIn) {
    return '/'
  }

  // 管理后台仅 admin 角色可进入
  if (to.meta.admin && !userStore.isAdmin) {
    return '/'
  }
})

// 页面标题
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 卡面来打小站` : '卡面来打小站'
})

export default router
