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
              <TableHead class="whitespace-nowrap">对方账号</TableHead>
              <TableHead class="whitespace-nowrap">AI账号选择</TableHead>
              <TableHead class="whitespace-nowrap">关注执行结果</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="accounts.length">
              <TableRow v-for="(acc, index) in accounts" :key="acc.id">
                <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.external_user_id || '--' }}</TableCell>
                <TableCell class="whitespace-nowrap">
                  <div v-if="acc.runner_accounts && acc.runner_accounts.length > 0" class="flex flex-wrap gap-1">
                    <span v-for="accountId in acc.runner_accounts" :key="accountId"
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
                      {{ getAiAccountName(accountId) }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400">--</span>
                </TableCell>
                <TableCell class="whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    acc.completed == true
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : acc.completed == false
                        ? 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30'
                        : 'bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/30'
                  ]">
                    {{ acc.completed ? '已完成':'未完成' }}
                  </span>
                </TableCell>
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
                <TableCell :colspan="5" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
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
      <!-- 表单弹窗组件 -->
      <FollowForm
        :showModal="showAdd"
        :isEditMode="isEditMode"
        :editData="editData"
        @close="closeAdd"
        @success="handleFormSuccess"
      />

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
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { getFollow, getDetailsFollow,deleteFollow, getBoot } from '@/api/follow.ts'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'
import FollowForm from './form.vue'
const currentPageTitle = ref('关注列表')
const accounts = ref([])
const page = ref(1)
const pageSize = ref(20) // 默认一页20条
const total = ref(0)
const searchQuery = ref('')
const searchTimeout = ref(null)
const isSearching = ref(false)

// AI账号选项
const aiAccountOptions = ref([])

// 获取AI账号名称
function getAiAccountName(accountId) {
  const account = aiAccountOptions.value.find(option => option.id === accountId)
  return account ? account.bot : `账号${accountId}`
}

// 获取关注执行结果文本
function getFollowResultText(result) {
  switch (result) {
    case 'success':
      return '执行成功'
    case 'failed':
      return '执行失败'
    case 'pending':
    default:
      return '未执行'
  }
}

async function onEdit(account) {
  try {
    // 获取详细信息
    const detailData = await getDetailsFollow(account.id)

    isEditMode.value = true
    editingId.value = account.id

    // 设置编辑数据
    editData.value = {
      id: account.id,
      external_user_id: detailData.external_user_id || '',
      runner_accounts: detailData.runner_accounts || []
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
    await deleteFollow(itemToDelete.value.id)
    toast.success('删除成功')
    await fetchAccounts()
    closeDeleteDialog()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除关注列表时发生错误'
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
const editData = ref({})
const isLoading = ref(false)

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })
function openAdd() {
  // 重置为新增模式
  isEditMode.value = false
  editingId.value = null
  editData.value = {}
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  isEditMode.value = false
  editingId.value = null
  editData.value = {}
}

// 表单成功回调
function handleFormSuccess() {
  fetchAccounts() // 刷新列表
  closeAdd()
}


// 手动搜索按钮点击
const handleSearchClick = async () => {
  if (isSearching.value) return

  isSearching.value = true
  page.value = 1 // 搜索时重置到第一页
  try {
    await fetchAccounts()
  } finally {
    isSearching.value = false
  }
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  page.value = 1 // 重置到第一页
  fetchAccounts()
}


const fetchAccounts = async () => {
  try {
    let res = await getFollow({
      // search: searchQuery.value,
      page: page.value
    })

    accounts.value = res.results
    total.value = res.count

  } catch (error) {
    console.error('获取列表失败:', error)
    toast.error('获取列表失败', {
      description: error.response?.data?.message || error.message || '获取关注列表时发生错误'
    })
  }
}

// 获取AI账号列表
const fetchAiAccounts = async () => {
  try {
    const res = await getBoot({})
    aiAccountOptions.value = res
  } catch (error) {
    console.error('获取AI账号失败:', error)
    aiAccountOptions.value = []
  }
}

// 监听分页变化
watch(page, (newPage) => {
  console.log('Page changed to:', newPage)
  fetchAccounts()
})

onMounted(() => {
  fetchAccounts()
  fetchAiAccounts()
})
</script>

<style></style>
