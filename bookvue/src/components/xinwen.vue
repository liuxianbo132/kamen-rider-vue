<template>
  <div class="kr-page news-bg">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="kr-container nav-inner">
        <a href="#/home" class="brand"><span class="brand-core"></span>KAMEN RIDER</a>
        <div class="nav-links">
          <a href="#/home">首页</a>
          <a href="#/book">产品信息</a>
          <a href="#/xilie">闲暇时光</a>
          <a href="#/xinwen" class="active">新闻资讯</a>
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
        <h1>新闻资讯</h1>
        <p>KAMEN RIDER NEWS · 特摄快讯</p>
      </div>

      <!-- 搜索栏 -->
      <div class="news-toolbar">
        <input
          type="text"
          class="kr-input"
          placeholder="输入关键字，如：W、动画化、剧场版…"
          v-model.trim="keywords"
        >
        <button class="kr-btn kr-btn-gold" @click="search()">搜索</button>
        <a
          class="kr-btn kr-btn-ghost"
          href="https://news.dmzj.com/tag/1274"
          target="_blank"
        >动漫之家 →</a>
      </div>

      <p class="result-tip" v-if="searched">
        {{ keywords ? '关键词「' + keywords + '」共匹配 ' + filtered.length + ' 条资讯' : '显示全部 ' + filtered.length + ' 条资讯' }}
      </p>

      <!-- 文章列表 -->
      <div class="article kr-card" v-for="a in filtered" :key="a.id">
        <div class="article-head">
          <h2>{{ a.title }}</h2>
          <div class="meta">
            <span>{{ a.source }}</span>
            <span>{{ a.date }}</span>
          </div>
        </div>
        <p class="article-body" v-for="(p, i) in a.paragraphs" :key="i">{{ p }}</p>
        <p class="article-footer">编辑 {{ a.editor }}</p>
      </div>

      <div class="empty kr-card" v-if="filtered.length === 0">
        没有匹配的资讯，换个关键词试试吧
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keywords: '',
      searched: false,
      articles: [
        {
          id: 1,
          title: '特摄剧《假面骑士W》续篇漫画《风都侦探》决定动画化',
          source: '新京报社官方帐号',
          date: '10-23 07:09',
          editor: '杨利',
          paragraphs: [
            '特摄剧《假面骑士W》的续篇漫画《风都侦探》决定动画化了，预定于 2022 年夏季开始播出。此次的动画化是特摄剧《假面骑士》50 周年纪念企划之一。',
            '于 2009 年 8 月开始播出的《假面骑士W》讲述了私家侦探左翔太郎与其搭档菲利普变身为"2人一体"的假面骑士而活跃的故事。变身前的翔太郎由桐山涟饰演，菲利普由菅田将暉饰演。'
          ]
        },
        {
          id: 2,
          title: '《假面骑士》系列迎来播映 50 周年纪念企划',
          source: '特摄新闻组',
          date: '09-18 10:32',
          editor: '小林',
          paragraphs: [
            '自 1971 年初代《假面骑士》播映以来，系列已走过半个世纪。周年企划将陆续推出新作、复刻腰带与跨代骑士联动剧场版。',
            '官方同时宣布将重制多款经典驱动器商品，全球限定发售，粉丝可通过各地授权渠道预约。'
          ]
        },
        {
          id: 3,
          title: '剧场版新骑士公开：最新变身腰带设计图流出',
          source: '玩具情报站',
          date: '08-30 21:15',
          editor: '阿诚',
          paragraphs: [
            '即将上映的剧场版中，新骑士的变身腰带首次公开。设计上延续了系列一贯的机械质感，并加入全新发光机构。',
            '相关商品预计与剧场版同步发售，主题商城将第一时间上架，敬请期待。'
          ]
        }
      ]
    }
  },
  computed: {
    user() {
      try {
        return JSON.parse(localStorage.getItem('kamenUser'))
      } catch (e) {
        return null
      }
    },
    filtered() {
      if (!this.keywords) return this.articles
      const k = this.keywords.toLowerCase()
      return this.articles.filter(a => {
        return (
          a.title.toLowerCase().includes(k) ||
          a.source.toLowerCase().includes(k) ||
          a.paragraphs.some(p => p.toLowerCase().includes(k))
        )
      })
    }
  },
  methods: {
    search() {
      this.searched = true
    },
    logout() {
      localStorage.removeItem('kamenUser')
      alert('已退出登录')
    }
  }
}
</script>

<style scoped>
.news-bg {
  background:
    linear-gradient(rgba(11, 14, 20, 0.94), rgba(11, 14, 20, 0.97)),
    url('../assets/news-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
}

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

/* 搜索 */
.news-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}
.news-toolbar .kr-input { flex: 1; }
.result-tip {
  color: var(--text-faint);
  font-size: 13px;
  margin: 0 0 20px;
}

/* 文章卡片 */
.article {
  padding: 28px 32px;
  margin-bottom: 24px;
}
.article-head h2 {
  margin: 0 0 10px;
  font-size: 20px;
  letter-spacing: 1px;
  line-height: 1.5;
}
.meta {
  display: flex;
  gap: 20px;
  color: var(--text-faint);
  font-size: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}
.article-body {
  color: var(--text-sub);
  font-size: 15px;
  line-height: 1.9;
  text-indent: 2em;
  margin: 0 0 12px;
}
.article-footer {
  color: var(--text-faint);
  font-size: 12px;
  text-align: right;
  margin: 8px 0 0;
}

.empty {
  text-align: center;
  padding: 50px 0;
  color: var(--text-faint);
}
</style>
