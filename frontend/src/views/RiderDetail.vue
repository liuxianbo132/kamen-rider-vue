<template>
  <!-- 假面骑士图鉴详情页 /archive/:id -->
  <div class="rd-page" v-if="rider">
    <NavBar />

    <div class="rd-container">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="goBack">← 返回图鉴</button>

      <!-- 头部：大图 + 基础信息 -->
      <header class="rd-head">
        <div class="rd-hero">
          <img v-if="rider.image" :src="rider.image" :alt="rider.name" />
          <div v-else class="img-fallback">暂无图片</div>
        </div>
        <div class="rd-meta">
          <p class="rd-eyebrow">{{ rider.era === 'showa' ? 'SHOWA' : rider.era === 'heisei' ? 'HEISEI' : 'REIWA' }} RIDER</p>
          <h1 class="rd-name">{{ rider.name }}</h1>
          <p v-if="rider.name_origin || rider.name_en" class="rd-origin">
            {{ rider.name_origin }}<span v-if="rider.name_origin && rider.name_en"> · </span>{{ rider.name_en }}
          </p>
          <p class="rd-series">{{ rider.series }}</p>
          <ul class="rd-stats">
            <li><span class="k">年代</span><span class="v">{{ rider.year }}</span></li>
            <li v-if="rider.height"><span class="k">身高</span><span class="v">{{ rider.height }}</span></li>
            <li v-if="rider.weight"><span class="k">体重</span><span class="v">{{ rider.weight }}</span></li>
            <li v-if="rider.transform_belongings">
              <span class="k">变身道具</span><span class="v">{{ rider.transform_belongings }}</span>
            </li>
            <li v-if="rider.transform_user">
              <span class="k">变身者</span><span class="v">{{ rider.transform_user }}</span>
            </li>
            <li v-if="rider.first_appear">
              <span class="k">初登场</span><span class="v">{{ rider.first_appear }}</span>
            </li>
          </ul>
        </div>
      </header>

      <!-- 介绍 -->
      <section class="rd-intro">
        <SectionHeading title="角色介绍" en="INTRODUCTION" />
        <p v-if="rider.intro" class="rd-intro-text">{{ rider.intro }}</p>
        <p v-else class="rd-intro-empty">暂无介绍</p>
      </section>

      <!-- 资料来源 -->
      <p v-if="rider.image_source" class="rd-source">
        图片与设定来源：<a :href="rider.image_source" target="_blank" rel="noopener">仮面ライダーWEB 公式図鑑</a>
      </p>

      <!-- 底部返回 -->
      <button class="back-btn bottom" @click="goBack">← 返回图鉴</button>
    </div>
  </div>
  <div v-else class="rd-loading">
    <NavBar />
    <p class="loading-text">加载中…</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { getRiderByIdApi } from '../api/riders'

const route = useRoute()
const router = useRouter()
const rider = ref(null)

async function load(id) {
  rider.value = null
  try {
    rider.value = await getRiderByIdApi(id)
  } catch (e) {
    rider.value = null
  }
}

function goBack() {
  // 保留 era 查询参数
  router.push({ path: '/archive', query: route.query.era ? { era: route.query.era } : {} })
}

onMounted(() => load(route.params.id))
watch(() => route.params.id, (v) => v && load(v))
</script>

<style scoped>
.rd-page,
.rd-loading {
  min-height: 100vh;
  background: var(--page-bg);
}

.rd-container {
  max-width: 1060px;
  margin: 0 auto;
  padding: 36px 24px 72px;
}

.back-btn {
  font-family: var(--font-sans);
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--accent-dark);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 16px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  margin-bottom: 24px;
}
.back-btn:hover {
  border-color: var(--accent);
}
.back-btn.bottom {
  display: block;
  margin: 56px auto 0;
}

/* 头部：图 + 信息 */
.rd-head {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 36px;
  align-items: start;
  margin-bottom: 44px;
  animation: fadeUp 0.5s ease-out both;
}
.rd-hero {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rd-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.img-fallback {
  font-size: 13px;
  color: var(--muted);
  letter-spacing: 2px;
}

.rd-eyebrow {
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--accent-dark);
  margin: 0 0 8px;
}
.rd-name {
  font-family: var(--font-serif);
  font-size: 38px;
  letter-spacing: 4px;
  color: var(--text);
  margin: 0 0 8px;
  line-height: 1.2;
}
.rd-origin {
  font-size: 13px;
  color: var(--muted);
  letter-spacing: 1px;
  margin: 0 0 12px;
}
.rd-series {
  font-size: 15px;
  color: var(--text);
  letter-spacing: 1px;
  margin: 0 0 20px;
}

.rd-stats {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 24px;
  border-top: 1px solid var(--line);
  padding-top: 20px;
}
.rd-stats li {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rd-stats .k {
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--muted);
}
.rd-stats .v {
  font-size: 14px;
  color: var(--text);
  word-break: break-all;
}

/* 介绍 */
.rd-intro {
  margin-top: 36px;
  animation: fadeUp 0.6s ease-out both;
  animation-delay: 80ms;
}
.rd-intro-text {
  font-size: 15px;
  line-height: 2;
  color: var(--text);
  letter-spacing: 0.5px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 22px 26px;
  margin: 0;
  text-indent: 2em;
}
.rd-intro-empty {
  font-size: 14px;
  color: var(--muted);
  text-align: center;
  padding: 32px;
  border: 1px dashed var(--line);
  border-radius: 12px;
}

.rd-source {
  margin-top: 28px;
  font-size: 11px;
  color: var(--muted);
  text-align: center;
  letter-spacing: 1px;
}
.rd-source a {
  color: var(--accent-dark);
  text-decoration: none;
  border-bottom: 1px dashed var(--accent);
}

.loading-text {
  text-align: center;
  padding: 120px 0;
  color: var(--muted);
  letter-spacing: 4px;
  font-size: 13px;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .rd-container { padding: 24px 16px 56px; }
  .rd-head { grid-template-columns: 1fr; gap: 20px; }
  .rd-name { font-size: 28px; }
  .rd-stats { grid-template-columns: 1fr; }
}
</style>