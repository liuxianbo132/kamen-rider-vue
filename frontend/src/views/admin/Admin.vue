<template>
  <!-- 管理后台布局：左侧菜单 + 顶栏 + 内容区 -->
  <el-container class="admin-layout">
    <el-aside width="200px">
      <div class="logo">卡面来打小站 · 管理后台</div>
      <el-menu :default-active="route.path" router class="menu">
        <el-menu-item index="/admin/goods">商品管理</el-menu-item>
        <el-menu-item index="/admin/users">用户管理</el-menu-item>
        <el-menu-item index="/admin/banners">轮播图管理</el-menu-item>
        <el-menu-item index="/admin/news">新闻管理</el-menu-item>
        <el-menu-item index="/admin/posts">文章管理</el-menu-item>
        <el-menu-item index="/admin/collections">收藏管理</el-menu-item>
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
  background: #ffffff;
  border-right: 1px solid #eceef2;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #eceef2;
  color: #d4a017;
  letter-spacing: 1px;
}

.menu {
  border-right: none;
}

.header {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eceef2;
}

.welcome {
  color: #23262e;
}

.main {
  background: #f4f5f7;
}
</style>
