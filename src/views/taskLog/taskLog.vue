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
          </select>

          <select
            v-model="platformFilter"
            @change="handleFilterChange"
            class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          >
            <option value="">请选择平台</option>
            <option value="x">X</option>
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
            <option value="visual_aesthetics">视觉/身材美学</option>
            <option value="relationship_consulting">情感/关系咨询</option>
            <option value="cryptocurrency">加密货币/交易</option>
            <option value="ai_tools">AI/科技工具分享</option>
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
              <TableHead
                class="whitespace-nowrap text-right sticky right-0 bg-white dark:bg-gray-900 z-10"
                >操作</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="taskLogs.length">
              <TableRow v-for="(log, index) in taskLogs" :key="log.id">
                <TableCell class="whitespace-nowrap">{{
                  (page - 1) * pageSize + index + 1
                }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ formatTime(log.created_at) }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ log.created_by || '--' }}</TableCell>
                <TableCell class="whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                      log.type === 'post'
                        ? 'bg-blue-50 text-blue-600 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30'
                        : 'bg-purple-50 text-purple-600 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/30',
                    ]"
                  >
                    {{ log.type === 'post' ? '发帖' : '回复评论' }}
                  </span>
                </TableCell>
                <TableCell class="whitespace-nowrap">{{ log.platform || '--' }}</TableCell>
                <TableCell class="max-w-[300px] truncate" :title="log.text_content">{{
                  log.text_content || '--'
                }}</TableCell>
                <TableCell class="whitespace-nowrap text-center">{{
                  log.bot_count || 0
                }}</TableCell>
                <TableCell class="whitespace-nowrap text-center">
                  <span
                    class="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    {{ log.success_count || 0 }}
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
                <TableCell :colspan="9" class="py-16 text-center text-gray-400 dark:text-white/40"
                  >暂无数据,请输入正确任务序号或内容!</TableCell
                >
              </TableRow>
            </template>
          </TableBody>
        </Table>

        <div class="mt-4 flex justify-center" v-if="total > 0">
          <div class="flex items-center gap-4">
            <Button
              size="sm"
              variant="outline"
              @click="page > 1 ? page-- : null"
              :disabled="page === 1"
              class="px-4 py-2"
            >
              上一页
            </Button>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >共{{ total }}条 第{{ page }}页</span
            >
            <Button
              size="sm"
              variant="outline"
              @click="page < Math.ceil(total / pageSize) ? page++ : null"
              :disabled="page >= Math.ceil(total / pageSize)"
              class="px-4 py-2"
            >
              下一页
            </Button>
          </div>
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
                    {{ selectedLog?.created_by || '--' }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >类型</label
                  >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ selectedLog?.type === 'post' ? '发帖' : '回复评论' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >平台</label
                  >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ selectedLog?.platform || '--' }}
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
                  {{ selectedLog?.text_content || '--' }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                    >机器人数量</label
                  >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ selectedLog?.bot_count || 0 }}
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
import { toast } from 'vue-sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTime } from '@/lib/utils'

// 类型定义
interface TaskLog {
  id: number
  created_at: string
  created_by: string
  type: 'post' | 'reply_comment'
  platform: string
  language?: string
  text_content: string
  mentions?: string
  topic?: string
  prompt?: string
  remarks?: string
  bot_count: number
  success_count: number
}

interface FilterParams {
  page: number
  page_size: number
  search?: string
  type?: string
  platform?: string
  prompt?: string
  start_date?: string
  end_date?: string
}

