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
            <TableCell class="whitespace-nowrap">{{ taskDetail.created_by || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                  taskDetail.type === 'post'
                    ? 'bg-blue-50 text-blue-600 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30'
                    : 'bg-purple-50 text-purple-600 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/30',
                ]"
              >
                {{ taskDetail.type === 'post' ? '发帖' : '回复评论' }}
              </span>
            </TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.platform || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.language || '--' }}</TableCell>
            <TableCell class="max-w-[200px] truncate" :title="taskDetail.text_content">
              {{ taskDetail.text_content || '--' }}
            </TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.mentions || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.topic || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.prompt || '--' }}</TableCell>
            <TableCell class="whitespace-nowrap">{{ taskDetail.remarks || '--' }}</TableCell>
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
                <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  成功: {{ executionStats.success }}
                </span>
                <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">
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
            <TableHead class="whitespace-nowrap">发布时间</TableHead>
            <TableHead class="whitespace-nowrap">状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="executionLogs.length">
            <TableRow v-for="log in executionLogs" :key="log.id">
              <TableCell class="whitespace-nowrap font-mono text-sm">{{ log.id }}</TableCell>
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
                  <span v-if="log.error_message" class="ml-1">{{ log.error_message }}</span>
                </span>
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="3" class="py-16 text-center text-gray-400 dark:text-white/40">
                暂无执行日志
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>

      <!-- 分页 -->
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
          <span class="text-sm text-gray-600 dark:text-gray-400">
            共{{ total }}条 第{{ page }}页
          </span>
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
import { formatTime } from '@/lib/utils'
import { toast } from 'vue-sonner'

// 定义事件
defineEmits(['close'])

// 定义属性
interface TaskDetail {
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
}

interface ExecutionLog {
  id: string
  publish_time: string
  status: 'success' | 'failed'
  error_message?: string
}

interface ExecutionStats {
  success: number
  failed: number
}

defineProps<{
  taskDetail: TaskDetail | null
}>()

// 响应式数据
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showRetryConfirm = ref(false)

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
  try {
    // 模拟数据 - 简化数据用于测试
    const mockLogs: ExecutionLog[] = [
      {
        id: '31231242442525155344',
        publish_time: new Date().toISOString(),
        status: 'success',
      },
      {
        id: '31231242442525155345',
        publish_time: new Date(Date.now() - 3600000).toISOString(),
        status: 'success',
      },
      {
        id: '31231242442525155346',
        publish_time: new Date(Date.now() - 7200000).toISOString(),
        status: 'failed',
        error_message: '网络错误',
      },
    ]

    // 应用筛选
    let filteredLogs = mockLogs

    if (statusFilter.value && statusFilter.value !== 'all') {
      filteredLogs = filteredLogs.filter((log) => log.status === statusFilter.value)
    }

    // 分页
    const startIndex = (page.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value

    executionLogs.value = filteredLogs.slice(startIndex, endIndex)
    total.value = filteredLogs.length
  } catch (error) {
    console.error('获取执行日志失败:', error)
    toast.error('获取执行日志失败')
  }
}

// 确认重新执行失败的任务
const confirmRetry = async () => {
  try {
    // 关闭弹窗
    showRetryConfirm.value = false

    // 这里应该调用重新执行的API
    toast.success('已开始重新执行失败的任务')
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

// 组件挂载时获取数据
onMounted(() => {
  fetchExecutionLogs()
})
</script>

<style scoped>
/* 自定义样式 */
</style>
