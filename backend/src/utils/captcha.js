// 图形验证码：纯 Node 生成 SVG，内存存证（5 分钟有效，校验一次即失效）
import { randomUUID, randomInt } from 'crypto'

// id -> { text, expiresAt }
const store = new Map()
const TTL = 5 * 60 * 1000
// 去掉易混淆字符 0/O/1/I/L
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function randomText(n = 4) {
  let s = ''
  for (let i = 0; i < n; i++) s += CHARS[randomInt(0, CHARS.length)]
  return s
}

function cleanExpired() {
  const now = Date.now()
  for (const [id, item] of store) {
    if (item.expiresAt < now) store.delete(id)
  }
}

// 生成一张验证码，返回 { id, svg }
export function createCaptcha() {
  cleanExpired()
  const text = randomText(4)
  const id = randomUUID()
  const w = 120
  const h = 44
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`
  svg += `<rect width="100%" height="100%" rx="6" fill="#f4f0e8"/>`

  // 干扰线
  for (let i = 0; i < 4; i++) {
    const x1 = randomInt(0, w)
    const y1 = randomInt(0, h)
    const x2 = randomInt(0, w)
    const y2 = randomInt(0, h)
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="hsl(${randomInt(0, 360)} 45% 68%)" stroke-width="1"/>`
  }
  // 噪点
  for (let i = 0; i < 28; i++) {
    svg += `<circle cx="${randomInt(0, w)}" cy="${randomInt(0, h)}" r="1" fill="hsl(${randomInt(0, 360)} 40% 62%)"/>`
  }
  // 字符（随机旋转 + 随机颜色 + 轻微偏移）
  for (let i = 0; i < text.length; i++) {
    const x = 16 + i * 26
    const y = 31 + randomInt(-4, 5)
    const rot = randomInt(-18, 18)
    svg += `<text x="${x}" y="${y}" font-family="Georgia,'Times New Roman',serif" font-size="26" font-weight="700" fill="hsl(${randomInt(0, 360)} 60% 36%)" transform="rotate(${rot} ${x} ${y})">${text[i]}</text>`
  }
  svg += '</svg>'

  store.set(id, { text, expiresAt: Date.now() + TTL })
  return { id, svg }
}

// 校验验证码（大小写不敏感，一次性）
export function verifyCaptcha(id, input) {
  if (!id || !input) return false
  const item = store.get(id)
  if (!item) return false
  store.delete(id)
  if (Date.now() > item.expiresAt) return false
  return String(input).trim().toUpperCase() === item.text
}
