<template>
  <el-card>
    <div class="toolbar">
      <span class="page-title">新闻管理</span>
      <el-button type="primary" @click="openDialog()">新增新闻</el-button>
    </div>

    <!-- 新闻表格 -->
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column prop="source" label="来源" width="140" show-overflow-tooltip />
      <el-table-column prop="editor" label="编辑" width="100" />
      <el-table-column prop="date" label="日期" width="130" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确认删除该新闻？" @confirm="onRemove(row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑新闻' : '新增新闻'" width="640">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="来源">
          <el-input v-model="form.source" placeholder="如：特摄新闻组（选填）" />
        </el-form-item>
        <el-form-item label="编辑">
          <el-input v-model="form.editor" placeholder="编辑署名（选填）" />
        </el-form-item>
        <el-form-item label="日期">
          <el-input v-model="form.date" placeholder="YYYY-MM-DD HH:mm，如 2026-09-07 14:30（选填）" />
        </el-form-item>
        <el-form-item label="原文链接">
          <el-input v-model="form.url" placeholder="https://…（选填，有值则点击卡片跳原文）" />
        </el-form-item>
        <el-form-item label="正文" required>
          <!-- 每行一段，保存时按换行转 JSON 数组 -->
          <el-input
            v-model="form.contentText"
            type="textarea"
            :rows="6"
            placeholder="每行一个段落…"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getNewsApi, createNewsApi, updateNewsApi, deleteNewsApi } from '../../api/news'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)

// contentText 为文本域所见（每行一段），保存时转 JSON；content 为数据库 JSON 文本
const form = reactive({
  id: null, title: '', source: '', editor: '', date: '', url: '', contentText: ''
})

// 当前本地时间 → 'YYYY-MM-DD HH:mm'（新增新闻的日期默认值，统一日期格式）
function nowLocal() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// JSON 段落数组 ↔ 文本域换行文本
function contentToText(content) {
  try {
    const arr = JSON.parse(content)
    return Array.isArray(arr) ? arr.join('\n') : content || ''
  } catch {
    return content || ''
  }
}

async function fetchList() {
  loading.value = true
  try {
    list.value = await getNewsApi()
  } finally {
    loading.value = false
  }
}

// 打开弹窗：传入 row 为编辑，不传为新增
function openDialog(row) {
  if (row) {
    Object.assign(form, {
      id: row.id,
      title: row.title,
      source: row.source || '',
      editor: row.editor || '',
      date: row.date || '',
      url: row.url || '',
      contentText: contentToText(row.content)
    })
  } else {
    Object.assign(form, { id: null, title: '', source: '', editor: '', date: nowLocal(), url: '', contentText: '' })
  }
  dialogVisible.value = true
}

// 保存（新增或编辑），contentText 按行转 JSON 数组
async function onSave() {
  if (!form.title.trim()) return ElMessage.warning('请输入标题')
  if (!form.contentText.trim()) return ElMessage.warning('请输入正文')
  saving.value = true
  try {
    const payload = {
      title: form.title,
      source: form.source,
      editor: form.editor,
      date: form.date,
      url: form.url,
      content: JSON.stringify(form.contentText.split('\n'))
    }
    if (form.id) {
      await updateNewsApi(form.id, payload)
    } else {
      await createNewsApi(payload)
    }
    ElMessage.success(form.id ? '更新成功' : '新增成功')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

// 删除，成功后刷新表格
async function onRemove(row) {
  await deleteNewsApi(row.id)
  ElMessage.success('删除成功')
  fetchList()
}

onMounted(fetchList)
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
}
</style>