<template>
  <el-card>
    <div class="toolbar">
      <span class="page-title">文章管理</span>
      <div class="filters">
        <el-select v-model="statusFilter" placeholder="全部状态" clearable style="width: 120px" @change="fetchList">
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-select v-model="categoryFilter" placeholder="全部栏目" clearable style="width: 130px" @change="fetchList">
          <el-option v-for="(label, value) in CATEGORY_LABELS" :key="value" :label="label" :value="value" />
        </el-select>
        <el-button type="primary" @click="openDialog()">新增文章</el-button>
      </div>
    </div>

    <!-- 文章表格 -->
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column label="栏目" width="100">
        <template #default="{ row }">{{ categoryLabel(row.category) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
            {{ STATUS_LABELS[row.status] || row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推荐级别" width="90">
        <template #default="{ row }">{{ FEATURED_LABELS[row.featured_level] ?? '普通' }}</template>
      </el-table-column>
      <el-table-column label="发布时间" width="110">
        <template #default="{ row }">{{ (row.published_at || '').slice(0, 10) || '—' }}</template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" width="160" show-overflow-tooltip />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确认删除该文章？仅删除记录，不影响图片文件。" @confirm="onRemove(row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗：编辑 / 预览两种模式 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑文章' : '新增文章'" width="780" top="4vh">
      <div class="dialog-head">
        <el-radio-group v-model="mode" size="small">
          <el-radio-button value="edit">编辑</el-radio-button>
          <el-radio-button value="preview">预览</el-radio-button>
        </el-radio-group>
        <span class="dialog-tip">正文按空行分段，行首「## 」作为二级标题</span>
      </div>

      <!-- 编辑模式 -->
      <el-form v-if="mode === 'edit'" :model="form" label-width="90px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="slug">
          <el-input v-model="form.slug" placeholder="留空将根据标题自动生成（小写字母、数字、连字符）" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="文章摘要，显示在列表与首页卡片（选填）" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-select v-model="form.cover_image" filterable allow-create placeholder="选择或输入图片路径（选填）" style="width: 100%">
            <el-option v-for="img in coverOptions" :key="img" :label="img" :value="img" />
          </el-select>
        </el-form-item>
        <el-form-item label="栏目">
          <el-select v-model="form.category" style="width: 220px">
            <el-option v-for="(label, value) in CATEGORY_LABELS" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tagsText" placeholder="多个标签用英文逗号分隔，如：评测,驱动器（选填）" />
        </el-form-item>
        <el-form-item label="正文" required>
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="12"
            placeholder="段落之间空一行；行首「## 」渲染为二级标题…"
          />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-input v-model="form.publishedAtText" placeholder="YYYY-MM-DD HH:mm（发布状态留空则自动取当前时间）" style="width: 280px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 160px">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item label="推荐级别">
          <el-select v-model="form.featured_level" style="width: 160px">
            <el-option label="普通（不上首页推荐）" :value="0" />
            <el-option label="次推（首页小卡片）" :value="1" />
            <el-option label="主推（首页大卡片）" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 预览模式：模拟详情页排版 -->
      <div v-else class="preview">
        <p class="pv-meta">
          <span class="pv-cat">{{ categoryLabel(form.category) }}</span>
          <span>{{ form.publishedAtText || '未设置发布时间' }}</span>
        </p>
        <h2 class="pv-title">{{ form.title || '（未填写标题）' }}</h2>
        <p v-if="form.summary" class="pv-summary">{{ form.summary }}</p>
        <img v-if="form.cover_image" :src="form.cover_image" class="pv-cover" alt="封面预览" />
        <div class="pv-body">
          <template v-for="(b, i) in previewBlocks" :key="i">
            <h3 v-if="b.type === 'h2'" class="pv-h2">{{ b.text }}</h3>
            <p v-else class="pv-p">{{ b.text }}</p>
          </template>
          <p v-if="!previewBlocks.length" class="pv-p pv-empty">（正文为空）</p>
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminPostsApi, createPostApi, updatePostApi, deletePostApi } from '../../api/posts'
import { CATEGORY_LABELS, STATUS_LABELS, FEATURED_LABELS, categoryLabel } from '../../constants/posts'
import { parseBlocks, isoToLocal } from '../../utils/postContent'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)
const mode = ref('edit') // 弹窗模式：edit 编辑 / preview 预览
const statusFilter = ref('')
const categoryFilter = ref('')

