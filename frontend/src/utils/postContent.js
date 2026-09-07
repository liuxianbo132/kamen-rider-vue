// 文章正文与时间格式化工具（PostDetail 与后台预览共用）

// 正文按空行分段；以 "## " 开头的段落渲染为二级标题（不使用 v-html，防 XSS）
export function parseBlocks(content) {
  const text = String(content || '').trim()
  if (!text) return []
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) =>
      s.startsWith('## ')
        ? { type: 'h2', text: s.slice(3).trim() }
        : { type: 'p', text: s }
    )
}

// tags（JSON 数组文本）→ 数组；解析失败返回 []
export function parseTags(tags) {
  try {
    const arr = JSON.parse(tags)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

// ISO 时间 → 'YYYY-MM-DD HH:mm'（本地时区）；空/非法返回 ''
export function isoToLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// 当前本地时间 → 'YYYY-MM-DD HH:mm'（后台表单默认值）
export function nowLocal() {
  return isoToLocal(new Date().toISOString())
}
