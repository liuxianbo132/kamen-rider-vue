// 图鉴骑士控制器（公开 + 管理员 CRUD）
import { riderModel } from '../models/riderModel.js'
import { ok, fail } from '../utils/respond.js'

// 列表（公开，前台 /archive 使用）
export function list(req, res) {
  ok(res, riderModel.findAll())
}

// 详情（公开，前台 /archive/:id 使用）
export function detail(req, res) {
  const rider = riderModel.findById(Number(req.params.id))
  if (!rider) return fail(res, 404, '骑士不存在')
  ok(res, rider)
}

// 管理员 CRUD 参数校验
function validate(body) {
  const { name, era, year, member_id } = body || {}
  if (!name || !String(name).trim()) return '骑士名称不能为空'
  if (!['showa', 'heisei', 'reiwa'].includes(era)) return 'era 必须为 showa/heisei/reiwa'
  if (!Number.isInteger(Number(year)) || Number(year) < 1971 || Number(year) > 2100) return 'year 不合法'
  if (!Number.isFinite(Number(member_id))) return 'member_id 必须为数字'
  return null
}

// 管理员：新增骑士
export function create(req, res) {
  const error = validate(req.body)
  if (error) return fail(res, 400, error)
  // 同一 member_id 已存在则拒绝，避免脏数据
  if (riderModel.findByMemberId(Number(req.body.member_id))) return fail(res, 409, '该官方 member_id 已存在')
  const info = riderModel.create({
    ...req.body,
    member_id: Number(req.body.member_id),
    name: String(req.body.name).trim(),
    year: Number(req.body.year),
    era: req.body.era
  })
  ok(res, riderModel.findById(info.lastInsertRowid), '新增成功')
}

// 管理员：编辑骑士
export function update(req, res) {
  const id = Number(req.params.id)
  if (!riderModel.findById(id)) return fail(res, 404, '骑士不存在')
  const error = validate(req.body)
  if (error) return fail(res, 400, error)
  riderModel.update(id, {
    ...req.body,
    member_id: Number(req.body.member_id),
    name: String(req.body.name).trim(),
    year: Number(req.body.year),
    era: req.body.era
  })
  ok(res, riderModel.findById(id), '更新成功')
}

// 管理员：删除骑士
export function remove(req, res) {
  const id = Number(req.params.id)
  if (!riderModel.findById(id)) return fail(res, 404, '骑士不存在')
  riderModel.remove(id)
  ok(res, null, '删除成功')
}