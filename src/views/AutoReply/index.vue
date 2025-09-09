<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div></div>
          <Button size="sm" @click="openAdd">新增</Button>
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">序号</TableHead>
              <TableHead class="whitespace-nowrap">平台名称</TableHead>
              <TableHead class="whitespace-nowrap">触发关键词</TableHead>
              <TableHead class="whitespace-nowrap">提示词</TableHead>
              <TableHead class="whitespace-nowrap">任务类型</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap">循环周期</TableHead>
              <TableHead class="whitespace-nowrap">循环类型</TableHead>
              <TableHead class="whitespace-nowrap">执行时间</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, idx) in tasks" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ idx + 1 }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.provider }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.keyword_config_id }}</TableCell>
              <TableCell class="max-w-[380px] truncate" :title="item.prompt_config_id">{{ item.prompt_config_id }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ getTaskTypeText(item.type) }}</TableCell>
              <TableCell class="whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    item.enabled
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                  ]"
                >
                  {{ item.enabled ? '启用' : '停用' }}
                </span>
              </TableCell>
              <TableCell class="whitespace-nowrap">{{ item.day_of_month }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ getRecurrenceTypeText(item.recurrence_type) }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.time_of_day }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.created_at }}</TableCell>
              <TableCell class="text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="openEdit(item)">编辑</Button>
                  <Button size="sm" variant="outline" @click="onDelete(item)">删除</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div class="mt-4" v-if="total > 0">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1">
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

      <Modal v-if="showForm" :fullScreenBackdrop="true" @close="closeForm">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">{{ isEditing ? '编辑任务' : '新增任务' }}</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">目标用户<span class="text-error-500">*</span></label>
                <select v-model="form.owner"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择目标用户</option>
                  <option v-for="user in userOptions" :key="user.id" :value="user.id">{{ user.name }}</option>
                </select>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span class="text-error-500">*</span></label>
                  <select v-model="form.provider"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Ins">Ins</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">类型<span class="text-error-500">*</span></label>
                  <select v-model="form.type"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="reply_comment">回复评论</option>
                    <option value="post">发帖</option>
                    <option value="reply_message">回复消息</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">关键词<span class="text-error-500">*</span></label>
                  <select v-model="form.keyword"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option disabled value="">请选择关键词</option>
                    <option v-for="opt in keywordOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">提示词<span class="text-error-500">*</span></label>
                  <select v-model="form.prompt"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option disabled value="">请选择提示词</option>
                    <option v-for="opt in availablePrompts" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">循环类型<span class="text-error-500">*</span></label>
                  <select v-model="form.recurrence_type"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="daily">日</option>
                    <option value="weekly">周</option>
                    <option value="monthly">月</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">循环周期<span class="text-error-500">*</span></label>
                  <input v-model.number="form.day_of_month" type="number" min="1" placeholder="如：1"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">执行时间<span class="text-error-500">*</span></label>
                  <input v-model="form.time_of_day" type="time"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">状态</label>
                <select v-model="form.enabled"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option :value="true">启用</option>
                  <option :value="false">停用</option>
                </select>
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeForm">取消</Button>
                <Button type="submit">保存</Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getScheduledTasks, createScheduledTask, getScheduledTask, updateScheduledTask, deleteScheduledTask } from '@/api/task'
import { getKeywordsConfigs } from '@/api/keywrods'
import { getPromptsConfigs } from '@/api/prompts'
import { getUser } from '@/api/index'

const currentPageTitle = ref('任务列表')

const tasks = ref([])

// 用户下拉选项
const userOptions = ref([])

// 分页参数
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const showForm = ref(false)
const editingId = ref(null)
const form = ref({
  owner: '',
  provider: 'Twitter',
  type: 'reply_message',
  keyword: '',
  prompt: '',
  recurrence_type: 'daily',
  day_of_month: 1,
  time_of_day: '09:00',
  enabled: true,
})

const isEditing = computed(() => editingId.value !== null)

function openAdd() {
  editingId.value = null
  showForm.value = true
}

