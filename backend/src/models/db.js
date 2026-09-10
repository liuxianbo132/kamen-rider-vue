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
  token_version INTEGER NOT NULL DEFAULT 0,
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

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  source TEXT,
  editor TEXT,
  date TEXT,
  url TEXT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  category TEXT DEFAULT 'review',
  tags TEXT DEFAULT '[]',
  content TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured_level INTEGER NOT NULL DEFAULT 0 CHECK (featured_level IN (0, 1, 2)),
  published_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  cover_image TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'belt' CHECK (type IN ('belt', 'figure', 'place', 'event')),
  series TEXT DEFAULT '',
  acquired_at TEXT,
  status TEXT NOT NULL DEFAULT 'owned' CHECK (status IN ('owned', 'wishlist', 'archived')),
  notes TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS riders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_origin TEXT DEFAULT '',
  name_en TEXT DEFAULT '',
  series TEXT DEFAULT '',
  series_ja TEXT DEFAULT '',
  era TEXT NOT NULL CHECK (era IN ('showa','heisei','reiwa')),
  year INTEGER,
  height TEXT DEFAULT '',
  weight TEXT DEFAULT '',
  punch TEXT DEFAULT '',
  kick TEXT DEFAULT '',
  jump TEXT DEFAULT '',
  run TEXT DEFAULT '',
  transform_user TEXT DEFAULT '',
  transform_belongings TEXT DEFAULT '',
  first_appear TEXT DEFAULT '',
  intro TEXT DEFAULT '',
  image TEXT DEFAULT '',
  image_source TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

// 幂等迁移：历史库补充 token_version 列（已存在则忽略）
// 用途：修改密码后自增，使该用户已签发的旧 token 立即失效
try {
  db.exec('ALTER TABLE users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0')
} catch {
  /* 列已存在，忽略 */
}

// 幂等迁移：历史库补充 url 列（已存在则忽略）
try {
  db.exec('ALTER TABLE news ADD COLUMN url TEXT')
} catch {
  /* 列已存在，忽略 */
}

// ==================== 初始数据 ====================

// 初始管理员：密码由环境变量 ADMIN_PASSWORD 注入，禁止硬编码。
// 未设置时跳过创建——公开仓库若预置固定密码，等于给所有人留一把万能钥匙。
const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get()
if (userCount.c === 0) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminPassword && adminPassword.length >= 8) {
    const adminHash = bcrypt.hashSync(adminPassword, 10)
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
      .run('admin', adminHash, 'admin')
    console.log('[init] 已根据 ADMIN_PASSWORD 创建管理员账号 admin')
  } else {
    console.warn('[init] 未设置 ADMIN_PASSWORD（或长度不足 8 位），已跳过创建默认管理员。')
    console.warn('[init] 可在 backend/.env 中配置 ADMIN_PASSWORD 后重启，或通过注册接口创建账号。')
  }
}

// 演示商品（假面骑士驱动器腰带，图片为前端 public/images 静态资源）
// 说明：小站专注精品，按四百五老大需求精简到 7 款（删 Faiz/Kabuto/Zi-O/Den-O/Ex-Aid，新增 555FAIZ 与极狐）
const goodsCount = db.prepare('SELECT COUNT(*) AS c FROM goods').get()
if (goodsCount.c === 0) {
  const goods = [
    ['W 驱动器（Cyclone & Joker）', 180, 100, '平成系列', '双插槽变身腰带，疾风与王牌的旋律', '/images/1.jpg'],
    ['OOO 驱动器', 220, 80, '平成系列', '三枚核心奖章，欲望的化身', '/images/2.jpg'],
    ['Build 驱动器', 260, 60, '平成系列', '满装瓶罐变身系统，天才物理学家的杰作', '/images/8.jpg'],
    ['零一驱动器（Zero-One）', 240, 50, '令和系列', '飞电或人之腰，人工生命体的黎明', '/images/7.jpg'],
    ['Decade 驱动器', 280, 40, '平成系列', '穿越世界的破坏者，卡片式变身', '/images/3.jpg'],
    ['555 FAIZ 驱动器', 290, 88, '平成系列', '流线型手机变身腰带，加速形态的咆哮', '/images/goods-faiz.jpg'],
    ['极狐驱动器（Geats）', 265, 66, '令和系列', '假面骑士Geats，白色天使大逃杀变身系统', '/images/geats.jpg']
  ]
  const insert = db.prepare(
    'INSERT INTO goods (name, price, stock, category, image_url, description) VALUES (?, ?, ?, ?, ?, ?)'
  )
  // 数组顺序：[名称, 价格, 库存, 分类, 描述, 图片]
  goods.forEach(([name, price, stock, category, description, imageUrl]) => {
    insert.run(name, price, stock, category, imageUrl, description)
  })
}

