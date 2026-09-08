# 假面骑士商城 DRIVER COLLECTION

一个以「假面骑士」为主题的 Vue 3 全栈 Demo 项目：前端商城 + 假面骑士图鉴（图鉴）+ 资讯 / 帖子 / 收藏 / 休闲等模块，配套 Express + SQLite 后端与后台管理系统。

> 数据仅用于学习与技术展示。图鉴数据来自假面骑士官方图鉴（kamen-rider-official.com）公开 member 页面，经服务端抓取整理；图片为官方 s3 资源。

## 技术栈

- **前端**：Vue 3（`<script setup>`）+ Vite + Vue Router + Pinia + Element Plus + Axios + @vueuse/motion
- **后端**：Express + Node 内置 SQLite（`node:sqlite`）+ JWT + bcryptjs + cors
- **部署**：后端 Render（Blueprint `render.yaml`）、前端 Vercel（`vercel.json`）

## 目录结构

```
卡面来打/
├── backend/                # Express + SQLite 后端（端口 3001）
│   ├── src/
│   │   ├── app.js          # 入口，挂载各 /api 路由
│   │   ├── controllers/    # auth / goods / banners / news / posts / collections / riders
│   │   ├── models/         # db.js（建表 + 图鉴 seed）、各业务 model
│   │   └── routes/         # 各模块路由
│   ├── data/               # 运行时 SQLite 文件（自动生成，已 gitignore）
│   └── package.json
├── frontend/               # Vue 3 前端（端口 5173）
│   ├── public/images/      # 静态图片（banner、riders、goods 等）
│   ├── src/
│   │   ├── api/            # 各模块请求封装（request.js 统一 axios 实例）
│   │   ├── views/          # 页面（Home / Archive / Shop / News / Posts / Collections / Login / Register ...）
│   │   ├── components/     # NavBar / SectionHeading 等
│   │   ├── data/           # riderSeries.js 图鉴前端数据
│   │   └── router/         # 前端路由
│   ├── .env.development    # VITE_API_BASE_URL=/api（走 Vite 代理）
│   ├── .env.production     # VITE_API_BASE_URL=https://kamen-rider-mall-api.onrender.com/api
│   ├── vercel.json         # Vercel 重写规则（/api → Render 后端）
│   └── vite.config.js
├── render.yaml             # 后端 Render Blueprint 配置
└── sql/                    # SQL 脚本
```

## 功能模块

- **商城 DRIVER COLLECTION**：商品列表 / 详情、分类、收藏、后台商品管理。
- **图鉴（Archive）**：38 位骑士，按 **昭和 / 平成 / 令和** 三年代分组；详情页含身高体重、拳力踢力、特征、必杀、官方立绘。
- **资讯 News / 帖子 Posts / 收藏 Collections / 休闲 Leisure**：内容浏览与后台 CRUD。
- **后台管理 Admin**：商品、资讯、帖子、收藏、轮播图管理。
- **认证**：登录 / 注册，JWT 鉴权。

## 移动端适配

- 全局 `overflow-x: hidden`，卡片宽度使用 `clamp()` / `min(400px, 92vw)`。
- 图鉴网格 4 → 3 → 2 列（≤768px / ≤480px）；导航栏在窄屏精简品牌名与按钮。
- `vite.config.js` 中 `server.host: true`，手机与电脑同一局域网可直接访问 `http://<电脑IP>:5173`。

## 本地开发

```bash
# 1. 安装依赖
cd backend   && npm install
cd ../frontend && npm install

# 2. 启动后端（端口 3001）
cd backend   && npm run dev

# 3. 启动前端（端口 5173）
cd frontend  && npm run dev
```

- 前端访问：http://localhost:5173
- 后端接口：http://localhost:3001/api
- 数据库：`backend/data/` 首次启动自动建表，并幂等 seed 图鉴数据（来源 `verify/riders_all_final.json`）。

## 环境变量

| 文件 | 变量 | 说明 |
| --- | --- | --- |
| `frontend/.env.development` | `VITE_API_BASE_URL=/api` | 开发环境走 Vite 代理转发本地后端 |
| `frontend/.env.production` | `VITE_API_BASE_URL=https://kamen-rider-mall-api.onrender.com/api` | 生产环境直连 Render 后端（已开启 CORS） |
| `backend`（Render） | `JWT_SECRET` | 由 Render 自动生成 |
| `backend`（Render） | `NODE_VERSION=24` | Node 运行版本 |

## 部署（在线，已上线）

- **后端 API**：`https://kamen-rider-mall-api.onrender.com`（Render Web Service，免费层，HTTPS）
- **前端站点**：`https://kamen-rider-mall-web.onrender.com`（Render 静态站，HTTPS，国内可直连）

**部署方式**：仓库根 `render.yaml` 为 Blueprint（双服务：后端 Web Service `kamen-rider-mall-api` + 前端静态站 `kamen-rider-mall-web`）。推送到 `master` 分支即触发 Render 自动构建部署，无需手动操作。

> 部署要点：图鉴 seed 数据 `verify/riders_all_final.json` 已纳入版本管理，构建时后端正常初始化 38 位骑士数据。前端构建注入 `VITE_API_BASE_URL`（见 `frontend/.env.production` 与 `render.yaml` 环境变量）直连后端公网地址，源码无任何 `localhost` 硬编码。

## 已知问题 / 后续可优化

1. **数据持久化（需关注）**：Render 免费层为临时文件系统，容器重建 / 休眠后本地 SQLite（`backend/data/mall.db`）数据会丢失（用户注册、下单等动态数据）。
   - 升级 Render Starter（$7/月，可挂持久盘，需绑卡）
   - 或迁移至**方案 B 香港轻量云服务器**（¥99/年起，支付宝，零代码改动，国内访问更快、数据落盘持久、无冷启动）
2. **后端冷启动**：免费层空闲约 15 分钟后休眠，下次请求需 10–30s 唤醒。前端静态站本身常驻 CDN，不休眠。
3. **Vercel 方案已弃用**：早期曾试过 Vercel + Render，但 Vercel 对未认领的匿名临时部署返回 403（`X-Vercel-Mitigated: deny`），且 `*.vercel.app` 国内可达性不稳，故统一迁至 Render 双服务部署。

## 版本记录

- **v5.0.0**：新增「图鉴（Archive）」模块（38 位骑士，昭和/平成/令和分代）；新增资讯/帖子/收藏/休闲模块与对应后台管理；首页轮播修复为 3 张并去除与精选阅读重复项；全站移动端适配；登录/注册页移除背景（居中卡片）。
- **v4.0.0**：Vue 3 + Vite + Express + JWT + SQLite 重构，商城主流程（认证、后台 CRUD、轮播、角色管理）、骑士暗金主题。
- **v3.0.0**：迁移至 Vue 3 + Vite + Express + JWT + SQLite 架构，移除旧 Vue 2 应用与 json-server。
- **v2.0.0**：假面骑士暗色 UI 重设计、登录/注册鉴权。
- **v1.0.0**：2021 原始版本（Bootstrap UI，无鉴权）。
