<template>
  <el-card>
    <div class="toolbar">
      <span class="page-title">收藏管理</span>
      <div class="filters">
        <el-select v-model="typeFilter" placeholder="全部类型" clearable style="width: 130px" @change="fetchList">
          <el-option v-for="(label, value) in TYPE_LABELS" :key="value" :label="label" :value="value" />
        </el-select>
        <el-select v-model="statusFilter" placeholder="全部状态" clearable style="width: 120px" @change="fetchList">
          <el-option v-for="(label, value) in STATUS_LABELS" :key="value" :label="label" :value="value" />
        </el-select>
        <el-button type="primary" @click="openDialog()">新增收藏</el-button>
      </div>
    </div>

    <!-- 收藏表格 -->
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column label="类型" width="100">
        <template #default="{ row }">{{ typeLabel(row.type) }}</template>
      </el-table-column>
      <el-table-column prop="series" label="系列" width="140" show-overflow-tooltip />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'owned' ? 'success' : row.status === 'wishlist' ? 'warning' : 'info'" size="small">
            {{ statusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="精选" width="70">
        <template #default="{ row }">{{ row.is_featured ? '是' : '—' }}</template>
      </el-table-column>
      <el-table-column prop="acquired_at" label="收录日期" width="110">
        <template #default="{ row }">{{ row.acquired_at ? row.acquired_at.slice(0, 10) : '—' }}</template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" width="160" show-overflow-tooltip />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确认删除该收藏条目？仅删除记录，不影响图片文件。" @confirm="onRemove(row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑收藏' : '新增收藏'" width="620">
      <el-form :model="form" label-width="90px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入收藏条目标题" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-select v-model="form.cover_image" filterable allow-create placeholder="选择或输入图片路径（选填）" style="width: 100%">
            <el-option v-for="img in coverOptions" :key="img" :label="img" :value="img" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" style="width: 200px">
            <el-option v-for="(label, value) in TYPE_LABELS" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="系列">
          <el-input v-model="form.series" placeholder="如：假面骑士W（选填）" style="width: 280px" />
        </el-form-item>
        <el-form-item label="收录日期">
          <el-input v-model="form.acquiredAtText" placeholder="YYYY-MM-DD（心愿单可留空）" style="width: 240px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 200px">
            <el-option v-for="(label, value) in STATUS_LABELS" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tagsText" placeholder="多个标签用英文逗号分隔，如：驱动器,平成（选填）" />
        </el-form-item>
        <el-form-item label="收藏笔记">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="5"
            placeholder="把玩感受、入手故事、陈列位置…（段落间空行）"
          />
        </el-form-item>
        <el-form-item label="首页精选">
          <el-switch v-model="form.is_featured" active-text="在首页收藏精选区展示" />
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
import { getAdminCollectionsApi, createCollectionApi, updateCollectionApi, deleteCollectionApi } from '../../api/collections'
import { TYPE_LABELS, STATUS_LABELS, typeLabel, statusLabel, parseTags } from '../../constants/collections'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)
const typeFilter = ref('')
const statusFilter = ref('')

// 封面图候选：复用 public/images 中已有有效图片（排除损坏的 rider-*.png）
const coverOptions = [
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg',
  '/images/banner-w.png',
  '/images/banner-zzz.png',
  '/images/123.jpg',
  '/images/22jpg.jpg',
  '/images/zzz.jpg',
  '/images/geats.jpg',
  '/images/goods-faiz.jpg',
  '/images/goods-kabuto.jpg',
  '/images/goods-deno.jpg',
  '/images/xilie.jpg',
  '/images/xilie2.jpg',
  '/images/xilie3.jpg',
  '/images/banner-w.jpg',
  '/images/banner-ooo.jpg',
  '/images/banner-deno.jpg',
  '/images/collection-8.jpg',
  '/images/collection-9.jpg',
  '/images/hero.jpg'
]

// tagsText 为逗号输入所见；tags 存库为 JSON 数组文本
const form = reactive({
  id: null,
  title: '',
  cover_image: '',
  type: 'belt',
  series: '',
  acquiredAtText: '',
  status: 'owned',
  tagsText: '',
  notes: '',
  is_featured: false
})

async function fetchList() {
  loading.value = true
  try {
    const params = { page: 1, pageSize: 100 }
    if (typeFilter.value) params.type = typeFilter.value
    if (statusFilter.value) params.status = statusFilter.value
    const data = await getAdminCollectionsApi(params)
    list.value = data.list || []
  } finally {
    loading.value = false
  }
}

// 打开弹窗：传入 row 为编辑，不传为新增
function openDialog(row) {
  if (row) {
    Object.assign(form, {
      id: row.id,
      title: row.title || '',
      cover_image: row.cover_image || '',
      type: row.type || 'belt',
      series: row.series || '',
      acquiredAtText: row.acquired_at ? row.acquired_at.slice(0, 10) : '',
      status: row.status || 'owned',
      tagsText: parseTags(row.tags).join(','),
      notes: row.notes || '',
      is_featured: !!row.is_featured
    })
  } else {
    Object.assign(form, {
      id: null,
      title: '',
      cover_image: '',
      type: 'belt',
      series: '',
      acquiredAtText: '',
      status: 'owned',
      tagsText: '',
      notes: '',
      is_featured: false
    })
  }
  dialogVisible.value = true
}

// 保存（新增或编辑）
async function onSave() {
  if (!form.title.trim()) return ElMessage.warning('请输入标题')
  saving.value = true
  try {
    const payload = {
      title: form.title.trim(),
      cover_image: form.cover_image,
      type: form.type,
      series: form.series,
      acquired_at: form.acquiredAtText.trim(),
      status: form.status,
      tags: JSON.stringify(form.tagsText.split(',').map((t) => t.trim()).filter(Boolean)),
      notes: form.notes,
      is_featured: form.is_featured
    }
    if (form.id) {
      await updateCollectionApi(form.id, payload)
    } else {
      await createCollectionApi(payload)
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
  await deleteCollectionApi(row.id)
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
</style>
