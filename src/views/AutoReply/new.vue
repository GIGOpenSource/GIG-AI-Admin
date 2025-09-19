<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div></div>
          <div class="flex gap-2">
            <Button size="sm" @click="openAdd">新增</Button>
          </div>
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">序号</TableHead>
              <TableHead class="whitespace-nowrap">类型</TableHead>
              <TableHead class="whitespace-nowrap">平台</TableHead>
              <TableHead class="whitespace-nowrap">语言</TableHead>
              <TableHead class="whitespace-nowrap">文本内容</TableHead>
              <TableHead class="whitespace-nowrap">提及</TableHead>
              <TableHead class="whitespace-nowrap">话题</TableHead>
              <!-- <TableHead class="whitespace-nowrap">载荷</TableHead> -->
              <TableHead class="whitespace-nowrap">机器人</TableHead>
              <TableHead class="whitespace-nowrap">提示词</TableHead>
              <TableHead class="whitespace-nowrap">备注</TableHead>
              <!-- <TableHead class="whitespace-nowrap">Twitter回复ID</TableHead>
              <TableHead class="whitespace-nowrap">Facebook页面ID</TableHead>
              <TableHead class="whitespace-nowrap">Facebook评论ID</TableHead> -->
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="tasks.length">
              <TableRow v-for="(task, index) in tasks" :key="task.id">
                <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.type == 'post' ? '发帖' : '回复评论' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.provider || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ langer[task.language] || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.text">{{ task.text || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.mentions">{{ task.mentions || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.tags">{{task.tags.map(item => item).join(',') ||
                  '-' }}</TableCell>
                <!-- <TableCell class="max-w-[200px] truncate" :title="task.payload">{{ task.payload || '-' }}</TableCell> -->
                <TableCell class="max-w-[200px] truncate"
                  :title="task.selected_accounts.map(item => item.name).join(',')">{{task.selected_accounts.map(item =>
                    item.name).join(',') || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.prompt">{{ task.prompt_name || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">
                  <div class="max-w-[200px] truncate" :title="task.task_remark">{{ task.task_remark || '-' }}</div>
                </TableCell>
                <!-- <TableCell class="whitespace-nowrap">{{ task.twitter_reply_to_tweet_id || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.facebook_page_id || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.facebook_comment_id || '-' }}</TableCell> -->
                <TableCell class="whitespace-nowrap">{{ formatTime(task.created_at) }}</TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" @click="btn(task)">
                      立即执行
                    </Button>
                    <Button size="sm" variant="outline" @click="onEdit(task)">编辑</Button>
                    <button
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(task, $event)">
                      删除
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell :colspan="15" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
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

      <!-- 新增/编辑弹窗 -->
      <Modal v-if="showAdd" :fullScreenBackdrop="true" @close="closeAdd">
        <template #body>
          <div class="relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
          <div style="height:30vh"></div>
            <h3 class="mb-4 text-lg font-semibold">{{ isEditMode ? '编辑任务' : '新增任务' }}</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">类型<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.type"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择类型</option>
                    <option value="post">发帖</option>
                    <option value="reply_comment">回复评论</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.provider"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择平台</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">语言<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.language"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择语言</option>
                    <option value="zh">中文</option>
                    <option value="en">英文</option>
                    <option value="ja">日文</option>
                    <option value="ko">韩文</option>
                    <option value="es">西班牙文</option>
                    <option value="fr">法文</option>
                    <option value="de">德文</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">文本内容<span
                      class="text-error-500">*</span></label>
                  <input v-model="form.text" placeholder="请输入文本内容"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></input>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">提及账号<span
                    class="text-error-500">*</span></label>
                <input v-model="form.mentions" type="text" placeholder="多个提及账号使用逗号隔开 如：user1，user2"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">话题<span
                    class="text-error-500">*</span></label>
                <input v-model="form.tags" type="text" placeholder="多个话题使用逗号隔开 如：品牌牛奶，优质水管"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <!-- <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">载荷</label>
                <textarea v-model="form.payload" placeholder="请输入载荷数据（JSON格式）"
                  class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none"></textarea>
              </div> -->

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">机器人<span
                    class="text-error-500">*</span></label>
                <PaginatedTransfer
                  v-model="form.selected_accounts"
                  :fetchApi="fetchBotListPaginated"
                  labelKey="name"
                  valueKey="id"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">提示词</label>
                <select v-model="form.prompt"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="">请选择提示词</option>
                  <option v-for="prompt in promptList" :key="prompt.id" :value="prompt.id">{{ prompt.name }}</option>
                </select>
              </div>

              <!-- Twitter回复ID：仅当 type=reply_comment 且 provider=twitter 时显示 -->
              <div v-if="form.type === 'reply_comment' && form.provider === 'twitter'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Twitter回复ID</label>
                <input v-model="form.twitter_reply_to_tweet_id" type="text" placeholder="请输入Twitter回复ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <!-- Facebook页面ID：仅当 type=post 且 provider=facebook 时显示 -->
              <div v-if="form.type === 'post' && form.provider === 'facebook'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Facebook页面ID</label>
                <input v-model="form.facebook_page_id" type="text" placeholder="请输入Facebook页面ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <!-- Facebook评论ID：仅当 type=reply_comment 且 provider=facebook 时显示 -->
              <div v-if="form.type === 'reply_comment' && form.provider === 'facebook'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Facebook评论ID</label>
                <input v-model="form.facebook_comment_id" type="text" placeholder="请输入Facebook评论ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">备注</label>
                <textarea v-model="form.task_remark" placeholder="请输入备注信息（可选）" rows="3"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none"></textarea>
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
      <DeleteConfirmDialog :isOpen="showDeleteDialog" :title="'删除'" :description="'确定要删除吗？此操作不可撤销。'"
        :isLoading="deleteLoading" :triggerRect="triggerRect" @close="closeDeleteDialog" @confirm="confirmDelete" />

      <!-- 执行任务时的透明蒙层 -->
      <div v-if="executeLoading" class="fixed inset-0 bg-transparent flex items-center justify-center z-50">
        <div class="flex flex-col items-center gap-3">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          <span class="text-blue-600 dark:text-blue-400 font-medium text-sm">任务正在执行，请稍后...</span>
        </div>
      </div>
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
import PaginatedTransfer from '@/components/ui/PaginatedTransfer.vue'
import { getAutoPlay, getAutoPlayDetail, createAutoPlay, updateAutoPlay, deleteAutoPlay, runNow } from '@/api/autoPlay.ts'
import { getUser } from '@/api/index.ts'
import { getTags } from '@/api/tag.ts'
import { getPromptsConfigs } from '@/api/prompts.ts'
import { getPool } from '@/api/pool.ts'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'

const currentPageTitle = ref('任务列表')
const tasks = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const langer = {
  zh: '中文',
  en: '英文',
  ja: '日文',
  ko: '韩文',
  es: '西班牙文',
  fr: '法文',
  de: '德文'
}
// 下拉列表数据
const promptList = ref([])
const botList = ref([])

// 已移除多选下拉框状态，改用分页穿梭框

// 弹窗相关状态
const showAdd = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isLoading = ref(false)

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })

