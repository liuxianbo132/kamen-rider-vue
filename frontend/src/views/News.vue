<template>
  <!-- 文章页：站内文章 + 外部资讯双 Tab（URL query 同步：/news?tab=posts | /news?tab=news） -->
  <div class="news-page">
    <NavBar />

    <div class="news-container">
      <div class="page-head">
        <p class="page-eyebrow">KAMEN RIDER NOTES</p>
        <h1>文章与资讯</h1>
        <p class="page-sub">站内原创 · 外部快讯</p>
      </div>

      <!-- Tab 切换 -->
      <div class="tabs">
        <button :class="['tab', { active: tab === 'posts' }]" @click="switchTab('posts')">站内文章</button>
        <button :class="['tab', { active: tab === 'news' }]" @click="switchTab('news')">外部资讯</button>
      </div>

      <!-- ============ Tab 1：站内文章 ============ -->
      <div v-if="tab === 'posts'">
        <!-- 栏目筛选 + 关键词搜索 -->
        <div class="toolbar">
          <el-select v-model="postCategory" placeholder="全部栏目" clearable style="width: 150px">
            <el-option v-for="(label, value) in CATEGORY_LABELS" :key="value" :label="label" :value="value" />
          </el-select>
          <el-input
            v-model="postKeyword"
            placeholder="搜索标题、摘要或标签…"
            clearable
            class="search-input"
            @keyup.enter="postSearched = true"
          />
          <el-button type="primary" @click="postSearched = true">搜索</el-button>
        </div>

        <p v-if="postSearched && postKeyword" class="result-tip">
          关键词「{{ postKeyword }}」共匹配 {{ filteredPosts.length }} 篇文章
        </p>

        <!-- 文章卡片：封面、栏目、摘要、标签、阅读全文（站内跳转） -->
        <article
          v-for="(p, i) in filteredPosts"
          :key="p.id"
          class="post-card"
          :style="{ animationDelay: `${Math.min(i, 8) * 60}ms` }"
          role="link"
          tabindex="0"
          @click="goPost(p.slug)"
          @keydown.enter="goPost(p.slug)"
        >
          <div class="pc-cover">
            <img :src="p.cover_image || '/images/hero.jpg'" :alt="p.title" loading="lazy" />
          </div>
          <div class="pc-body">
            <div class="pc-meta">
              <span class="pc-cat">{{ categoryLabel(p.category) }}</span>
              <span>{{ isoToLocal(p.published_at).slice(0, 10) }}</span>
            </div>
            <h2 class="pc-title">{{ p.title }}</h2>
            <p class="pc-summary">{{ p.summary }}</p>
            <div class="pc-foot">
              <div class="pc-tags">
                <span v-for="t in parseTags(p.tags)" :key="t" class="pc-tag"># {{ t }}</span>
              </div>
              <span class="read-link">阅读全文 →</span>
            </div>
          </div>
        </article>

        <el-empty
          v-if="!postsLoading && filteredPosts.length === 0"
          :description="postsError ? '文章加载失败，请稍后重试' : '还没有符合条件的文章'"
        />
      </div>

      <!-- ============ Tab 2：外部资讯 ============ -->
      <div v-else>
        <div class="toolbar">
          <el-input
            v-model="keywords"
            placeholder="输入关键字，如：W、动画化、剧场版…"
            clearable
            class="search-input"
            @keyup.enter="searched = true"
          />
          <el-button type="primary" @click="searched = true">搜索</el-button>
          <el-button class="dmzj-link" tag="a" href="https://news.dmzj.com/tag/1274" target="_blank" link>
            动漫之家 →
          </el-button>
        </div>

        <p v-if="searched" class="result-tip">
          {{ keywords ? `关键词「${keywords}」共匹配 ${filtered.length} 条资讯` : `显示全部 ${filtered.length} 条资讯` }}
        </p>

        <p class="tab-hint">以下内容整理自外部站点，仅保留摘要与原文链接，著作权归原出处所有。</p>

        <!-- 资讯列表：编辑列表风格，点击整体跳原文外链 -->
        <article
          v-for="(a, i) in filtered"
          :key="a.id"
          class="article"
          :style="{ animationDelay: `${Math.min(i, 8) * 60}ms` }"
          role="link"
          tabindex="0"
          @click.stop="openArticle(a)"
          @keydown.enter="openArticle(a)"
          @keydown.space.prevent="openArticle(a)"
        >
          <div class="article-date">
            <span class="ad-day">{{ dateParts(a.date).day }}</span>
            <span class="ad-rest">{{ dateParts(a.date).rest }}</span>
          </div>
          <div class="article-main">
            <h2 class="article-title">{{ a.title }}</h2>
            <p class="article-excerpt">{{ excerpt(a) }}</p>
            <p class="article-footer">
              <span class="source">{{ a.source }}</span>
              <span class="ext">查看原文 ↗</span>
              <span class="editor">编辑 {{ a.editor }}</span>
            </p>
          </div>
        </article>

        <el-empty v-if="!loading && filtered.length === 0" description="没有匹配的资讯，换个关键词试试吧" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { getNewsApi } from '../api/news'
