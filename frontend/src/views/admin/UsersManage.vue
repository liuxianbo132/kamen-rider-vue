<template>
  <el-card>
    <div class="toolbar">
      <span class="page-title">用户管理</span>
    </div>

    <!-- 用户表格 -->
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" min-width="160" />
      <el-table-column label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" min-width="170" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <!-- 修改角色：管理员 ↔ 普通用户（后端禁止操作自己的角色） -->
          <el-button size="small" :type="row.role === 'admin' ? 'info' : 'warning'" @click="onToggleRole(row)">
            {{ row.role === 'admin' ? '降为普通用户' : '设为管理员' }}
          </el-button>
          <el-popconfirm title="确认删除该用户？" @confirm="onRemove(row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUsersApi, updateRoleApi, deleteUserApi } from '../../api/users'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const list = ref([])
const loading = ref(false)

async function fetchList() {
  loading.value = true
  try {
    list.value = await getUsersApi()
  } finally {
    loading.value = false
  }
}

// 切换用户角色，成功后刷新表格
async function onToggleRole(row) {
  const nextRole = row.role === 'admin' ? 'user' : 'admin'
  await updateRoleApi(row.id, nextRole)
  ElMessage.success('角色修改成功')
  fetchList()
}

// 删除用户，成功后刷新表格
async function onRemove(row) {
  await deleteUserApi(row.id)
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
