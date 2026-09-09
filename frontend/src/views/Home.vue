<template>
  <div class="home">
    <NavBar />

    <main class="home-main">
      <!-- ============ 1. 首屏介绍区（右侧为 3 张轮播图，自动切换） ============ -->
      <section class="hero">
        <div class="hero-text">
          <p class="hero-eyebrow">A KAMEN RIDER NOTES</p>
          <h1 class="hero-title">敌我同源、悲剧英雄，<br>手握恶的力量，却选择守护人类</h1>
          <p class="hero-intro">本站收集假面骑士的资讯、设定、收藏与日常——从最新情报到腰带陈列，从台词摘录到主题空间探访。</p>
          <div class="hero-actions">
            <button class="btn btn-primary" @click="router.push('/news?tab=posts')">阅读最新文章</button>
            <button class="btn btn-ghost" @click="router.push('/collections')">进入收藏室</button>
          </div>
        </div>

        <!-- 轮播图：API 取 3 张，自动切换；与下方精选阅读重复的图自动剔除 -->
        <figure class="hero-cover">
          <div
            v-if="carouselBanners.length"
            class="banner-carousel"
            @mouseenter="paused = true"
            @mouseleave="paused = false"
          >
            <a
              v-for="(b, i) in carouselBanners"
              :key="b.id"
              :href="b.link_url && b.link_url !== '/' ? b.link_url : '#'"
              :class="['bc-slide', { active: i === current }]"
              :aria-hidden="i !== current"
              @click.prevent="onBannerClick(b)"
            >
              <img :src="b.image_url" :alt="b.title || 'banner'" />
            </a>
            <!-- 左右控制按钮 -->
            <button class="bc-arrow bc-prev" @click.stop="prev" aria-label="上一张">‹</button>
            <button class="bc-arrow bc-next" @click.stop="next" aria-label="下一张">›</button>
            <!-- 指示点 -->
            <div class="bc-dots" role="tablist">
              <button
                v-for="(b, i) in carouselBanners"
                :key="b.id"
                :class="['dot', { active: i === current }]"
                role="tab"
                :aria-label="`第 ${i + 1} 张`"
                @click.stop="goTo(i)"
              ></button>
            </div>
          </div>
          <div v-else class="bc-empty">轮播图加载中</div>
        </figure>
      </section>

      <!-- ============ 2. 精选阅读（站内文章，featured 优先） ============ -->
      <section class="section">
        <SectionHeading title="精选阅读" en="FEATURED" more-text="查看全部文章" @more="router.push('/news?tab=posts')" />

        <template v-if="articles.length">
          <article
            class="feature-main"
            role="link"
            tabindex="0"
            @click="goPost(articles[0].slug)"
            @keydown.enter="goPost(articles[0].slug)"
          >
            <div class="fm-img">
              <img :src="articles[0].cover_image || '/images/hero.jpg'" :alt="articles[0].title" />
            </div>
            <div class="fm-body">
              <p class="article-meta">
                <span class="cat-chip">{{ categoryLabel(articles[0].category) }}</span>
                {{ postDate(articles[0]) }}
              </p>
              <h3 class="fm-title">{{ articles[0].title }}</h3>
              <p class="article-excerpt">{{ articles[0].summary }}</p>
              <span class="read-link">阅读全文 →</span>
            </div>
          </article>

          <div v-if="articles.length > 1" class="feature-side">
            <article
              v-for="a in articles.slice(1)"
              :key="a.id"
              class="feature-card"
              role="link"
              tabindex="0"
              @click="goPost(a.slug)"
              @keydown.enter="goPost(a.slug)"
            >
              <div class="fc-img">
                <img :src="a.cover_image || '/images/hero.jpg'" :alt="a.title" loading="lazy" />
              </div>
              <div class="fc-body">
                <p class="article-meta">
                  <span class="cat-chip">{{ categoryLabel(a.category) }}</span>
                  {{ postDate(a) }}
                </p>
                <h3 class="fc-title">{{ a.title }}</h3>
                <p class="article-excerpt">{{ a.summary }}</p>
                <span class="read-link">阅读全文 →</span>
              </div>
            </article>
          </div>
        </template>

        <div v-else class="posts-empty">
          <p class="pe-title">第一篇站内文章正在整理中</p>
          <p class="pe-sub">写好之后会第一时间出现在这里。</p>
        </div>
      </section>

      <!-- ============ 3. 最新快讯 ============ -->
      <section class="section section-tight">
        <SectionHeading title="最新快讯" en="NEWS FEED" more-text="查看全部资讯" @more="router.push('/news?tab=news')" />
        <div v-if="newsItems.length" class="news-feed">
          <template v-for="n in newsItems" :key="n.id">
            <a v-if="n.url" :href="n.url" target="_blank" rel="noopener" class="feed-item">
              <span class="feed-date">{{ n.date }}</span>
              <span class="feed-title">{{ n.title }}</span>
              <span class="feed-source">{{ n.source }}</span>
              <span class="feed-ext">查看原文 ↗</span>
            </a>
            <div v-else class="feed-item">
              <span class="feed-date">{{ n.date }}</span>
              <span class="feed-title">{{ n.title }}</span>
              <span class="feed-source">{{ n.source }}</span>
            </div>
          </template>
        </div>
        <p v-else class="empty-tip">暂无快讯。</p>
      </section>

      <!-- ============ 4. 收藏精选 ============ -->
      <section class="section section-tight">
        <SectionHeading title="收藏精选" en="COLLECTION" more-text="进入收藏室" @more="router.push('/collections')" />
        <div v-if="collectionItems.length" class="collect-grid">
          <a
            v-for="c in collectionItems"
            :key="c.id"
            class="collect-card"
            @click="router.push(`/collections/${c.id}`)"
          >
            <div class="co-img">
              <img :src="c.cover_image || '/images/hero.jpg'" :alt="c.title" loading="lazy" />
              <span class="co-status" :class="`st-${c.status}`">{{ statusLabel(c.status) }}</span>
            </div>
            <div class="co-body">
              <p class="co-meta">
                <span class="co-type">{{ typeLabel(c.type) }}</span>
                <span v-if="c.series">{{ c.series }}</span>
              </p>
              <h3 class="co-title">{{ c.title }}</h3>
            </div>
          </a>
        </div>
        <p v-else class="empty-tip">收藏室正在整理中。</p>
      </section>

      <!-- ============ 5. 专题入口区 ============ -->
      <section class="section">
        <SectionHeading title="站内专题" en="TOPICS" />
        <div class="topic-grid">
          <a
            v-for="t in topics"
            :key="t.title"
            class="topic-card"
            @click="router.push(t.to)"
          >
            <div class="topic-img">
              <img :src="t.img" :alt="t.alt" loading="lazy" />
            </div>
            <div class="topic-body">
              <h3 class="topic-title">{{ t.title }}</h3>
              <p class="topic-desc">{{ t.desc }}</p>
            </div>
          </a>
        </div>
      </section>

      <!-- （已移除：6. 本月收藏 / 商城精选区） -->

      <!-- ============ 7. 关于区 ============ -->
      <section id="about" class="about">
        <div class="about-inner">
          <p class="about-eyebrow">ABOUT</p>
          <h2 class="about-title">关于本站</h2>
          <p class="about-text">
            「卡面来打小站」是一个围绕假面骑士的私人记录站：收集新作资讯与设定考据，
            整理腰带收藏与主题空间探访，也随手写下一些关于特摄文化的小观察。
          </p>
          <div class="about-tags">
            <span>资讯</span>
            <span>收藏</span>
            <span>特摄文化</span>
          </div>
          <p class="about-motto">始于热爱，记录每一次变身。</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <p class="footer-brand">© {{ year }} 卡面来打小站 · KAMEN RIDER ARCHIVE</p>
        <nav class="footer-nav">
          <a @click="router.push('/')">首页</a>
          <a @click="router.push('/news')">文章</a>
          <a @click="router.push('/collections')">收藏室</a>
          <a @click="router.push('/archive')">资料库</a>
          <a @click="router.push('/shop')">商城</a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { getPostsApi } from '../api/posts'
