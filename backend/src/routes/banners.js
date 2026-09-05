// 轮播图路由
import { Router } from 'express'
import { list, create, update, remove } from '../controllers/bannersController.js'
import { authRequired, adminRequired } from '../middleware/auth.js'

const router = Router()

router.get('/', authRequired, list)                          // 轮播图列表（登录即可）
router.post('/', authRequired, adminRequired, create)        // 新增（管理员）
router.put('/:id', authRequired, adminRequired, update)      // 编辑（管理员）
router.delete('/:id', authRequired, adminRequired, remove) // 删除（管理员）

export default router
