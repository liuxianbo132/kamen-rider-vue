<template>
  <div class="shop-page">
    <NavBar />

    <!-- 简洁栏目页头 -->
    <div class="shop-head">
      <div class="head-inner">
        <p class="eyebrow">KAMEN RIDER STORE</p>
        <h1>驱动器典藏</h1>
        <p class="sub">历代骑士变身腰带 · 正版周边精选</p>
      </div>
    </div>

    <!-- 商品网格：杂志目录风格 -->
    <div class="shop-container">
      <el-row :gutter="24">
        <el-col v-for="g in goods" :key="g.id" :xs="12" :sm="8" :md="6" class="goods-col">
          <div class="goods-card" role="link" tabindex="0" @click="router.push(`/shop/${g.id}`)" @keydown.enter="router.push(`/shop/${g.id}`)">
            <div class="img-wrap">
              <img :src="g.image_url" class="goods-img" :alt="g.name" loading="lazy" />
            </div>
            <div class="goods-body">
              <span class="tag">{{ g.category }}</span>
              <h3 class="goods-name" :title="g.name">{{ g.name }}</h3>
              <p class="goods-desc">{{ g.description }}</p>
              <div class="goods-foot">
                <span class="price">￥{{ g.price }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-empty v-if="!loading && !goods.length" description="暂无商品" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { getGoodsApi } from '../api/goods'

const router = useRouter()
const goods = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    goods.value = await getGoodsApi()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  background: var(--page-bg);
}

/* 简洁栏目页头：纸张底色 + 细分割线，不再使用深色渐变 */
.shop-head {
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  padding: 64px 32px 56px;
  text-align: center;
}
.head-inner { max-width: 1180px; margin: 0 auto; }
.eyebrow {
  color: var(--accent-dark);
  font-size: 11px;
  letter-spacing: 5px;
  margin: 0 0 12px;
}
.shop-head h1 {
  font-family: var(--font-serif);
  color: var(--text);
  font-size: 34px;
  letter-spacing: 6px;
  margin: 0 0 12px;
}
.shop-head .sub {
  color: var(--muted);
  font-size: 13px;
  letter-spacing: 2px;
  margin: 0;
}

/* 商品容器 */
.shop-container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 48px 32px 72px;
}

.goods-col { margin-bottom: 24px; }

.goods-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
  /* 等高 + 内部弹性布局，保证所有卡片高度一致 */
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: cardIn 450ms ease-out both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.goods-card:hover {
  border-color: var(--accent);
  box-shadow: 0 14px 32px -24px rgba(37, 37, 37, 0.35);
}

.img-wrap {
  padding: 16px 16px 0;
  height: 200px;          /* 锁高，所有卡片图片比例统一 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.goods-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  background: var(--page-bg);
}

.goods-body {
  padding: 14px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.tag {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--accent-dark);
  background: var(--page-bg);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 2px 8px;
  margin-bottom: 8px;
  align-self: flex-start;
}
.goods-name {
  margin: 0 0 6px;
  font-family: var(--font-serif);
  font-size: 16px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.goods-desc {
  margin: 0 0 14px;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.goods-foot {
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}
.price {
  color: var(--accent-dark);
  font-size: 18px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .shop-head { padding: 40px 20px 36px; }
  .shop-head h1 { font-size: 24px; letter-spacing: 4px; }
  .shop-container { padding: 28px 20px 56px; }
}
</style>
