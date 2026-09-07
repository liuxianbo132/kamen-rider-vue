// 站内文章栏目常量（与后端 postModel.CATEGORIES 保持一致）
export const CATEGORY_LABELS = {
  review: '评论',
  lore: '设定考据',
  collection: '收藏',
  guide: '指南'
}

export const categoryLabel = (c) => CATEGORY_LABELS[c] || c || '未分类'

// 状态与推荐级别展示文案
export const STATUS_LABELS = { published: '已发布', draft: '草稿' }
export const FEATURED_LABELS = { 0: '普通', 1: '次推', 2: '主推' }
