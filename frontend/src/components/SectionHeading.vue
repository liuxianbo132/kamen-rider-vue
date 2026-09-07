<template>
  <!-- 栏目标题：左标题 + 右侧“查看全部”链接，杂志目录风格 -->
  <div class="section-heading">
    <div class="sh-left">
      <h2 class="sh-title">{{ title }}</h2>
      <p v-if="en" class="sh-en">{{ en }}</p>
    </div>
    <a v-if="moreText" class="sh-more" role="link" tabindex="0" @click="$emit('more')" @keydown.enter="$emit('more')">
      {{ moreText }} →
    </a>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  en: { type: String, default: '' },
  moreText: { type: String, default: '' }
})
defineEmits(['more'])
</script>

<style scoped>
.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 28px;
}

.sh-title {
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 2px;
  line-height: 1.2;
}

.sh-en {
  margin-top: 6px;
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--muted);
}

.sh-more {
  font-size: 13px;
  color: var(--accent-dark);
  letter-spacing: 1px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s;
}

.sh-more:hover,
.sh-more:focus-visible {
  color: var(--accent);
  outline: none;
}

@media (max-width: 768px) {
  .sh-title { font-size: 22px; }
}
</style>
