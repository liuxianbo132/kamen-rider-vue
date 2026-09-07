// 资料库本地数据：假面骑士系列条目（第一版只读，不做后台管理）
// era: 'showa' 昭和 / 'heisei' 平成 / 'reiwa' 令和；封面复用 public/images 已有图片
export const ERAS = [
  { key: 'showa', label: '昭和', en: 'SHOWA', range: '1971 - 1989', intro: '改造人的悲歌与英雄的原点' },
  { key: 'heisei', label: '平成', en: 'HEISEI', range: '2000 - 2018', intro: '平成二十年，变身系统的叙事革命' },
  { key: 'reiwa', label: '令和', en: 'REIWA', range: '2019 - 今', intro: '令和新生代，做减法的变身美学' }
]

export const riderSeries = [
  // ============ 昭和 ============
  {
    name: '假面骑士',
    era: 'showa',
    year: 1971,
    cover: '/images/hero.jpg',
    summary: '本乡猛被邪恶组织修卡改造成蝗虫能力的改造人，为守护人类的自由而战。特摄英雄叙事的原点。',
    tags: ['改造人', '原点']
  },
  {
    name: '假面骑士V3',
    era: 'showa',
    year: 1973,
    cover: '/images/6.jpg',
    summary: '风见志郎为复仇接受改造，由初代双骑士托付技术诞生的变身腰带。名台词「变身，V3！」沿用至今。',
    tags: ['双骑士', '复仇']
  },
  {
    name: '假面骑士Black',
    era: 'showa',
    year: 1987,
    cover: '/images/11.jpg',
    summary: '南光太郎与秘密组织戈尔戈姆的宿命对决。黑色铠甲美学与影月的悲剧，昭和系列的巅峰之作。',
    tags: ['影月', '宿命']
  },
  {
    name: '假面骑士Black RX',
    era: 'showa',
    year: 1988,
    cover: '/images/33.jpg',
    summary: '光太郎进化为「太阳之子」，昭和骑士的最终章。王子与骑士的双重身份叙事影响了之后的许多作品。',
    tags: ['太阳之子', '进化']
  },

  // ============ 平成 ============
  {
    name: '假面骑士555（Faiz）',
    era: 'heisei',
    year: 2003,
    cover: '/images/goods-faiz.jpg',
    summary: '乾巧与流线型手机变身腰带 Faiz Gear。「人类的梦想是自由的」——平成骑士的悲剧美学代表。',
    tags: ['腰带', '悲剧']
  },
  {
    name: '假面骑士Kabuto',
    era: 'heisei',
    year: 2006,
    cover: '/images/goods-kabuto.jpg',
    summary: '天道总司与独角仙形态的 Zecter。Clock Up 超高速战斗与「奶奶说过」的哲学，人气经久不衰。',
    tags: ['天道', 'Clock Up']
  },
  {
    name: '假面骑士电王（Den-O）',
    era: 'heisei',
    year: 2007,
    cover: '/images/goods-deno.jpg',
    summary: '野上良太郎与四个异魔神共乘时空列车。喜剧与羁绊的集大成，系列人气与衍生剧场版之最。',
    tags: ['异魔神', '时空列车']
  },
  {
    name: '假面骑士Decade',
    era: 'heisei',
    year: 2009,
    cover: '/images/3.jpg',
    summary: '门矢士穿越平行世界，被称为「世界的破坏者」。平成十年集大成之作，卡片式变身腰带的起点。',
    tags: ['平行世界', '卡片']
  },
  {
    name: '假面骑士W（Double）',
    era: 'heisei',
    year: 2009,
    cover: '/images/123.jpg',
    summary: '风都的两人一体侦探，左翔太郎与菲利普共用一副身体。「好了，来细数你的罪恶吧。」',
    tags: ['风都', '侦探']
  },
  {
    name: '假面骑士OOO',
    era: 'heisei',
    year: 2010,
    cover: '/images/22jpg.jpg',
    summary: '火野映司与三枚核心硬币组成的欲望故事。「欲望，得到手的话会怎么样呢」——无欲的主人公与贪婪的反派。',
    tags: ['硬币', '欲望']
  },
  {
    name: '假面骑士Build',
    era: 'heisei',
    year: 2017,
    cover: '/images/8.jpg',
    summary: '天才物理学家桐生战兔与满装瓶罐变身系统。奥特曼式双人叙事与「实验开始」的浪漫。',
    tags: ['瓶子', '物理']
  },
  {
    name: '假面骑士Zi-O',
    era: 'heisei',
    year: 2018,
    cover: '/images/5.jpg',
    summary: '时之王庄吾穿越历代骑士的时间旅行，平成骑士二十年终章。卡片与表盘的收藏叙事。',
    tags: ['时间', '平成终章']
  },

  // ============ 令和 ============
  {
    name: '假面骑士Zero-One',
    era: 'reiwa',
    year: 2019,
    cover: '/images/7.jpg',
    summary: '飞电或人与人工智能黎明期的故事。人造骑士 HumaGear 的存在叩问「何为人」。',
    tags: ['AI', '黎明']
  },
  {
    name: '假面骑士Geats',
    era: 'reiwa',
    year: 2022,
    cover: '/images/geats.jpg',
    summary: '愿望游戏大逃杀，浮世英寿的白色身影。「愿望，降临」——令和系设计与人气的双高峰。',
    tags: ['游戏', '愿望']
  },
  {
    name: '假面骑士ZZZ',
    era: 'reiwa',
    year: 2025,
    cover: '/images/zzz.jpg',
    summary: '清醒梦特工与梦境变身系统。Make your dream come true——新世代的变身叙事。',
    tags: ['梦境', '新世代']
  }
]
