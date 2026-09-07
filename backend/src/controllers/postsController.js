// 站内文章控制器：公开列表/详情 + 管理端增删改查
import { postModel, CATEGORIES } from '../models/postModel.js'
import { ok, fail } from '../utils/respond.js'

// 从标题生成 slug：仅保留小写字母数字与连字符；纯中文标题回退为时间戳短串
function slugify(title) {
  const s = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
  return s || `post-${Date.now().toString(36)}`
}

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

// 发布时间归一：'YYYY-MM-DD HH:mm' → ISO；返回 undefined 表示格式非法
function toISO(input) {
  const s = String(input).trim()
  const d = new Date(s.includes('T') ? s : s.replace(' ', 'T'))
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}

// 公开列表：仅已发布（支持 category / tag / keyword / page / pageSize / featured）
export function listPublic(req, res) {
  const { category, tag, keyword, page, pageSize, featured } = req.query
  if (category && !CATEGORIES.includes(category)) return fail(res, 400, '栏目不正确')
  ok(res, postModel.findPublished({ category, tag, keyword, page, pageSize, featured }))
}

// 公开详情：按 slug，仅已发布
export function detailPublic(req, res) {
  const post = postModel.findBySlug(req.params.slug)
  if (!post) return fail(res, 404, '文章不存在或未发布')
  ok(res, post)
}

// 管理端列表：全部文章（含草稿）
export function listAdmin(req, res) {
  const { status, category, keyword, page, pageSize } = req.query
  if (status && !['draft', 'published'].includes(status)) return fail(res, 400, '状态不正确')
  if (category && !CATEGORIES.includes(category)) return fail(res, 400, '栏目不正确')
  ok(res, postModel.findAllAdmin({ status, category, keyword, page, pageSize }))
}

// 新增文章（仅管理员）
export function create(req, res) {
  const body = req.body || {}
  const title = String(body.title || '').trim()
  if (!title) return fail(res, 400, '标题不能为空')

  // slug：未填写时按标题自动生成
  let slug = String(body.slug || '').trim().toLowerCase()
  if (!slug) slug = slugify(title)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return fail(res, 400, 'slug 只能包含小写字母、数字和连字符，且需以字母数字开头结尾')
  }
  if (postModel.slugExists(slug)) return fail(res, 400, `slug「${slug}」已被使用，请更换`)

  const category = body.category || 'review'
  if (!CATEGORIES.includes(category)) return fail(res, 400, '栏目不正确')

  const tags = normalizeTags(body.tags)
  if (tags === null) return fail(res, 400, '标签格式不正确，应为数组或 JSON 数组文本')

  const status = body.status || 'draft'
  if (!['draft', 'published'].includes(status)) return fail(res, 400, '状态不正确')

  const featuredLevel = Number(body.featured_level ?? 0)
  if (![0, 1, 2].includes(featuredLevel)) return fail(res, 400, '推荐级别不正确')

  let publishedAt = null
  if (body.published_at && String(body.published_at).trim()) {
    publishedAt = toISO(body.published_at)
    if (!publishedAt) return fail(res, 400, '发布时间格式不正确，应为 YYYY-MM-DD HH:mm')
  } else if (status === 'published') {
    publishedAt = new Date().toISOString() // 发布时未填时间则自动补当前时间
  }

  const info = postModel.create({
    slug,
    title,
    summary: body.summary || '',
    cover_image: body.cover_image || '',
    category,
    tags,
    content: body.content || '',
    status,
    featured_level: featuredLevel,
    published_at: publishedAt
  })
  ok(res, postModel.findById(info.lastInsertRowid), '新增成功')
}

// 编辑文章（仅管理员）
export function update(req, res) {
  const id = Number(req.params.id)
  const old = postModel.findById(id)
  if (!old) return fail(res, 404, '文章不存在')

  const body = req.body || {}
  const title = body.title !== undefined ? String(body.title).trim() : old.title
  if (!title) return fail(res, 400, '标题不能为空')

  let slug = body.slug !== undefined ? String(body.slug || '').trim().toLowerCase() : old.slug
  if (!slug) slug = slugify(title)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return fail(res, 400, 'slug 只能包含小写字母、数字和连字符，且需以字母数字开头结尾')
  }
  if (slug !== old.slug && postModel.slugExists(slug, id)) {
    return fail(res, 400, `slug「${slug}」已被使用，请更换`)
  }

  const category = body.category !== undefined ? body.category : old.category
  if (!CATEGORIES.includes(category)) return fail(res, 400, '栏目不正确')

  let tags = old.tags
  if (body.tags !== undefined) {
    tags = normalizeTags(body.tags)
    if (tags === null) return fail(res, 400, '标签格式不正确，应为数组或 JSON 数组文本')
  }

  const status = body.status !== undefined ? body.status : old.status
  if (!['draft', 'published'].includes(status)) return fail(res, 400, '状态不正确')

  const featuredLevel =
    body.featured_level !== undefined ? Number(body.featured_level) : old.featured_level
  if (![0, 1, 2].includes(featuredLevel)) return fail(res, 400, '推荐级别不正确')

  // 发布时间：显式传入则解析校验；未传且首次发布自动补当前时间；否则保留旧值
  let publishedAt = old.published_at
  if (body.published_at !== undefined && String(body.published_at).trim()) {
    publishedAt = toISO(body.published_at)
    if (!publishedAt) return fail(res, 400, '发布时间格式不正确，应为 YYYY-MM-DD HH:mm')
  } else if (status === 'published' && !publishedAt) {
    publishedAt = new Date().toISOString()
  }

  postModel.update(id, {
    slug,
    title,
    summary: body.summary !== undefined ? body.summary : old.summary,
    cover_image: body.cover_image !== undefined ? body.cover_image : old.cover_image,
    category,
    tags,
    content: body.content !== undefined ? body.content : old.content,
    status,
    featured_level: featuredLevel,
    published_at: publishedAt
  })
  ok(res, postModel.findById(id), '更新成功')
}

// 删除文章（仅管理员）：仅删除数据库记录，不删除本地图片文件
export function remove(req, res) {
  const id = Number(req.params.id)
  if (!postModel.findById(id)) return fail(res, 404, '文章不存在')
  postModel.remove(id)
  ok(res, null, '删除成功')
}
