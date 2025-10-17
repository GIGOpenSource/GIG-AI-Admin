<template>
  <div class="space-y-6">
    <!-- 任务参数部分 -->
    <ComponentCard>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">任务参数</h3>
        <Button variant="outline" @click="$emit('close')"> 返回 </Button>
      </div>

      <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
        <TableHeader>
          <TableRow>
            <TableHead class="whitespace-nowrap">序号</TableHead>
            <TableHead class="whitespace-nowrap">创建用户</TableHead>
            <TableHead class="whitespace-nowrap">类型</TableHead>
            <TableHead class="whitespace-nowrap">平台</TableHead>
            <TableHead class="whitespace-nowrap">语言</TableHead>
            <TableHead class="whitespace-nowrap">文本内容</TableHead>
            <TableHead class="whitespace-nowrap">提及</TableHead>
            <TableHead class="whitespace-nowrap">话题</TableHead>
            <TableHead class="whitespace-nowrap">提示词</TableHead>
            <TableHead class="whitespace-nowrap">备注</TableHead>
            <TableHead class="whitespace-nowrap">创建时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="taskDetail">
            <TableCell class="whitespace-nowrap">1</TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.owner_name || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                  taskDetail.type === 'post'
                    ? 'bg-blue-50 text-blue-600 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30'
                    : taskDetail.type === 'reply_comment'
                      ? 'bg-purple-50 text-purple-600 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/30'
                      : 'bg-orange-50 text-orange-600 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/30',
                ]"
              >
                {{
                  taskDetail.type === 'post'
                    ? '发帖'
                    : taskDetail.type === 'reply_comment'
                      ? '回复评论'
                      : taskDetail.type === 'reply_mention'
                        ? '回复消息'
                        : taskDetail.type
                }}
              </span>
            </TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.provider || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.language || '--' }}</TableCell>
            <TableCell class="max-w-[200px] truncate" :title="taskDetail.text">
              {{ taskDetail.text || '--' }}
            </TableCell>
            <TableCell class="max-w-[150px] truncate" :title="taskDetail.mentions">
              {{ taskDetail.mentions || '--' }}
            </TableCell>
            <TableCell
              class="max-w-[150px] truncate"
              :title="Array.isArray(taskDetail.tags) ? taskDetail.tags.join(', ') : taskDetail.tags"
            >
              {{
                Array.isArray(taskDetail.tags)
                  ? taskDetail.tags.join(', ')
                  : taskDetail.tags || '--'
              }}
            </TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.prompt_name || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.task_remark || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">{{ formatTime(taskDetail.created_at) }}</TableCell>
          </TableRow>
          <TableRow v-else>
            <TableCell :colspan="11" class="py-16 text-center text-gray-400 dark:text-white/40">
              暂无数据
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ComponentCard>

    <!-- 执行日志部分 -->
    <ComponentCard>
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">执行日志</h3>

        <!-- 筛选和统计栏 -->
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="flex items-center justify-between">
            <!-- 左侧筛选器 -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
                  >发布状态</label
                >
                <select
                  v-model="statusFilter"
                  @change="handleFilterChange"
                  class="w-48 h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                >
                  <option value="">请选择发布状态</option>
                  <option value="all">全部</option>
                  <option value="success">成功</option>
                  <option value="failed">失败</option>
                </select>
              </div>
            </div>

            <!-- 右侧统计和按钮 -->
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-4">
                <span class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  成功: {{ executionStats.success }}
                </span>
                <span class="text-sm text-red-600 dark:text-red-400 font-medium">
                  失败: {{ executionStats.failed }}
                </span>
              </div>
              <Button
                size="sm"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                @click="handleRetryClick"
                :disabled="executionStats.failed === 0"
              >
                重新执行失败
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
        <TableHeader>
          <TableRow>
            <TableHead class="whitespace-nowrap">ID</TableHead>
            <TableHead class="whitespace-nowrap">账号ID</TableHead>
            <TableHead class="whitespace-nowrap">发布时间</TableHead>
            <TableHead class="whitespace-nowrap">状态</TableHead>
            <TableHead class="whitespace-nowrap">外部ID</TableHead>
            <TableHead class="whitespace-nowrap">错误信息</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- 加载状态 -->
          <template v-if="loading">
            <TableRow>
              <TableCell :colspan="6" class="py-16 text-center text-gray-400 dark:text-white/40">
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
          <template v-else-if="executionLogs.length">
            <TableRow v-for="log in executionLogs" :key="log.id">
              <TableCell class="whitespace-nowrap font-mono text-sm">{{ log.id }}</TableCell>
              <TableCell class="whitespace-nowrap font-mono text-sm">{{
                log.account || '--'
              }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ formatTime(log.publish_time) }}</TableCell>
              <TableCell class="whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    log.status === 'success'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                  ]"
                >
                  {{
                    log.status === 'success'
                      ? '成功'
                      : log.status === 'failed'
                        ? '失败'
                        : log.status
                  }}
                </span>
              </TableCell>
              <TableCell
                class="whitespace-nowrap font-mono text-sm max-w-[120px] truncate"
                :title="log.external_id"
              >
                {{ log.external_id || '--' }}
              </TableCell>
              <TableCell
                class="max-w-[200px] truncate text-red-600 dark:text-red-400"
                :title="log.error_message"
              >
                {{ log.error_message || '--' }}
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="6" class="py-16 text-center text-gray-400 dark:text-white/40">
                暂无执行日志
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>

      <!-- 分页 -->
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

    <!-- 重试确认弹窗 -->
    <Modal v-if="showRetryConfirm" @close="showRetryConfirm = false">
      <template #body>
        <!-- 遮影背景 -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="showRetryConfirm = false"
        ></div>

        <!-- 弹窗内容 -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 dark:bg-gray-800">
          <div class="p-6">
            <div class="text-center">
              <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                确认重试失败任务?
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
                一键重新发送所有执行失败的机器人任务 (此操作仅能进行一次)
              </p>

              <div class="flex justify-center gap-3">
                <Button
                  @click="confirmRetry"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
                >
                  确认重试
                </Button>
                <Button
                  @click="showRetryConfirm = false"
                  variant="outline"
                  class="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg text-sm font-medium"
                >
                  不重试
                </Button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
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
import { logdetail, postlogdetail } from '@/api/home'
import { toast } from 'vue-sonner'