// 幂等迁移：历史库中的旧商品名修正（旧名存在才更新，不影响以后重建）
db.prepare("UPDATE goods SET name = '零一驱动器（Zero-One）' WHERE name = '01 驱动器'").run()
db.prepare("UPDATE goods SET name = 'Kabuto Zecter' WHERE name = 'Kabuto 驱动器'").run()

// 幂等迁移：历史库商品图校正（按正确商品名更新为对应骑士图，纠正图错配）
db.prepare("UPDATE goods SET image_url = '/images/8.jpg' WHERE name = 'Build 驱动器'").run()
db.prepare("UPDATE goods SET image_url = '/images/7.jpg' WHERE name = '零一驱动器（Zero-One）'").run()
db.prepare("UPDATE goods SET image_url = '/images/goods-faiz.jpg' WHERE name = 'Faiz 驱动器'").run()
db.prepare("UPDATE goods SET image_url = '/images/3.jpg' WHERE name = 'Decade 驱动器'").run()
db.prepare("UPDATE goods SET image_url = '/images/goods-kabuto.jpg' WHERE name = 'Kabuto Zecter'").run()
db.prepare("UPDATE goods SET image_url = '/images/5.jpg' WHERE name = 'Zi-O 驱动器'").run()
db.prepare("UPDATE goods SET image_url = '/images/goods-deno.jpg' WHERE name = 'Den-O 驱动器'").run()

// 幂等迁移（历史库）：按需求删除旧的 5 款商品
db.prepare("DELETE FROM goods WHERE name IN ('Faiz 驱动器','Kabuto Zecter','Zi-O 驱动器','Den-O 驱动器','Ex-Aid 驱动器')").run()

// 幂等新增（历史库）：确保 555FAIZ 与极狐存在（已存在则不重复插入）
const upsertGoods = db.prepare(
  "INSERT INTO goods (name, price, stock, category, image_url, description) SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM goods WHERE name = ?)"
)
upsertGoods.run('555 FAIZ 驱动器', 290, 88, '平成系列', '/images/goods-faiz.jpg', '流线型手机变身腰带，加速形态的咆哮', '555 FAIZ 驱动器')
upsertGoods.run('极狐驱动器（Geats）', 265, 66, '令和系列', '/images/geats.jpg', '假面骑士Geats，白色天使大逃杀变身系统', '极狐驱动器（Geats）')
upsertGoods.run('ZZZ 泽兹驱动器', 245, 55, '令和系列', '/images/zzz.jpg', '假面骑士ZZZ，清醒梦特工的梦境变身腰带', 'ZZZ 泽兹驱动器')

// 幂等修正：历史库曾把 image_url 与 description 错位写入的两条
db.prepare("UPDATE goods SET image_url='/images/goods-faiz.jpg', description='流线型手机变身腰带，加速形态的咆哮' WHERE name='555 FAIZ 驱动器'").run()
db.prepare("UPDATE goods SET image_url='/images/geats.jpg', description='假面骑士Geats，白色天使大逃杀变身系统' WHERE name='极狐驱动器（Geats）'").run()

// 3 条轮播图（W → OOO → 电王；图源为 public/images/riders 图鉴高清皮套照的 4:3 裁剪特写版）
// banner-w.jpg / banner-ooo.jpg / banner-deno.jpg 均为 1200x900
const bannerCount = db.prepare('SELECT COUNT(*) AS c FROM banners').get()
if (bannerCount.c === 0) {
  const insert = db.prepare('INSERT INTO banners (image_url, link_url, sort_order) VALUES (?, ?, ?)')
  insert.run('/images/banner-w.jpg', '/', 1)
  insert.run('/images/banner-ooo.jpg', '/', 2)
  insert.run('/images/banner-deno.jpg', '/', 3)
}

