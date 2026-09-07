// 站内文章路由：列表/详情公开，管理端增删改需登录 + 管理员
import { Router } from 'express'
import { listPublic, detailPublic, listAdmin, create, update, remove } from '../controllers/postsController.js'
import { authRequired, adminRequired } from '../middleware/auth.js'

const router = Router()

// 注意：/admin/all 必须先于 /:slug 注册，避免被动态 slug 参数吞掉
router.get('/', listPublic)                                        // 公开：已发布文章列表（分页 + 筛选）
router.get('/admin/all', authRequired, adminRequired, listAdmin)   // 管理员：全部文章（含草稿）
router.get('/:slug', detailPublic)                                 // 公开：已发布文章详情
router.post('/', authRequired, adminRequired, create)              // 管理员：新增
router.put('/:id', authRequired, adminRequired, update)            // 管理员：编辑
router.delete('/:id', authRequired, adminRequired, remove)         // 管理员：删除

export default router