import { getPostsApi } from '../api/posts'
import { CATEGORY_LABELS, categoryLabel } from '../constants/posts'
import { parseTags, isoToLocal } from '../utils/postContent'
import OpenCC from 'opencc-js' // 简繁转换（OpenCC 的 JS 版）

const route = useRoute()
const router = useRouter()

// ============ Tab 状态（URL query 同步） ============
const tab = computed(() => (route.query.tab === 'news' ? 'news' : 'posts'))

function switchTab(t) {
  router.replace({ query: { ...route.query, tab: t } })
}

// ============ 站内文章 ============
const posts = ref([])
const postsLoading = ref(false)
const postsError = ref(false)
const postCategory = ref('')
const postKeyword = ref('')
const postSearched = ref(false)

// 栏目 + 关键词前端过滤（数据量有限，一次拉取）
const filteredPosts = computed(() => {
  let list = posts.value
  if (postCategory.value) list = list.filter((p) => p.category === postCategory.value)
  const k = postKeyword.value.trim().toLowerCase()
  if (k) {
    list = list.filter((p) => {
      const inTags = parseTags(p.tags).some((t) => String(t).toLowerCase().includes(k))
      return (
        String(p.title).toLowerCase().includes(k) ||
        String(p.summary || '').toLowerCase().includes(k) ||
        inTags
      )
    })
  }
  return list
})

function goPost(slug) {
  router.push(`/posts/${slug}`)
}

// ============ 外部资讯（沿用原有逻辑） ============
const list = ref([])
const loading = ref(false)
const keywords = ref('')
const searched = ref(false)

// 简繁归一：无论用户输简体还是繁体，统一转简体后再匹配（转换器创建一次，复用）
const toSimplified = OpenCC.Converter({ from: 'tw', to: 'cn' })
const norm = (s) => toSimplified(s).toLowerCase()

// content 为 JSON 段落数组文本，解析为数组；解析失败时按单段处理
function parseContent(content) {
  try {
    const arr = JSON.parse(content)
    return Array.isArray(arr) ? arr : [content]
  } catch {
    return [content]
  }
}

// 摘要：拼接段落截取约 120 字（仅摘要展示，正文请看原文，不复制第三方全文）
function excerpt(a, len = 120) {
  const text = parseContent(a.content).join(' ').replace(/\s+/g, ' ').trim()
  return text.length > len ? text.slice(0, len) + '……' : text
}

// 日期拆分：兼容新格式 YYYY-MM-DD HH:mm 与旧格式 MM-DD HH:mm（无年份）
function dateParts(date) {
  const s = String(date || '')
  let m = s.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (m) return { day: m[3].padStart(2, '0'), rest: `${m[1]} / ${m[2].padStart(2, '0')}` }
  m = s.match(/(\d{1,2})[-/.](\d{1,2})/)
  if (m) return { day: m[2].padStart(2, '0'), rest: `${m[1].padStart(2, '0')} 月` }
  return { day: '·', rest: s.slice(0, 10) }
}

// 资讯点击：有原文链接则新标签打开，否则跳到资讯站外链
// 兜底：先尝试 window.open，浏览器拦截时改用 a 标签模拟点击
function openArticle(a) {
  const url = (a.url && String(a.url).trim()) || 'https://news.dmzj.com/tag/1274'
  try {
    const win = window.open(url, '_blank', 'noopener')
    if (!win) throw new Error('blocked')
  } catch {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener'
    link.click()
  }
}

// 本地搜索：标题 / 来源 / 正文段落 任一命中（均先简繁归一 + 小写）
const filtered = computed(() => {
  if (!keywords.value) return list.value
  const k = norm(keywords.value)
  return list.value.filter((a) => {
    return (
      norm(a.title).includes(k) ||
      norm(a.source || '').includes(k) ||
      parseContent(a.content).some((p) => norm(p).includes(k))
    )
  })
})

