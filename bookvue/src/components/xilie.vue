<template>
  <div class="kr-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="kr-container nav-inner">
        <a href="#/home" class="brand"><span class="brand-core"></span>KAMEN RIDER</a>
        <div class="nav-links">
          <a href="#/home">首页</a>
          <a href="#/book">产品信息</a>
          <a href="#/xilie" class="active">闲暇时光</a>
          <a href="#/xinwen">新闻资讯</a>
          <a v-if="!user" href="#/login" class="nav-login">登录</a>
          <template v-else>
            <span class="welcome">你好，{{ user.nickname }}</span>
            <a href="javascript:;" class="logout" @click="logout">退出</a>
          </template>
        </div>
      </div>
    </nav>

    <div class="kr-container">
      <div class="page-head">
        <h1>假面骑士主题店</h1>
        <p>KAMEN RIDER CAFE · 鸣海侦探事务所</p>
      </div>

      <div class="quote kr-card">
        <p class="quote-mark">“</p>
        <p class="quote-text">好了，来细数你的罪恶吧。</p>
        <p class="quote-en">Now, count up your sins.</p>
      </div>

      <div class="intro">
        <p>亲爱的顾客朋友，欢迎光临假面骑士主题咖啡店。</p>
        <p>Dear customers and friends, welcome to the Masked Knight theme coffee shop.</p>
        <p class="highlight">「鸣海咖啡馆以最好的材料和服务，为人们提供最高水平的享受。」</p>
      </div>

      <div class="gallery">
        <img src="../assets/xilie.jpg" alt="主题店一景">
        <img src="../assets/xilie2.jpg" alt="主题餐饮">
        <img src="../assets/xilie3.jpg" alt="骑士文化">
      </div>

      <div class="actions">
        <div class="action-card kr-card">
          <h3>If you have time, you should know more</h3>
          <p>了解最新骑士情报与动画化消息</p>
          <a href="#/xinwen" class="kr-btn kr-btn-gold">点击这里，开启探险 →</a>
        </div>
        <div class="action-card kr-card">
          <h3>If you want to buy some other products</h3>
          <p>历代驱动器与正版周边等你带走</p>
          <a href="#/book" class="kr-btn kr-btn-gold">点击这里，购买商品 →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      try {
        return JSON.parse(localStorage.getItem('kamenUser'))
      } catch (e) {
        return null
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('kamenUser')
      alert('已退出登录')
    }
  }
}
</script>

<style scoped>
/* 导航栏（与首页一致） */
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
.nav-links a:hover, .nav-links a.active { color: var(--gold); }
.nav-links a.nav-login {
  color: var(--gold);
  border: 1px solid rgba(245, 197, 24, 0.5);
  border-radius: 6px;
  padding: 5px 16px;
}
.welcome { color: var(--text-sub); font-size: 13px; }
.logout { cursor: pointer; }

/* 页头 */
.page-head { padding: 48px 0 30px; text-align: center; }
.page-head h1 {
  margin: 0 0 8px;
  font-size: 34px;
  letter-spacing: 10px;
}
.page-head p {
  margin: 0;
  color: var(--text-faint);
  font-size: 12px;
  letter-spacing: 4px;
}

/* 名台词 */
.quote {
  text-align: center;
  padding: 36px 30px 30px;
  margin-bottom: 36px;
}
.quote-mark {
  font-size: 56px;
  color: rgba(245, 197, 24, 0.35);
  line-height: 0.6;
  margin: 0 0 10px;
}
.quote-text {
  font-size: 24px;
  letter-spacing: 6px;
  margin: 0 0 8px;
  color: var(--gold);
}
.quote-en {
  color: var(--text-faint);
  font-size: 13px;
  letter-spacing: 2px;
  margin: 0;
}

.intro {
  text-align: center;
  color: var(--text-sub);
  line-height: 2;
  font-size: 15px;
  margin-bottom: 40px;
}
.intro .highlight {
  color: var(--text);
  font-size: 17px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 48px;
}
.gallery img {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.gallery img:hover {
  transform: scale(1.03);
  border-color: rgba(245, 197, 24, 0.5);
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.action-card {
  text-align: center;
  padding: 34px 28px;
}
.action-card h3 {
  margin: 0 0 10px;
  font-size: 15px;
  letter-spacing: 1px;
  color: var(--text-sub);
  font-weight: 600;
}
.action-card p {
  margin: 0 0 22px;
  color: var(--text-faint);
  font-size: 14px;
}

@media (max-width: 900px) {
  .gallery { grid-template-columns: 1fr; }
  .actions { grid-template-columns: 1fr; }
}
</style>