// 封面图候选：复用 public/images 中已有有效图片（排除损坏的 rider-*.png）
const coverOptions = [
  '/images/banner-w.png',
  '/images/banner-zzz.png',
  '/images/123.jpg',
  '/images/22jpg.jpg',
  '/images/zzz.jpg',
  '/images/geats.jpg',
  '/images/goods-faiz.jpg',
  '/images/xilie.jpg',
  '/images/xilie2.jpg',
  '/images/xilie3.jpg',
  '/images/hero.jpg',
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg'
]

// tagsText 为逗号输入所见；tags 存库为 JSON 数组文本
const form = reactive({
  id: null,
  title: '',
  slug: '',
  summary: '',
  cover_image: '',
  category: 'review',
  tagsText: '',
  content: '',
  publishedAtText: '',
  status: 'draft',
  featured_level: 0
})

const previewBlocks = computed(() => parseBlocks(form.content))

// slug 自动生成：与后端 slugify 同规则（仅小写字母数字连字符，纯中文回退时间戳）
function slugify(title) {
  const s = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
  return s || `post-${Date.now().toString(36)}`
}

async function fetchList() {
  loading.value = true
  try {
    const params = { page: 1, pageSize: 100 }
    if (statusFilter.value) params.status = statusFilter.value
    if (categoryFilter.value) params.category = categoryFilter.value
    const data = await getAdminPostsApi(params)
    list.value = data.list || []
  } finally {
    loading.value = false
  }
}

// 打开弹窗：传入 row 为编辑，不传为新增
function openDialog(row) {
  mode.value = 'edit'
  if (row) {
    let tags = []
    try {
      const arr = JSON.parse(row.tags)
      if (Array.isArray(arr)) tags = arr
    } catch { /* 解析失败按空处理 */ }
    Object.assign(form, {
      id: row.id,
      title: row.title || '',
      slug: row.slug || '',
      summary: row.summary || '',
      cover_image: row.cover_image || '',
      category: row.category || 'review',
      tagsText: tags.join(','),
      content: row.content || '',
      publishedAtText: isoToLocal(row.published_at),
      status: row.status || 'draft',
      featured_level: Number(row.featured_level) || 0
    })
  } else {
    Object.assign(form, {
      id: null,
      title: '',
      slug: '',
      summary: '',
      cover_image: '',
      category: 'review',
      tagsText: '',
      content: '',
      publishedAtText: '',
      status: 'draft',
      featured_level: 0
    })
  }
  dialogVisible.value = true
}

// 保存（新增或编辑）；slug 重复由后端校验并经 axios 拦截器弹出提示
async function onSave() {
  if (!form.title.trim()) return ElMessage.warning('请输入标题')
  if (!form.content.trim()) return ElMessage.warning('请输入正文')
  saving.value = true
  try {
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      summary: form.summary,
      cover_image: form.cover_image,
      category: form.category,
      tags: JSON.stringify(form.tagsText.split(',').map((t) => t.trim()).filter(Boolean)),
      content: form.content,
      published_at: form.publishedAtText.trim(),
      status: form.status,
      featured_level: form.featured_level
    }
    if (form.id) {
      await updatePostApi(form.id, payload)
    } else {
      await createPostApi(payload)
    }
    ElMessage.success(form.id ? '更新成功' : '新增成功')
    dialogVisible.value = false
    fetchList()
  } catch {
    /* 错误消息已由 axios 拦截器统一弹出，保留弹窗供修改 */
  } finally {
    saving.value = false
  }
}

// 删除，成功后刷新表格
async function onRemove(row) {
  await deletePostApi(row.id)
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
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.dialog-tip {
  font-size: 12px;
  color: #909399;
}

/* 预览区：模拟详情页排版 */
.preview {
  border: 1px solid #e6e0d6;
  border-radius: 8px;
  background: #fffdf8;
  padding: 28px 32px;
  max-height: 62vh;
  overflow-y: auto;
}

.pv-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #7a756c;
  margin: 0 0 10px;
}

.pv-cat {
  color: #805b1c;
  letter-spacing: 2px;
}

.pv-title {
  font-family: Georgia, 'Noto Serif SC', serif;
  font-size: 24px;
  color: #252525;
  margin: 0 0 12px;
  line-height: 1.4;
}

.pv-summary {
  font-size: 14px;
  line-height: 1.9;
  color: #7a756c;
  border-left: 3px solid #b8872f;
  padding-left: 14px;
  margin: 0 0 20px;
}

.pv-cover {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 22px;
  display: block;
}

.pv-h2 {
  font-family: Georgia, 'Noto Serif SC', serif;
  font-size: 19px;
  color: #252525;
  margin: 28px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e6e0d6;
}

.pv-p {
  font-size: 15px;
  line-height: 2;
  color: #3d3a34;
  margin: 0 0 16px;
  white-space: pre-line;
}

.pv-empty {
  color: #a8a29a;
}
</style>
