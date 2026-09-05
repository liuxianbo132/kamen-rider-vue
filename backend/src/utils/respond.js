// 统一接口返回格式：{ code, data, message }
export function ok(res, data = null, message = 'success') {
  res.json({ code: 200, data, message })
}

export function fail(res, code = 400, message = '请求失败') {
  res.json({ code, data: null, message })
}
