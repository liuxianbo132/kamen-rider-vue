// 用户状态管理（Pinia）：token、用户名、角色，刷新后从 localStorage 恢复
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    role: localStorage.getItem('role') || ''
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin'
  },

  actions: {
    // 登录成功后保存用户信息
    setUser({ token, username, role }) {
      this.token = token
      this.username = username
      this.role = role
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      localStorage.setItem('role', role)
    },

    // 退出登录：清空内存与本地缓存
    logout() {
      this.token = ''
      this.username = ''
      this.role = ''
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
    }
  }
})
