<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <select v-model="typeFilter" @change="handleFilterChange"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
              <option value="">请选择类型</option>
              <option value="post">发帖</option>
              <option value="reply_comment">回复评论</option>
            </select>

            <select v-model="platformFilter" @change="handleFilterChange"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
              <option value="">请选择平台</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="threads">Threads</option>
            </select>

            <Button size="sm" @click="handleFilterChange" :disabled="isFiltering">
              <span v-if="isFiltering" class="mr-2">搜索中...</span>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              搜索
            </Button>
            <Button size="sm" variant="outline" @click="clearSearch">
              重置
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
              <TableHead class="whitespace-nowrap text-right sticky right-0 bg-white dark:bg-gray-900 z-10">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="taskLogs.length">
              <TableRow v-for="(log, index) in taskLogs" :key="log.id">
                <TableCell class="whitespace-nowrap">{{ (page - 1) * pageSize + index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ formatTime(log.created_at) }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ log.created_by || '--' }}</TableCell>
                <TableCell class="whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    log.type === 'post'
                      ? 'bg-blue-50 text-blue-600 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30'
                      : 'bg-purple-50 text-purple-600 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/30'
                  ]">
                    {{ log.type === 'post' ? '发帖' : '回复评论' }}
                  </span>
                </TableCell>
                <TableCell class="whitespace-nowrap">{{ log.platform || '--' }}</TableCell>
                <TableCell class="max-w-[300px] truncate" :title="log.text_content">{{ log.text_content || '--' }}</TableCell>
                <TableCell class="whitespace-nowrap text-center">{{ log.bot_count || 0 }}</TableCell>
                <TableCell class="whitespace-nowrap text-center">
                  <span class="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                    {{ log.success_count || 0 }}
                  </span>
                </TableCell>
                <TableCell class="whitespace-nowrap text-center">
                  <span class="inline-flex items-center text-rose-600 dark:text-rose-400 font-medium">
                    {{ log.failed_count || 0 }}
                  </span>
                </TableCell>
                <TableCell class="text-right whitespace-nowrap sticky right-0 bg-white dark:bg-gray-900 z-10">
                  <div class="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" @click="onViewDetail(log)"
                      class="!text-blue-600 hover:!text-blue-700">
                      查看详情
                    </Button>
                    <!-- <button
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(log, $event)">
                      删除
                    </button> -->
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell :colspan="10" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>

        <div class="mt-4" v-if="total > 0">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1" show-edges>
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
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
          <div class="relative z-10 w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-6 text-lg font-semibold">任务日志详情</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">创建时间</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formatTime(selectedLog?.created_at) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">创建用户</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog?.created_by || '--' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">类型</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog?.type === 'post' ? '发帖' : '回复评论' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">平台</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog?.platform || '--' }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">文本内容</label>
                <p class="text-sm text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {{ selectedLog?.text_content || '--' }}
                </p>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">机器人数量</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog?.bot_count || 0 }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">发送成功数</label>
                  <p class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{{ selectedLog?.success_count || 0 }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">发送失败数</label>
                  <p class="text-sm text-rose-600 dark:text-rose-400 font-medium">{{ selectedLog?.failed_count || 0 }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" @click="closeDetailModal">关闭</Button>
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

<script setup>
import { ref, onMounted, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { getTaskLogs, deleteTaskLog } from '@/api/task'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'

const currentPageTitle = ref('任务日志')
const taskLogs = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 筛选条件
const typeFilter = ref('')
const platformFilter = ref('')
const isFiltering = ref(false)

// 详情弹窗
const showDetailModal = ref(false)
const selectedLog = ref(null)

// 删除确认弹窗
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })

// 查看详情
function onViewDetail(log) {
  selectedLog.value = log
  showDetailModal.value = true
}

// 关闭详情弹窗
function closeDetailModal() {
  showDetailModal.value = false
  selectedLog.value = null
}

// 删除功能
function onDelete(log, event) {
  itemToDelete.value = log

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
    await deleteTaskLog(itemToDelete.value.id)
    toast.success('删除成功')
    await fetchTaskLogs()
    closeDeleteDialog()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除任务日志时发生错误'
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
  typeFilter.value = ''
  platformFilter.value = ''
  page.value = 1
  fetchTaskLogs()
}

// 获取任务日志列表
const fetchTaskLogs = async () => {
  try {
    const params = {
      page: page.value,
      page_size: pageSize.value
    }

    // 添加筛选条件
    if (typeFilter.value) {
      params.type = typeFilter.value
    }
    if (platformFilter.value) {
      params.platform = platformFilter.value
    }

    // 临时使用假数据进行展示
    taskLogs.value = [
      {
        id: 1,
        created_at: new Date().toISOString(),
        created_by: '管理员',
        type: 'post',
        platform: 'twitter',
        text_content: '这是一条测试发帖内容，用于展示任务日志的效果。欢迎使用 Pulse AI 系统进行社交媒体管理。',
        bot_count: 5,
        success_count: 4,
        failed_count: 1
      },
      {
        id: 2,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        created_by: '测试用户',
        type: 'reply_comment',
        platform: 'facebook',
        text_content: '这是一条回复评论的测试内容，感谢您的关注和支持！',
        bot_count: 3,
        success_count: 3,
        failed_count: 0
      },
      {
        id: 3,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        created_by: '运营团队',
        type: 'post',
        platform: 'instagram',
        text_content: '今天的营销活动进展顺利，已成功发布到多个平台。',
        bot_count: 8,
        success_count: 7,
        failed_count: 1
      }
    ]
    total.value = 3

    // 正式环境请使用以下代码
    // const res = await getTaskLogs(params)
    // taskLogs.value = res.results || res.data || []
    // total.value = res.count || res.total || 0

  } catch (error) {
    console.error('获取任务日志失败:', error)
    toast.error('获取列表失败', {
      description: error.response?.data?.message || error.message || '获取任务日志时发生错误'
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

