<template>
  <!-- 收藏室：主题空间与手记（静态页，图文网格布局） -->
  <div class="leisure-page">
    <NavBar />

    <div class="page-head">
      <p class="page-eyebrow">COLLECTION ROOM</p>
      <h1>收藏室</h1>
      <p class="page-sub">主题空间 · 台词摘录 · 陈列手记</p>
    </div>

    <div class="leisure-container">
      <!-- 名台词引言 -->
      <blockquote class="quote">
        <p class="quote-mark">“</p>
        <p class="quote-text">好了，来细数你的罪恶吧。</p>
        <p class="quote-en">Now, count up your sins.</p>
      </blockquote>

      <!-- 简介 -->
      <div class="intro">
        <p>亲爱的顾客朋友，欢迎光临假面骑士主题咖啡店。</p>
        <p>Dear customers and friends, welcome to the Masked Knight theme coffee shop.</p>
        <p class="highlight">「鸣海咖啡馆以最好的材料和服务，为人们提供最高水平的享受。」</p>
      </div>

      <!-- 图文网格 -->
      <div class="gallery">
        <figure v-for="(img, i) in gallery" :key="img.src" class="gallery-item">
          <img :src="img.src" :alt="img.alt" loading="lazy" />
          <figcaption>{{ img.caption }}</figcaption>
        </figure>
      </div>

      <!-- 跳转卡片 -->
      <div class="actions">
        <div v-for="action in actions" :key="action.title" class="action-card">
          <h3>{{ action.title }}</h3>
          <p>{{ action.desc }}</p>
          <a class="action-link" @click="$router.push(action.to)">{{ action.btn }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'

const gallery = [
  { src: '/images/xilie.jpg', alt: '主题店一景', caption: 'Theme Store' },
  { src: '/images/xilie2.jpg', alt: '主题餐饮', caption: 'Rider Cafe' },
  { src: '/images/xilie3.jpg', alt: '骑士文化', caption: 'Rider Culture' }
]

const actions = [
  { title: 'If you have time, you should know more', desc: '了解最新骑士情报与动画化消息', to: '/news', btn: '点击这里，开启探险 →' },
  { title: 'If you want to buy some other products', desc: '历代驱动器与正版周边等你带走', to: '/shop', btn: '点击这里，前往商城 →' }
]
</script>

<style scoped>
.leisure-page {
  min-height: 100vh;
  background: var(--page-bg);
}

/* 大标题页头 */
.page-head {
  max-width: 960px;
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

.leisure-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 72px;
}

/* 名台词引言 */
.quote {
  max-width: 720px;
  margin: 40px auto 0;
  text-align: center;
  padding: 24px 32px 32px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  animation: fadeUp 0.6s ease-out both;
}

.quote-mark {
  font-family: var(--font-serif);
  font-size: 56px;
  line-height: 1;
  color: var(--accent);
  opacity: 0.45;
  margin: 0;
}

.quote-text {
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--text);
  margin: 10px 0 8px;
}

.quote-en {
  color: var(--muted);
  font-size: 13px;
  letter-spacing: 2px;
  margin: 0;
}

/* 简介 */
.intro {
  max-width: 720px;
  margin: 32px auto 0;
  padding: 0 8px;
  text-align: center;
  animation: fadeUp 0.6s ease-out 0.1s both;
}

.intro p {
  color: var(--muted);
  line-height: 1.9;
  margin: 0 0 10px;
  font-size: 14px;
}

.intro p:last-child { margin-bottom: 0; }

.intro .highlight {
  color: var(--accent-dark);
  font-family: var(--font-serif);
}

/* 图文网格 */
.gallery {
  margin: 48px auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.gallery-item {
  margin: 0;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface);
  transition: border-color 0.25s;
  animation: fadeUp 0.6s ease-out both;
}
.gallery-item:hover { border-color: var(--accent); }

.gallery-item img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.gallery-item:hover img { transform: scale(1.04); }

.gallery-item figcaption {
  padding: 12px 16px;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 2px;
  border-top: 1px solid var(--line);
}

/* 跳转卡片 */
.actions {
  margin: 48px auto 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.action-card {
  padding: 28px 30px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  animation: fadeUp 0.6s ease-out 0.15s both;
  transition: border-color 0.25s;
}
.action-card:hover { border-color: var(--accent); }

.action-card h3 {
  font-family: var(--font-serif);
  color: var(--text);
  font-size: 17px;
  letter-spacing: 1px;
  margin: 0 0 10px;
}

.action-card p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 18px;
}

.action-link {
  font-size: 13px;
  letter-spacing: 1px;
  color: var(--accent-dark);
  cursor: pointer;
  transition: color 0.2s;
}
.action-link:hover { color: var(--accent); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 手机端单列 */
@media (max-width: 768px) {
  .page-head { padding-top: 40px; }
  .page-head h1 { font-size: 26px; }
  .quote-text { font-size: 21px; }
  .gallery, .actions { grid-template-columns: 1fr; gap: 16px; }
  .gallery-item img { height: 200px; }
}
</style>
