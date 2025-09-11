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
          <template v-if="tasks.length">
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
              <TableCell class="whitespace-nowrap">{{ formatTime(item.created_at) }}</TableCell>
              <TableCell class="text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="openEdit(item)">编辑</Button>
                  <button
                    class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                    @click="onDelete(item, $event)"
                  >
                    删除
                  </button>
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
              <div v-if="role == 'admin'">
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
                    <option value="">请选择平台</option>
                    <option v-for="option in PLATFORM_OPTIONS" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">类型<span class="text-error-500">*</span></label>
                  <select v-model="form.type"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择类型</option>
                    <option v-for="option in TASK_TYPE_OPTIONS" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getScheduledTasks, createScheduledTask, getScheduledTask, updateScheduledTask, deleteScheduledTask } from '@/api/task'
import { getKeywordsConfigs } from '@/api/keywrods'
import { getPromptsConfigs } from '@/api/prompts'
import { getUser } from '@/api/index'
import { toast } from "vue-sonner"
import { formatTime } from '@/lib/utils'
import { PLATFORM_OPTIONS, TASK_TYPE_OPTIONS } from '@/config/platforms'
const role = localStorage.getItem('role')
const userinfo = JSON.parse(localStorage.getItem('profile'))
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
  owner: role == 'user' ?userinfo.id :'',
  provider: '',
  type: 'reply_message',
  keyword: '',
  prompt: '',
  recurrence_type: 'daily',
  day_of_month: 1,
  time_of_day: '09:00',
  enabled: true,
})

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })

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
    toast.error('获取任务详情失败', {
      description: error.response?.data?.message || error.message || '获取任务详情时发生错误'
    })
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
  form.value = { owner: '', provider: '', type: 'reply_message', keyword: '', prompt: '', recurrence_type: 'daily', day_of_month: 1, time_of_day: '09:00', enabled: true }
}

async function submitForm() {
  // 表单验证
  if (!form.value.owner) {
    toast.error('目标用户不能为空', {
      description: '请选择目标用户'
    })
    return
  }
  if (!form.value.keyword) {
    toast.error('关键词不能为空', {
      description: '请选择关键词'
    })
    return
  }
  if (!form.value.prompt) {
    toast.error('提示词不能为空', {
      description: '请选择提示词'
    })
    return
  }
  if (!form.value.day_of_month) {
    toast.error('循环周期不能为空', {
      description: '请输入循环周期'
    })
    return
  }
  if (!form.value.time_of_day) {
    toast.error('执行时间不能为空', {
      description: '请选择执行时间'
    })
    return
  }

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
      toast.success('任务更新成功')
    } else {
      await createScheduledTask(payload)
      toast.success('任务创建成功')
    }

    await fetchTasks() // Refresh the list
    closeForm()
  } catch (error) {
    console.error('Failed to save task:', error)
    toast.error(isEditing.value ? '更新失败' : '创建失败', {
      description: error.response?.data?.message || error.message || (isEditing.value ? '更新任务时发生错误' : '创建任务时发生错误')
    })
  }
}

function onDelete(item, event) {
  itemToDelete.value = item

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
    await deleteScheduledTask(String(itemToDelete.value.id))
    toast.success('任务删除成功')
    await fetchTasks() // Refresh the list after deletion
    closeDeleteDialog()
  } catch (error) {
    console.error('Failed to delete task:', error)
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


function getRecurrenceTypeText(recurrenceType) {
  const typeMap = {
    'daily': '日',
    'weekly': '周',
    'monthly': '月'
  }
  return typeMap[recurrenceType] || recurrenceType
}

function getTaskTypeText(type) {
  const taskType = TASK_TYPE_OPTIONS.find(option => option.value === type)
  return taskType ? taskType.label : type
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
    toast.error('获取任务列表失败', {
      description: error.response?.data?.message || error.message || '获取任务列表时发生错误'
    })
    tasks.value = []
  }
}

async function fetchUsers() {
  if(role == 'user') return
  try {
    const res = await getUser({})
    const list = (res && res.results) ? res.results : res
    userOptions.value = Array.isArray(list) ? list.map((u) => ({
      id: u.id ?? u.pk ?? u.uuid,
      name: u.username || u.name || u.email || `用户${u.id}`,
    })) : []
  } catch (error) {
    console.error('Failed to fetch users:', error)
    toast.error('获取用户列表失败', {
      description: error.response?.data?.message || error.message || '获取用户列表时发生错误'
    })
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
    toast.error('获取关键词列表失败', {
      description: error.response?.data?.message || error.message || '获取关键词列表时发生错误'
    })
    keywordOptions.value = []
  }
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
    toast.error('获取提示词列表失败', {
      description: error.response?.data?.message || error.message || '获取提示词列表时发生错误'
    })
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


