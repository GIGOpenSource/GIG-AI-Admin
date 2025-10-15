<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- 详情页面 -->
    <div v-if="showDetailPage" class="space-y-5 sm:space-y-6">
      <TaskDetail :taskDetail="selectedLog" @close="closeDetailPage" />
    </div>

    <!-- 列表页面 -->
    <div v-else class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <!-- 搜索框 -->
        <div class="mb-4">
          <div class="relative">
            <input
              v-model="searchText"
              type="text"
              placeholder="请输入文本内容"
              class="w-64 h-10 px-4 pl-10 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              @keyup.enter="handleFilterChange"
            />
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <!-- 筛选条件 -->
        <div class="mb-4 flex items-center gap-3 flex-wrap">
          <select
            v-model="typeFilter"
            @change="handleFilterChange"
            class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          >
            <option value="">请选择类型</option>
            <option value="post">发帖</option>
            <option value="reply_comment">回复评论</option>
            <option value="reply_mention">回复消息</option>
          </select>

          <select
            v-model="platformFilter"
            @change="handleFilterChange"
            class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          >
            <option value="">请选择平台</option>
            <option value="twitter">X</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="threads">Threads</option>
          </select>

          <select
            v-model="promptFilter"
            @change="handleFilterChange"
            class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          >
            <option value="">请选择提示词</option>
            <option v-for="prompt in promptConfigs" :key="prompt.id" :value="prompt.id">
              {{ prompt.name }}
            </option>
          </select>

          <!-- 日期范围选择器 -->
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              @click="openDatePicker"
              class="px-4 py-2 h-10 min-w-[220px] justify-start text-left"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              {{ dateRangeDisplay || '选择日期时间段' }}
            </Button>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center gap-2">
            <Button
              size="sm"
              @click="handleFilterChange"
              :disabled="isFiltering"
              class="bg-blue-600 hover:bg-blue-700"
            >
              <span v-if="isFiltering" class="mr-2">查询中...</span>
              <span v-else>查询</span>
            </Button>
            <Button size="sm" variant="outline" @click="clearSearch"> 重置 </Button>
            <Button
              size="sm"
              @click="refreshData"
              variant="outline"
              class="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              刷新
            </Button>
          </div>
        </div>

        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">序号</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap">创建用户</TableHead>
              <TableHead class="whitespace-nowrap">类型</TableHead>
              <TableHead class="whitespace-nowrap">平台</TableHead>
              <TableHead class="whitespace-nowrap">文本内容</TableHead>
              <TableHead class="whitespace-nowrap">机器人数量</TableHead>
              <TableHead class="whitespace-nowrap">发送成功数</TableHead>
              <TableHead class="whitespace-nowrap">发送失败数</TableHead>
              <TableHead
                class="whitespace-nowrap text-right sticky right-0 bg-white dark:bg-gray-900 z-10"
                >操作</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- 加载状态 -->
            <template v-if="loading">
              <TableRow>
                <TableCell :colspan="10" class="py-16 text-center text-gray-400 dark:text-white/40">
                  <div class="flex items-center justify-center gap-2">
                    <svg
                      class="animate-spin h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    加载中...
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <!-- 数据列表 -->
            <template v-else-if="taskLogs.length">
              <TableRow v-for="(log, index) in taskLogs" :key="log.id">
                <TableCell class="whitespace-nowrap">{{
                  (page - 1) * pageSize + index + 1
                }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ formatTime(log.created_at) }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ log.owner_name || '--' }}</TableCell>
                <TableCell class="whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                      log.type === 'post'
                        ? 'bg-blue-50 text-blue-600 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30'
                        : log.type === 'reply_comment'
                          ? 'bg-purple-50 text-purple-600 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/30'
                          : 'bg-orange-50 text-orange-600 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/30',
                    ]"
                  >
                    {{
                      log.type === 'post'
                        ? '发帖'
                        : log.type === 'reply_comment'
                          ? '回复评论'
                          : log.type === 'reply_mention'
                            ? '回复消息'
                            : log.type
                    }}
                  </span>
                </TableCell>
                <TableCell class="whitespace-nowrap">{{ log.provider || '--' }}</TableCell>
                <TableCell class="max-w-[300px] truncate" :title="log.text">{{
                  log.text || '--'
                }}</TableCell>
                <TableCell class="whitespace-nowrap text-center">{{
                  log.account_count || 0
                }}</TableCell>
                <TableCell class="whitespace-nowrap text-center">
                  <span
                    class="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    {{ log.success_count || 0 }}
                  </span>
                </TableCell>
                <TableCell class="whitespace-nowrap text-center">
                  <span class="inline-flex items-center text-red-600 dark:text-red-400 font-medium">
                    {{ log.fail_count || 0 }}
                  </span>
                </TableCell>
                <TableCell
                  class="text-right whitespace-nowrap sticky right-0 bg-white dark:bg-gray-900 z-10"
                >
                  <div class="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      @click="onViewDetail(log)"
                      class="!text-blue-600 hover:!text-blue-700"
                    >
                      查看详情
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell :colspan="10" class="py-16 text-center text-gray-400 dark:text-white/40"
                  >暂无数据</TableCell
                >
              </TableRow>
            </template>
          </TableBody>
        </Table>

        <div class="mt-4">
          <Pagination
            v-model:page="page"
            :total="total"
            :items-per-page="pageSize"
            :sibling-count="1"
            show-edges
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === page"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </ComponentCard>

      <!-- 查看详情弹窗 -->
      <Modal v-if="showDetailModal" :fullScreenBackdrop="true" @close="closeDetailModal">
        <template #body>
          <div
            class="relative z-10 w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900"
          >
            <h3 class="mb-6 text-lg font-semibold">任务日志详情</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >创建时间</label
                  >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ formatTime(selectedLog?.created_at) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >创建用户</label
                  >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ selectedLog?.owner_name || '--' }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >类型</label
                  >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{
                      selectedLog?.type === 'post'
                        ? '发帖'
                        : selectedLog?.type === 'reply_comment'
                          ? '回复评论'
                          : selectedLog?.type === 'reply_mention'
                            ? '回复消息'
                            : selectedLog?.type
                    }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >平台</label
                  >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ selectedLog?.provider || '--' }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                  >文本内容</label
                >
                <p
                  class="text-sm text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  {{ selectedLog?.text || '--' }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >机器人数量</label
                  >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ selectedLog?.account_count || 0 }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >发送成功数</label
                  >
                  <p class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    {{ selectedLog?.success_count || 0 }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <Button variant="outline" @click="closeDetailModal">关闭</Button>
            </div>
          </div>
        </template>
      </Modal>

      <!-- 日期范围选择器弹窗 -->
      <Modal v-if="showDatePicker" :fullScreenBackdrop="true" @close="closeDatePicker">
        <template #body>
          <div
            class="relative bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto dark:bg-gray-900"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">选择日期时间段</h3>
              <button
                @click="closeDatePicker"
                class="text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- 日期范围选择器 -->
            <div class="mb-6">
              <RangeCalendar
                v-model="dateRange"
                :locale="'zh-CN'"
                class="border border-gray-200 rounded-lg dark:border-gray-700"
              />
            </div>

            <!-- 选中的日期范围显示 -->
            <div class="mb-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                已选择:
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ dateRangeDisplay }}
                </span>
              </p>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end gap-3">
              <Button
                variant="outline"
                class="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                @click="closeDatePicker"
              >
                取消
              </Button>
              <Button
                variant="primary"
                class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white"
                @click="confirmDateRange"
                :disabled="!isDateRangeValid"
              >
                确定
              </Button>
            </div>
          </div>
        </template>
      </Modal>

      <!-- 删除确认气泡弹窗 -->
      <DeleteConfirmDialog
        :isOpen="showDeleteDialog"
        :title="'删除'"
        :description="'确定要删除这条任务日志吗？此操作不可撤销。'"
        :isLoading="deleteLoading"
        :triggerRect="triggerRect"
        @close="closeDeleteDialog"
        @confirm="confirmDelete"
      />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { RangeCalendar } from '@/components/ui/range-calendar'
