// 用户管理路由（仅管理员）
import { Router } from 'express'
import { list, updateRole, remove } from '../controllers/usersController.js'
import { authRequired, adminRequired } from '../middleware/auth.js'

const router = Router()

router.get('/', authRequired, adminRequired, list)                        // 用户列表
router.put('/:id/role', authRequired, adminRequired, updateRole)           // 修改角色
router.delete('/:id', authRequired, adminRequired, remove)                // 删除用户

export default router
