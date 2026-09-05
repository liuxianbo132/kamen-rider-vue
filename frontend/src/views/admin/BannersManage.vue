<template>
  <el-card>
    <div class="toolbar">
      <span class="page-title">轮播图管理</span>
      <el-button type="primary" @click="openDialog()">新增轮播图</el-button>
    </div>

    <!-- 轮播图表格 -->
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="图片" min-width="200">
        <template #default="{ row }">
          <el-image :src="row.image_url" fit="cover" style="width: 160px; height: 60px; border-radius: 4px" :preview-src-list="[row.image_url]" preview-teleported />
        </template>
      </el-table-column>
      <el-table-column prop="link_url" label="跳转链接" min-width="160" show-overflow-tooltip />
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确认删除该轮播图？" @confirm="onRemove(row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑轮播图' : '新增轮播图'" width="520">
      <el-form :model="form" label-width="80px">
        <el-form-item label="图片链接" required>
          <el-input v-model="form.image_url" placeholder="https://picsum.photos/seed/xxx/1200/400" />
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="form.link_url" placeholder="点击轮播图跳转的地址（选填）" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" :step="1" style="width: 100%" />
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
import { getBannersApi, createBannerApi, updateBannerApi, deleteBannerApi } from '../../api/banners'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)

const form = reactive({
  id: null, image_url: '', link_url: '', sort_order: 0
})

async function fetchList() {
  loading.value = true
  try {
    list.value = await getBannersApi()
  } finally {
    loading.value = false
  }
}

// 打开弹窗：传入 row 为编辑，不传为新增
function openDialog(row) {
  if (row) {
    Object.assign(form, row)
  } else {
    Object.assign(form, { id: null, image_url: '', link_url: '', sort_order: 0 })
  }
  dialogVisible.value = true
}

// 保存（新增或编辑），成功后刷新表格
async function onSave() {
  if (!form.image_url.trim()) return ElMessage.warning('请输入图片链接')
  saving.value = true
  try {
    const payload = { ...form }
    if (form.id) {
      await updateBannerApi(form.id, payload)
    } else {
      await createBannerApi(payload)
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
  await deleteBannerApi(row.id)
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
