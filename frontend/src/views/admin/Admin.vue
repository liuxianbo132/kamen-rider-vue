<template>
  <!-- 管理后台布局：左侧菜单 + 顶栏 + 内容区 -->
  <el-container class="admin-layout">
    <el-aside width="200px">
      <div class="logo">⚡ 骑士商城 · 管理后台</div>
      <el-menu :default-active="route.path" router class="menu">
        <el-menu-item index="/admin/goods">📦 商品管理</el-menu-item>
        <el-menu-item index="/admin/users">👥 用户管理</el-menu-item>
        <el-menu-item index="/admin/banners">🖼️ 轮播图管理</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <span class="welcome">{{ userStore.username }}，欢迎回来</span>
        <div>
          <el-button text @click="$router.push('/')">返回前台</el-button>
          <el-button text type="danger" @click="onLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

function onLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.el-aside {
  background: #161a23;
  border-right: 1px solid #2a2f3d;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #2a2f3d;
  color: #f5c518;
  letter-spacing: 1px;
}

.menu {
  border-right: none;
}

.header {
  background: #161a23;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #2a2f3d;
}

.welcome {
  color: #e8eaf0;
}

.main {
  background: #0b0e14;
}
</style>
