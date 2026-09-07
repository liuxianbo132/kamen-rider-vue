// 站内文章接口
import request from './request'

// 公开：已发布文章列表（支持 category / tag / keyword / page / pageSize / featured）
export const getPostsApi = (params) => request.get('/posts', { params })

// 公开：按 slug 获取已发布文章详情
export const getPostBySlugApi = (slug) => request.get(`/posts/${slug}`)

// 管理员：全部文章（含草稿，支持 status / category / keyword 筛选）
export const getAdminPostsApi = (params) => request.get('/posts/admin/all', { params })

export const createPostApi = (data) => request.post('/posts', data)
export const updatePostApi = (id, data) => request.put(`/posts/${id}`, data)
export const deletePostApi = (id) => request.delete(`/posts/${id}`)
