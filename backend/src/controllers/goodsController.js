// 商品控制器：增删改查
import { goodsModel } from '../models/goodsModel.js'
import { ok, fail } from '../utils/respond.js'

// 新增/编辑共用的参数校验
function validate(body) {
  const { name, price, stock } = body || {}
  if (!name || !String(name).trim()) return '商品名称不能为空'
  const p = Number(price)
  if (!Number.isFinite(p) || p < 0) return '价格必须为非负数字'
  const s = Number(stock ?? 0)
  if (!Number.isInteger(s) || s < 0) return '库存必须为非负整数'
  return null
}

// 商品列表（登录即可访问）
export function list(req, res) {
  ok(res, goodsModel.findAll())
}

// 商品详情（公开，前台商品详情页）
export function detail(req, res) {
  const goods = goodsModel.findById(Number(req.params.id))
  if (!goods) return fail(res, 404, '商品不存在')
  ok(res, goods)
}

// 新增商品（仅管理员）
export function create(req, res) {
  const error = validate(req.body)
  if (error) return fail(res, 400, error)
  const { name, price, stock, category, image_url, description } = req.body
  const info = goodsModel.create({ name: String(name).trim(), price: Number(price), stock, category, image_url, description })
  ok(res, goodsModel.findById(info.lastInsertRowid), '新增成功')
}

// 编辑商品（仅管理员）
export function update(req, res) {
  const id = Number(req.params.id)
  if (!goodsModel.findById(id)) return fail(res, 404, '商品不存在')
  const error = validate(req.body)
  if (error) return fail(res, 400, error)
  const { name, price, stock, category, image_url, description } = req.body
  goodsModel.update(id, { name: String(name).trim(), price: Number(price), stock, category, image_url, description })
  ok(res, goodsModel.findById(id), '更新成功')
}

// 删除商品（仅管理员）
export function remove(req, res) {
  const id = Number(req.params.id)
  if (!goodsModel.findById(id)) return fail(res, 404, '商品不存在')
  goodsModel.remove(id)
  ok(res, null, '删除成功')
}
