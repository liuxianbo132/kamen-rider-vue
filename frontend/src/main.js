import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { MotionPlugin } from '@vueuse/motion' // GitHub 热门动效库：声明式动画指令 v-motion
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())      // 状态管理
app.use(router)             // 路由
app.use(ElementPlus, { locale: zhCn }) // UI 组件库（中文语言包）
app.use(MotionPlugin)       // 动效引擎（@vueuse/motion）

app.mount('#app')
