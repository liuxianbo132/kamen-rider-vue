# 假面骑士商城 DRIVER COLLECTION

一个以假面骑士为主题的商城毕业设计系统（前后端分离），包含用户认证、商城前台、后台管理三大模块，黑金暗色主题设计。

> **版本**：v3.0.0 · 架构升级版（Vue 3 + Vite + Express + JWT + SQLite）

## 版本演进

| 版本 | 说明 |
|---|---|
| v1.0.0 | 2021 原始版：Bootstrap UI + jQuery，无认证（`git tag v1.0.0`） |
| v2.0.0 | 黑金 UI 改版 + 登录注册（json-server）+ 全按钮激活（`git tag v2.0.0`） |
| **v3.0.0** | **架构升级：Vue 3 + Vite + Express + JWT + SQLite，完整商城（前台 + 后台管理）** |

## 技术栈

| 端 | 技术 |
|---|---|
| 前端 | Vue 3 + Vite + Vue Router + Pinia + Element Plus（暗色模式）+ Axios |
| 后端 | Node.js + Express |
| 数据库 | SQLite（Node 内置 `node:sqlite`，零安装；另附 MySQL 脚本 `sql/init.sql`） |
| 认证 | JWT + bcryptjs 密码加密 |

## 功能清单

- **用户认证**：注册（密码一致性校验 + 用户名唯一性校验）、登录（JWT 签发）、路由守卫（未登录只能访问登录/注册页）、axios 拦截器自动携带 token、401 过期自动跳登录
- **商城前台**：顶部导航（品牌 + 用户名 + 管理后台入口 + 退出登录）、假面骑士主题轮播图、驱动器商品卡片网格（10 条演示数据）
- **后台管理**（仅管理员）：
  - 商品管理：表格展示 + Dialog 弹窗新增/编辑 + 删除确认
  - 用户管理：角色切换（普通用户 ↔ 管理员）、删除用户（防自删保护）
  - 轮播图管理：增删改，前台首页实时联动
- **安全机制**：双层权限控制（前端路由守卫 + 后端中间件 403）、bcrypt 密文存储、管理员不能删除/降级自己

## 启动步骤（三步）

> 环境要求：Node.js ≥ 22.5（推荐 24.x，需内置 `node:sqlite` 模块）

### 第一步：启动后端

```bash
cd backend
npm install
npm run dev        # http://localhost:3001
```

首次启动自动创建 `backend/data/mall.db`（SQLite），建表并写入初始数据：管理员账号、10 条驱动器商品、3 条轮播图。

### 第二步：启动前端

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### 第三步：访问系统

浏览器打开 **http://localhost:5173**，默认管理员账号：

```
账号：admin
密码：123456
```

> PowerShell 用户请使用 `npm.cmd install` / `npm.cmd run dev` 绕过执行策略限制。

## 项目结构

```
├── backend/               # 后端（Express + node:sqlite）
│   ├── src/
│   │   ├── routes/        # 路由：auth / goods / users / banners
│   │   ├── controllers/   # 控制器（业务逻辑）
│   │   ├── models/        # 数据库操作（SQL 封装 + 初始化数据）
│   │   ├── middleware/    # JWT 认证 + 管理员权限中间件
│   │   ├── utils/         # 统一响应格式
│   │   └── app.js         # 入口
│   └── data/              # SQLite 数据库文件（启动自动生成，不入库）
├── frontend/              # 前端（Vue 3 + Vite + Element Plus 暗色主题）
│   ├── public/images/     # 假面骑士图片素材（商品图 + 轮播图 + 登录背景）
│   └── src/
│       ├── views/         # 页面：Login / Register / Home / admin/*
│       ├── components/    # 公共组件（NavBar）
│       ├── api/           # axios 封装与接口模块
│       ├── stores/        # Pinia（登录状态）
│       └── router/        # 路由 + 全局守卫
└── sql/
    └── init.sql           # MySQL 建表 + 初始数据脚本（备用）
```

## 接口文档（Postman / Apifox 可直接导入测试）

**通用约定**

- Base URL：`http://localhost:3001/api`
- 除注册/登录外，所有接口需携带请求头：`Authorization: Bearer <token>`
- 统一返回格式：`{ "code": 200, "data": ..., "message": "success" }`

| 模块 | 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|---|
| 认证 | POST | `/auth/register` | 公开 | 注册，body: `{ username, password }` |
| 认证 | POST | `/auth/login` | 公开 | 登录，返回 token |
| 认证 | GET | `/auth/me` | 登录 | 获取当前用户信息 |
| 商品 | GET | `/goods` | 登录 | 商品列表 |
| 商品 | POST | `/goods` | 管理员 | 新增商品 |
| 商品 | PUT | `/goods/:id` | 管理员 | 编辑商品 |
| 商品 | DELETE | `/goods/:id` | 管理员 | 删除商品 |
| 用户 | GET | `/users` | 管理员 | 用户列表 |
| 用户 | PUT | `/users/:id/role` | 管理员 | 修改角色，body: `{ role }` |
| 用户 | DELETE | `/users/:id` | 管理员 | 删除用户（不能删自己） |
| 轮播图 | GET | `/banners` | 登录 | 轮播图列表 |
| 轮播图 | POST | `/banners` | 管理员 | 新增轮播图 |
| 轮播图 | PUT | `/banners/:id` | 管理员 | 编辑轮播图 |
| 轮播图 | DELETE | `/banners/:id` | 管理员 | 删除轮播图 |

**商品字段**：`name`（必填）、`price`（必填，非负）、`stock`（非负整数）、`category`、`image_url`（如 `/images/1.jpg`）、`description`

## 系统使用说明（面向答辩评委）

### 一、系统功能概述

系统分为三部分：**用户认证**、**商城前台**、**管理后台**，采用假面骑士黑金暗色主题（腰带金 #f5c518 + 深空黑 #0b0e14）。

### 二、演示流程建议（5 分钟路线）

1. **未登录拦截**：直接访问首页 → 自动跳转登录页（路由守卫生效），登录页为骑士背景 + 深色卡片
2. **注册**：注册新账号（如 `zhangsan / 123456`）→ 跳回登录页
3. **普通用户视角**：登录后浏览商城前台（轮播图 + 驱动器商品卡片）；导航栏**无**"管理后台"入口；手动输入 `/admin` 被弹回首页
4. **管理员登录**：`admin / 123456` → 导航栏出现"管理后台"
5. **商品管理**：新增商品（弹窗表单）→ 表格即时刷新 → 编辑 → 删除
6. **用户管理**：将普通用户设为管理员 → 再降级；尝试删除自己被拒绝（安全保护）
7. **轮播图管理**：新增/删除轮播图 → 返回前台首页看到变化（前后台数据联动）
8. **退出登录**：回到登录页

### 三、技术亮点（答辩可讲）

- 前后端分离架构，RESTful 接口 + 统一返回格式
- JWT 无状态认证 + axios 双拦截器（请求自动带 token / 响应统一处理 401 过期）
- bcryptjs 密码加密存储，数据库无明文密码
- 双层权限控制：前端路由守卫（体验层）+ 后端中间件（安全层），普通用户伪造请求直接 403
- Pinia 集中管理登录状态 + localStorage 持久化，刷新不掉线
- 后端分层架构：routes → controllers → models，职责清晰
- 三代版本演进（v1 jQuery → v2 Vue 2 → v3 Vue 3 全栈），体现完整工程迭代能力