import { getNewsApi } from '../api/news'
import { getCollectionsApi } from '../api/collections'
import { getBannersApi } from '../api/banners'
import { categoryLabel } from '../constants/posts'
import { typeLabel, statusLabel } from '../constants/collections'
import { isoToLocal } from '../utils/postContent'

const router = useRouter()
const year = new Date().getFullYear()

// ============ 精选阅读 ============
const articles = ref([])
const newsItems = ref([])
const collectionItems = ref([])

// ============ 轮播图 ============
const banners = ref([])
const current = ref(0)
const paused = ref(false)
let timer = null

function postDate(p) {
  return isoToLocal(p.published_at).slice(0, 10)
}
function goPost(slug) {
  router.push(`/posts/${slug}`)
}

// 精选阅读封面基名（去重用，仅做精确文件名匹配，避免误删轮播图）
const featuredCovers = computed(() =>
  new Set(
    (articles.value || [])
      .map((a) => (a.cover_image || '').split('/').pop().toLowerCase())
      .filter(Boolean)
  )
)
// 仅当轮播图与精选阅读封面「文件名完全相同」时才剔除，保证轮播数量与 API 一致
const carouselBanners = computed(() => {
  if (!banners.value.length) return banners.value
  const filtered = banners.value.filter((b) => {
    const base = (b.image_url || '').split('/').pop().toLowerCase()
    return base ? !featuredCovers.value.has(base) : true
  })
  return filtered.length ? filtered : banners.value
})

