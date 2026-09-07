<template>
  <!-- 图鉴：昭和/平成/令和三个年代入口 + 当前年代骑士卡片网格（点卡片跳详情 /archive/:id） -->
  <div class="archive-page">
    <NavBar />

    <div class="ar-container">
      <div class="page-head">
        <p class="page-eyebrow">RIDER ARCHIVE</p>
        <h1>假面骑士图鉴</h1>
        <p class="page-sub">历代主骑士资料 · 持续整理中</p>
      </div>

      <!-- 年代入口 -->
      <div class="era-grid">
        <button
          v-for="e in ERAS"
          :key="e.key"
          :class="['era-card', { active: era === e.key }]"
          @click="switchEra(e.key)"
        >
          <span class="era-label">{{ e.label }}</span>
          <span class="era-en">{{ e.en }}</span>
          <span class="era-range">{{ e.range }}</span>
          <span class="era-intro">{{ e.intro }}</span>
          <span class="era-count">{{ countOf(e.key) }} 位已收录</span>
        </button>
      </div>

      <!-- 当前年代骑士卡片 -->
      <section class="series-section">
        <SectionHeading :title="currentEra.label + '主骑士'" :en="currentEra.en" />
        <div class="series-grid">
          <article
            v-for="r in currentRiders"
            :key="r.id"
            class="series-card"
            role="link"
            tabindex="0"
            :style="{ animationDelay: `${Math.min(r.id, 12) * 40}ms` }"
            @click="goDetail(r.id)"
            @keydown.enter="goDetail(r.id)"
          >
            <div class="sc-img">
              <img v-if="r.image" :src="r.image" :alt="r.name" loading="lazy" />
              <div v-else class="img-empty">暂无图片</div>
              <span class="sc-year">{{ r.year }}</span>
            </div>
            <div class="sc-body">
              <h2 class="sc-name">{{ r.name }}</h2>
              <p class="sc-series">{{ r.series }}</p>
              <p v-if="r.transform_belongings" class="sc-belong">🎞 {{ r.transform_belongings }}</p>
            </div>
          </article>
        </div>
        <p v-if="!loading && !currentRiders.length" class="empty-tip">该年代暂未收录骑士</p>
      </section>

      <p class="ar-note">图鉴内容以 <a href="https://www.kamen-rider-official.com/zukan/" target="_blank" rel="noopener">仮面ライダーWEB 公式図鑑</a> 为主要资料来源，第一版聚焦历代主骑士，副骑士/形态留待后续批次补充。</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { getRidersApi } from '../api/riders'

const route = useRoute()
const router = useRouter()

const ERAS = [
  { key: 'showa',  label: '昭和', en: 'SHOWA',  range: '1971 - 1989', intro: '改造人的悲歌与英雄的原点' },
  { key: 'heisei', label: '平成', en: 'HEISEI', range: '2000 - 2018', intro: '平成二十年，变身系统的叙事革命' },
  { key: 'reiwa',  label: '令和', en: 'REIWA',  range: '2019 - 今',   intro: '令和新生代，做减法的变身美学' }
]

const riders = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    riders.value = await getRidersApi()
  } finally {
    loading.value = false
  }
}

const era = computed(() => {
  const keys = ERAS.map((e) => e.key)
  return keys.includes(route.query.era) ? route.query.era : 'heisei'
})

const currentEra = computed(() => ERAS.find((e) => e.key === era.value))
const currentRiders = computed(() => riders.value.filter((r) => r.era === era.value))

function countOf(key) {
  return riders.value.filter((r) => r.era === key).length
}

function switchEra(key) {
  router.replace({ query: { ...route.query, era: key } })
}

function goDetail(id) {
  router.push({ path: `/archive/${id}`, query: route.query.era ? { era: route.query.era } : {} })
}

onMounted(load)
// 监听 era 切换不需重拉数据（一次拉全量本地过滤）
watch(() => route.query.era, () => {})
</script>

<style scoped>
.archive-page {
  min-height: 100vh;
  background: var(--page-bg);
}

.ar-container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 56px 24px 72px;
}

/* 页头 */
.page-head {
  text-align: center;
  margin-bottom: 36px;
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
  letter-spacing: 6px;
  color: var(--text);
  margin: 0 0 10px;
}
.page-sub {
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--muted);
  margin: 0;
}

/* 年代入口 */
.era-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 44px;
}
.era-card {
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  padding: 22px 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s;
  animation: fadeUp 0.6s ease-out both;
}
.era-card:hover { border-color: var(--accent); }
.era-card.active {
  border-color: var(--accent);
  box-shadow: 0 14px 32px -24px rgba(37, 37, 37, 0.3);
  background: linear-gradient(180deg, #fffdf8 0%, #faf6ec 100%);
}
.era-label {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 3px;
}
.era-en {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--accent-dark);
}
.era-range {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}
.era-intro {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.7;
}
.era-count {
  margin-top: 10px;
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--accent-dark);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 3px 10px;
  background: var(--page-bg);
}

/* 骑士卡片 */
.series-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.series-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
  animation: fadeUp 0.6s ease-out both;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.series-card:hover {
  border-color: var(--accent);
  box-shadow: 0 14px 32px -24px rgba(37, 37, 37, 0.35);
  transform: translateY(-2px);
}
.series-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.sc-img {
  position: relative;
  overflow: hidden;
  background: var(--page-bg);
  aspect-ratio: 4 / 5;
}
.sc-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.series-card:hover .sc-img img { transform: scale(1.04); }
.img-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 2px;
}
.sc-year {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--accent-dark);
  background: rgba(255, 253, 248, 0.92);
  border: 1px solid var(--accent);
  border-radius: 999px;
  padding: 2px 8px;
}

.sc-body { padding: 14px 16px 16px; }
.sc-name {
  font-family: var(--font-serif);
  font-size: 17px;
  line-height: 1.5;
  color: var(--text);
  margin: 0 0 4px;
  letter-spacing: 1px;
}
.sc-series {
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 8px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sc-belong {
  font-size: 11px;
  color: var(--accent-dark);
  margin: 0;
  letter-spacing: 1px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-tip {
  text-align: center;
  color: var(--muted);
  padding: 60px 0;
  font-size: 13px;
  letter-spacing: 2px;
}

.ar-note {
  margin-top: 44px;
  text-align: center;
  font-size: 12px;
  color: var(--muted);
  padding: 16px;
  border: 1px dashed var(--line);
  border-radius: 10px;
  background: var(--surface);
}
.ar-note a {
  color: var(--accent-dark);
  text-decoration: none;
  border-bottom: 1px dashed var(--accent);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .series-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .ar-container { padding: 36px 20px 56px; }
  .page-head h1 { font-size: 26px; }
  .era-grid { grid-template-columns: 1fr; gap: 12px; }
  .era-card { padding: 16px 18px; }
  .era-label { font-size: 19px; }
  .series-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
}
/* 超小屏：年代入口横排两列，骑士卡片保持两列 */
@media (max-width: 480px) {
  .era-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .era-card { padding: 12px 14px; }
  .era-intro { display: none; }
  .era-count { margin-top: 6px; }
}
</style>