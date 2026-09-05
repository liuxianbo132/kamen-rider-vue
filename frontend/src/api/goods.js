// 商品相关接口
import request from './request'

export const getGoodsApi = () => request.get('/goods')
export const createGoodsApi = (data) => request.post('/goods', data)
export const updateGoodsApi = (id, data) => request.put(`/goods/${id}`, data)
export const deleteGoodsApi = (id) => request.delete(`/goods/${id}`)
