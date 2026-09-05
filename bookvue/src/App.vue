<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* ============ 假面骑士主题设计系统 ============ */
:root {
  --bg: #0b0e14;
  --bg-card: #141925;
  --bg-card-hover: #1a2030;
  --border: rgba(255, 255, 255, 0.08);
  --gold: #f5c518;
  --gold-dark: #d9a80c;
  --red: #e5484d;
  --text: #e5e7eb;
  --text-sub: #94a3b8;
  --text-faint: #64748b;
  --radius: 12px;
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  --shadow-gold: 0 4px 18px rgba(245, 197, 24, 0.35);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: "PingFang SC", "Microsoft YaHei", "Segoe UI", Roboto, Arial, sans-serif;
  min-height: 100%;
}

#app { min-height: 100vh; }

a { color: var(--gold); text-decoration: none; }
a:hover { color: var(--gold-dark); }

/* 滚动条 */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #2a3245; border-radius: 5px; }
::-webkit-scrollbar-thumb:hover { background: #3a4560; }

/* 通用按钮体系 */
.kr-btn {
  display: inline-block;
  padding: 10px 26px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
}
.kr-btn-gold {
  background: linear-gradient(135deg, #f5c518 0%, #d9a80c 100%);
  color: #1a1400;
  box-shadow: var(--shadow-gold);
}
.kr-btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(245, 197, 24, 0.5);
  color: #1a1400;
}
.kr-btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}
.kr-btn-ghost:hover {
  border-color: var(--gold);
  color: var(--gold);
}
.kr-btn-danger {
  background: transparent;
  color: var(--red);
  border: 1px solid rgba(229, 72, 77, 0.4);
}
.kr-btn-danger:hover {
  background: rgba(229, 72, 77, 0.12);
}

/* 通用输入框 */
.kr-input {
  width: 100%;
  padding: 11px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.kr-input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.15);
}
.kr-input::placeholder { color: var(--text-faint); }

/* 通用卡片 */
.kr-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}
.kr-card:hover {
  transform: translateY(-4px);
  border-color: rgba(245, 197, 24, 0.45);
  background: var(--bg-card-hover);
}

/* 页面通用容器 */
.kr-page {
  min-height: 100vh;
  padding-bottom: 60px;
}
.kr-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
