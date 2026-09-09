// 图形验证码路由：前端拉取后端生成的 SVG 验证码
import { Router } from 'express'
import { createCaptcha } from '../utils/captcha.js'
import { ok } from '../utils/respond.js'

const router = Router()

// 获取一张新验证码，返回 { id, svg }
router.get('/', (req, res) => {
  const { id, svg } = createCaptcha()
  ok(res, { id, svg })
})

export default router