async function openEdit(item) {
  editingId.value = item.id
  try {
    const detail = await getScheduledTask(String(item.id))
    form.value = {
      owner: detail.owner ?? item.owner,
      provider: detail.provider ?? item.provider,
      type: detail.type ?? item.type,
      keyword: detail.keyword_config_id ?? item.keyword_config_id,
      prompt: detail.prompt_config_id ?? item.prompt_config_id,
      recurrence_type: detail.recurrence_type ?? item.recurrence_type,
      day_of_month: detail.day_of_month ?? item.day_of_month,
      time_of_day: detail.time_of_day ?? item.time_of_day,
      enabled: typeof detail.enabled === 'boolean' ? detail.enabled : item.enabled,
    }
  } catch (error) {
    console.error('Failed to fetch task detail:', error)
    form.value = {
      owner: item.owner,
      provider: item.provider,
      type: item.type,
      keyword: item.keyword_config_id,
      prompt: item.prompt_config_id,
      recurrence_type: item.recurrence_type,
      day_of_month: item.day_of_month,
      time_of_day: item.time_of_day,
      enabled: item.enabled,
    }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  form.value = { owner: '', provider: 'Twitter', type: 'reply_message', keyword: '', prompt: '', recurrence_type: 'daily', day_of_month: 1, time_of_day: '09:00', enabled: true }
}

async function submitForm() {
  // if (!form.value.owner || !form.value.provider || !form.value.type || !form.value.keyword || !form.value.prompt || !form.value.recurrence_type || !form.value.day_of_month || !form.value.time_of_day) {
  //   return
  // }
  try {
    const payload = {
      owner: form.value.owner,
      provider: form.value.provider,
      type: form.value.type,
      keyword_config_id: form.value.keyword,
      prompt_config_id: form.value.prompt,
      recurrence_type: form.value.recurrence_type,
      day_of_month: form.value.day_of_month,
      time_of_day: form.value.time_of_day,
      enabled: form.value.enabled,
    }

    if (isEditing.value) {
      await updateScheduledTask(String(editingId.value), payload)
    } else {
      await createScheduledTask(payload)
    }

    await fetchTasks() // Refresh the list
    closeForm()
  } catch (error) {
    console.error('Failed to save task:', error)
  }
}

async function onDelete(item) {
  try {
    await deleteScheduledTask(String(item.id))
    await fetchTasks() // Refresh the list after deletion
  } catch (error) {
    console.error('Failed to delete task:', error)
  }
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function getRecurrenceTypeText(recurrenceType) {
  const typeMap = {
    'daily': '日',
    'weekly': '周',
    'monthly': '月'
  }
  return typeMap[recurrenceType] || recurrenceType
}

function getTaskTypeText(type) {
  const typeMap = {
    'reply_comment': '回复评论',
    'post': '发帖',
    'reply_message': '回复消息'
  }
  return typeMap[type] || type
}

// keyword/prompt options and linkage
const keywordOptions = ref([])
const promptOptions = ref([])

const availablePrompts = computed(() => {
  // Return all prompt options from API
  return promptOptions.value
})

async function fetchTasks() {
  try {
    const res = await getScheduledTasks({
      page: page.value,
      page_size: pageSize.value,
    })
    const list = (res && res.results) ? res.results : res
    tasks.value = Array.isArray(list) ? list.map((item) => ({
      id: item.id,
      owner: item.owner,
      provider: item.provider,
      type: item.type,
      keyword_config_id: item.keyword_config_id,
      prompt_config_id: item.prompt_config_id,
      recurrence_type: item.recurrence_type,
      day_of_month: item.day_of_month,
      time_of_day: item.time_of_day,
      enabled: item.enabled,
      created_at: item.created_at,
    })) : []
    total.value = res.count || 0
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    tasks.value = []
  }
}

async function fetchUsers() {
  try {
    const res = await getUser({})
    const list = (res && res.results) ? res.results : res
    userOptions.value = Array.isArray(list) ? list.map((u) => ({
      id: u.id ?? u.pk ?? u.uuid,
      name: u.username || u.name || u.email || `用户${u.id}`,
    })) : []
  } catch (error) {
    console.error('Failed to fetch users:', error)
    userOptions.value = []
  }
}

async function fetchKeywords() {
  try {
    const res = await getKeywordsConfigs()
    const list = (res && res.results) ? res.results : res
    keywordOptions.value = Array.isArray(list) ? list.map((item) =>{
      return {
        id: item.id,
        name: item.name,
        keyword: item.include_keywords
      }
    }
    ).filter(Boolean) : []
  } catch (error) {
    console.error('Failed to fetch keywords:', error)
    keywordOptions.value = []
  }
  console.log(keywordOptions.value);

}

async function fetchPrompts() {
  try {
    const res = await getPromptsConfigs()
    const list = (res && res.results) ? res.results : res
    promptOptions.value = Array.isArray(list) ? list.map((item) => ({
      id: item.id,
      name: item.name,
      content: item.content
    })) : []
  } catch (error) {
    console.error('Failed to fetch prompts:', error)
    promptOptions.value = []
  }
}

// 监听页码变化，自动刷新列表
watch(page, () => {
  fetchTasks()
})

onMounted(async () => {
  await Promise.all([
    fetchTasks(),
    fetchUsers(),
    fetchKeywords(),
    fetchPrompts()
  ])
})


</script>


