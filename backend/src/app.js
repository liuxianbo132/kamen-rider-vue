// 应用入口：加载环境变量、注册中间件与路由、启动服务
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import goodsRoutes from './routes/goods.js'
import usersRoutes from './routes/users.js'
import bannerRoutes from './routes/banners.js'
import newsRoutes from './routes/news.js'
import postsRoutes from './routes/posts.js'
import collectionsRoutes from './routes/collections.js'
import ridersRoutes from './routes/riders.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())            // 允许跨域（前后端分离部署）
app.use(express.json())    // 解析 JSON 请求体

// 健康检查与根路径：供云平台探活，也避免直接访问服务地址时看到 404
app.get('/health', (req, res) => {
  res.json({ code: 200, data: { status: 'ok' }, message: 'success' })
})
app.get('/', (req, res) => {
  res.json({ code: 200, data: { name: '假面骑士商城 API', version: '4.0.0' }, message: '服务运行中' })
})

// 业务路由
app.use('/api/auth', authRoutes)
app.use('/api/goods', goodsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/collections', collectionsRoutes)
app.use('/api/riders', ridersRoutes)

// 404 兜底
app.use((req, res) => {
  res.status(404).json({ code: 404, data: null, message: '接口不存在' })
})

// 全局异常兜底
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ code: 500, data: null, message: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`后端服务已启动: http://localhost:${PORT}`)
  console.log('默认管理员账号: admin / 123456')
})