// 定义事件
defineEmits(['close'])

// 定义属性
interface TaskDetail {
  id: number
  created_at: string
  owner_name: string
  type: 'post' | 'reply_comment' | 'reply_mention'
  provider: string
  text: string | null
  prompt_name: string
  prompt_id: number
  owner_id: number
  account_count: number
  success_count: number
  fail_count: number
  language?: string
  task_remark?: string
  tags?: string[] | string
  mentions?: string
}

interface ExecutionLog {
  id: string
  account?: string
  publish_time: string
  status: 'success' | 'failed'
  external_id?: string
  error_message?: string
}

interface ExecutionStats {
  success: number
  failed: number
}

const props = defineProps<{
  taskDetail: TaskDetail | null
}>()

// 响应式数据
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showRetryConfirm = ref(false)
const loading = ref(false)

// 执行日志数据
const executionLogs = ref<ExecutionLog[]>([])

// 计算执行统计
const executionStats = computed<ExecutionStats>(() => {
  const success = executionLogs.value.filter((log) => log.status === 'success').length
  const failed = executionLogs.value.filter((log) => log.status === 'failed').length
  return { success, failed }
})

// 筛选处理
const handleFilterChange = () => {
  page.value = 1
  fetchExecutionLogs()
}

// 处理重试按钮点击
const handleRetryClick = () => {
  console.log('重试按钮被点击')
  console.log('失败数量:', executionStats.value.failed)
  console.log('当前showRetryConfirm:', showRetryConfirm.value)
  showRetryConfirm.value = true
  console.log('设置后showRetryConfirm:', showRetryConfirm.value)
}

// 获取执行日志
const fetchExecutionLogs = async () => {
  loading.value = true
  try {
    if (!props.taskDetail?.id) {
      executionLogs.value = []
      total.value = 0
      return
    }

    // 构建请求参数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = {
      simpletask_id: props.taskDetail.id,
      currentPage: page.value,
      pageSize: pageSize.value,
    }

    // 添加状态筛选
    if (statusFilter.value && statusFilter.value !== 'all') {
      params.status = statusFilter.value
    }

    // 调用API接口获取执行日志详情
    const res = await logdetail(params)

    // 处理API响应数据
    if (res && res.results) {
      const logs = res.results || []

      // 转换数据格式以匹配组件期望的结构
      executionLogs.value = logs.map((log: Record<string, unknown>) => ({
        id: log.id || '',
        account: log.account || '',
        publish_time: log.created_at || '',
        status: log.success === 'success' ? 'success' : 'failed',
        external_id: log.external_id || '',
        error_message: log.error_message || '',
      }))

      total.value = res.pagination?.total || 0
    } else {
      executionLogs.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取执行日志失败:', error)
    toast.error('获取执行日志失败')

    // 发生错误时清空数据
    executionLogs.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 确认重新执行失败的任务
const confirmRetry = async () => {
  try {
    // 关闭弹窗
    showRetryConfirm.value = false

    // 调用重试接口
    const params = {
      simpletask_id: props.taskDetail?.id,
    }

    const res = await postlogdetail(params)

    if (res.message) {
      toast.success(res.message)
    } else {
      toast.success('已开始重新执行失败的任务')
    }

    // 重新获取执行日志详情
    await fetchExecutionLogs()
  } catch (error) {
    console.error('重新执行失败:', error)
    toast.error('重新执行失败')
  }
}

// 监听分页变化
watch(page, () => {
  fetchExecutionLogs()
})

// 监听任务详情变化
watch(
  () => props.taskDetail,
  (newTaskDetail) => {
    if (newTaskDetail?.id) {
      fetchExecutionLogs()
    }
  },
  { deep: true },
)

// 组件挂载时获取数据
onMounted(() => {
  fetchExecutionLogs()
})
</script>

<style scoped>
/* 自定义样式 */
</style>
