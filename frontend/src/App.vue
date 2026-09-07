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

/* ============ 纸张感设计系统（杂志 / 博客气质） ============ */
/* 暖白纸张底色 + 深灰正文 + 低饱和金作主题点缀 */
:root {
  --page-bg: #f7f5f0;
  --surface: #fffdf8;
  --text: #252525;
  --muted: #7a756c;
  --line: #e6e0d6;
  --accent: #b8872f;
  --accent-dark: #805b1c;
  --font-serif: Georgia, "Noto Serif SC", serif;
  --font-sans: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 覆盖 Element Plus 主题变量：主色改为低饱和金，表面色对齐纸张 token */
html, html.dark {
  color-scheme: light;
  --el-color-primary: #b8872f;
  --el-color-primary-dark-2: #805b1c;
  --el-color-primary-light-3: #c69b52;
  --el-color-primary-light-5: #d3b380;
  --el-color-primary-light-7: #e2cbaa;
  --el-color-primary-light-8: #ebd9c0;
  --el-color-primary-light-9: #f4ead4;
  --el-bg-color: #fffdf8;
  --el-bg-color-overlay: #fffdf8;
  --el-fill-color-blank: #fffdf8;
  --el-border-color: #e6e0d6;
  --el-border-color-light: #e6e0d6;
  --el-text-color-primary: #252525;
  --el-text-color-regular: #4a453d;
}

body {
  font-family: var(--font-sans);
  background-color: var(--page-bg);
  color: var(--text);
  margin: 0;
}

/* 全局防横向溢出：避免任意页面在手机端出现水平滚动条 */
html, body {
  max-width: 100%;
  overflow-x: hidden;
}

/* 尊重系统“减弱动效”偏好：关闭非必要动画 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 暖色滚动条 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: #d8d2c6;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}
::-webkit-scrollbar-track {
  background: var(--page-bg);
}
</style>
