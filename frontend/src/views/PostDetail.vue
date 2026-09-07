<template>
  <div class="post-detail-page">
    <NavBar />

    <div class="pd-container">
      <!-- 面包屑：文章 / 当前栏目 -->
      <nav class="breadcrumb">
        <a @click="router.push('/news?tab=posts')">文章</a>
        <span class="sep">/</span>
        <span class="current">{{ categoryLabel(post?.category) }}</span>
      </nav>

      <!-- 加载中 -->
      <div v-if="loading" class="pd-loading" v-loading="true" element-loading-text="正在加载文章…"></div>

      <!-- 未找到：友好空状态 -->
      <div v-else-if="!post" class="pd-empty">
        <el-empty description="没有找到这篇文章，可能已下线或链接有误">
          <el-button type="primary" @click="router.push('/news?tab=posts')">返回文章列表</el-button>
        </el-empty>
      </div>

      <!-- 文章主体 -->
      <article v-else class="pd-article">
        <header class="pd-head">
          <div class="pd-meta">
            <span class="pd-cat">{{ categoryLabel(post.category) }}</span>
            <span>{{ isoToLocal(post.published_at).slice(0, 10) }}</span>
          </div>
          <h1 class="pd-title">{{ post.title }}</h1>
          <p v-if="post.summary" class="pd-summary">{{ post.summary }}</p>
          <div v-if="postTags.length" class="pd-tags">
            <span v-for="t in postTags" :key="t" class="pd-tag"># {{ t }}</span>
          </div>
        </header>

        <img
          v-if="post.cover_image"
          :src="post.cover_image"
          :alt="post.title"
          class="pd-cover"
        />

        <div class="pd-body">
          <template v-for="(b, i) in blocks" :key="i">
            <h2 v-if="b.type === 'h2'" class="pd-h2">{{ b.text }}</h2>
            <p v-else class="pd-p">{{ b.text }}</p>
          </template>
          <p v-if="!blocks.length" class="pd-p pd-empty-text">（正文为空）</p>
        </div>

        <footer class="pd-foot">
          <button class="btn-back" @click="router.push('/news?tab=posts')">← 返回文章列表</button>
        </footer>
      </article>

      <!-- 相关阅读：同栏目最新 3 篇（排除当前文章） -->
      <section v-if="related.length" class="pd-related">
        <SectionHeading title="相关阅读" en="RELATED" />
        <div class="related-grid">
          <a v-for="r in related" :key="r.id" class="related-card" @click="goPost(r.slug)">
            <div class="rc-img">
              <img :src="r.cover_image || '/images/hero.jpg'" :alt="r.title" loading="lazy" />
            </div>
            <div class="rc-body">
              <p class="rc-date">{{ isoToLocal(r.published_at).slice(0, 10) }}</p>
              <h3 class="rc-title">{{ r.title }}</h3>
            </div>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { getPostBySlugApi, getPostsApi } from '../api/posts'
import { categoryLabel } from '../constants/posts'
import { parseBlocks, parseTags, isoToLocal } from '../utils/postContent'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const post = ref(null)
const related = ref([])

const blocks = computed(() => parseBlocks(post.value?.content))
const postTags = computed(() => parseTags(post.value?.tags))

// 加载详情 + 相关阅读；slug 变化时重新拉取（同栏目最新，排除当前文章）
async function load(slug) {
  loading.value = true
  post.value = null
  related.value = []
  try {
    post.value = await getPostBySlugApi(slug)
  } catch {
    post.value = null // 未找到 / 接口失败 → 空状态
  } finally {
    loading.value = false
  }
  if (post.value?.category) {
    try {
      const data = await getPostsApi({ category: post.value.category, page: 1, pageSize: 5 })
      related.value = (data.list || []).filter((p) => p.slug !== slug).slice(0, 3)
    } catch {
      related.value = [] // 相关阅读失败不影响正文展示
    }
  }
}

function goPost(slug) {
  router.push(`/posts/${slug}`)
}

watch(
  () => route.params.slug,
  (slug) => {
    if (slug && route.name === 'PostDetail') {
      load(slug)
      window.scrollTo({ top: 0 })
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background: var(--page-bg);
}

.pd-container {
  max-width: 820px;
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

.pd-loading {
  min-height: 320px;
  border-radius: 12px;
}

.pd-empty {
  padding: 60px 0;
}

/* 文章主体 */
.pd-article {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 40px 44px 36px;
  animation: pdIn 0.5s ease-out both;
}

@keyframes pdIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.pd-head { margin-bottom: 24px; }

.pd-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 14px;
}

.pd-cat {
  color: var(--accent-dark);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 3px 12px;
  letter-spacing: 2px;
  background: var(--page-bg);
}

.pd-title {
  font-family: var(--font-serif);
  font-size: 30px;
  line-height: 1.4;
  letter-spacing: 1px;
  color: var(--text);
  margin: 0 0 16px;
}

.pd-summary {
  font-size: 15px;
  line-height: 1.9;
  color: var(--muted);
  border-left: 3px solid var(--accent);
  padding-left: 14px;
  margin: 0 0 16px;
}

.pd-tags { display: flex; flex-wrap: wrap; gap: 8px; }

.pd-tag {
  font-size: 12px;
  color: var(--muted);
}

.pd-cover {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  margin-bottom: 28px;
}

/* 正文：纯文本渲染（不使用 v-html） */
.pd-h2 {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--text);
  margin: 30px 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--line);
}

.pd-p {
  font-size: 15px;
  line-height: 2.1;
  color: #3d3a34;
  margin: 0 0 18px;
  white-space: pre-line;
}

.pd-empty-text { color: #a8a29a; }

.pd-foot {
  margin-top: 36px;
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

/* 相关阅读 */
.pd-related { margin-top: 48px; }

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.related-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s;
  animation: pdIn 0.5s ease-out 0.1s both;
}
.related-card:hover { border-color: var(--accent); }

.rc-img img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.rc-body { padding: 14px 16px 16px; }

.rc-date {
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 6px;
}

.rc-title {
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
.related-card:hover .rc-title { color: var(--accent-dark); }

/* 手机端 */
@media (max-width: 768px) {
  .pd-container { padding: 20px 20px 56px; }
  .pd-article { padding: 26px 22px; }
  .pd-title { font-size: 24px; }
  .pd-cover { max-height: 260px; }
  .related-grid { grid-template-columns: 1fr; gap: 14px; }
}
</style>
