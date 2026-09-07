// 收藏条目控制器：公开列表/详情 + 管理端增删改查
import { collectionModel, TYPES, STATUSES } from '../models/collectionModel.js'
import { ok, fail } from '../utils/respond.js'

// 标签归一：接受数组或 JSON 数组文本，返回 JSON 文本；非法返回 null
function normalizeTags(tags) {
  if (tags === undefined || tags === null) return '[]'
  let arr = tags
  if (typeof tags === 'string') {
    try {
      arr = JSON.parse(tags)
    } catch {
      return null
    }
  }
  if (!Array.isArray(arr)) return null
  return JSON.stringify(arr.map((t) => String(t).trim()).filter(Boolean))
}

// 收录日期归一：校验可解析后，按本地时区存 'YYYY-MM-DD'（避免 toISOString 转 UTC 导致日期偏移）
function normalizeDate(input) {
  const s = String(input).trim()
  const d = new Date(s.includes('T') ? s : s + 'T00:00:00')
  if (isNaN(d.getTime())) return undefined
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// 公开列表：默认排除归档（支持 type / status / tag / keyword / page / pageSize / featured）
export function listPublic(req, res) {
  const { type, status, tag, keyword, page, pageSize, featured } = req.query
  if (type && !TYPES.includes(type)) return fail(res, 400, '类型不正确')
  // 公开端 status 仅允许 owned / wishlist，归档不对外
  if (status && !['owned', 'wishlist'].includes(status)) return fail(res, 400, '状态不正确')
  ok(res, collectionModel.findPublic({ type, status, tag, keyword, page, pageSize, featured }))
}

// 公开详情：按 id，归档条目不展示
export function detailPublic(req, res) {
  const item = collectionModel.findPublicById(Number(req.params.id))
  if (!item) return fail(res, 404, '收藏条目不存在或已归档')
  ok(res, item)
}

// 管理端列表：全部条目（含归档）
export function listAdmin(req, res) {
  const { type, status, keyword, page, pageSize } = req.query
  if (type && !TYPES.includes(type)) return fail(res, 400, '类型不正确')
  if (status && !STATUSES.includes(status)) return fail(res, 400, '状态不正确')
  ok(res, collectionModel.findAllAdmin({ type, status, keyword, page, pageSize }))
}

// 新增收藏条目（仅管理员）
export function create(req, res) {
  const body = req.body || {}
  const title = String(body.title || '').trim()
  if (!title) return fail(res, 400, '标题不能为空')

  const type = body.type || 'belt'
  if (!TYPES.includes(type)) return fail(res, 400, '类型不正确')

  const status = body.status || 'owned'
  if (!STATUSES.includes(status)) return fail(res, 400, '状态不正确')

  const tags = normalizeTags(body.tags)
  if (tags === null) return fail(res, 400, '标签格式不正确，应为数组或 JSON 数组文本')

  const isFeatured = body.is_featured ? 1 : 0

  let acquiredAt = null
  if (body.acquired_at && String(body.acquired_at).trim()) {
    acquiredAt = normalizeDate(body.acquired_at)
    if (!acquiredAt) return fail(res, 400, '收录日期格式不正确，应为 YYYY-MM-DD')
  }

  const info = collectionModel.create({
    title,
    cover_image: body.cover_image || '',
    type,
    series: body.series || '',
    acquired_at: acquiredAt,
    status,
    notes: body.notes || '',
    tags,
    is_featured: isFeatured
  })
  ok(res, collectionModel.findById(info.lastInsertRowid), '新增成功')
}

// 编辑收藏条目（仅管理员）
export function update(req, res) {
  const id = Number(req.params.id)
  const old = collectionModel.findById(id)
  if (!old) return fail(res, 404, '收藏条目不存在')

  const body = req.body || {}
  const title = body.title !== undefined ? String(body.title).trim() : old.title
  if (!title) return fail(res, 400, '标题不能为空')

  const type = body.type !== undefined ? body.type : old.type
  if (!TYPES.includes(type)) return fail(res, 400, '类型不正确')

  const status = body.status !== undefined ? body.status : old.status
  if (!STATUSES.includes(status)) return fail(res, 400, '状态不正确')

  let tags = old.tags
  if (body.tags !== undefined) {
    tags = normalizeTags(body.tags)
    if (tags === null) return fail(res, 400, '标签格式不正确，应为数组或 JSON 数组文本')
  }

  const isFeatured = body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : old.is_featured

  // 收录日期：显式传入则解析校验（空字符串视为清空）；未传保留旧值
  let acquiredAt = old.acquired_at
  if (body.acquired_at !== undefined) {
    if (String(body.acquired_at).trim()) {
      acquiredAt = normalizeDate(body.acquired_at)
      if (!acquiredAt) return fail(res, 400, '收录日期格式不正确，应为 YYYY-MM-DD')
    } else {
      acquiredAt = null
    }
  }

  collectionModel.update(id, {
    title,
    cover_image: body.cover_image !== undefined ? body.cover_image : old.cover_image,
    type,
    series: body.series !== undefined ? body.series : old.series,
    acquired_at: acquiredAt,
    status,
    notes: body.notes !== undefined ? body.notes : old.notes,
    tags,
    is_featured: isFeatured
  })
  ok(res, collectionModel.findById(id), '更新成功')
}

// 删除收藏条目（仅管理员）：仅删除数据库记录，不删除本地图片文件
export function remove(req, res) {
  const id = Number(req.params.id)
  if (!collectionModel.findById(id)) return fail(res, 404, '收藏条目不存在')
  collectionModel.remove(id)
  ok(res, null, '删除成功')
}
