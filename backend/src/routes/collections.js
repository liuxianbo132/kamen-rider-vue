// 收藏条目路由：列表/详情公开，管理端增删改需登录 + 管理员
import { Router } from 'express'
import { listPublic, detailPublic, listAdmin, create, update, remove } from '../controllers/collectionsController.js'
import { authRequired, adminRequired } from '../middleware/auth.js'

const router = Router()

// 注意：/admin/all 必须先于 /:id 注册，避免被动态 id 参数吞掉
router.get('/', listPublic)                                        // 公开：收藏列表（默认排除归档）
router.get('/admin/all', authRequired, adminRequired, listAdmin)   // 管理员：全部收藏（含归档）
router.get('/:id', detailPublic)                                   // 公开：收藏详情（归档不可见）
router.post('/', authRequired, adminRequired, create)              // 管理员：新增
router.put('/:id', authRequired, adminRequired, update)            // 管理员：编辑
router.delete('/:id', authRequired, adminRequired, remove)         // 管理员：删除

export default router
