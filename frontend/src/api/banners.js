// 轮播图相关接口
import request from './request'

export const getBannersApi = () => request.get('/banners')
export const createBannerApi = (data) => request.post('/banners', data)
export const updateBannerApi = (id, data) => request.put(`/banners/${id}`, data)
export const deleteBannerApi = (id) => request.delete(`/banners/${id}`)
