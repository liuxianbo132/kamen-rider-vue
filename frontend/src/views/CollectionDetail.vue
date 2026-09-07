<template>
  <div class="cd-page">
    <NavBar />

    <div class="cd-container">
      <!-- 面包屑 -->
      <nav class="breadcrumb">
        <a @click="router.push('/collections')">收藏室</a>
        <span class="sep">/</span>
        <span class="current">{{ typeLabel(item?.type) }}</span>
      </nav>

      <!-- 加载中 -->
      <div v-if="loading" class="cd-loading" v-loading="true" element-loading-text="正在加载收藏条目…"></div>

      <!-- 未找到：友好空状态 -->
      <div v-else-if="!item" class="cd-empty">
        <el-empty description="没有找到这个收藏条目，可能已归档或链接有误">
          <el-button type="primary" @click="router.push('/collections')">返回收藏室</el-button>
        </el-empty>
      </div>

      <!-- 条目主体 -->
      <article v-else class="cd-article">
        <div class="cd-layout">
          <figure class="cd-cover">
            <img :src="item.cover_image || '/images/hero.jpg'" :alt="item.title" />
            <span class="cd-status" :class="`st-${item.status}`">{{ statusLabel(item.status) }}</span>
          </figure>
          <div class="cd-info">
            <p class="cd-meta">
              <span class="cd-type">{{ typeLabel(item.type) }}</span>
              <span v-if="item.series">{{ item.series }}</span>
            </p>
            <h1 class="cd-title">{{ item.title }}</h1>
            <dl class="cd-attrs">
              <div v-if="item.acquired_at" class="attr-row">
                <dt>收录日期</dt>
                <dd>{{ item.acquired_at.slice(0, 10) }}</dd>
              </div>
              <div v-if="tags.length" class="attr-row">
                <dt>标签</dt>
                <dd>
                  <span v-for="t in tags" :key="t" class="cd-tag"># {{ t }}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- 收藏笔记 -->
        <section v-if="item.notes" class="cd-notes">
          <h2 class="cd-notes-title">收藏笔记</h2>
          <p v-for="(para, i) in noteParas" :key="i" class="cd-note-p">{{ para }}</p>
        </section>

        <footer class="cd-foot">
          <button class="btn-back" @click="router.push('/collections')">← 返回收藏室</button>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { getCollectionByIdApi } from '../api/collections'
import { typeLabel, statusLabel, parseTags } from '../constants/collections'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const item = ref(null)

const tags = computed(() => parseTags(item.value?.tags))

// 笔记按空行分段展示
const noteParas = computed(() =>
  String(item.value?.notes || '')
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
)

async function load(id) {
  loading.value = true
  item.value = null
  try {
    item.value = await getCollectionByIdApi(id)
  } catch {
    item.value = null // 未找到 / 已归档 / 接口失败 → 空状态
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id && route.name === 'CollectionDetail') {
      load(id)
      window.scrollTo({ top: 0 })
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.cd-page {
  min-height: 100vh;
  background: var(--page-bg);
}

.cd-container {
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

.cd-loading {
  min-height: 320px;
  border-radius: 12px;
}

.cd-empty { padding: 60px 0; }

/* 条目主体 */
.cd-article {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 36px 40px 32px;
  animation: cdIn 0.5s ease-out both;
}

@keyframes cdIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.cd-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  align-items: start;
}

.cd-cover {
  margin: 0;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.cd-cover img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.cd-status {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 999px;
}

.cd-status.st-owned {
  color: var(--accent-dark);
  background: rgba(255, 253, 248, 0.9);
  border: 1px solid var(--accent);
}

.cd-status.st-wishlist {
  color: #fff;
  background: rgba(122, 117, 108, 0.85);
}

.cd-info { padding-top: 4px; }

.cd-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 14px;
}

.cd-type {
  color: var(--accent-dark);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 3px 12px;
  letter-spacing: 2px;
  background: var(--page-bg);
}

.cd-title {
  font-family: var(--font-serif);
  font-size: 28px;
  line-height: 1.4;
  letter-spacing: 1px;
  color: var(--text);
  margin: 0 0 22px;
}

.cd-attrs {
  margin: 0;
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cd-tag {
  font-size: 12px;
  color: var(--muted);
}

/* 收藏笔记 */
.cd-notes {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.cd-notes-title {
  font-family: var(--font-serif);
  font-size: 18px;
  color: var(--text);
  margin: 0 0 14px;
  letter-spacing: 2px;
}

.cd-note-p {
  font-size: 15px;
  line-height: 2.1;
  color: #3d3a34;
  margin: 0 0 16px;
}

.cd-foot {
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

/* 手机端 */
@media (max-width: 768px) {
  .cd-container { padding: 20px 20px 56px; }
  .cd-article { padding: 24px 22px; }
  .cd-layout {
    grid-template-columns: 1fr;
    gap: 22px;
  }
  .cd-cover { max-width: 320px; }
  .cd-title { font-size: 23px; }
}
</style>
