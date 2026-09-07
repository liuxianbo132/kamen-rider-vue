// 图鉴骑士路由
// 公开：列表 + 详情；管理员：增删改查
import { Router } from 'express'
import { list, detail, create, update, remove } from '../controllers/ridersController.js'
import { authRequired, adminRequired } from '../middleware/auth.js'

const router = Router()

router.get('/', list)                                                       // 公开列表
router.get('/:id', detail)                                                  // 公开详情
router.post('/', authRequired, adminRequired, create)                       // 管理员新增
router.put('/:id', authRequired, adminRequired, update)                     // 管理员编辑
router.delete('/:id', authRequired, adminRequired, remove)                  // 管理员删除

export default router