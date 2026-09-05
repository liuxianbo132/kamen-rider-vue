<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <h2 class="title">假面骑士商城</h2>
      <p class="subtitle">DRIVER COLLECTION · 用户登录</p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="submit-btn" :loading="loading" @click="onSubmit">
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="footer-tip">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
      <div class="footer-tip demo">演示管理员账号：admin / 123456</div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginApi } from '../api/auth'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 提交登录：成功后保存 token 并跳转首页
async function onSubmit() {
  await formRef.value.validate()
  loading.value = true
  try {
    const data = await loginApi(form)
    userStore.setUser(data)
    ElMessage.success('登录成功')
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 假面骑士登录背景图 */
  background: url('/images/login-bg.jpg') center / cover no-repeat;
  position: relative;
}

/* 背景压暗，突出登录卡片 */
.auth-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(11, 14, 20, 0.78);
}

.auth-card {
  width: 400px;
  padding: 12px 8px;
  position: relative;
  background: #161a23;
  border: 1px solid #2a2f3d;
  border-radius: 10px;
  box-shadow: 0 0 40px rgba(245, 197, 24, 0.12);
}

.title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 4px;
  color: #f5c518;
  letter-spacing: 2px;
}

.subtitle {
  text-align: center;
  color: #b7bcc9;
  margin-bottom: 24px;
  font-size: 13px;
  letter-spacing: 1px;
}

.submit-btn {
  width: 100%;
}

.footer-tip {
  text-align: center;
  font-size: 14px;
  color: #b7bcc9;
  margin-top: 4px;
}

.footer-tip.demo {
  margin-top: 10px;
  color: #6e7480;
  font-size: 13px;
}
</style>
