<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="请搜索模板名称"
                class="w-80 h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                @keyup.enter="handleSearchClick"
              />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <Button
              size="sm"
              @click="handleSearchClick"
              :disabled="isSearching"
            >
              <span v-if="isSearching" class="mr-2">搜索中...</span>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              搜索
            </Button>
            <Button
              size="sm"
              variant="outline"
              @click="clearSearch"
              class="text-gray-500 hover:text-gray-700"
            >
              重置
            </Button> -->
          </div>
          <div class="flex gap-2">
            <Button size="sm" @click="openAdd">新增</Button>
          </div>
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">序号</TableHead>
              <TableHead class="whitespace-nowrap">模板名称</TableHead>
              <TableHead class="whitespace-nowrap">模板类型</TableHead>
              <TableHead class="whitespace-nowrap">所属用户</TableHead>
              <TableHead class="whitespace-nowrap">是否激活</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="templates.length">
              <TableRow v-for="(item,index) in templates" :key="item.id">
                <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ item.name }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ getTemplateTypeText(item.type) }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ item.user }}</TableCell>
                <TableCell class="whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                      item.isActive
                        ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                        : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                    ]"
                  >
                    {{ item.isActive ? '启用' : '停用' }}
                  </span>
                </TableCell>
                <TableCell class="whitespace-nowrap">{{ formatTime(item.createdAt) }}</TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" @click="openEdit(item)">编辑</Button>
                    <button
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(item, $event)"
                    >
                      删除
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
               <template v-else>
              <TableRow>
                <TableCell :colspan="6" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
        <div class="mt-4" v-if="total > 0">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1">
            <PaginationContent v-slot="{ items }">
              <!-- <PaginationFirst>首页</PaginationFirst> -->
              <PaginationPrevious/>
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext/>
              <!-- <PaginationLast>末页</PaginationLast> -->
            </PaginationContent>
          </Pagination>
        </div>
      </ComponentCard>

      <!-- 统一的弹窗组件 -->
      <Modal v-if="showModal" :fullScreenBackdrop="true" @close="closeModal">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">{{ isEditMode ? '编辑提示词模板' : '新增提示词模板' }}</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板名称<span
                    class="text-error-500">*</span></label>
                <input v-model="form.name" type="text" placeholder="如：客服问候模板"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div v-if="userRole === 'admin'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">所属用户<span
                    class="text-error-500">*</span></label>
                <select v-model="form.owner_id"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板类型</label>
                <select v-model="form.scene"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择模板类型</option>
                  <option v-for="option in  OPTIONS_TYPE_OPTIONS" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">是否激活</label>
                <select v-model="form.enabled"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option :value="true">是</option>
                  <option :value="false">否</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">内容<span
                    class="text-error-500">*</span></label>
                <textarea v-model="form.content" rows="3" placeholder="请输入模板内容"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeModal">取消</Button>
                <Button type="submit" :disabled="isLoading">
                  {{ isLoading ? '保存中...' : '保存' }}
                </Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- 删除确认气泡弹窗 -->
      <DeleteConfirmDialog
        :isOpen="showDeleteDialog"
        :title="'删除'"
        :description="'确定要删除吗？此操作不可撤销。'"
        :isLoading="deleteLoading"
        :triggerRect="triggerRect"
        @close="closeDeleteDialog"
        @confirm="confirmDelete"
      />

      <!-- 调试信息 -->
      <div v-if="showDeleteDialog" class="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50">
        弹窗应该显示: {{ showDeleteDialog }}
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getUser } from '@/api/index'
import { getPromptsConfigs, createPromptsConfig, createUserPromptsConfig, updatePromptsConfig, deletePromptsConfig, getPromptsConfig } from '@/api/prompts'
import { toast } from 'vue-sonner'
import { formatTime } from '@/lib/utils'
import {  OPTIONS_TYPE_OPTIONS } from '@/config/platforms'
const currentPageTitle = ref('提示词模板')
const isLoading = ref(false)
const isEditMode = ref(false)
const templates = ref([])
const editingId = ref('')
// 用户下拉选项
const userOptions = ref([])
// 统一的弹窗显示状态
const showModal = ref(false)

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })
// 当前用户信息
const currentUser = ref(null)
const userRole = ref('')
// 分页相关
const page = ref(1)
const pageSize = ref(20) // 默认一页20条
const total = ref(0)
const searchQuery = ref('')
const isSearching = ref(false)