function goTo(i) {
  if (!carouselBanners.value.length) return
  current.value = (i + carouselBanners.value.length) % carouselBanners.value.length
}
function next() { goTo(current.value + 1) }
function prev() { goTo(current.value - 1) }

function start() {
  stop()
  if (carouselBanners.value.length <= 1) return
  timer = setInterval(() => { if (!paused.value) next() }, 5000)
}
function stop() {
  if (timer) { clearInterval(timer); timer = null }
}

function onBannerClick(b) {
  if (b.link_url && b.link_url !== '/') {
    // 外链或站内绝对路径
    if (/^https?:\/\//.test(b.link_url)) window.open(b.link_url, '_blank', 'noopener')
    else router.push(b.link_url)
  } else {
    router.push('/news?tab=posts')
  }
}

// 轮播图列表变化（含过滤后数量变化）时，重置并重启定时器
watch(carouselBanners, () => {
  current.value = 0
  start()
}, { flush: 'post' })

// ============ 精选阅读加载 ============
async function loadPosts() {
  const [featRes, latestRes] = await Promise.allSettled([
    getPostsApi({ featured: 1, page: 1, pageSize: 10 }),
    getPostsApi({ page: 1, pageSize: 6 })
  ])
  const feat = featRes.status === 'fulfilled' ? featRes.value?.list || [] : []
  const latest = latestRes.status === 'fulfilled' ? latestRes.value?.list || [] : []

  const main = feat.find((p) => p.featured_level === 2) || latest[0] || null
  const used = new Set(main ? [main.id] : [])
  const sides = []
  for (const p of feat) {
    if (sides.length >= 2) break
    if (p.featured_level === 1 && !used.has(p.id)) {
      sides.push(p); used.add(p.id)
    }
  }
  for (const p of latest) {
    if (sides.length >= 2) break
    if (!used.has(p.id)) { sides.push(p); used.add(p.id) }
  }
  articles.value = main ? [main, ...sides] : []
}

// ============ 轮播图加载 ============
async function loadBanners() {
  try {
    const data = await getBannersApi()
    banners.value = Array.isArray(data) ? data : (data?.list || [])
  } catch (e) {
    console.warn('[home] banners fetch failed', e)
  }
}

// ============ 专题入口 ============
const topics = [
  { img: '/images/123.jpg', alt: '假面骑士 W 双人侦探剧照', title: '骑士资讯', desc: '动画化情报与周年企划速递', to: '/news' },
  { img: '/images/xilie.jpg', alt: '主题店空间陈列', title: '收藏与主题店', desc: '鸣海侦探事务所的主题空间', to: '/collections' },
  { img: '/images/4.jpg', alt: '历代变身腰带驱动器', title: '驱动器典藏', desc: '历代正版变身腰带精选', to: '/shop' }
]

// ============ 挂载 ============
onMounted(async () => {
  loadPosts()
  loadBanners()

  const [newsRes, collectionsRes] = await Promise.allSettled([
    getNewsApi(),
    getCollectionsApi({ featured: 1, page: 1, pageSize: 3 })
  ])

  const newsList = newsRes.status === 'fulfilled' && Array.isArray(newsRes.value) ? newsRes.value : []
  newsItems.value = newsList.slice(0, 3)

  const collectionsList =
    collectionsRes.status === 'fulfilled' && collectionsRes.value?.list ? collectionsRes.value.list : []
  collectionItems.value = collectionsList.slice(0, 3)
})

onUnmounted(stop)
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--page-bg);
  color: var(--text);
}

