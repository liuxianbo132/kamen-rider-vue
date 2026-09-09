<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <h2 class="title">卡面来打小站</h2>
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

        <el-form-item label="验证码">
          <CaptchaInput ref="captchaRef" @enter="onSubmit" />
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginApi } from '../api/auth'
import { useUserStore } from '../stores/user'
import CaptchaInput from '../components/CaptchaInput.vue'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const captchaRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 提交登录：后端校验验证码 → 成功后保存 token 并跳转首页
async function onSubmit() {
  await formRef.value.validate()
  const { id, text } = captchaRef.value.getValue()
  if (!text) {
    ElMessage.error('请输入验证码')
    return
  }
  loading.value = true
  try {
    const data = await loginApi({
      username: form.username,
      password: form.password,
      captchaId: id,
      captchaText: text
    })
    userStore.setUser(data)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (err) {
    // 登录失败（含验证码错误）：刷新验证码并清空输入
    captchaRef.value.refresh()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 登录页：顶部背景 banner（不全屏 cover） + 纸张底色卡片区 */
.auth-page {
  min-height: 100vh;
  background: var(--page-bg);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 表单卡片：页面居中（暂不使用背景图） */
.auth-card {
  width: min(400px, 92vw);
  margin: 0;
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

.footer-tip.demo {
  margin-top: 10px;
  color: var(--muted);
  font-size: 13px;
}
</style>
