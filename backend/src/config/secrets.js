// 安全配置：密钥一律从环境变量注入，禁止硬编码默认值。
// 原因：仓库公开后，任何写在代码里的密钥都等同于公开密钥。
// 因此这里采用 fail-fast 策略——缺失即拒绝启动，避免带着弱密钥上线。

function requireSecret(name, minLength) {
  const value = process.env[name]
  if (!value || value.length < minLength) {
    console.error(
      `\n[FATAL] 缺少环境变量 ${name}，或长度不足 ${minLength} 位。\n` +
        `请复制 backend/.env.example 为 backend/.env 并填写真实值后重启。\n` +
        `生成随机密钥：node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"\n`
    )
    process.exit(1)
  }
  return value
}

// JWT 签名密钥：泄露即可伪造任意用户（含管理员）身份，故要求高强度
export const JWT_SECRET = requireSecret('JWT_SECRET', 32)
