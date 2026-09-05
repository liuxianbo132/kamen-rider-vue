import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // Element Plus 暗色模式变量
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())      // 状态管理
app.use(router)             // 路由
app.use(ElementPlus, { locale: zhCn }) // UI 组件库（中文语言包）

// 启用暗色模式（假面骑士黑金主题）
document.documentElement.classList.add('dark')

app.mount('#app')
