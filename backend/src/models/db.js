// 数据库初始化模块：SQLite 建表 + 初始数据
// 首次启动自动创建 data/mall.db 并写入演示数据，无需手动执行 SQL
// 使用 Node.js 内置的 node:sqlite 模块（Node 22.5+ 自带，零原生依赖）
import { DatabaseSync } from 'node:sqlite'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 数据库文件存放目录（backend/data）
const dataDir = path.join(__dirname, '../../data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const db = new DatabaseSync(path.join(__dirname, '../../', process.env.DB_PATH || './data/mall.db'))
db.exec('PRAGMA journal_mode = WAL') // 提升并发读写性能

// ==================== 建表（与 sql/init.sql 保持一致） ====================
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  image_url TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

// ==================== 初始数据 ====================

// 默认管理员 admin / 123456（密码用 bcrypt 现场加密，保证密文真实有效）
const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get()
if (userCount.c === 0) {
  const adminHash = bcrypt.hashSync('123456', 10)
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
    .run('admin', adminHash, 'admin')
}

// 10 条演示商品（假面骑士驱动器腰带，图片为前端 public/images 静态资源）
const goodsCount = db.prepare('SELECT COUNT(*) AS c FROM goods').get()
if (goodsCount.c === 0) {
  const goods = [
    ['W 驱动器（Cyclone & Joker）', 180, 100, '平成系列', '双插槽变身腰带，疾风与王牌的旋律', '/images/1.jpg'],
    ['OOO 驱动器', 220, 80, '平成系列', '三枚核心奖章，欲望的化身', '/images/2.jpg'],
    ['Build 驱动器', 260, 60, '平成系列', '满装瓶罐变身系统，天才物理学家的杰作', '/images/3.jpg'],
    ['01 驱动器', 240, 50, '令和系列', '飞电或人之腰，人工生命体的黎明', '/images/4.jpg'],
    ['Faiz 驱动器', 190, 90, '平成系列', '555 变身腰带，流线型未来设计', '/images/5.jpg'],
    ['Decade 驱动器', 280, 40, '平成系列', '穿越世界的破坏者，卡片式变身', '/images/6.jpg'],
    ['Kabuto 驱动器', 200, 70, '平成系列', '天道总司的正义，速度变身系统', '/images/7.jpg'],
    ['Zi-O 驱动器', 230, 55, '平成系列', '时之魔王，驾驭时间的骑士表头', '/images/8.jpg'],
    ['Den-O 驱动器', 210, 65, '平成系列', '月台通行，异魔神附身的变身腰带', '/images/xilie.jpg'],
    ['Ex-Aid 驱动器', 195, 75, '平成系列', '游戏领域展开，卡带式变身', '/images/xilie2.jpg']
  ]
  const insert = db.prepare(
    'INSERT INTO goods (name, price, stock, category, image_url, description) VALUES (?, ?, ?, ?, ?, ?)'
  )
  // 数组顺序：[名称, 价格, 库存, 分类, 描述, 图片]
  goods.forEach(([name, price, stock, category, description, imageUrl]) => {
    insert.run(name, price, stock, category, imageUrl, description)
  })
}

// 3 条轮播图（假面骑士主题）
const bannerCount = db.prepare('SELECT COUNT(*) AS c FROM banners').get()
if (bannerCount.c === 0) {
  const insert = db.prepare('INSERT INTO banners (image_url, link_url, sort_order) VALUES (?, ?, ?)')
  insert.run('/images/hero.jpg', '/', 1)
  insert.run('/images/123.jpg', '/', 2)
  insert.run('/images/xilie3.jpg', '/', 3)
}

export default db
