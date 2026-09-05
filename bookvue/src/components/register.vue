<template>
  <div class="login-bg">
    <div class="login-wrap">
      <a href="#/login" class="back-link">← 返回登录</a>

      <div class="login-card kr-card">
        <div class="login-head">
          <div class="belt-icon">
            <span class="core"></span>
          </div>
          <h1>骑士注册</h1>
          <p>JOIN KAMEN RIDER STORE</p>
        </div>

        <div class="login-form">
          <div class="form-item">
            <input type="text" class="kr-input" placeholder="昵称" v-model.trim="nickname">
          </div>
          <div class="form-item">
            <input type="text" class="kr-input" placeholder="用户名" v-model.trim="username">
          </div>
          <div class="form-item">
            <input type="password" class="kr-input" placeholder="密码（至少 3 位）" v-model.trim="password">
          </div>
          <div class="form-item">
            <input type="password" class="kr-input" placeholder="确认密码" v-model.trim="password2">
          </div>

          <p class="error-msg" v-if="error">{{ error }}</p>

          <button class="kr-btn kr-btn-gold btn-block" :disabled="loading" @click="register">
            {{ loading ? '注册中…' : '注 册 变 身' }}
          </button>

          <div class="form-footer">
            <span style="color:#64748b">已有账号？</span>
            <a href="#/login">直接登录</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      nickname: '',
      username: '',
      password: '',
      password2: '',
      error: '',
      loading: false
    }
  },
  methods: {
    register() {
      this.error = ''
      if (!this.nickname || !this.username || !this.password) {
        this.error = '请填写完整信息'
        return
      }
      if (this.password.length < 3) {
        this.error = '密码至少 3 位'
        return
      }
      if (this.password !== this.password2) {
        this.error = '两次输入的密码不一致'
        return
      }
      this.loading = true

      // 先检查用户名是否已存在
      axios({
        url: 'http://localhost:3000/users',
        method: 'GET',
        params: { username: this.username }
      })
        .then(response => {
          if (response.data.length > 0) {
            this.error = '该用户名已被注册'
            return null
          }
          return axios({
            url: 'http://localhost:3000/users',
            method: 'POST',
            data: {
              username: this.username,
              password: this.password,
              nickname: this.nickname
            }
          })
        })
        .then(response => {
          if (response) {
            alert('注册成功，请登录')
            this.$router.push('/login')
          }
        })
        .catch(() => {
          this.error = '网络异常，请确认后端服务已启动（3000 端口）'
        })
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(rgba(11, 14, 20, 0.82), rgba(11, 14, 20, 0.92)),
              url('../assets/login-bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrap {
  width: 400px;
  max-width: 92vw;
  position: relative;
  padding: 40px 0;
}

.back-link {
  position: absolute;
  top: -46px;
  left: 0;
  color: #cbd5e1;
  font-size: 14px;
}
.back-link:hover { color: #f5c518; }

.login-card {
  padding: 38px 36px 30px;
  background: rgba(20, 25, 37, 0.92);
  text-align: center;
}

.login-head h1 {
  margin: 14px 0 4px;
  font-size: 26px;
  letter-spacing: 8px;
  color: #f5c518;
}
.login-head p {
  margin: 0 0 28px;
  font-size: 11px;
  letter-spacing: 4px;
  color: #64748b;
}

.belt-icon {
  width: 74px;
  height: 34px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a2030, #2a3245);
  border: 1px solid rgba(245, 197, 24, 0.5);
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.belt-icon .core {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ffe27a, #f5c518 55%, #b8860b);
  box-shadow: 0 0 18px rgba(245, 197, 24, 0.9);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(245, 197, 24, 0.6); }
  50% { box-shadow: 0 0 26px rgba(245, 197, 24, 1); }
}

.form-item { margin-bottom: 16px; }

.error-msg {
  margin: 0 0 14px;
  color: #e5484d;
  font-size: 13px;
}

.btn-block { width: 100%; }
.btn-block:disabled { opacity: 0.6; cursor: not-allowed; }

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 13px;
}
.form-footer a { color: #94a3b8; }
.form-footer a:hover { color: #f5c518; }
</style>
