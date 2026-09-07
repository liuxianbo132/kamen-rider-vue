// 图鉴骑士接口
import request from './request'

// 公开：列表（按年代/年份排序）
export const getRidersApi = () => request.get('/riders')

// 公开：详情
export const getRiderByIdApi = (id) => request.get(`/riders/${id}`)

// 管理员 CRUD
export const createRiderApi = (data) => request.post('/riders', data)
export const updateRiderApi = (id, data) => request.put(`/riders/${id}`, data)
export const deleteRiderApi = (id) => request.delete(`/riders/${id}`)