import TaskDetail from './components/TaskDetail.vue'
import { deleteTaskLog } from '@/api/task'
import { tasklog, promptconfigs } from '@/api/home'
import { toast } from 'vue-sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'

// 类型定义
interface TaskLog {
  id: number
  created_at: string
  owner_name: string
  type: 'post' | 'reply_comment' | 'reply_mention'
  provider: string
  text: string
  prompt_name: string
  prompt_id: number
  owner_id: number
  account_count: number
  success_count: number
  fail_count: number
}

interface FilterParams {
  currentPage: number
  pageSize: number
  search?: string
  type?: string
  provider?: string
  prompt__id?: number
  start_date?: string
  end_date?: string
}

const currentPageTitle = ref('任务日志')
const taskLogs = ref<TaskLog[]>([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const totalPages = ref(0)
const loading = ref(false)

// 提示词配置数据
const promptConfigs = ref<Array<{ id: number; name: string }>>([])

// 筛选条件
const searchText = ref('')
const typeFilter = ref('')
const platformFilter = ref('')
const promptFilter = ref('')
const isFiltering = ref(false)

// 日期范围选择器相关
const showDatePicker = ref(false)
const dateRange = ref({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start: undefined as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  end: undefined as any,
})

// 计算日期范围显示文本
const dateRangeDisplay = computed(() => {
  if (!dateRange.value.start || !dateRange.value.end) {
    return ''
  }

  const startStr = formatDate(dateRange.value.start)
  const endStr = formatDate(dateRange.value.end)
  return `${startStr} 至 ${endStr}`
})

// 检查日期范围是否有效
const isDateRangeValid = computed(() => {
  return dateRange.value.start && dateRange.value.end
})

// 格式化日期
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatDate = (date: any) => {
  if (!date) return ''
  const year = date.year
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 详情弹窗
const showDetailModal = ref(false)
const showDetailPage = ref(false)
const selectedLog = ref<TaskLog | null>(null)

// 删除确认弹窗
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref<TaskLog | null>(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })

// 查看详情
function onViewDetail(log: TaskLog) {
  selectedLog.value = log
  showDetailPage.value = true
}

// 关闭详情弹窗
function closeDetailModal() {
  showDetailModal.value = false
  selectedLog.value = null
}

// 关闭详情页面
function closeDetailPage() {
  showDetailPage.value = false
  selectedLog.value = null
}

// 删除功能（暂时注释掉，因为表格中没有删除按钮）
// function onDelete(log, event) {
//   itemToDelete.value = log

//   // 获取触发按钮的位置信息
//   const buttonRect = event.target.getBoundingClientRect()
//   triggerRect.value = {
//     top: buttonRect.top,
//     left: buttonRect.left,
//     width: buttonRect.width,
//     height: buttonRect.height,
//     bottom: buttonRect.bottom
//   }

//   showDeleteDialog.value = true
// }

// 确认删除
async function confirmDelete() {
  if (!itemToDelete.value) return

  deleteLoading.value = true

  try {
    await deleteTaskLog(itemToDelete.value.id.toString())
    toast.success('删除成功')
    await fetchTaskLogs()
    closeDeleteDialog()
  } catch (error: unknown) {
    console.error('删除失败:', error)
    const errorMessage = error instanceof Error ? error.message : '删除任务日志时发生错误'
    toast.error('删除失败', {
      description: errorMessage,
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

// 筛选处理函数
const handleFilterChange = async () => {
  isFiltering.value = true
  page.value = 1 // 重置到第一页
  try {
    await fetchTaskLogs()
  } finally {
    isFiltering.value = false
  }
}

// 清除搜索
const clearSearch = () => {
  searchText.value = ''
  typeFilter.value = ''
  platformFilter.value = ''
  promptFilter.value = ''
  dateRange.value = {
    start: undefined,
    end: undefined,
  }
  page.value = 1
  fetchTaskLogs()
}

// 刷新数据
const refreshData = () => {
  page.value = 1
  fetchTaskLogs()
}

// 日期选择器相关方法
const openDatePicker = () => {
  showDatePicker.value = true
}

const closeDatePicker = () => {
  showDatePicker.value = false
}

const confirmDateRange = () => {
  if (!isDateRangeValid.value) return

  showDatePicker.value = false
  handleFilterChange()
}

// 获取提示词配置
const fetchPromptConfigs = async () => {
  try {
    const res = await promptconfigs({})
    console.log(res.results, 'res')
    if (res && res.results) {
      promptConfigs.value = res.results
    } else {
      promptConfigs.value = []
    }
    console.log(promptConfigs.value, 'promptConfigs.value')
  } catch (error) {
    console.error('获取提示词配置失败:', error)
    promptConfigs.value = []
  }
}

// 获取任务日志列表
const fetchTaskLogs = async () => {
  loading.value = true
  try {
    const params: FilterParams = {
      currentPage: page.value,
      pageSize: pageSize.value,
    }

    // 添加筛选条件
    if (searchText.value) {
      params.search = searchText.value
    }
    if (typeFilter.value) {
      params.type = typeFilter.value
    }
    if (platformFilter.value) {
      params.provider = platformFilter.value
    }
    if (promptFilter.value) {
      params.prompt__id = parseInt(promptFilter.value)
    }
    if (dateRange.value.start && dateRange.value.end) {
      params.start_date = formatDate(dateRange.value.start)
      params.end_date = formatDate(dateRange.value.end)
    }

    // 调用真实API接口
    const res = await tasklog(params)

    // 处理API响应数据
    if (res && res.results) {
      taskLogs.value = res.results || []
      total.value = res.pagination?.total || 0
      totalPages.value = res.pagination?.total_pages || 0
    } else {
      taskLogs.value = []
      total.value = 0
      totalPages.value = 0
    }
  } catch (error: unknown) {
    console.error('获取任务日志失败:', error)
    const errorMessage = error instanceof Error ? error.message : '获取任务日志时发生错误'
    toast.error('获取列表失败', {
      description: errorMessage,
    })

    // 发生错误时清空数据
    taskLogs.value = []
    total.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

// 监听分页变化
watch(page, () => {
  fetchTaskLogs()
})

onMounted(() => {
  fetchPromptConfigs()
  fetchTaskLogs()
})
</script>

<style scoped>
/* 自定义样式 */
</style>