.home-main { max-width: 1180px; margin: 0 auto; }

/* ============ 1. 首屏介绍区 ============ */
.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 56px;
  align-items: center;
  padding: 72px 24px 48px;
}

.hero-eyebrow {
  font-size: 12px;
  letter-spacing: 4px;
  color: var(--accent-dark);
  margin-bottom: 18px;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: 46px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 2px;
  color: var(--text);
  margin: 0 0 20px;
}

.hero-intro {
  font-size: 15px;
  line-height: 2;
  color: var(--muted);
  max-width: 420px;
  margin: 0 0 32px;
}

.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

.btn {
  font-family: var(--font-sans);
  font-size: 14px;
  letter-spacing: 2px;
  padding: 12px 26px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.btn-primary {
  background: var(--accent);
  border: 1px solid var(--accent);
  color: #fff;
}
.btn-primary:hover { background: var(--accent-dark); border-color: var(--accent-dark); }

.btn-ghost {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--text);
}
.btn-ghost:hover { border-color: var(--accent-dark); color: var(--accent-dark); }

/* 安静的圆角封面图 */
.hero-cover {
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 48px -28px rgba(37, 37, 37, 0.25);
}

/* ============ 轮播图 ============ */
.banner-carousel {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--surface);
}

.bc-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.7s ease;
  pointer-events: none;
}
.bc-slide.active {
  opacity: 1;
  pointer-events: auto;
}
.bc-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bc-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 253, 248, 0.78);
  color: var(--text);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.banner-carousel:hover .bc-arrow { opacity: 1; }
.bc-arrow:hover { background: #fff; }
.bc-prev { left: 12px; }
.bc-next { right: 12px; }

.bc-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.dot.active { background: var(--accent); transform: scale(1.2); }
.dot:hover { background: var(--accent-dark); }

.bc-empty {
  width: 100%;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 14px;
  background: var(--surface);
}

/* ============ 通用栏目 ============ */
.section { padding: 56px 24px; }
.section-tight { padding-top: 24px; }

.article-meta {
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 10px;
}

.cat-chip {
  color: var(--accent-dark);
  letter-spacing: 2px;
}

.article-excerpt {
  font-size: 14px;
  line-height: 1.9;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-link {
  font-size: 13px;
  letter-spacing: 1px;
  color: var(--accent-dark);
}

/* ============ 2. 精选文章 ============ */
.feature-main {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s;
  animation: fadeUp 0.6s ease-out both;
}
.feature-main:hover,
.feature-main:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 16px 36px -24px rgba(37, 37, 37, 0.3);
  outline: none;
}

.fm-img { min-height: 300px; }
.fm-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fm-body {
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
}

.fm-title {
  font-family: var(--font-serif);
  font-size: 24px;
  line-height: 1.4;
  letter-spacing: 1px;
  color: var(--text);
  transition: color 0.2s;
}
.feature-main:hover .fm-title { color: var(--accent-dark); }

.feature-side {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.feature-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s;
  animation: fadeUp 0.6s ease-out both;
  animation-delay: 0.1s;
}
.feature-card:hover,
.feature-card:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 16px 36px -24px rgba(37, 37, 37, 0.3);
  outline: none;
}