// 演示新闻（按标题去重追加，标题已存在则跳过，可对历史库增量新增；content 为 JSON 段落数组文本）
const newsList = [
  // —— v2 新闻社迁移（3 条）——
  [
    '特摄剧《假面骑士W》续篇漫画《风都侦探》决定动画化',
    '新京报社官方帐号',
    '杨利',
    '10-23 07:09',
    [
      '特摄剧《假面骑士W》的续篇漫画《风都侦探》决定动画化了，预定于 2022 年夏季开始播出。此次的动画化是特摄剧《假面骑士》50 周年纪念企划之一。',
      '于 2009 年 8 月开始播出的《假面骑士W》讲述了私家侦探左翔太郎与其搭档菲利普变身为"2人一体"的假面骑士而活跃的故事。变身前的翔太郎由桐山涟饰演，菲利普由菅田将暉饰演。'
    ]
  ],
  [
    '《假面骑士》系列迎来播映 50 周年纪念企划',
    '特摄新闻组',
    '小林',
    '09-18 10:32',
    [
      '自 1971 年初代《假面骑士》播映以来，系列已走过半个世纪。周年企划将陆续推出新作、复刻腰带与跨代骑士联动剧场版。',
      '官方同时宣布将重制多款经典驱动器商品，全球限定发售，粉丝可通过各地授权渠道预约。'
    ]
  ],
  [
    '剧场版新骑士公开：最新变身腰带设计图流出',
    '玩具情报站',
    '阿诚',
    '08-30 21:15',
    [
      '即将上映的剧场版中，新骑士的变身腰带首次公开。设计上延续了系列一贯的机械质感，并加入全新发光机构。',
      '相关商品预计与剧场版同步发售，主题商城将第一时间上架，敬请期待。'
    ]
  ],
  // —— 网络情报新增（4 条）——
  [
    '夏之奥特：剧场版《假面骑士加布 点心的家之侵略者》定档 7 月 25 日',
    '特摄新闻组',
    '杨利',
    '06-22 10:00',
    [
      '特摄剧《假面骑士加布》夏季剧场版《点心的家之侵略者》正式定档，将于 7 月 25 日与超级战队《Gozyuger》以「W 英雄联动」形式在日本全国公映。',
      '本次剧场版中，加布将与最强之敌「假面骑士卡利埃斯」展开殊死对决，异世界的冒险与点心屋故事交织；电影限定的酷奇兽与特别短片《酷奇兽的暑假》一并登场。',
      '首周观影特典为「剧场限定！贴纸附酷奇兽 BOOK」，全国限量 30 万册，先到先得。'
    ]
  ],
  [
    '《假面骑士加布》剧情渐入高潮，最终决战一触即发',
    '特摄快讯',
    '小林',
    '08-03 08:00',
    [
      '正在热播的《假面骑士加布》迎来剧情最高潮。第 46 话中，主角尚马为守护珍视的世界立下决意，化身「Master 加布」向强敌发起挑战。',
      '围绕斯托马克家的阴谋逐渐浮出水面，同伴们为夺回尚马而群策群力，一场关乎格拉努特界与人类世界的决战一触即发。'
    ]
  ],
  [
    '《假面骑士歌查德》毕业特别篇《GRADUATIONS》限时配信',
    '骑士资讯站',
    '阿诚',
    '02-20 09:30',
    [
      '为纪念《假面骑士歌查德》完结，特别篇《GRADUATIONS／HOPPER1 的春假》于 2 月 21 日起在东映特摄粉丝俱乐部会员独家先行配信。',
      '短篇聚焦以成为大炼金术师为目标的宝太郎，以及踏上新旅程的九堂凛音等角色毕业后的去向；同期上线的「女孩重混」系列短片也一并配信。'
    ]
  ],
  [
    '周年企划多线推进，历代驱动器复刻焕新',
    '玩具情报站',
    '杨利',
    '09-01 12:00',
    [
      '假面骑士系列持续多线企划，历代变身腰带与周边商品不断复刻焕新，粉丝可通过各地授权渠道预约入手。',
      '新作情报、剧场版与周年纪念活动陆续公开，更多消息敬请锁定本站持续跟进。'
    ]
  ]
]
const insertNews = db.prepare('INSERT INTO news (title, source, editor, date, content) VALUES (?, ?, ?, ?, ?)')
const findNews = db.prepare('SELECT COUNT(*) AS c FROM news WHERE title = ?')
for (const [title, source, editor, date, paragraphs] of newsList) {
  if (findNews.get(title).c === 0) {
    insertNews.run(title, source, editor, date, JSON.stringify(paragraphs))
  }
}

