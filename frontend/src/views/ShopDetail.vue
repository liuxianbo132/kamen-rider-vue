<template>
  <div class="sd-page">
    <NavBar />

    <div class="sd-container">
      <!-- 面包屑 -->
      <nav class="breadcrumb">
        <a @click="router.push('/shop')">商城</a>
        <span class="sep">/</span>
        <span class="current">{{ goods?.category || '商品详情' }}</span>
      </nav>

      <!-- 加载中 -->
      <div v-if="loading" class="sd-loading" v-loading="true" element-loading-text="正在加载商品…"></div>

      <!-- 未找到：友好空状态 -->
      <div v-else-if="!goods" class="sd-empty">
        <el-empty description="没有找到这件商品，可能已下架或链接有误">
          <el-button type="primary" @click="router.push('/shop')">返回商城</el-button>
        </el-empty>
      </div>

      <template v-else>
        <!-- 商品主体 -->
        <article class="sd-article">
          <div class="sd-layout">
            <figure class="sd-cover">
              <img :src="goods.image_url || '/images/hero.jpg'" :alt="goods.name" />
            </figure>
            <div class="sd-info">
              <p class="sd-meta"><span class="sd-cat">{{ goods.category || '未分类' }}</span></p>
              <h1 class="sd-title">{{ goods.name }}</h1>
              <p class="sd-price">￥{{ goods.price }}</p>
              <dl class="sd-attrs">
                <div class="attr-row">
                  <dt>库存</dt>
                  <dd>{{ goods.stock > 0 ? `${goods.stock} 件` : '暂时缺货' }}</dd>
                </div>
                <div class="attr-row">
                  <dt>分类</dt>
                  <dd>{{ goods.category || '—' }}</dd>
                </div>
              </dl>
              <p v-if="goods.description" class="sd-desc">{{ goods.description }}</p>
            </div>
          </div>
          <footer class="sd-foot">
            <button class="btn-back" @click="router.push('/shop')">← 返回商城</button>
          </footer>
        </article>

        <!-- 相关站内文章 -->
        <section v-if="relatedPosts.length" class="sd-related">
          <SectionHeading title="相关站内文章" en="RELATED POSTS" more-text="全部文章" @more="router.push('/news?tab=posts')" />
          <div class="rp-list">
            <a v-for="p in relatedPosts" :key="p.id" class="rp-item" @click="router.push(`/posts/${p.slug}`)">
              <div class="rp-img">
                <img :src="p.cover_image || '/images/hero.jpg'" :alt="p.title" loading="lazy" />
              </div>
              <div class="rp-body">
                <p class="rp-date">{{ isoToLocal(p.published_at).slice(0, 10) }} · {{ categoryLabel(p.category) }}</p>
                <h3 class="rp-title">{{ p.title }}</h3>
              </div>
            </a>
          </div>
        </section>

        <!-- 相关收藏记录 -->
        <section v-if="relatedCollections.length" class="sd-related">
          <SectionHeading title="相关收藏记录" en="RELATED COLLECTIONS" more-text="进入收藏室" @more="router.push('/collections')" />
          <div class="rc-list">
            <a
              v-for="c in relatedCollections"
              :key="c.id"
              class="rco-item"
              @click="router.push(`/collections/${c.id}`)"
            >
              <div class="rco-img">
                <img :src="c.cover_image || '/images/hero.jpg'" :alt="c.title" loading="lazy" />
              </div>
              <div class="rco-body">
                <p class="rco-meta">
                  <span class="rco-type">{{ typeLabel(c.type) }}</span>
                  <span>{{ statusLabel(c.status) }}</span>
                </p>
                <h3 class="rco-title">{{ c.title }}</h3>
              </div>
            </a>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { getGoodsByIdApi } from '../api/goods'
import { getPostsApi } from '../api/posts'
import { getCollectionsApi } from '../api/collections'
import { categoryLabel } from '../constants/posts'
import { typeLabel, statusLabel, parseTags } from '../constants/collections'
import { isoToLocal } from '../utils/postContent'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const goods = ref(null)
const posts = ref([])
const collections = ref([])

// 从商品名提取系列关键词（过滤通用词），用于关联站内文章与收藏记录
const GENERIC = new Set(['驱动器', '腰带', '变身', '手机', '双插槽'])
function extractKeywords(name) {
  return String(name || '')
    .split(/[\s（）()·&/，,]+/)
    .map((t) => t.trim())
    .filter((t) => t && !GENERIC.has(t))
}

function includesCI(text, key) {
  return String(text || '').toLowerCase().includes(key.toLowerCase())
}

// 相关文章：标题 / 摘要 / 标签 / 正文命中任一关键词，取前 3
const relatedPosts = computed(() => {
  if (!goods.value) return []
  const keys = extractKeywords(goods.value.name)
  if (!keys.length) return []
  return posts.value
    .filter((p) => {
      const hay = `${p.title} ${p.summary || ''} ${parseTags(p.tags).join(' ')} ${p.content || ''}`
      return keys.some((k) => includesCI(hay, k))
    })
    .slice(0, 3)
})

