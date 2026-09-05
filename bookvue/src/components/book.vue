<template>
  <div class="kr-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="kr-container nav-inner">
        <a href="#/home" class="brand"><span class="brand-core"></span>KAMEN RIDER</a>
        <div class="nav-links">
          <a href="#/home">首页</a>
          <a href="#/book" class="active">产品信息</a>
          <a href="#/xilie">闲暇时光</a>
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
        <h1>产品信息</h1>
        <p>DRIVER COLLECTION · 驱动器典藏</p>
      </div>

      <!-- 工具栏：添加 + 搜索 -->
      <div class="toolbar kr-card">
        <div class="tool-row">
          <input type="text" class="kr-input" placeholder="编号" v-model.trim="id">
          <input type="text" class="kr-input" placeholder="商品名" v-model.trim="name">
          <input type="text" class="kr-input" placeholder="单价 如 $180" v-model.trim="price">
          <input type="text" class="kr-input" placeholder="数量" v-model.trim="num">
          <button class="kr-btn kr-btn-gold" @click="add()">添加</button>
        </div>
        <div class="tool-row">
          <input
            type="text"
            class="kr-input search"
            placeholder="搜索商品名称关键字…"
            v-model.trim="keywords"
          >
          <button class="kr-btn kr-btn-ghost" @click="search()">搜索</button>
        </div>
      </div>

      <!-- 数据表 -->
      <div class="table-wrap kr-card">
        <table class="kr-table">
          <thead>
            <tr>
              <th>编号</th>
              <th>商品名</th>
              <th>单价</th>
              <th>现存数量</th>
              <th>入库时间</th>
              <th>基本操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in books" :key="item.id">
              <!-- 编辑态 -->
              <template v-if="editId === item.id">
                <td>{{ item.id }}</td>
                <td><input class="kr-input sm" v-model.trim="editName"></td>
                <td><input class="kr-input sm" v-model.trim="editPrice"></td>
                <td><input class="kr-input sm" v-model.trim="editNum"></td>
                <td>{{ item.ctime }}</td>
                <td>
                  <a href="javascript:;" class="op-save" @click="saveEdit(item)">保存</a>
                  <a href="javascript:;" class="op-cancel" @click="cancelEdit">取消</a>
                </td>
              </template>
              <!-- 展示态 -->
              <template v-else>
                <td class="mono">{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td class="gold">{{ item.price || '—' }}</td>
                <td>{{ item.num || '—' }}</td>
                <td class="sub">{{ item.ctime }}</td>
                <td>
                  <a href="javascript:;" class="op-del" @click="handelConfirm(item.id)">删除</a>
                  <a href="javascript:;" class="op-edit" @click="startEdit(item)">修改</a>
                </td>
              </template>
            </tr>
            <tr v-if="books.length === 0">
              <td colspan="6" class="empty">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 商品卡片 -->
      <h2 class="section-title">热门驱动器</h2>
      <div class="goods-grid">
        <div class="goods-card kr-card" v-for="g in goods" :key="g.name">
          <img :src="g.img" :alt="g.name">
          <div class="goods-body">
            <h3>{{ g.name }}</h3>
            <p class="price">{{ g.price }}</p>
            <button class="kr-btn kr-btn-gold btn-buy" @click="buy(g)">加入购物车</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import img3 from '../assets/3.jpg'
import img4 from '../assets/4.jpg'
import img5 from '../assets/5.jpg'
import img6 from '../assets/6.jpg'
import img7 from '../assets/7.jpg'
import img8 from '../assets/8.jpg'

export default {
  data() {
    return {
      books: [],
      id: '',
      name: '',
      price: '',
      num: '',
      keywords: '',
      editId: null,
      editName: '',
      editPrice: '',
      editNum: '',
      goods: [
        { img: img1, name: 'W 周边', price: '$130' },
        { img: img2, name: 'OOO 腰带', price: '$140' },
        { img: img3, name: 'Decade 腰带', price: '$230' },
        { img: img4, name: 'W 腰带', price: '$180' },
        { img: img5, name: '时王腰带', price: '$180' },
        { img: img6, name: '利维斯腰带', price: '$180' },
        { img: img7, name: '01 腰带', price: '$180' },
        { img: img8, name: 'Build 腰带', price: '$180' }
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
    }
  },
  created() {
    this.getAll()
  },
  watch: {
    keywords() {
      this.search()
    }
  },
  methods: {
    getAll() {
      axios({
        url: 'http://localhost:3000/books',
        method: 'GET'
      })
        .then(response => {
          this.books = response.data
        })
        .catch(() => {
          alert('获取数据失败，请确认后端服务已启动（3000 端口）')
        })
    },
    search() {
      axios({
        url: 'http://localhost:3000/books',
        method: 'GET',
        params: { name_like: this.keywords }
      })
        .then(response => {
          this.books = response.data
        })
        .catch(() => {
          alert('搜索失败')
        })
    },
    add() {
      if (!this.id || !this.name) {
        alert('请至少填写编号和商品名')
        return
      }
      axios({
        url: 'http://localhost:3000/books',
        method: 'POST',
        data: {
          id: this.id,
          name: this.name,
          price: this.price,
          num: this.num,
          ctime: new Date().toLocaleDateString()
        }
      })
        .then(() => {
          this.getAll()
          this.id = this.name = this.price = this.num = ''
        })
        .catch(() => {
          alert('数据添加失败')
        })
    },
    handelConfirm(id) {
      if (confirm('是否删除该数据？')) {
        this.del(id)
      }
    },
    del(id) {
      axios({
        url: 'http://localhost:3000/books/' + id,
        method: 'DELETE'
      })
        .then(() => {
          this.getAll()
        })
        .catch(() => {
          alert('删除数据失败')
        })
    },
    startEdit(item) {
      this.editId = item.id
      this.editName = item.name
      this.editPrice = item.price
      this.editNum = item.num
    },
    cancelEdit() {
      this.editId = null
    },
    saveEdit(item) {
      if (!this.editName) {
        alert('商品名不能为空')
        return
      }
      axios({
        url: 'http://localhost:3000/books/' + item.id,
        method: 'PUT',
        data: {
          id: item.id,
          name: this.editName,
          price: this.editPrice,
          num: this.editNum,
          ctime: item.ctime
        }
      })
        .then(() => {
          this.editId = null
          this.getAll()
        })
        .catch(() => {
          alert('修改失败')
        })
    },
    buy(g) {
      if (!this.user) {
        alert('请先登录')
        this.$router.push('/login')
      } else {
        alert('「' + g.name + '」已加入购物车（演示功能）')
      }
    },
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

/* 工具栏 */
.toolbar {
  padding: 20px 22px;
  margin-bottom: 26px;
}
.tool-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.tool-row + .tool-row { margin-top: 14px; }
.tool-row .kr-input { flex: 1; }
.tool-row .kr-input.search { max-width: 340px; }

/* 表格 */
.table-wrap { overflow-x: auto; }
.kr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.kr-table th {
  text-align: left;
  padding: 14px 18px;
  color: var(--gold);
  font-size: 13px;
  letter-spacing: 2px;
  border-bottom: 1px solid var(--border);
  background: rgba(245, 197, 24, 0.04);
}
.kr-table td {
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}
.kr-table tbody tr:hover { background: rgba(255, 255, 255, 0.03); }
.mono { font-family: Consolas, monospace; color: var(--text-sub); }
.gold { color: var(--gold); font-weight: 700; }
.sub { color: var(--text-sub); }
.empty { text-align: center; color: var(--text-faint); padding: 40px 0 !important; }
.kr-input.sm { padding: 7px 10px; font-size: 13px; }

.op-del, .op-edit, .op-save, .op-cancel {
  margin-right: 12px;
  font-size: 13px;
  letter-spacing: 1px;
}
.op-del { color: var(--red); }
.op-edit { color: var(--gold); }
.op-save { color: #2dd4a0; }
.op-cancel { color: var(--text-sub); }

/* 商品卡片 */
.section-title {
  margin: 56px 0 26px;
  font-size: 24px;
  letter-spacing: 8px;
}
.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}
.goods-card { text-align: center; padding-bottom: 18px; }
.goods-card img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  display: block;
}
.goods-body { padding: 14px 16px 0; }
.goods-body h3 { margin: 0 0 6px; font-size: 16px; letter-spacing: 1px; }
.goods-body .price {
  margin: 0 0 12px;
  color: var(--gold);
  font-weight: 800;
  font-size: 18px;
}
.btn-buy { width: 100%; padding: 9px 0; font-size: 13px; }

@media (max-width: 900px) {
  .goods-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