// 立即执行loading状态
const executeLoading = ref(false)
const executingTaskId = ref(null)

// 表单数据
const form = ref({
  type: '',
  provider: '',
  language: '',
  text: '',
  mentions: '',
  tags: '',
  payload: '',
  selected_accounts: [],
  prompt: '',
  twitter_reply_to_tweet_id: '',
  facebook_page_id: '',
  facebook_comment_id: '',
  task_orig_id: '',
  task_remark: ''
})
// 立即执行任务 - 使用btn接口
async function btn(item) {
  // 防止重复执行
  if (executeLoading.value) return

  executeLoading.value = true
  executingTaskId.value = item.id

  try {
    const res = await runNow(String(item.id), {})
    toast.success('任务执行成功', {
      description: `任务已开始执行，成功${res.summary.ok}条，失败${res.summary.error}条`
    })
    fetchlist()
  } catch (error) {
    console.error('Failed to run task:', error)
    toast.error('执行失败', {
      description: error.response?.data?.message || error.message || '执行任务时发生错误'
    })
  } finally {
    executeLoading.value = false
    executingTaskId.value = null
  }
}
// 编辑功能
async function onEdit(task) {
  try {
    // 获取详细信息
    const detailData = await getAutoPlayDetail(task.id)

    // 设置为编辑模式
    isEditMode.value = true
    editingId.value = task.id

    // 处理从后端返回的数据格式
    // 处理 tags：如果是数组，转换为字符串；如果是字符串，直接使用
    let tagsValue = ''
    if (Array.isArray(detailData.tags)) {
      tagsValue = detailData.tags.join(',')
    } else {
      tagsValue = detailData.tags || ''
    }

    // 处理 selected_accounts：确保是数组格式，包含id和name
    let selectedAccountsValue = []
    if (Array.isArray(detailData.selected_accounts)) {
      // 如果是数组格式，确保id是字符串格式
      selectedAccountsValue = detailData.selected_accounts.map(account => ({
        id: String(account.id || account),
        name: account.name || String(account.id || account)
      }))
    } else if (typeof detailData.selected_accounts === 'object' && detailData.selected_accounts !== null) {
      // 如果是对象格式，转换为数组
      selectedAccountsValue = Object.keys(detailData.selected_accounts).map(key => ({
        id: String(key),
        name: detailData.selected_accounts[key] || String(key)
      }))
    } else if (typeof detailData.selected_accounts === 'string') {
      // 如果是字符串格式，分割后转换
      selectedAccountsValue = detailData.selected_accounts.split(',').map(id => ({
        id: String(id.trim()),
        name: String(id.trim())
      }))
    }

    // 填充表单数据
    form.value = {
      type: detailData.type || '',
      provider: detailData.provider || '',
      language: detailData.language || '',
      text: detailData.text || '',
      mentions: detailData.mentions || '',
      tags: tagsValue,
      payload: detailData.payload || '',
      selected_accounts: selectedAccountsValue,
      prompt: detailData.prompt || '',
      twitter_reply_to_tweet_id: detailData.twitter_reply_to_tweet_id || '',
      facebook_page_id: detailData.facebook_page_id || '',
      facebook_comment_id: detailData.facebook_comment_id || '',
      task_remark: detailData.task_remark || ''
    }

    // 打开弹窗
    showAdd.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    toast.error('获取详情失败')
  }
}