// 演示站内文章（按 slug 幂等去重；published_at 为 ISO 格式；正文空行分段，"## " 开头为二级标题）
const postsSeed = [
  {
    slug: 'driver-notes-60-years',
    title: '从昭和到令和：变身腰带的六十年笔记',
    summary: '以腰带为线索，串起假面骑士三个世代的造型语言与玩具化演进——一篇写给同好的梳理笔记。',
    cover_image: '/images/banner-w.png',
    category: 'lore',
    tags: ['设定考据', '驱动器'],
    featured_level: 2,
    published_at: '2026-09-01T09:00:00.000Z',
    content: [
      '变身腰带从来不只是道具。它是每一代假面骑士的视觉签名，也是玩具厂商与特摄剧组之间长达六十年的对话。',
      '## 昭和：腰带即骑士',
      '初代假面骑士以台风腰带变身，风车转动的一刻，改造人的悲剧感与机械感同时成立。这个世代的腰带在剧中是身体的一部分，而非随身装备。',
      '## 平成：卡片、硬币与瓶子',
      '从 Decade 的卡片到 OOO 的核心硬币，再到 Build 的满装瓶罐，平成系把「收集」写进了变身系统本身——腰带第一次有了叙事功能。',
      '## 令和：做减法的年代',
      '近年的驱动器明显在变轻、变小、变安静。与其说是简化，不如说是让腰带回到日常把玩的位置：能被随手系上的一条腰带，才是真正活着的腰带。',
      '这篇笔记会持续更新，作为本站「设定考据」栏目的开篇文章。'
    ].join('\n\n')
  },
  {
    slug: 'geats-driver-review',
    title: '极狐驱动器上手三个月：一条安静的愿望腰带',
    summary: '音效、手感与陈列表现的长期把玩记录：它可能是令和系里最适合放在桌面的一条腰带。',
    cover_image: '/images/geats.jpg',
    category: 'review',
    tags: ['评测', '驱动器'],
    featured_level: 1,
    published_at: '2026-08-20T10:30:00.000Z',
    content: [
      '三个月前把极狐驱动器请上桌面，如今可以负责任地写下这篇长期把玩记录。',
      '## 手感',
      '插拔带扣的阻尼恰到好处，比想象中轻的机身反而成了优点——长时间单手把玩也不累。',
      '## 音效',
      '愿望降临的音效层次分明，但音量偏克制，深夜把玩不必担心扰邻。',
      '## 陈列',
      '白色主体在暖光下非常上镜，与站内其他腰带并列时自带主角感。如果你只能留一条令和腰带在桌面，我会投它一票。'
    ].join('\n\n')
  },
  {
    slug: 'desk-as-windy-city',
    title: '收藏手记：把书桌摆成风都侦探事务所',
    summary: '一张书桌、两条腰带和几枚徽章的陈列方案——献给所有想在日常里留一块事务所角落的人。',
    cover_image: '/images/xilie.jpg',
    category: 'collection',
    tags: ['收藏', '陈列'],
    featured_level: 1,
    published_at: '2026-08-02T13:00:00.000Z',
    content: [
      '风都侦探事务所不需要多大的地方，一张一米二的桌面就够了。',
      '## 布局',
      '左侧留给 W 驱动器与几枚徽章，右侧是常读的漫画与一台旧打字机造型的收纳盒。中间留白——事务所最重要的，其实是那块永远空着的待客区。',
      '## 光',
      '一盏 2700K 的暖光台灯。傍晚开灯的瞬间，桌面就会自动切换到风都模式。',
      '## 心得',
      '收藏的意义不在占有，而在为热爱布置一个可以日常回访的坐标。'
    ].join('\n\n')
  }
]
const insertPost = db.prepare(`
  INSERT OR IGNORE INTO posts (slug, title, summary, cover_image, category, tags, content, status, featured_level, published_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?)
`)
for (const p of postsSeed) {
  insertPost.run(p.slug, p.title, p.summary, p.cover_image, p.category, JSON.stringify(p.tags), p.content, p.featured_level, p.published_at)
}

