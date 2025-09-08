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
              <TableHead class="whitespace-nowrap">模板名称</TableHead>
              <TableHead class="whitespace-nowrap">模板类型</TableHead>
              <TableHead class="whitespace-nowrap">所属用户</TableHead>
              <TableHead class="whitespace-nowrap">AI配置</TableHead>
              <!-- <TableHead class="whitespace-nowrap">使用次数</TableHead> -->
              <TableHead class="whitespace-nowrap">是否激活</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item,index ) in templates" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ index + 1}}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.name }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ formdata[item.template_type]  }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.owner }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.ai_config }}</TableCell>
              <!-- <TableCell class="whitespace-nowrap">{{ item.usageCount }}</TableCell> -->
              <TableCell class="whitespace-nowrap">{{ item.is_active ? '是' : '否' }}</TableCell>
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
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            共 {{ total }} 条记录，第 {{ page }} 页
          </div>
          <div class="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              :disabled="!hasPrevious"
              @click="handlePrevious"
            >
              上一页
            </Button>
            <span class="px-3 py-1 text-sm bg-gray-100 rounded-md">
              {{ page }}
            </span>
            <Button
              size="sm"
              variant="outline"
              :disabled="!hasNext"
              @click="handleNext"
            >
              下一页
            </Button>
          </div>
        </div>
      </ComponentCard>

      <Modal v-if="showAdd" :fullScreenBackdrop="true" @close="closeAdd">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">{{ isEditMode ? '编辑提示词模板' : '新增提示词模板' }}</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板名称<span
                    class="text-error-500">*</span></label>
                <input v-model="form.name" type="text" placeholder="如：客服问候模板"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">所属用户<span
                    class="text-error-500">*</span></label>
                <select v-model="form.user"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板类型</label>
                <select v-model="form.template_type"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择模板类型</option>
                  <option value="comment">评论模板</option>

                  <option value="reply">回复模板</option>
                  <option value="post">发帖模板</option>
                  <option value="message">私信模板</option>
                  <option value="analysis">分析模板</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">AI配置</label>
                <input v-model="form.ai_config" type="text" placeholder="如：默认、GPT-4o"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">系统提示词<span
                    class="text-error-500">*</span></label>
                <textarea v-model="form.system_prompt" rows="3" placeholder="请输入系统提示词模板"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">用户提示词模板<span
                    class="text-error-500">*</span></label>
                <textarea v-model="form.user_prompt_template" rows="3" placeholder="请输入用户提示词模板"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="flex items-center gap-3 pt-6">
                  <input id="addActive" v-model="form.is_active" type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  <label for="addActive" class="text-sm font-medium text-gray-700 dark:text-gray-400">是否激活</label>
                </div>
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
import { ref, onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getlist, addlist, detailslist, updatelist, deletelist} from '@/api/promptTemplates.ts'
import { toast } from 'vue-sonner'
import { getUser } from '@/api/index'

const currentPageTitle = ref('提示词模板')
const formdata = {
  comment: '评论模板',
  reply: '回复模板',
  post: '发帖模板',
  message: '私信模板',
  analysis: '分析模板',
}
const templates = ref([])

// 分页相关状态
const page = ref(1)
const pageSize = ref(20) // 默认一页20条
const total = ref(0)
const hasNext = ref(false)
const hasPrevious = ref(false)

// 用户下拉选项
const userOptions = ref([])

async function fetchUsers() {
  try {
    const res = await getUser({})
    const list = (res && res.results) ? res.results : res
    userOptions.value = Array.isArray(list) ? list.map((u) => ({
      id: u.id ?? u.pk ?? u.uuid,
      name: u.username || u.name || u.email || `用户${u.id}`,
    })) : []
  } catch (error) {
    console.error('获取用户列表失败:', error)
    userOptions.value = []
  }
}

async function fetchTemplates() {
  try {
    const res = await getlist({ page: page.value })
    templates.value = res.results || []
    total.value = res.count || 0

    // 设置分页状态
    hasNext.value = res.next !== null
    hasPrevious.value = res.previous !== null

  } catch (error) {
    console.error('获取模板列表失败:', error)
    templates.value = []
    total.value = 0
    hasNext.value = false
    hasPrevious.value = false
  }
}

const showAdd = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isLoading = ref(false)
const form = ref({
  name: '', // 模板名称
  template_type: '',
  system_prompt: '',
  user_prompt_template: '',
  is_active: true,
  user: '',
  ai_config: ''
})

function openAdd() {
  // 重置为新增模式
  isEditMode.value = false
  editingId.value = null

  // 重置表单数据
  form.value = {
    name: '',
    template_type: '',
    system_prompt: '',
    user_prompt_template: '',
    is_active: true,
    user: '',
    ai_config: ''
  }

  // 直接打开弹窗，不需要调用接口
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  isEditMode.value = false
  editingId.value = null
  form.value = {
    name: '',
    template_type: '',
    system_prompt: '',
    user_prompt_template: '',
    is_active: true,
    user: '',
    ai_config: ''
  }
}

async function submitAdd() {


  try {
    // 准备提交数据
    const submitData = {
      name: form.value.name.trim(),
      template_type: form.value.template_type,
      system_prompt: form.value.system_prompt.trim(),
      user_prompt_template: form.value.user_prompt_template.trim(),
      is_active: form.value.is_active,
      // user: form.value.user,
      // ai_config: form.value.ai_config?.trim() || ''
    }

    // 根据模式调用不同的接口
    if (isEditMode.value) {
      // 编辑模式：调用更新接口
      await updatelist(editingId.value, submitData)
      toast.success('模板更新成功')
    } else {
      // 新增模式：调用新增接口
      await addlist(submitData)
      toast.success('模板新增成功')
    }

    // 成功后关闭弹窗并刷新列表
    closeAdd()
    await fetchTemplates()

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

async function openEdit(item) {
  try {
    // 获取详细信息
    const detailData = await detailslist(item.id)

    // 设置为编辑模式
    isEditMode.value = true
    editingId.value = item.id

    // 填充表单数据
    form.value = {
      name: detailData.name || '',
      template_type: detailData.template_type || '',
      system_prompt: detailData.system_prompt || '',
      user_prompt_template: detailData.user_prompt_template || '',
      is_active: detailData.is_active !== undefined ? detailData.is_active : true,
      user: detailData.user || '',
      ai_config: detailData.ai_config || ''
    }

    // 打开弹窗
    showAdd.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    toast.error('获取详情失败')
  }
}


async function onDelete(item) {
  try {
    await deletelist(item.id)
    toast.success('删除成功')
    await fetchTemplates()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败，请重试')
  }
}

// 分页处理函数
const handlePageChange = (newPage) => {
  page.value = newPage
  fetchTemplates()
}

// 上一页
const handlePrevious = () => {
  if (hasPrevious.value && page.value > 1) {
    page.value = page.value - 1
    fetchTemplates()
  }
}

// 下一页
const handleNext = () => {
  if (hasNext.value) {
    page.value = page.value + 1
    fetchTemplates()
  }
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchTemplates()])
})
</script>
