<template>
  <div class="kr-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="kr-container nav-inner">
        <a href="#/home" class="brand">
          <span class="brand-core"></span>KAMEN RIDER
        </a>
        <div class="nav-links">
          <a href="#/home">首页</a>
          <a href="#features">主题</a>
          <a href="#/book">产品信息</a>
          <a href="#/xilie">闲暇时光</a>
          <a href="#/xinwen">新闻资讯</a>
          <template v-if="user">
            <span class="welcome">你好，{{ user.nickname }}</span>
            <a href="javascript:;" class="logout" @click="logout">退出</a>
          </template>
          <a v-else href="#/login" class="nav-login">登录</a>
        </div>
      </div>
    </nav>

    <!-- Hero 轮播 -->
    <div class="hero">
      <transition name="fade">
        <img :src="slides[current].img" :key="current" class="hero-img" alt="hero">
      </transition>
      <div class="hero-mask"></div>
      <div class="hero-content">
        <p class="hero-eyebrow">SINCE 1971 · 特摄永恒</p>
        <h1 class="hero-title">{{ slides[current].title }}</h1>
        <p class="hero-sub">{{ slides[current].sub }}</p>
        <div class="hero-actions">
          <a href="#/book" class="kr-btn kr-btn-gold">进入商城</a>
          <a href="#/xilie" class="kr-btn kr-btn-ghost">主题咖啡厅</a>
        </div>
      </div>
      <div class="hero-dots">
        <span
          v-for="(s, i) in slides"
          :key="i"
          :class="['dot', { active: i === current }]"
          @click="current = i"
        ></span>
      </div>
      <button class="hero-arrow left" @click="prev">‹</button>
      <button class="hero-arrow right" @click="next">›</button>
    </div>

    <!-- 特色卡片 -->
    <section id="features" class="features">
      <div class="kr-container">
        <h2 class="section-title">骑士主题世界</h2>
        <p class="section-sub">REVOL · BUGSTER · HEAVEN'S ARENA</p>
        <div class="feature-grid">
          <a href="#/book" class="feature-card kr-card">
            <img src="../assets/4.jpg" alt="变身腰带">
            <div class="feature-body">
              <h3>变身腰带</h3>
              <p>从 W 到 01，历代正版驱动器齐聚一堂</p>
              <span class="feature-link">立即选购 →</span>
            </div>
          </a>
          <a href="#/xinwen" class="feature-card kr-card">
            <img src="../assets/123.jpg" alt="骑士资讯">
            <div class="feature-body">
              <h3>骑士资讯</h3>
              <p>最新动画化情报与周年企划一手速递</p>
              <span class="feature-link">查看新闻 →</span>
            </div>
          </a>
          <a href="#/xilie" class="feature-card kr-card">
            <img src="../assets/xilie.jpg" alt="主题咖啡">
            <div class="feature-body">
              <h3>主题咖啡</h3>
              <p>"好了，来细数你的罪恶吧"——鸣海侦探事务所</p>
              <span class="feature-link">前往体验 →</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="kr-container">
        <div class="footer-grid">
          <div>音频视频 · 假面骑士主题店</div>
          <div>联系方式：78985241639@163.com</div>
          <div>© 2026 KAMEN RIDER STORE</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import heroImg from '../assets/hero.jpg'
import slide2 from '../assets/22jpg.jpg'
import slide3 from '../assets/33.jpg'

export default {
  data() {
    return {
      current: 0,
      slides: [
        { img: heroImg, title: '变身，开始', sub: '历代骑士驱动器 · 正版周边主题商城' },
        { img: slide2, title: '风都侦探', sub: '假面骑士 W 续篇动画化情报火热进行中' },
        { img: slide3, title: '细数你的罪恶', sub: '主题咖啡厅 · 等待下一位侦探的到来' }
      ],
      timer: null
    }
  },
  computed: {
    user() {
      try {
        return JSON.parse(localStorage.getItem('kamenUser'))
      } catch (e) {
        return null
      }
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.current = (this.current + 1) % this.slides.length
    }, 4500)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    prev() {
      this.current = (this.current - 1 + this.slides.length) % this.slides.length
    },
    next() {
      this.current = (this.current + 1) % this.slides.length
    },
    logout() {
      localStorage.removeItem('kamenUser')
      alert('已退出登录')
    }
  }
}
</script>

<style scoped>
/* 导航栏 */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 14, 20, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: 3px;
  font-size: 16px;
  color: var(--text);
}
.brand:hover { color: var(--gold); }
.brand-core {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 12px rgba(245, 197, 24, 0.9);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 26px;
  font-size: 14px;
}
.nav-links a {
  color: var(--text-sub);
  letter-spacing: 2px;
  transition: color 0.2s ease;
}
.nav-links a:hover { color: var(--gold); }
.nav-links a.nav-login {
  color: var(--gold);
  border: 1px solid rgba(245, 197, 24, 0.5);
  border-radius: 6px;
  padding: 5px 16px;
}
.welcome { color: var(--text-sub); font-size: 13px; }
.logout { cursor: pointer; }

/* Hero */
.hero {
  position: relative;
  height: 560px;
  overflow: hidden;
}
.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11,14,20,0.25) 0%, rgba(11,14,20,0.55) 70%, var(--bg) 100%);
}
.hero-content {
  position: absolute;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 90%;
}
.hero-eyebrow {
  color: var(--gold);
  font-size: 13px;
  letter-spacing: 6px;
  margin-bottom: 14px;
}
.hero-title {
  font-size: 52px;
  font-weight: 900;
  letter-spacing: 14px;
  margin: 0 0 16px;
  color: #fff;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}
.hero-sub {
  color: #cbd5e1;
  font-size: 16px;
  letter-spacing: 3px;
  margin: 0 0 32px;
}
.hero-actions { display: flex; gap: 16px; justify-content: center; }

.hero-dots {
  position: absolute;
  bottom: 76px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.dot {
  width: 26px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: background 0.25s ease;
}
.dot.active { background: var(--gold); }

.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: rgba(11, 14, 20, 0.5);
  color: #fff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}
.hero-arrow:hover { border-color: var(--gold); color: var(--gold); }
.hero-arrow.left { left: 24px; }
.hero-arrow.right { right: 24px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.8s ease; }
.fade-enter, .fade-leave-to { opacity: 0; }

/* 特色卡片 */
.features { padding: 70px 0 30px; }
.section-title {
  text-align: center;
  font-size: 30px;
  letter-spacing: 8px;
  margin: 0 0 8px;
  color: var(--text);
}
.section-sub {
  text-align: center;
  color: var(--text-faint);
  font-size: 12px;
  letter-spacing: 4px;
  margin: 0 0 44px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.feature-card {
  display: block;
  overflow: hidden;
  color: var(--text);
}
.feature-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}
.feature-body { padding: 20px 22px; }
.feature-body h3 {
  margin: 0 0 8px;
  font-size: 18px;
  letter-spacing: 2px;
}
.feature-body p {
  margin: 0 0 14px;
  color: var(--text-sub);
  font-size: 14px;
  line-height: 1.6;
}
.feature-link { color: var(--gold); font-size: 13px; letter-spacing: 1px; }

/* 页脚 */
.footer {
  margin-top: 60px;
  border-top: 1px solid var(--border);
  padding: 26px 0;
}
.footer-grid {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--text-faint);
  font-size: 13px;
  letter-spacing: 1px;
}
</style>
