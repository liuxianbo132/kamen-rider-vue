// 认证路由
import { Router } from 'express'
import { register, login, me, changePassword } from '../controllers/authController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)                      // 注册
router.post('/login', login)                            // 登录
router.get('/me', authRequired, me)                     // 获取当前登录用户
router.put('/password', authRequired, changePassword)   // 修改自己的密码

export default router