// 演示收藏条目（按标题幂等去重；原 Leisure 静态页的主题店内容以 place 条目形式沉淀）
const collectionsSeed = [
  {
    title: 'W 驱动器（Cyclone & Joker）',
    cover_image: '/images/collection-1.jpg',
    type: 'belt',
    series: '假面骑士W',
    acquired_at: '2024-03-15',
    status: 'owned',
    notes: '入坑第一条腰带。疾风侧插槽的机械感至今无可替代，录音循环播放最多的音效是 Joker 侧。',
    tags: ['驱动器', '平成'],
    is_featured: 1
  },
  {
    title: '极狐驱动器（Geats）',
    cover_image: '/images/collection-2.jpg',
    type: 'belt',
    series: '假面骑士Geats',
    acquired_at: '2025-11-02',
    status: 'owned',
    notes: '白色主体在暖光陈列柜里非常上镜。带扣插拔阻尼顺滑，是把玩频率最高的一条。',
    tags: ['驱动器', '令和'],
    is_featured: 1
  },
  {
    title: '鸣海侦探事务所主题店探访',
    cover_image: '/images/collection-3.jpg',
    type: 'place',
    series: '假面骑士W',
    acquired_at: '2024-08-10',
    status: 'owned',
    notes: '推开店门的瞬间自动切换到风都模式。点了一杯事务所特调，墙上挂着历代委托人的照片。',
    tags: ['主题店', '探访'],
    is_featured: 1
  },
  {
    title: '555 FAIZ 驱动器',
    cover_image: '/images/collection-4.jpg',
    type: 'belt',
    series: '假面骑士555',
    acquired_at: '',
    status: 'wishlist',
    notes: '流线型手机变身腰带。心愿单常客，等一个合适的复刻批次。',
    tags: ['驱动器', '平成'],
    is_featured: 0
  },
  {
    title: 'ZZZ 泽兹驱动器',
    cover_image: '/images/collection-5.jpg',
    type: 'belt',
    series: '假面骑士ZZZ',
    acquired_at: '',
    status: 'wishlist',
    notes: '清醒梦特工的梦境变身腰带，发售即关注中。',
    tags: ['驱动器', '令和'],
    is_featured: 0
  },
  {
    title: 'Build 驱动器',
    cover_image: '/images/collection-6.jpg',
    type: 'belt',
    series: '假面骑士Build',
    acquired_at: '2023-06-20',
    status: 'owned',
    notes: '满装瓶罐的满弹音效很解压，天才物理学家的浪漫。',
    tags: ['驱动器', '平成'],
    is_featured: 0
  },
  {
    title: '主题餐饮一景（Rider Cafe）',
    cover_image: '/images/collection-7.jpg',
    type: 'place',
    series: '假面骑士',
    acquired_at: '2024-08-10',
    status: 'owned',
    notes: '同一趟主题店行程里的餐饮区，拉花是骑士之眼。',
    tags: ['主题店', '餐饮'],
    is_featured: 0
  },
  {
    title: '漫展巡礼：昭和骑士同框',
    cover_image: '/images/collection-8.jpg',
    type: 'place',
    series: '假面骑士',
    acquired_at: '2025-07-01',
    status: 'owned',
    notes: 'Anime Expo 现场的昭和骑士团合影环节，从初代到 Sky，一脉相承的变身姿势。',
    tags: ['漫展', '探访'],
    is_featured: 0
  },
  {
    title: '商场骑士主题展打卡',
    cover_image: '/images/collection-9.jpg',
    type: 'place',
    series: '假面骑士Agito',
    acquired_at: '2025-08-24',
    status: 'owned',
    notes: 'ACGHK 现场的 Agito 展位与周边陈列，排了半小时队才抢到的合影机位。',
    tags: ['漫展', '陈列'],
    is_featured: 0
  }
]
const insertCollection = db.prepare(`
  INSERT INTO collections (title, cover_image, type, series, acquired_at, status, notes, tags, is_featured)
  SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
  WHERE NOT EXISTS (SELECT 1 FROM collections WHERE title = ?)
`)
for (const c of collectionsSeed) {
  insertCollection.run(
    c.title, c.cover_image, c.type, c.series, c.acquired_at, c.status, c.notes, JSON.stringify(c.tags), c.is_featured, c.title
  )
}

// ==================== 图鉴骑士 seed（按 member_id 幂等去重；首批平成 20 位主骑士） ====================
// 数据来源：官方图鉴站 https://www.kamen-rider-official.com/zukan/ —— 日文原版简介已逐条转写为中文 intro
try {
  const ridersPath = path.join(__dirname, '../../../verify/riders_all_final.json')
  const ridersData = JSON.parse(fs.readFileSync(ridersPath, 'utf-8'))
  const upsertRider = db.prepare(`
    INSERT OR IGNORE INTO riders (
      member_id, name, name_origin, name_en, series, series_ja, era, year,
      height, weight, punch, kick, jump, run,
      transform_user, transform_belongings, first_appear, intro, image, image_source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const r of ridersData) {
    upsertRider.run(
      r.member_id, r.name, r.nameOrigin || '', r.nameEn || '',
      r.series || '', r.series_ja || '', r.era, r.year,
      r.height || '', r.weight || '', r.punch || '', r.kick || '', r.jump || '', r.run || '',
      r.transformUser || '', r.transformBelongings || '', r.firstAppear || '',
      r.intro || '', r.image || '', r.imageSource || ''
    )
  }
  console.log(`[riders] 幂等写入 ${ridersData.length} 条图鉴数据`)
} catch (e) {
  console.warn('[riders] seed 跳过：', e.message)
}

// 幂等迁移：历史库图鉴图片路径补全为 /images/riders/ 前缀（与商城 goods.image_url 约定一致）
db.prepare("UPDATE riders SET image = '/images/riders/' || image WHERE image != '' AND image NOT LIKE '/%'").run()

export default db
