// 新闻路由：前台列表公开给登录用户，增删改仅管理员
import { Router } from 'express'
import { list, create, update, remove } from '../controllers/newsController.js'
import { authRequired, adminRequired } from '../middleware/auth.js'

const router = Router()

router.get('/', list)                                        // 新闻列表（公开，前台新闻社展示）
router.post('/', authRequired, adminRequired, create)        // 新增（管理员）
router.put('/:id', authRequired, adminRequired, update)      // 编辑（管理员）
router.delete('/:id', authRequired, adminRequired, remove)   // 删除（管理员）

export default router