// 删除功能
function onDelete(task, event) {
  itemToDelete.value = task

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
    await deleteAutoPlay(itemToDelete.value.id)
    toast.success('删除成功')
    await fetchlist()
    closeDeleteDialog()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除任务时发生错误'
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

// 新增功能
function openAdd() {
  // 重置为新增模式
  isEditMode.value = false
  editingId.value = null
  form.value = {
    type: '',
    provider: '',
    language: '',
    text: '',
    mentions: '',
    tags: '',
    payload: '',
    selected_accounts: [],
    prompt: '',
    twitter_reply_to_tweet_id: '',
    facebook_page_id: '',
    facebook_comment_id: '',
    task_remark: ''
  }
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  isEditMode.value = false
  editingId.value = null
  form.value = {
    type: '',
    provider: '',
    language: '',
    text: '',
    mentions: '',
    tags: '',
    payload: '',
    selected_accounts: [],
    prompt: '',
    twitter_reply_to_tweet_id: '',
    facebook_page_id: '',
    facebook_comment_id: '',
    task_remark: ''
  }
}

// 提交表单
async function submitAdd() {
  // 防止重复提交
  if (isLoading.value) return

  // 表单验证
  if (!form.value.type || form.value.type.trim() === '') {
    toast.error('请选择类型', {
      description: '类型不能为空'
    })
    return
  }

  if (!form.value.provider || form.value.provider.trim() === '') {
    toast.error('请选择平台', {
      description: '平台不能为空'
    })
    return
  }

  if (!form.value.language || form.value.language.trim() === '') {
    toast.error('请选择语言', {
      description: '语言不能为空'
    })
    return
  }

  if (!form.value.text || form.value.text.trim() === '') {
    toast.error('请填写文本内容', {
      description: '文本内容不能为空'
    })
    return
  }

  if (!form.value.selected_accounts || form.value.selected_accounts.length === 0) {
    toast.error('请选择机器人', {
      description: '机器人不能为空'
    })
    return
  }

  isLoading.value = true

  try {
    // 准备提交数据
    // 处理 tags 格式：将字符串转换为数组
    let tagsArray = []
    if (form.value.tags && form.value.tags.trim() !== '') {
      // 如果 tags 是字符串，按逗号分割转换为数组
      tagsArray = form.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    }

    // 处理 selected_accounts 格式：保持数组格式，确保id是字符串
    let selectedAccountsArray = []
    if (Array.isArray(form.value.selected_accounts)) {
      selectedAccountsArray = form.value.selected_accounts.map(account => ({
        id: String(account.id),
        name: account.name || String(account.id)
      }))
    }

    const submitData = {
      type: form.value.type,
      provider: form.value.provider,
      language: form.value.language,
      text: form.value.text.trim(),
      mentions: form.value.mentions || '',
      tags: tagsArray,
      payload: '',
      selected_accounts: selectedAccountsArray,
      prompt: form.value.prompt || '',
      twitter_reply_to_tweet_id: '',
      facebook_page_id: '',
      facebook_comment_id: '',
      task_remark: form.value.task_remark.trim() || ''
    }

    // 根据模式调用不同的接口
    if (isEditMode.value) {
      // 编辑模式：调用更新接口
      await updateAutoPlay(editingId.value, submitData)
      toast.success('任务更新成功')
    } else {
      // 新增模式：调用新增接口
      await createAutoPlay(submitData)
      toast.success('任务新增成功')
    }

    // 成功后关闭弹窗并刷新列表
    closeAdd()
    await fetchlist()

  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '新增失败:', error)
    toast.error(isEditMode.value ? '更新失败' : '新增失败', {
      description: error.response?.data?.message || error.message || (isEditMode.value ? '更新任务时发生错误' : '新增任务时发生错误')
    })
  } finally {
    isLoading.value = false
  }
}

