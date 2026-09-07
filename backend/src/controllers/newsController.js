// 新闻控制器：增删改查（结构同 bannersController）
import { newsModel } from '../models/newsModel.js'
import { ok, fail } from '../utils/respond.js'

// 新闻列表（登录即可访问，前台新闻社展示）
export function list(req, res) {
  ok(res, newsModel.findAll())
}

// 新增新闻（仅管理员）
export function create(req, res) {
  const { title } = req.body || {}
  if (!title) return fail(res, 400, '标题不能为空')
  const { source, editor, date, url, content } = req.body
  // content 需为可解析的 JSON 数组文本（对应前台段落数组）
  if (content !== undefined) {
    try {
      const parsed = JSON.parse(content)
      if (!Array.isArray(parsed)) throw new Error('not array')
    } catch {
      return fail(res, 400, '正文格式不正确，应为段落 JSON 数组')
    }
  }
  const info = newsModel.create({ title, source, editor, date, url, content: content || '[]' })
  ok(res, newsModel.findById(info.lastInsertRowid), '新增成功')
}

// 编辑新闻（仅管理员）
export function update(req, res) {
  const id = Number(req.params.id)
  if (!newsModel.findById(id)) return fail(res, 404, '新闻不存在')
  const { title } = req.body || {}
  if (!title) return fail(res, 400, '标题不能为空')
  const { source, editor, date, url, content } = req.body
  if (content !== undefined) {
    try {
      const parsed = JSON.parse(content)
      if (!Array.isArray(parsed)) throw new Error('not array')
    } catch {
      return fail(res, 400, '正文格式不正确，应为段落 JSON 数组')
    }
  }
  newsModel.update(id, { title, source, editor, date, url, content: content || '[]' })
  ok(res, newsModel.findById(id), '更新成功')
}

// 删除新闻（仅管理员）
export function remove(req, res) {
  const id = Number(req.params.id)
  if (!newsModel.findById(id)) return fail(res, 404, '新闻不存在')
  newsModel.remove(id)
  ok(res, null, '删除成功')
}