const currentPageTitle = ref('任务日志')
const taskLogs = ref<TaskLog[]>([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 筛选条件
const searchText = ref('')
const typeFilter = ref('')
const platformFilter = ref('')
const promptFilter = ref('')
const isFiltering = ref(false)

// 日期范围选择器相关
const showDatePicker = ref(false)
const dateRange = ref({
  start: undefined as any,
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

// 获取任务日志列表
const fetchTaskLogs = async () => {
  try {
    const params: FilterParams = {
      page: page.value,
      page_size: pageSize.value,
    }

    // 添加筛选条件
    if (searchText.value) {
      params.search = searchText.value
    }
    if (typeFilter.value) {
      params.type = typeFilter.value
    }
    if (platformFilter.value) {
      params.platform = platformFilter.value
    }
    if (promptFilter.value) {
      params.prompt = promptFilter.value
    }
    if (dateRange.value.start && dateRange.value.end) {
      params.start_date = formatDate(dateRange.value.start)
      params.end_date = formatDate(dateRange.value.end)
    }

    // 临时使用假数据进行展示
    const mockData: TaskLog[] = [
      {
        id: 1,
        created_at: new Date().toISOString(),
        created_by: 'user1',
        type: 'post',
        platform: 'X',
        language: '日语',
        text_content: 'xx牛奶好喝，营养丰富，推荐给大家！',
        mentions: 'user1,user2,user3',
        topic: '牛奶',
        prompt: '饮品/营养',
        remarks: '备注',
        bot_count: 5,
        success_count: 4,
      },
      {
        id: 2,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        created_by: '测试用户',
        type: 'reply_comment',
        platform: 'Facebook',
        language: '中文',
        text_content:
          '感谢您的关注！关于情感关系咨询，建议您从沟通开始，真诚的对话是维系感情的基础。',
        mentions: 'user4,user5',
        topic: '情感咨询',
        prompt: '情感/关系咨询',
        remarks: '回复评论',
        bot_count: 3,
        success_count: 3,
      },
      {
        id: 3,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        created_by: '运营团队',
        type: 'post',
        platform: 'Instagram',
        text_content:
          '今天的营销活动进展顺利，已成功发布到多个平台。通过AI/科技工具分享，我们帮助更多用户提升工作效率。',
        bot_count: 8,
        success_count: 7,
      },
      {
        id: 4,
        created_at: new Date(Date.now() - 10800000).toISOString(),
        created_by: '市场部',
        type: 'post',
        platform: 'X',
        text_content:
          '加密货币市场分析：BTC突破关键阻力位，建议关注后续走势。投资有风险，请谨慎操作。',
        bot_count: 12,
        success_count: 11,
      },
      {
        id: 5,
        created_at: new Date(Date.now() - 14400000).toISOString(),
        created_by: '客服团队',
        type: 'reply_comment',
        platform: 'Instagram',
        text_content:
          '您好！关于您提到的情感问题，我们建议您先冷静思考，然后与对方进行真诚的沟通。',
        bot_count: 6,
        success_count: 6,
      },
      {
        id: 6,
        created_at: new Date(Date.now() - 18000000).toISOString(),
        created_by: '内容创作者',
        type: 'post',
        platform: 'Facebook',
        text_content:
          '分享最新的AI工具使用技巧，这些工具能够显著提升您的工作效率。包括自动化写作、数据分析等实用功能。',
        bot_count: 15,
        success_count: 14,
      },
      {
        id: 7,
        created_at: new Date(Date.now() - 21600000).toISOString(),
        created_by: '设计师',
        type: 'post',
        platform: 'Instagram',
        text_content:
          '视觉美学设计理念分享：简约而不简单，每个元素都有其存在的意义。今天分享一些设计心得。',
        bot_count: 9,
        success_count: 8,
      },
      {
        id: 8,
        created_at: new Date(Date.now() - 25200000).toISOString(),
        created_by: '财务顾问',
        type: 'reply_comment',
        platform: 'X',
        text_content:
          '关于加密货币投资建议：建议您先了解基础知识，制定合理的投资策略，切勿盲目跟风。',
        bot_count: 4,
        success_count: 4,
      },
      {
        id: 9,
        created_at: new Date(Date.now() - 28800000).toISOString(),
        created_by: '产品经理',
        type: 'post',
        platform: 'Facebook',
        text_content:
          '新产品发布预告：我们将推出全新的AI助手功能，帮助用户更好地管理社交媒体内容。敬请期待！',
        bot_count: 20,
        success_count: 19,
      },
      {
        id: 10,
        created_at: new Date(Date.now() - 32400000).toISOString(),
        created_by: '用户支持',
        type: 'reply_comment',
        platform: 'Instagram',
        text_content:
          '感谢您的反馈！我们会持续改进产品功能，为用户提供更好的体验。如有其他问题，请随时联系。',
        bot_count: 7,
        success_count: 7,
      },
    ]

    // 根据筛选条件过滤数据
    let filteredData = mockData

    if (searchText.value) {
      filteredData = filteredData.filter(
        (item) =>
          item.text_content.toLowerCase().includes(searchText.value.toLowerCase()) ||
          item.created_by.toLowerCase().includes(searchText.value.toLowerCase()),
      )
    }

    if (typeFilter.value) {
      filteredData = filteredData.filter((item) => item.type === typeFilter.value)
    }

    if (platformFilter.value) {
      filteredData = filteredData.filter((item) =>
        item.platform.toLowerCase().includes(platformFilter.value.toLowerCase()),
      )
    }

    if (promptFilter.value) {
      const promptKeywords: Record<string, string> = {
        visual_aesthetics: '视觉',
        relationship_consulting: '情感',
        cryptocurrency: '加密货币',
        ai_tools: 'AI',
      }
      const keyword = promptKeywords[promptFilter.value]
      if (keyword) {
        filteredData = filteredData.filter((item) => item.text_content.includes(keyword))
      }
    }

    // 处理日期范围筛选
    if (dateRange.value.start && dateRange.value.end) {
      const startDateObj = dateRange.value.start as any
      const endDateObj = dateRange.value.end as any
      const startDate = new Date(startDateObj.year, startDateObj.month - 1, startDateObj.day)
      const endDate = new Date(endDateObj.year, endDateObj.month - 1, endDateObj.day)
      endDate.setHours(23, 59, 59, 999) // 设置为当天的结束时间

      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.created_at)
        return itemDate >= startDate && itemDate <= endDate
      })
    }

    taskLogs.value = filteredData.slice(
      (page.value - 1) * pageSize.value,
      page.value * pageSize.value,
    )
    total.value = filteredData.length

    // 正式环境请使用以下代码
    // const res = await getTaskLogs(params)
    // taskLogs.value = res.results || res.data || []
    // total.value = res.count || res.total || 0
  } catch (error: unknown) {
    console.error('获取任务日志失败:', error)
    const errorMessage = error instanceof Error ? error.message : '获取任务日志时发生错误'
    toast.error('获取列表失败', {
      description: errorMessage,
    })
  }
}

// 监听分页变化
watch(page, () => {
  fetchTaskLogs()
})

onMounted(() => {
  fetchTaskLogs()
})
</script>

<style scoped>
/* 自定义样式 */
</style>
