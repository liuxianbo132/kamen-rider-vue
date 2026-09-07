// 收藏条目常量（与后端 collectionModel TYPES/STATUSES 保持一致）
export const TYPE_LABELS = {
  belt: '驱动器',
  figure: '手办',
  place: '主题空间',
  event: '活动'
}

export const STATUS_LABELS = {
  owned: '已收藏',
  wishlist: '心愿单',
  archived: '已归档'
}

export const typeLabel = (t) => TYPE_LABELS[t] || t || '未分类'
export const statusLabel = (s) => STATUS_LABELS[s] || s || ''

// tags（JSON 数组文本）→ 数组；解析失败返回 []
export function parseTags(tags) {
  try {
    const arr = JSON.parse(tags)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