// 获取当前用户信息
function getCurrentUserInfo() {
  try {
    const profileStr = localStorage.getItem('profile')
    const role = localStorage.getItem('role')

    if (profileStr) {
      currentUser.value = JSON.parse(profileStr)
    }
    if (role) {
      userRole.value = role
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

async function fetchUsers() {
  const res = await getUser({})
  const list = (res && res.results) ? res.results : res
  userOptions.value = Array.isArray(list) ? list.map((u) => ({
    id: u.id ?? u.pk ?? u.uuid,
    name: u.username || u.name || u.email || `用户${u.id}`,
  })) : []
}

async function fetchTemplates() {
  try {
    const res = await getPromptsConfigs({
      page: page.value,
    })

    // 处理分页数据
    if (res && res.results) {
      templates.value = Array.isArray(res.results) ? res.results.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.scene || item.type,
        user: item.owner_detail?.username || item.user,
        isActive: item.enabled !== undefined ? item.enabled : item.isActive,
        content: item.content,
        createdAt: item.createdAt || item.created_at,
      })) : []
      total.value = res.count || 0
    }
  } catch (error) {
    console.error('Failed to fetch templates:', error)
    templates.value = []
    total.value = 0
    toast.error('获取模板列表失败', {
      description: error.response?.data?.message || error.message || '获取模板列表时发生错误'
    })
  }
}

// 统一的表单数据结构
const form = ref({
  id: '',
  name: '',
  scene: '',
  owner_id: '',
  enabled: true,
  content: '',
  createdAt: '',
})

// 打开新增弹窗
async function openAdd() {
  isEditMode.value = false
  editingId.value = ''
  resetForm()

  // 如果用户角色为 user，自动设置 owner_id 为当前用户 ID
  if (userRole.value === 'user' && currentUser.value?.id) {
    form.value.owner_id = currentUser.value.id
  }

  // 如果是管理员且用户列表为空，则获取用户列表
  if (userRole.value === 'admin' && userOptions.value.length === 0) {
    await fetchUsers()
  }

  showModal.value = true
}

// 打开编辑弹窗
async function openEdit(item) {
  isEditMode.value = true
  editingId.value = item.id
  showModal.value = true

  // 如果是管理员且用户列表为空，则获取用户列表
  if (userRole.value === 'admin' && userOptions.value.length === 0) {
    await fetchUsers()
  }

  try {
    const detail = await getPromptsConfig(String(item.id))
    form.value = {
      id: detail.id ?? item.id,
      name: detail.name ?? item.name,
      scene: detail.scene ?? item.type,
      owner_id: detail.owner_detail.id,
      enabled: typeof detail.enabled === 'boolean' ? detail.enabled : (typeof detail.isActive === 'boolean' ? detail.isActive : item.isActive),
      content: detail.content ?? item.content,
      createdAt: detail.createdAt ?? detail.created_at ?? item.createdAt,
    }
  } catch (error) {
    console.error('Failed to fetch template detail:', error)
    toast.error('获取模板详情失败', {
      description: error.response?.data?.message || error.message || '获取模板详情时发生错误'
    })
    form.value = {
      id: item.id,
      name: item.name,
      scene: item.type,
      owner_id: item.user,
      enabled: item.isActive,
      content: item.content,
      createdAt: item.createdAt,
    }
  }
}

// 关闭弹窗
function closeModal() {
  showModal.value = false
  isEditMode.value = false
  editingId.value = ''
  resetForm()
}

// 重置表单
function resetForm() {
  form.value = {
    id: '',
    name: '',
    scene: '',
    owner_id: '',
    enabled: true,
    content: '',
    createdAt: '',
  }
}

