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
                placeholder="请搜索配置名称"
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
              v-if="searchQuery"
              size="sm"
              variant="outline"
              @click="clearSearch"
              class="text-gray-500 hover:text-gray-700"
            >
              清除
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
            <TableRow v-for="(acc, index) in accounts" :key="acc.id">
              <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.name }}</TableCell>
              <!--  -->
              <TableCell class="whitespace-nowrap">{{ formdata[acc.provider] }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.api_key_masked }}</TableCell>
              <TableCell class="whitespace-nowrap">

               <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    acc.enabled
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                  ]"
                >
                  {{ acc.enabled ?'正常':'禁用'}}
                </span>
              </TableCell>
              <!--{{ item.priority }}  -->
              <TableCell class="whitespace-nowrap">222</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.created_at }}</TableCell>
              <TableCell class="text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="onEdit(acc)">编辑</Button>
                  <Button size="sm" variant="outline"
                    :className="'text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30'"
                    @click="onDelete(acc)">
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            共 {{ total }} 条记录，第 {{ page }} 页
          </div>
          <div class="flex items-center gap-2">
            <Button size="sm" variant="outline" :disabled="!hasPrevious" @click="handlePrevious">
              上一页
            </Button>
            <span class="px-3 py-1 text-sm bg-gray-100 rounded-md">
              {{ page }}
            </span>
            <Button size="sm" variant="outline" :disabled="!hasNext" @click="handleNext">
              下一页
            </Button>
          </div>
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
                <input v-model="form.api_key" type="password" placeholder="sk-..."
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
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted ,nextTick} from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { getlist, addlist, details, updatelist, deletelist } from '@/api/aiCofig.ts'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
const currentPageTitle = ref('AI 服务配置')
const accounts = ref([])
const page = ref(1)
const pageSize = ref(20) // 默认一页20条
const total = ref(0)
const hasNext = ref(false)
const hasPrevious = ref(false)
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
      api_key: detailData.api_key || '',
      model: detailData.model || ''
    }

    // 打开弹窗
    showAdd.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    toast.error('获取详情失败')
  }
}

async function onDelete(account) {
  // 确认删除
  if (!confirm(`确定要删除配置 "${account.name}" 吗？此操作不可撤销。`)) {
    return
  }

  try {
    await deletelist(account.id)
    toast.success('删除成功')
    await fetchlist()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败，请重试')
  }
}

const showAdd = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isLoading = ref(false)
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

  nextTick(() => {
    console.log('DOM更新后打印:', form.value)
  })
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


  try {
    // 准备提交数据
    const submitData = {
      name: form.value.name,
      provider: form.value.provider,
      priority: form.value.priority,
      api_key: form.value.api_key,
      model: form.value.model
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

    // 更详细的错误处理
    let errorMessage = isEditMode.value ? '更新失败' : '新增失败'
    if (error.response?.data?.message) {
      errorMessage += `: ${error.response.data.message}`
    } else if (error.message) {
      errorMessage += `: ${error.message}`
    } else {
      errorMessage += '，请重试'
    }

    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
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

// 分页处理函数
const handlePageChange = (newPage) => {
  page.value = newPage
  fetchlist()
}

// 上一页
const handlePrevious = () => {
  if (hasPrevious.value && page.value > 1) {
    page.value = page.value - 1
    fetchlist()
  }
}

// 下一页
const handleNext = () => {
  if (hasNext.value) {
    page.value = page.value + 1
    fetchlist()
  }
}

const fetchlist = async () => {
  try {
    let res = await getlist({
      search: searchQuery.value,
      page: page.value
    })

    accounts.value = res.results
    total.value = res.count
    // 设置分页状态
    hasNext.value = res.next !== null
    hasPrevious.value = res.previous !== null

  } catch (error) {
    console.error('获取列表失败:', error)
    toast.error('获取列表失败')
  }
}
onMounted(() => {
  fetchlist()
})
</script>