.fc-img img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.fc-body {
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fc-title {
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.45;
  color: var(--text);
  transition: color 0.2s;
}
.feature-card:hover .fc-title { color: var(--accent-dark); }

.posts-empty {
  background: var(--surface);
  border: 1px dashed var(--line);
  border-radius: 12px;
  padding: 56px 24px;
  text-align: center;
}

.pe-title {
  font-family: var(--font-serif);
  font-size: 18px;
  color: var(--text);
  margin: 0 0 8px;
}

.pe-sub {
  font-size: 13px;
  color: var(--muted);
  margin: 0;
}

/* ============ 3. 最新快讯 ============ */
.news-feed {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.feed-item {
  display: grid;
  grid-template-columns: 130px 1fr auto auto;
  align-items: center;
  gap: 18px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
}
.feed-item:last-child { border-bottom: none; }

a.feed-item { cursor: pointer; }
a.feed-item .feed-title { transition: color 0.2s; }
a.feed-item:hover .feed-title { color: var(--accent-dark); }

.feed-date {
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.feed-title {
  font-size: 14px;
  color: var(--text);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feed-source {
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.feed-ext {
  font-size: 12px;
  color: var(--accent-dark);
  white-space: nowrap;
}

/* ============ 4. 收藏精选区 ============ */
.collect-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.collect-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s;
  animation: fadeUp 0.6s ease-out both;
}
.collect-card:hover { border-color: var(--accent); }

.co-img {
  position: relative;
  overflow: hidden;
}

.co-img img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.collect-card:hover .co-img img { transform: scale(1.04); }

.co-status {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

.co-status.st-owned {
  color: var(--accent-dark);
  background: rgba(255, 253, 248, 0.9);
  border: 1px solid var(--accent);
}

.co-status.st-wishlist {
  color: #fff;
  background: rgba(122, 117, 108, 0.85);
}

.co-body { padding: 16px 18px 18px; }

.co-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 8px;
}

.co-type {
  color: var(--accent-dark);
  letter-spacing: 2px;
}

.co-title {
  font-family: var(--font-serif);
  font-size: 17px;
  line-height: 1.5;
  color: var(--text);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}
.collect-card:hover .co-title { color: var(--accent-dark); }

/* ============ 5. 专题入口 ============ */
.topic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.topic-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.25s;
  animation: fadeUp 0.6s ease-out both;
}
.topic-card:hover { border-color: var(--accent); }

.topic-img { overflow: hidden; }
.topic-img img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.topic-card:hover .topic-img img { transform: scale(1.04); }

.topic-body { padding: 20px 22px 22px; }

.topic-title {
  font-family: var(--font-serif);
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--text);
  margin: 0 0 8px;
  transition: transform 0.3s ease, color 0.2s;
}
.topic-card:hover .topic-title { transform: translateY(-3px); color: var(--accent-dark); }

.topic-desc {
  font-size: 13px;
  color: var(--muted);
  margin: 0;
}

/* （已删除：原 .goods-grid / .goods-item / .gi-* 本月收藏样式） */

.empty-tip {
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  color: var(--muted);
}

/* ============ 6. 关于区 ============ */
.about {
  scroll-margin-top: 96px;
  margin: 24px 24px 0;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 56px 48px;
}

.about-eyebrow {
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--accent-dark);
  margin: 0 0 14px;
}

.about-title {
  font-family: var(--font-serif);
  font-size: 28px;
  letter-spacing: 2px;
  color: var(--text);
  margin: 0 0 18px;
}

.about-text {
  font-size: 15px;
  line-height: 2;
  color: var(--muted);
  max-width: 640px;
  margin: 0 0 24px;
}

.about-tags { display: flex; gap: 10px; margin-bottom: 24px; }

.about-tags span {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--accent-dark);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 5px 14px;
  background: var(--page-bg);
}

.about-motto {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 15px;
  color: var(--muted);
  margin: 0;
}

.footer {
  border-top: 1px solid var(--line);
  margin-top: 56px;
}

.footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-brand {
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--muted);
}

.footer-nav { display: flex; gap: 20px; }

.footer-nav a {
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s;
}
.footer-nav a:hover { color: var(--accent-dark); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-text { animation: fadeUp 0.6s ease-out both; }
.hero-cover { animation: fadeUp 0.6s ease-out 0.12s both; }

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 20px 24px;
  }
  .hero-title { font-size: 32px; }
  .hero-intro { margin-bottom: 26px; }

  .section { padding: 40px 20px; }
  .section-tight { padding-top: 16px; }

  .feature-main { grid-template-columns: 1fr; }
  .fm-img { min-height: 200px; aspect-ratio: 16 / 9; }
  .fm-body { padding: 22px 24px; gap: 10px; }
  .fm-title { font-size: 20px; }

  .feature-side { grid-template-columns: 1fr; margin-top: 16px; gap: 16px; }

  .feed-item {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 14px 18px;
  }
  .feed-title { white-space: normal; }

  .collect-grid { grid-template-columns: 1fr; gap: 16px; }

  .topic-grid { grid-template-columns: 1fr; gap: 16px; }

  .about { margin: 0 20px; padding: 36px 24px; }
  .about-title { font-size: 24px; }

  .footer-inner { flex-direction: column; align-items: flex-start; }
}
</style>
