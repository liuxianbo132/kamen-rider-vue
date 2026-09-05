// 用户管理相关接口（管理员）
import request from './request'

export const getUsersApi = () => request.get('/users')
export const updateRoleApi = (id, role) => request.put(`/users/${id}/role`, { role })
export const deleteUserApi = (id) => request.delete(`/users/${id}`)
