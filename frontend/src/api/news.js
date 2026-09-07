// 新闻相关接口
import request from './request'

export const getNewsApi = () => request.get('/news')
export const createNewsApi = (data) => request.post('/news', data)
export const updateNewsApi = (id, data) => request.put(`/news/${id}`, data)
export const deleteNewsApi = (id) => request.delete(`/news/${id}`)