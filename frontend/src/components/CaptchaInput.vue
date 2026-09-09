<template>
  <div class="captcha">
    <el-input
      v-model="input"
      class="captcha-input"
      placeholder="请输入右侧验证码"
      size="large"
      maxlength="4"
      @keyup.enter="$emit('enter')"
    />
    <div
      class="captcha-svg"
      title="点击刷新验证码"
      v-html="svg"
      @click="refresh"
    />
    <el-button class="captcha-refresh" text size="small" @click="refresh">换一张</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCaptchaApi } from '../api/auth'

const emit = defineEmits(['enter'])
const input = ref('')
const svg = ref('')
const captchaId = ref('')

// 从后端拉取一张新验证码（id + svg）
async function load() {
  try {
    const data = await getCaptchaApi()
    captchaId.value = data.id
    svg.value = data.svg
  } catch (e) {
    // 拉取失败（如后端未启动）时清空，避免展示旧的/伪造的验证码
    captchaId.value = ''
    svg.value = ''
  }
}

function refresh() {
  input.value = ''
  load()
}

// 暴露给父组件：当前验证码的 id 与用户输入文本
function getValue() {
  return { id: captchaId.value, text: input.value.trim() }
}

defineExpose({ refresh, getValue, clear: () => { input.value = '' } })

onMounted(load)
</script>

<style scoped>
.captcha {
  display: flex;
  align-items: center;
  gap: 8px;
}
.captcha-input {
  flex: 1;
}
.captcha-svg {
  width: 120px;
  height: 44px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--line, #e2ddd2);
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
}
.captcha-svg :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
.captcha-refresh {
  flex-shrink: 0;
  color: var(--accent, #9a3b2e);
}
</style>
