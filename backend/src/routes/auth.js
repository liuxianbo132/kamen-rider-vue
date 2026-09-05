// 认证路由
import { Router } from 'express'
import { register, login, me } from '../controllers/authController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)      // 注册
router.post('/login', login)            // 登录
router.get('/me', authRequired, me)     // 获取当前登录用户

export default router
