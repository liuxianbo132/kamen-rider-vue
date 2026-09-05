<template>
  <el-card>
    <div class="toolbar">
      <span class="page-title">商品管理</span>
      <el-button type="primary" @click="openDialog()">新增商品</el-button>
    </div>

    <!-- 商品表格 -->
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" min-width="140" show-overflow-tooltip />
      <el-table-column label="价格" width="100">
        <template #default="{ row }">￥{{ row.price }}</template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="80" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column label="图片" width="120">
        <template #default="{ row }">
          <el-image :src="row.image_url" fit="cover" style="width: 80px; height: 60px; border-radius: 4px" :preview-src-list="[row.image_url]" preview-teleported />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="160" show-overflow-tooltip />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确认删除该商品？" @confirm="onRemove(row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑商品' : '新增商品'" width="520">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input-number v-model="form.price" :min="0" :precision="2" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" placeholder="如：数码配件" />
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="form.image_url" placeholder="https://picsum.photos/seed/xxx/400/300" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="商品描述（选填）" />
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
import { getGoodsApi, createGoodsApi, updateGoodsApi, deleteGoodsApi } from '../../api/goods'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)

// 弹窗表单数据（id 为空表示新增）
const form = reactive({
  id: null, name: '', price: 0, stock: 0, category: '', image_url: '', description: ''
})

// 加载商品列表
async function fetchList() {
  loading.value = true
  try {
    list.value = await getGoodsApi()
  } finally {
    loading.value = false
  }
}

// 打开弹窗：传入 row 为编辑，不传为新增
function openDialog(row) {
  if (row) {
    Object.assign(form, row)
  } else {
    Object.assign(form, { id: null, name: '', price: 0, stock: 0, category: '', image_url: '', description: '' })
  }
  dialogVisible.value = true
}

// 保存（新增或编辑），成功后刷新表格
async function onSave() {
  if (!form.name.trim()) return ElMessage.warning('请输入商品名称')
  saving.value = true
  try {
    const payload = { ...form }
    if (form.id) {
      await updateGoodsApi(form.id, payload)
    } else {
      await createGoodsApi(payload)
    }
    ElMessage.success(form.id ? '更新成功' : '新增成功')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

// 删除商品，成功后刷新表格
async function onRemove(row) {
  await deleteGoodsApi(row.id)
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