// 相关收藏：标题 / 系列 / 笔记命中任一关键词，取前 3
const relatedCollections = computed(() => {
  if (!goods.value) return []
  const keys = extractKeywords(goods.value.name)
  if (!keys.length) return []
  return collections.value
    .filter((c) => {
      const hay = `${c.title} ${c.series || ''} ${c.notes || ''}`
      return keys.some((k) => includesCI(hay, k))
    })
    .slice(0, 3)
})

// 加载详情 + 关联内容；id 变化时重新拉取
async function load(id) {
  loading.value = true
  goods.value = null
  posts.value = []
  collections.value = []
  try {
    goods.value = await getGoodsByIdApi(id)
  } catch {
    goods.value = null // 未找到 / 接口失败 → 空状态
  } finally {
    loading.value = false
  }

  // 关联内容独立容错：失败不影响商品主体展示
  const [postsRes, collectionsRes] = await Promise.allSettled([
    getPostsApi({ page: 1, pageSize: 50 }),
    getCollectionsApi({ page: 1, pageSize: 60 })
  ])
  if (postsRes.status === 'fulfilled') posts.value = postsRes.value?.list || []
  if (collectionsRes.status === 'fulfilled') collections.value = collectionsRes.value?.list || []
}

watch(
  () => route.params.id,
  (id) => {
    if (id && route.name === 'ShopDetail') {
      load(id)
      window.scrollTo({ top: 0 })
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.sd-page {
  min-height: 100vh;
  background: var(--page-bg);
}

.sd-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 36px 24px 80px;
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  margin-bottom: 28px;
  color: var(--muted);
}

.breadcrumb a {
  color: var(--accent-dark);
  cursor: pointer;
  transition: color 0.2s;
}
.breadcrumb a:hover { color: var(--accent); }

.breadcrumb .sep { color: var(--line); }
.breadcrumb .current { color: var(--muted); }

.sd-loading {
  min-height: 320px;
  border-radius: 12px;
}

.sd-empty { padding: 60px 0; }

/* 商品主体 */
.sd-article {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 36px 40px 32px;
  animation: sdIn 0.5s ease-out both;
}

@keyframes sdIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.sd-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 36px;
  align-items: start;
}

.sd-cover {
  margin: 0;
  border-radius: 10px;
  overflow: hidden;
  background: var(--page-bg);
}

.sd-cover img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.sd-info { padding-top: 4px; }

.sd-meta { margin: 0 0 12px; }

.sd-cat {
  display: inline-block;
  font-size: 12px;
  color: var(--accent-dark);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 3px 12px;
  letter-spacing: 2px;
  background: var(--page-bg);
}

.sd-title {
  font-family: var(--font-serif);
  font-size: 28px;
  line-height: 1.4;
  letter-spacing: 1px;
  color: var(--text);
  margin: 0 0 16px;
}

.sd-price {
  font-size: 30px;
  font-weight: 700;
  color: var(--accent-dark);
  margin: 0 0 22px;
}

.sd-attrs {
  margin: 0 0 20px;
  border-top: 1px solid var(--line);
}

.attr-row {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.attr-row dt {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 2px;
  white-space: nowrap;
  padding-top: 2px;
}

.attr-row dd {
  margin: 0;
  font-size: 14px;
  color: var(--text);
}

.sd-desc {
  font-size: 15px;
  line-height: 2;
  color: #3d3a34;
  margin: 0;
}

.sd-foot {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.btn-back {
  font-family: var(--font-sans);
  font-size: 13px;
  letter-spacing: 1px;
  padding: 10px 22px;
  border-radius: 4px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-back:hover {
  border-color: var(--accent-dark);
  color: var(--accent-dark);
}

/* 相关文章（横向条目） */
.sd-related { margin-top: 44px; }

.rp-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.rp-item {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s;
  animation: sdIn 0.5s ease-out 0.1s both;
}
.rp-item:hover { border-color: var(--accent); }

.rp-img img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.rp-body { padding: 14px 16px 16px; }

.rp-date {
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 6px;
}

.rp-title {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.5;
  color: var(--text);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}
.rp-item:hover .rp-title { color: var(--accent-dark); }

/* 相关收藏（横向条目） */
.rc-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.rco-item {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 14px;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 14px 12px 12px;
  cursor: pointer;
  transition: border-color 0.25s;
  animation: sdIn 0.5s ease-out 0.12s both;
}
.rco-item:hover { border-color: var(--accent); }

.rco-img {
  border-radius: 6px;
  overflow: hidden;
}

.rco-img img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.rco-body { min-width: 0; }

.rco-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 4px;
}

.rco-type {
  color: var(--accent-dark);
  letter-spacing: 1px;
}

.rco-title {
  font-family: var(--font-serif);
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}
.rco-item:hover .rco-title { color: var(--accent-dark); }

/* 手机端 */
@media (max-width: 768px) {
  .sd-container { padding: 20px 20px 56px; }
  .sd-article { padding: 24px 22px; }
  .sd-layout { grid-template-columns: 1fr; gap: 24px; }
  .sd-cover { max-width: 340px; }
  .sd-title { font-size: 23px; }
  .sd-price { font-size: 26px; }
  .rp-list, .rc-list { grid-template-columns: 1fr; gap: 14px; }
}
</style>
