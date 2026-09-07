// 商品路由
import { Router } from 'express'
import { list, detail, create, update, remove } from '../controllers/goodsController.js'
import { authRequired, adminRequired } from '../middleware/auth.js'

const router = Router()

router.get('/', list)                                      // 商品列表（公开，前台首页展示）
router.get('/:id', detail)                                 // 商品详情（公开，前台商品详情页）
router.post('/', authRequired, adminRequired, create)      // 新增商品（管理员）
router.put('/:id', authRequired, adminRequired, update)    // 编辑商品（管理员）
router.delete('/:id', authRequired, adminRequired, remove) // 删除商品（管理员）

export default router