// ============ 数据加载：两个 Tab 数据独立容错 ============
onMounted(async () => {
  postsLoading.value = true
  try {
    const data = await getPostsApi({ page: 1, pageSize: 100 })
    posts.value = data.list || []
  } catch {
    postsError.value = true
    posts.value = []
  } finally {
    postsLoading.value = false
  }

  loading.value = true
  try {
    list.value = await getNewsApi()
  } catch {
    list.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.news-page {
  min-height: 100vh;
  background: var(--page-bg);
}

.news-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 56px 24px 72px;
}

/* 页头 */
.page-head {
  margin-bottom: 28px;
}

.page-eyebrow {
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--accent-dark);
  margin: 0 0 10px;
}

.page-head h1 {
  font-family: var(--font-serif);
  font-size: 34px;
  letter-spacing: 3px;
  color: var(--text);
  margin: 0 0 10px;
}

.page-sub {
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--muted);
  margin: 0;
}

/* Tab 切换 */
.tabs {
  display: flex;
  gap: 26px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 26px;
}

.tab {
  font-family: var(--font-sans);
  font-size: 15px;
  letter-spacing: 2px;
  color: var(--muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 4px 12px;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab:hover { color: var(--accent-dark); }

.tab.active {
  color: var(--accent-dark);
  font-weight: 600;
  border-bottom-color: var(--accent);
}

/* 工具栏（两 Tab 共用） */
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input { flex: 1; }

.dmzj-link {
  color: var(--muted);
  font-size: 13px;
}

.result-tip {
  color: var(--muted);
  font-size: 13px;
  margin: 0 0 16px;
}

.tab-hint {
  color: var(--muted);
  font-size: 12px;
  margin: 0 0 18px;
  padding: 8px 12px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
}

/* ============ 站内文章卡片：封面 + 栏目 + 摘要 + 标签 ============ */
.post-card {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s;
  animation: cardIn 450ms ease-out both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.post-card:hover,
.post-card:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 14px 32px -24px rgba(37, 37, 37, 0.3);
  outline: none;
}

.pc-cover img {
  width: 100%;
  height: 100%;
  min-height: 170px;
  object-fit: cover;
  display: block;
}

.pc-body {
  padding: 20px 24px 18px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pc-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--muted);
}

.pc-cat {
  color: var(--accent-dark);
  letter-spacing: 2px;
}

.pc-title {
  font-family: var(--font-serif);
  font-size: 20px;
  line-height: 1.5;
  color: var(--text);
  margin: 0;
  transition: color 0.2s;
}
.post-card:hover .pc-title { color: var(--accent-dark); }

.pc-summary {
  font-size: 14px;
  line-height: 1.8;
  color: var(--muted);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pc-foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: hidden;
}

.pc-tag {
  font-size: 12px;
  color: var(--muted);
}

.read-link {
  font-size: 13px;
  letter-spacing: 1px;
  color: var(--accent-dark);
  white-space: nowrap;
}

/* ============ 外部资讯：时间线 / 编辑列表风格（与站内文章明确区分） ============ */
.article {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 24px;
  padding: 26px 12px;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.25s;
  animation: articleIn 450ms ease-out both;
}
@keyframes articleIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.article:hover,
.article:focus-visible {
  background: var(--surface);
  outline: none;
}

/* 左侧日期列 */
.article-date {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding-top: 2px;
}

.ad-day {
  font-family: var(--font-serif);
  font-size: 26px;
  line-height: 1;
  color: var(--accent-dark);
}

.ad-rest {
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--muted);
}

.article-title {
  font-family: var(--font-serif);
  color: var(--text);
  font-size: 20px;
  line-height: 1.5;
  letter-spacing: 1px;
  margin: 0 0 10px;
  transition: color 0.2s;
}
.article:hover .article-title { color: var(--accent-dark); }

.article-excerpt {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
  margin: 0 0 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  color: var(--muted);
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
}
.article-footer .ext {
  color: var(--accent-dark);
  font-weight: 600;
}
.article-footer .editor {
  margin-left: auto;
}

/* 手机端 */
@media (max-width: 768px) {
  .news-container { padding: 36px 20px 56px; }
  .page-head h1 { font-size: 26px; }
  .toolbar { flex-wrap: wrap; }

  .post-card {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .pc-cover img {
    min-height: 0;
    aspect-ratio: 16 / 9;
  }
  .pc-body { padding: 16px 18px 18px; }
  .pc-title { font-size: 18px; }

  .article {
    grid-template-columns: 56px 1fr;
    gap: 14px;
    padding: 20px 4px;
  }
  .ad-day { font-size: 20px; }
  .article-title { font-size: 17px; }
  .article-footer { flex-wrap: wrap; gap: 8px; }
  .article-footer .editor { margin-left: 0; }
}
</style>
