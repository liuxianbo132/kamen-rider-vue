<template>
  <router-view />
</template>

<script setup>
// 根组件：仅承载路由出口，页面结构由各视图组件自行组织
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ============ 假面骑士黑金主题 ============ */
/* 腰带金 #f5c518 为主色调，深空黑 #0b0e14 为底色 */
:root {
  --kr-gold: #f5c518;
  --kr-gold-dark: #d4a017;
  --kr-bg: #0b0e14;
  --kr-card: #161a23;
  --kr-border: #2a2f3d;
  --kr-red: #e0322c;
}

/* 覆盖 Element Plus 暗色模式的主色为腰带金 */
html.dark {
  --el-color-primary: #f5c518;
  --el-color-primary-dark-2: #d4a017;
  --el-color-primary-light-3: #f7cd3d;
  --el-color-primary-light-5: #f9da6b;
  --el-color-primary-light-7: #fae699;
  --el-color-primary-light-8: #fbeeb5;
  --el-color-primary-light-9: #fdf5d6;
  --el-bg-color: #0b0e14;
  --el-bg-color-overlay: #161a23;
  --el-fill-color-blank: #161a23;
  --el-border-color: #2a2f3d;
  --el-border-color-light: #2a2f3d;
  --el-text-color-primary: #e8eaf0;
  --el-text-color-regular: #b7bcc9;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  background-color: var(--kr-bg);
  color: #e8eaf0;
}

/* 深色滚动条 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: #2a2f3d;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #f5c518;
}
::-webkit-scrollbar-track {
  background: #0b0e14;
}
</style>
