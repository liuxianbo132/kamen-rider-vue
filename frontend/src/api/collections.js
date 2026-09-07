// 收藏条目接口
import request from './request'

// 公开：收藏列表（默认排除归档；支持 type / status / tag / keyword / page / pageSize / featured）
export const getCollectionsApi = (params) => request.get('/collections', { params })

// 公开：按 id 获取收藏详情
export const getCollectionByIdApi = (id) => request.get(`/collections/${id}`)

// 管理员：全部收藏（含归档，支持 type / status / keyword 筛选）
export const getAdminCollectionsApi = (params) => request.get('/collections/admin/all', { params })

export const createCollectionApi = (data) => request.post('/collections', data)
export const updateCollectionApi = (id, data) => request.put(`/collections/${id}`, data)
export const deleteCollectionApi = (id) => request.delete(`/collections/${id}`)
