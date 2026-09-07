<template>
  <!-- 前台顶部导航：暖白纸张质感粘性导航 + 登录态 -->
  <header class="navbar">
    <div class="navbar-left" @click="router.push('/')">
      <div class="brand-text">
        <span class="brand-name">卡面来打小站</span>
        <span class="brand-sub">KAMEN RIDER ARCHIVE</span>
      </div>
    </div>

    <!-- 功能模块导航 -->
    <nav class="nav-links">
      <a
        v-for="item in links"
        :key="item.label"
        :class="['nav-item', { active: isActive(item) }]"
        @click="item.label === '关于' ? goAbout() : router.push(item.to)"
      >{{ item.label }}</a>
    </nav>

    <div class="navbar-right">
      <template v-if="userStore.isLoggedIn">
        <span class="username">{{ userStore.username }}</span>
        <el-button v-if="userStore.isAdmin" text type="primary" @click="router.push('/admin/goods')">
          管理后台
        </el-button>
        <el-button text @click="onLogout">退出登录</el-button>
      </template>
      <template v-else>
        <el-button text type="primary" @click="router.push('/login')">登录</el-button>
        <el-button text @click="router.push('/register')">注册</el-button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 导航项：首页 / 文章 / 收藏室 / 图鉴 / 商城 / 关于（首页内锚点）
const links = [
  { label: '首页', to: '/' },
  { label: '文章', to: '/news' },
  { label: '收藏室', to: '/collections' },
  { label: '图鉴', to: '/archive' },
  { label: '商城', to: '/shop' },
  { label: '关于', to: '#about' }
]

// 当前页高亮（“关于”锚点项不参与高亮）
function isActive(item) {
  return item.to !== '#about' && router.currentRoute.value.path === item.to
}

// 关于：首页内直接平滑滚动，其他页面先回首页再定位锚点
function goAbout() {
  if (router.currentRoute.value.path === '/') {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push({ path: '/', hash: '#about' })
  }
}

// 退出登录：清空状态并回到登录页
function onLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 40px;
  background: rgba(255, 253, 248, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-name {
  font-family: var(--font-serif);
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 2px;
  line-height: 1.2;
}

.brand-sub {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 3px;
}

/* 功能模块导航 */
.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-item {
  padding: 8px 16px;
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--muted);
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.2s;
}

.nav-item:hover {
  color: var(--accent-dark);
}

.nav-item.active {
  color: var(--accent-dark);
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.username {
  color: var(--muted);
  margin-right: 8px;
  font-size: 14px;
}

/* 手机端：两行布局（品牌 + 登录态一行，导航一行） */
@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 16px 6px;
    row-gap: 4px;
  }
  .brand-name { font-size: 17px; }
  .brand-sub { letter-spacing: 2px; }
  .nav-links {
    order: 3;
    width: 100%;
    justify-content: space-between;
    gap: 0;
    border-top: 1px solid var(--line);
    padding-top: 2px;
  }
  .nav-item {
    padding: 8px 6px;
    font-size: 13px;
    letter-spacing: 1px;
  }
  .username { display: none; }
}

/* 超小屏：收紧品牌与导航项，避免横向溢出 */
@media (max-width: 480px) {
  .navbar { padding: 8px 12px 4px; }
  .brand-name { font-size: 15px; }
  .brand-sub { display: none; }
  .nav-item {
    padding: 7px 4px;
    font-size: 12px;
    letter-spacing: 0;
  }
  .navbar-right .el-button {
    padding: 0 6px;
    font-size: 13px;
  }
}
</style>
