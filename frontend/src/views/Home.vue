<template>
  <div class="home">
    <NavBar />

    <div class="main">
      <!-- 轮播图（数据来自后端 banners 表，后台可管理） -->
      <el-carousel v-if="banners.length" height="300px" class="banner" :interval="4000">
        <el-carousel-item v-for="b in banners" :key="b.id">
          <img :src="b.image_url" class="banner-img" alt="轮播图" />
        </el-carousel-item>
      </el-carousel>

      <!-- 商品列表：卡片网格 -->
      <div class="section">
        <h2 class="section-title">驱动器典藏 <span class="section-sub">DRIVER COLLECTION</span></h2>
        <el-row :gutter="20">
          <el-col v-for="g in goods" :key="g.id" :span="6" class="goods-col">
            <el-card shadow="hover" class="goods-card">
              <img :src="g.image_url" class="goods-img" :alt="g.name" />
              <div class="goods-name" :title="g.name">{{ g.name }}</div>
              <div class="goods-price">￥{{ g.price }}</div>
            </el-card>
          </el-col>
        </el-row>
        <el-empty v-if="!loading && !goods.length" description="暂无商品" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import { getGoodsApi } from '../api/goods'
import { getBannersApi } from '../api/banners'

const goods = ref([])
const banners = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    // 并行拉取商品和轮播图数据
    const [goodsData, bannerData] = await Promise.all([getGoodsApi(), getBannersApi()])
    goods.value = goodsData
    banners.value = bannerData
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 32px 48px;
}

.banner {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #2a2f3d;
}

.banner-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.section {
  margin-top: 32px;
}

.section-title {
  font-size: 20px;
  margin-bottom: 16px;
  color: #e8eaf0;
  letter-spacing: 1px;
}

/* 副标金色点缀 */
.section-sub {
  font-size: 13px;
  color: #f5c518;
  font-weight: 400;
  letter-spacing: 2px;
  margin-left: 4px;
}

.goods-col {
  margin-bottom: 20px;
}

/* 商品卡片：黑底金边悬停效果 */
.goods-card {
  cursor: default;
  border: 1px solid #2a2f3d;
  transition: border-color 0.25s, transform 0.25s;
}

.goods-card:hover {
  border-color: #f5c518;
  transform: translateY(-4px);
}

.goods-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.goods-name {
  margin-top: 12px;
  font-size: 15px;
  color: #e8eaf0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-price {
  margin-top: 8px;
  color: #f5c518;
  font-size: 18px;
  font-weight: 600;
}
</style>
