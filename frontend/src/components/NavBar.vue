<template>
  <!-- 前台顶部导航：网站名称 + 用户名 + 管理后台入口 + 退出登录 -->
  <header class="navbar">
    <div class="navbar-left" @click="$router.push('/')">
      <span class="brand-badge">⚡</span> 假面骑士商城 <span class="brand-sub">DRIVER COLLECTION</span>
    </div>
    <div class="navbar-right">
      <span class="username">{{ userStore.username }}</span>
      <el-button v-if="userStore.isAdmin" text type="primary" @click="$router.push('/admin/goods')">
        管理后台
      </el-button>
      <el-button text @click="onLogout">退出登录</el-button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

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
  height: 60px;
  padding: 0 32px;
  background: #161a23;
  border-bottom: 1px solid #2a2f3d;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  color: #e8eaf0;
}

/* 品牌闪电标 + 金色副标 */
.brand-badge {
  color: #f5c518;
  margin-right: 2px;
}

.brand-sub {
  font-size: 12px;
  color: #f5c518;
  font-weight: 400;
  letter-spacing: 1px;
  margin-left: 6px;
  opacity: 0.85;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  color: #b7bcc9;
  margin-right: 8px;
}
</style>
