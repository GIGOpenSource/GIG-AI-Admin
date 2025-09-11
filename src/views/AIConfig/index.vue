<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="请搜索配置名称"
                class="w-80 h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                @keyup.enter="handleSearchClick" />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <Button size="sm" @click="handleSearchClick" :disabled="isSearching">
              <span v-if="isSearching" class="mr-2">搜索中...</span>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              搜索
            </Button>
            <Button size="sm" variant="outline" @click="clearSearch" class="text-gray-500 hover:text-gray-700">
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
              <TableHead class="whitespace-nowrap">配置名称</TableHead>
              <TableHead class="whitespace-nowrap">平台名称</TableHead>
              <TableHead class="whitespace-nowrap">key</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap">优先级</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="accounts.length">
              <TableRow v-for="(acc, index) in accounts" :key="acc.id">
                <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.name }}</TableCell>
                <!--  -->
                <TableCell class="whitespace-nowrap">{{ formdata[acc.provider] }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.api_key_masked }}</TableCell>
                <TableCell class="whitespace-nowrap">

                  <span :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    acc.enabled
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                  ]">
                    {{ acc.enabled ? '正常' : '禁用' }}
                  </span>
                </TableCell>
                <!--{{ item.priority }}  -->
                <TableCell class="whitespace-nowrap">{{ acc.priority }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ formatTime(acc.created_at) }}</TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" @click="onEdit(acc)">编辑</Button>
                    <button
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(acc, $event)"
                    >
                      删除
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell :colspan="7" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
        <div class="mt-4" v-if="total > 0">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1">
            <PaginationContent v-slot="{ items }">
              <!-- <PaginationFirst>首页</PaginationFirst> -->
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext />
              <!-- <PaginationLast>末页</PaginationLast> -->
            </PaginationContent>
          </Pagination>
        </div>
      </ComponentCard>
      <Modal v-if="showAdd" :fullScreenBackdrop="true" @close="closeAdd">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">{{ isEditMode ? '编辑服务配置' : '新增服务配置' }}</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">配置名称<span
                    class="text-error-500">*</span></label>
                <input v-model="form.name" type="text" placeholder="如：OpenAI GPT-4配置"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台名称<span
                    class="text-error-500">*</span></label>
                <select v-model="form.provider"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="">请选择平台</option>
                  <option :value="item.value" v-for="(item, index) in type" :key="index">{{ item.title }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">key<span
                    class="text-error-500">*</span></label>
                <input v-model="form.api_key" type="password" placeholder="请输入key"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模型名称<span
                    class="text-error-500">*</span></label>
                <input v-model="form.model" type="text" placeholder="如：gpt-4、claude-3-sonnet"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">优先级</label>
                <input v-model="form.priority" type="number" placeholder="如：8"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeAdd" :disabled="isLoading">取消</Button>
                <Button type="submit" :disabled="isLoading">
                  <span v-if="isLoading" class="mr-2">处理中...</span>
                  {{ isEditMode ? '更新' : '保存' }}
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

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { getlist, addlist, details, updatelist, deletelist } from '@/api/aiCofig.ts'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'
const currentPageTitle = ref('AI 服务配置')
const accounts = ref([])
const page = ref(1)
const pageSize = ref(20) // 默认一页20条
const total = ref(0)
const searchQuery = ref('')
const searchTimeout = ref(null)
const isSearching = ref(false)
const type = ref([
  {
    title: 'OpenAI',
    value: 'openai'
  },
  {
    title: 'Azure OpenAI',
    value: 'azure'
  }, {
    title: 'Google Gemini',
    value: 'gemini'
  }, {
    title: 'Anthropic',
    value: 'anthropic'
  }, {
    title: 'Custom',
    value: 'custom'
  },{
    title: 'Grok',
    value: 'grok'
  },{
    title: 'Deepseek',
    value: 'deepseek'
  },

])
const formdata = {
  openai: 'OpenAI',
  azure: 'Azure OpenAI',
  gemini: 'Google Gemini',
  anthropic: 'Anthropic Claude',
  together: 'Together Al',
  deepseek: 'Deepseek',
  moonshot: 'Moonshot',
  zhipuai: '智谱AI',
  custom: '自定义OpenAl兼容接口'
}
async function onEdit(account) {
  try {
    // 获取详细信息
    const detailData = await details(account.id)

    // pe
    isEditMode.value = true
    editingId.value = account.id

    // 填充表单数据
    form.value = {
      name: detailData.name || '',
      provider: detailData.provider || '',
      priority: detailData.priority || '',
      api_key: detailData.api_key_masked || '',
      model: detailData.model || ''
    }

    // 打开弹窗
    showAdd.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    toast.error('获取详情失败')
  }
}

function onDelete(account, event) {
  itemToDelete.value = account

  // 获取触发按钮的位置信息
  const buttonRect = event.target.getBoundingClientRect()
  triggerRect.value = {
    top: buttonRect.top,
    left: buttonRect.left,
    width: buttonRect.width,
    height: buttonRect.height,
    bottom: buttonRect.bottom
  }

  showDeleteDialog.value = true
}

// 确认删除
async function confirmDelete() {
  if (!itemToDelete.value) return

  deleteLoading.value = true

  try {
    await deletelist(itemToDelete.value.id)
    toast.success('删除成功')
    await fetchlist()
    closeDeleteDialog()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除配置时发生错误'
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

const showAdd = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isLoading = ref(false)

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })
const form = ref({
  name: '',
  provider: '',
  priority: '',
  api_key: '',
  model: ''
})

function openAdd() {
  // 重置为新增模式
  isEditMode.value = false
  editingId.value = null
  form.value = {
    name: '',
    provider: '',
    priority: '',
    api_key: '',
    model: ''
  }
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  isEditMode.value = false
  editingId.value = null
  form.value = {
    name: '',
    provider: '',
    priority: '',
    api_key: '',
    model: ''
  }
}

async function submitAdd() {
  // 防止重复提交
  if (isLoading.value) return

  // 表单验证 - 逐个检查并提示具体字段
  if (!form.value.name || form.value.name.trim() === '') {
    toast.error('请填写配置名称', {
      description: '配置名称不能为空'
    })
    return
  }

  if (!form.value.provider || form.value.provider === '') {
    toast.error('请选择平台名称', {
      description: '平台名称不能为空'
    })
    return
  }

  if (!form.value.api_key || form.value.api_key.trim() === '') {
    toast.error('请填写API Key', {
      description: 'API Key不能为空'
    })
    return
  }

  if (!form.value.model || form.value.model.trim() === '') {
    toast.error('请填写模型名称', {
      description: '模型名称不能为空'
    })
    return
  }

  isLoading.value = true

  try {
    // 准备提交数据
    const submitData = {
      name: form.value.name.trim(),
      provider: form.value.provider,
      priority: form.value.priority,
      api_key: form.value.api_key.trim(),
      model: form.value.model.trim()
    }

    // 根据模式调用不同的接口
    if (isEditMode.value) {
      // 编辑模式：调用更新接口
      await updatelist(editingId.value, submitData)
      toast.success('配置更新成功')
    } else {
      // 新增模式：调用新增接口
      await addlist(submitData)
      toast.success('配置新增成功')
    }

    // 成功后关闭弹窗并刷新列表
    closeAdd()
    await fetchlist()

  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '新增失败:', error)
    toast.error(isEditMode.value ? '更新失败' : '新增失败', {
      description: error.response?.data?.message || error.message || (isEditMode.value ? '更新配置时发生错误' : '新增配置时发生错误')
    })
  } finally {
    isLoading.value = false
  }
}


// 手动搜索按钮点击
const handleSearchClick = async () => {
  if (isSearching.value) return

  isSearching.value = true
  page.value = 1 // 搜索时重置到第一页
  try {
    await fetchlist()
  } finally {
    isSearching.value = false
  }
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  page.value = 1 // 重置到第一页
  fetchlist()
}


const fetchlist = async () => {
  try {
    let res = await getlist({
      search: searchQuery.value,
      page: page.value
    })

    accounts.value = res.results
    total.value = res.count

  } catch (error) {
    console.error('获取列表失败:', error)
    toast.error('获取列表失败', {
      description: error.response?.data?.message || error.message || '获取配置列表时发生错误'
    })
  }
}

// 监听分页变化
watch(page, (newPage) => {
  console.log('Page changed to:', newPage)
  fetchlist()
})

onMounted(() => {
  fetchlist()
})
</script>

<style></style>
