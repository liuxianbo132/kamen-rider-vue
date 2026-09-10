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
          <el-button text @click="openPwdDialog">修改密码</el-button>
          <el-button text @click="$router.push('/')">返回前台</el-button>
          <el-button text type="danger" @click="onLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>

  <!-- 修改密码弹窗：成功后旧 token 失效，需重新登录 -->
  <el-dialog v-model="pwdVisible" title="修改密码" width="420px" @closed="resetPwdForm">
    <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="90px">
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入当前密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="至少 8 位" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="pwdVisible = false">取消</el-button>
      <el-button type="primary" :loading="pwdSubmitting" @click="onSubmitPwd">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user'
import { changePasswordApi } from '../../api/auth'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

function onLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

// ==================== 修改密码 ====================
const pwdVisible = ref(false)
const pwdSubmitting = ref(false)
const pwdFormRef = ref(null)
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

// 前端校验规则与后端保持一致（新密码至少 8 位）
const pwdRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '新密码长度不能少于 8 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.newPassword) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}

function openPwdDialog() {
  pwdVisible.value = true
}

function resetPwdForm() {
  pwdFormRef.value?.resetFields()
  pwdForm.oldPassword = ''
  pwdForm.newPassword = ''
  pwdForm.confirmPassword = ''
}

function onSubmitPwd() {
  pwdFormRef.value?.validate(async (valid) => {
    if (!valid) return
    pwdSubmitting.value = true
    try {
      await changePasswordApi({
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword
      })
      ElMessage.success('密码修改成功，请重新登录')
      pwdVisible.value = false
      // 后端已令旧 token 失效，这里主动清理登录态并回到登录页
      userStore.logout()
      router.push('/login')
    } catch {
      // 失败提示由 request 响应拦截器统一弹出，此处不重复提示
    } finally {
      pwdSubmitting.value = false
    }
  })
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
