<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <h2 class="title">卡面来打小站</h2>
      <p class="subtitle">DRIVER COLLECTION · 用户注册</p>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少 6 位）"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            size="large"
            show-password
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="submit-btn" :loading="loading" @click="onSubmit">
            注 册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="footer-tip">
        已有账号？<router-link to="/login">返回登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registerApi } from '../api/auth'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 50, message: '用户名长度不能超过 50 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ],
  // 前端校验两次密码一致
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}

// 提交注册：成功后跳转登录页
async function onSubmit() {
  await formRef.value.validate()
  loading.value = true
  try {
    await registerApi({ username: form.username, password: form.password })
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 注册页：顶部背景 banner（不全屏 cover） + 纸张底色卡片区 */
.auth-page {
  min-height: 100vh;
  background: var(--page-bg);
  position: relative;
}

/* 表单卡片：页面居中（暂不使用背景图） */
.auth-card {
  width: min(400px, 92vw);
  margin: 64px auto 48px;
  padding: 36px 24px 16px;
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 10px 40px rgba(23, 28, 40, 0.14);
  z-index: 1;
}

.title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 4px;
  color: var(--accent-dark);
  letter-spacing: 2px;
}

.subtitle {
  text-align: center;
  color: var(--muted);
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
  color: #4a453d;
  margin-top: 4px;
}
</style>