// 获取机器人列表
// 获取机器人列表（分页版本，用于穿梭框，与账号池分页逻辑保持一致）
const fetchBotListPaginated = async (params) => {
  try {
    console.log('=== API调用参数 ===', params)

    const apiParams = {
      page: params.page
      // page_size 不传递，使用后端默认的20条
    }

    // 添加搜索参数（搜索机器人备注）
    if (params.search) {
      apiParams.remark = params.search // 使用remark字段进行搜索
    }

    const res = await getPool(apiParams)
    console.log('=== API返回原始数据 ===', res)

    // 完全在前端进行过滤，不依赖后端API参数
    let filteredResults = res.results || res.data || []
    console.log('=== 过滤前的数据 ===', filteredResults)

    // 排除已选中的项目（用于左侧列表）
    if (params.exclude_ids && params.exclude_ids.length > 0) {
      console.log('=== 排除ID列表 ===', params.exclude_ids)
      filteredResults = filteredResults.filter(item => {
        const shouldExclude = params.exclude_ids.includes(String(item.id))
        console.log(`项目 ${item.id} (${item.name}) 是否排除: ${shouldExclude}`)
        return !shouldExclude
      })
    }

    // 只包含已选中的项目（用于右侧列表）
    if (params.include_ids && params.include_ids.length > 0) {
      console.log('=== 包含ID列表 ===', params.include_ids)
      filteredResults = filteredResults.filter(item => {
        const shouldInclude = params.include_ids.includes(String(item.id))
        console.log(`项目 ${item.id} (${item.name}) 是否包含: ${shouldInclude}`)
        return shouldInclude
      })
    }

    console.log('=== 过滤后的数据 ===', filteredResults)

    return {
      results: filteredResults,
      count: res.count || res.total || 0,
      total: res.count || res.total || 0
    }
  } catch (error) {
    console.error('获取机器人列表失败:', error)
    return {
      results: [],
      count: 0,
      total: 0
    }
  }
}

// 获取提示词列表
const fetchPromptList = async () => {
  try {
    const res = await getPromptsConfigs({ page: 1 })
    promptList.value = res.results || res.data || []
  } catch (error) {
    console.error('获取提示词列表失败:', error)
  }
}

// 获取列表数据
const fetchlist = async () => {
  console.log(111);

  try {
    let res = await getAutoPlay({
      page: page.value,
      page_size: pageSize.value
    })

    tasks.value = res.results || res.data || []
    total.value = res.count || res.total || 0

  } catch (error) {
    console.error('获取列表失败:', error)
    toast.error('获取列表失败', {
      description: error.response?.data?.message || error.message || '获取任务列表时发生错误'
    })
  }
}

// 已移除多选下拉框相关函数，改用分页穿梭框组件

// 监听分页变化
watch(page, (newPage) => {
  console.log('Page changed to:', newPage)
  fetchlist()
})

// 已移除点击外部关闭下拉框的逻辑

onMounted(() => {
  fetchlist()
  fetchPromptList()
})
</script>

<style></style>