// 统一的表单提交函数
async function submitForm() {
  // 防止重复提交
  if (isLoading.value) return

  // 表单验证 - 逐个检查并提示具体字段
  if (!form.value.name || form.value.name.trim() === '') {
    toast.error('请填写模板名称', {
      description: '模板名称不能为空'
    })
    return
  }

  // 只有管理员需要验证所属用户字段
  if (userRole.value === 'admin' && (!form.value.owner_id || form.value.owner_id === '')) {
    toast.error('请选择所属用户', {
      description: '所属用户不能为空'
    })
    return
  }

  if (!form.value.content || form.value.content.trim() === '') {
    toast.error('请填写模板内容', {
      description: '模板内容不能为空'
    })
    return
  }

  isLoading.value = true

  try {
    // 准备提交数据
    const submitData = {
      owner_id: form.value.owner_id,
      owner: form.value.owner_id,
      scene: form.value.scene,
      name: form.value.name.trim(),
      content: form.value.content.trim(),
      enabled: form.value.enabled
    }

    // 根据模式调用不同的接口
    if (isEditMode.value) {
      // 编辑模式：调用更新接口
      await updatePromptsConfig(editingId.value, submitData)
      // toast.success('模板更新成功')
    } else {
      // 新增模式：根据用户角色使用不同的创建方法
      if (userRole.value === 'user') {
        await createUserPromptsConfig(submitData)
      } else {
        await createPromptsConfig(submitData)
      }
      // toast.success('模板新增成功')
    }

    // 成功后关闭弹窗并刷新列表
    toast.success(isEditMode.value ? '模板更新成功' : '模板新增成功')
    closeModal()
    await fetchTemplates()

  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '新增失败:', error)
    toast.error(isEditMode.value ? '更新失败' : '新增失败', {
      description: error.response?.data?.message || error.message || (isEditMode.value ? '更新模板时发生错误' : '新增模板时发生错误')
    })
  } finally {
    isLoading.value = false
  }
}



function onDelete(item, event) {
  console.log('onDelete called with:', item, event)
  itemToDelete.value = item

  // 获取触发按钮的位置信息
  const buttonRect = event.target.getBoundingClientRect()
  triggerRect.value = {
    top: buttonRect.top,
    left: buttonRect.left,
    width: buttonRect.width,
    height: buttonRect.height,
    bottom: buttonRect.bottom
  }

  console.log('Setting showDeleteDialog to true, triggerRect:', triggerRect.value)
  showDeleteDialog.value = true
}

// 确认删除
async function confirmDelete() {
  if (!itemToDelete.value) return

  deleteLoading.value = true

  try {
    await deletePromptsConfig(itemToDelete.value.id)
    toast.success('删除成功')
    await fetchTemplates()
    closeDeleteDialog()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除模板时发生错误'
    })
  } finally {
    deleteLoading.value = false
  }
}

// 关闭删除确认弹窗
function closeDeleteDialog() {
  showDeleteDialog.value = false
  itemToDelete.value = null
  deleteLoading.value = false
}


function getTemplateTypeText(type) {
  const taskType = OPTIONS_TYPE_OPTIONS.find(option => option.value === type)
  return taskType ? taskType.label : type
}

// 手动搜索按钮点击
const handleSearchClick = async () => {
  if (isSearching.value) return

  isSearching.value = true
  page.value = 1 // 搜索时重置到第一页
  try {
    await fetchTemplates()
  } catch (error) {
    console.error('搜索失败:', error)
    toast.error('搜索失败', {
      description: error.response?.data?.message || error.message || '搜索模板时发生错误'
    })
  } finally {
    isSearching.value = false
  }
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  page.value = 1 // 重置到第一页
  try {
    fetchTemplates()
  } catch (error) {
    console.error('清除搜索失败:', error)
    toast.error('清除搜索失败', {
      description: error.response?.data?.message || error.message || '清除搜索时发生错误'
    })
  }
}

// 监听分页变化
watch(page, async (newPage) => {
  console.log('Page changed to:', newPage)
  try {
    await fetchTemplates()
  } catch (error) {
    console.error('分页加载失败:', error)
    toast.error('分页加载失败', {
      description: error.response?.data?.message || error.message || '分页加载时发生错误'
    })
  }
})

onMounted(async () => {
  getCurrentUserInfo()

  // 只有管理员才需要获取用户列表
  if (userRole.value === 'admin') {
    await Promise.all([fetchUsers(), fetchTemplates()])
  } else {
    await fetchTemplates()
  }
})
</script>
