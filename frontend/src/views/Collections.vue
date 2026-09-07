<template>
  <!-- 收藏室：数据驱动的收藏条目列表（承接原 Leisure 静态页的主题店内容） -->
  <div class="collections-page">
    <NavBar />

    <div class="page-head">
      <p class="page-eyebrow">COLLECTION ROOM</p>
      <h1>收藏室</h1>
      <p class="page-sub">驱动器 · 主题空间 · 每一件都值得记录</p>
    </div>

    <div class="cl-container">
      <!-- 引言（承接原静态页气质） -->
      <blockquote class="quote">
        <p class="quote-mark">“</p>
        <p class="quote-text">收藏的意义不在占有，而在为热爱布置一个可以日常回访的坐标。</p>
      </blockquote>

      <!-- 类型 + 状态筛选 -->
      <div class="filters">
        <div class="filter-group">
          <button
            :class="['chip', { active: !typeFilter }]"
            @click="switchType('')"
          >全部</button>
          <button
            v-for="(label, value) in TYPE_LABELS"
            :key="value"
            :class="['chip', { active: typeFilter === value }]"
            @click="switchType(value)"
          >{{ label }}</button>
        </div>
        <div class="filter-group">
          <button
            :class="['chip chip-status', { active: !statusFilter }]"
            @click="switchStatus('')"
          >全部状态</button>
          <button
            :class="['chip chip-status', { active: statusFilter === 'owned' }]"
            @click="switchStatus('owned')"
          >已收藏</button>
          <button
            :class="['chip chip-status', { active: statusFilter === 'wishlist' }]"
            @click="switchStatus('wishlist')"
          >心愿单</button>
        </div>
      </div>

      <!-- 收藏网格 -->
      <div v-if="items.length" class="cl-grid">
        <article
          v-for="(c, i) in items"
          :key="c.id"
          class="cl-card"
          :style="{ animationDelay: `${Math.min(i, 8) * 60}ms` }"
          role="link"
          tabindex="0"
          @click="goDetail(c.id)"
          @keydown.enter="goDetail(c.id)"
        >
          <div class="cl-img">
            <img :src="c.cover_image || '/images/hero.jpg'" :alt="c.title" loading="lazy" />
            <span class="cl-status" :class="`st-${c.status}`">{{ statusLabel(c.status) }}</span>
          </div>
          <div class="cl-body">
            <p class="cl-meta">
              <span class="cl-type">{{ typeLabel(c.type) }}</span>
              <span v-if="c.series">{{ c.series }}</span>
            </p>
            <h2 class="cl-title">{{ c.title }}</h2>
            <p v-if="c.acquired_at" class="cl-date">收录于 {{ c.acquired_at.slice(0, 10) }}</p>
          </div>
        </article>
      </div>

      <!-- 空状态 / 加载失败 -->
      <div v-else-if="!loading" class="cl-empty">
        <el-empty :description="error ? '收藏加载失败，请稍后重试' : '这个分类下还没有收藏条目'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { getCollectionsApi } from '../api/collections'
import { TYPE_LABELS, typeLabel, statusLabel } from '../constants/collections'

const route = useRoute()
const router = useRouter()

const items = ref([])
const loading = ref(false)
const error = ref(false)

// 筛选状态（URL query 同步：type / status）
const typeFilter = ref(String(route.query.type || ''))
const statusFilter = ref(String(route.query.status || ''))

function switchType(t) {
  typeFilter.value = t
  router.replace({ query: { ...route.query, type: t || undefined } })
  fetchList()
}

function switchStatus(s) {
  statusFilter.value = s
  router.replace({ query: { ...route.query, status: s || undefined } })
  fetchList()
}

function goDetail(id) {
  router.push(`/collections/${id}`)
}

async function fetchList() {
  loading.value = true
  error.value = false
  try {
    const params = { page: 1, pageSize: 60 }
    if (typeFilter.value) params.type = typeFilter.value
    if (statusFilter.value) params.status = statusFilter.value
    const data = await getCollectionsApi(params)
    items.value = data.list || []
  } catch {
    error.value = true
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)
</script>

<style scoped>
.collections-page {
  min-height: 100vh;
  background: var(--page-bg);
}

/* 大标题页头 */
.page-head {
  max-width: 1060px;
  margin: 0 auto;
  text-align: center;
  padding: 64px 24px 8px;
}

.page-eyebrow {
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--accent-dark);
  margin: 0 0 12px;
}

.page-head h1 {
  font-family: var(--font-serif);
  font-size: 34px;
  letter-spacing: 6px;
  color: var(--text);
  margin: 0 0 10px;
}

.page-sub {
  color: var(--muted);
  font-size: 13px;
  letter-spacing: 2px;
  margin: 0;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.cl-container {
  max-width: 1060px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* 引言 */
.quote {
  max-width: 720px;
  margin: 36px auto 8px;
  text-align: center;
  padding: 20px 32px 28px;
  animation: fadeUp 0.6s ease-out both;
}

.quote-mark {
  font-family: var(--font-serif);
  font-size: 48px;
  line-height: 1;
  color: var(--accent);
  opacity: 0.45;
  margin: 0;
}

.quote-text {
  font-family: var(--font-serif);
  font-size: 18px;
  letter-spacing: 2px;
  line-height: 1.8;
  color: var(--muted);
  margin: 8px 0 0;
}

/* 筛选 */
.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin: 28px 0 24px;
  animation: fadeUp 0.6s ease-out 0.08s both;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--muted);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 16px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.chip:hover {
  color: var(--accent-dark);
  border-color: var(--accent);
}

.chip.active {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
}

/* 收藏网格 */
.cl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.cl-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s;
  animation: fadeUp 0.6s ease-out both;
}
.cl-card:hover,
.cl-card:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 14px 32px -24px rgba(37, 37, 37, 0.3);
  outline: none;
}

.cl-img {
  position: relative;
  overflow: hidden;
}

.cl-img img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.cl-card:hover .cl-img img { transform: scale(1.04); }

.cl-status {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

.cl-status.st-owned {
  color: var(--accent-dark);
  background: rgba(255, 253, 248, 0.9);
  border: 1px solid var(--accent);
}

.cl-status.st-wishlist {
  color: #fff;
  background: rgba(122, 117, 108, 0.85);
}

.cl-body { padding: 16px 18px 18px; }

.cl-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 8px;
}

.cl-type {
  color: var(--accent-dark);
  letter-spacing: 2px;
}

.cl-title {
  font-family: var(--font-serif);
  font-size: 17px;
  line-height: 1.5;
  color: var(--text);
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}
.cl-card:hover .cl-title { color: var(--accent-dark); }

.cl-date {
  font-size: 12px;
  color: var(--muted);
  margin: 0;
}

.cl-empty { padding: 40px 0; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 手机端 */
@media (max-width: 768px) {
  .page-head { padding-top: 40px; }
  .page-head h1 { font-size: 26px; }
  .quote-text { font-size: 16px; }
  .filters { justify-content: flex-start; }
  .cl-grid { grid-template-columns: 1fr; gap: 16px; }
}
</style>
