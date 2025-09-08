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
              <TableHead class="whitespace-nowrap">是否激活</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item,index ) in templates" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ index + 1}}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.name }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ getTemplateTypeText(item.type) }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.user }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.isActive ? '是' : '否' }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.createdAt }}</TableCell>
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
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">所属用户<span class="text-error-500">*</span></label>
                <select v-model="form.owner" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板类型</label>
                <select v-model="form.scene"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择模板类型</option>
                  <option value="reply_comment">回复评论</option>
                  <option value="reply_message">回复消息</option>
                  <option value="post">发帖</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">是否激活</label>
                <select v-model="form.enabled"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option :value="true">是</option>
                  <option :value="false">否</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">系统提示词<span
                    class="text-error-500">*</span></label>
                <textarea v-model="form.system_prompt" rows="3" placeholder="请输入系统提示词模板"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板名称<span class="text-error-500">*</span></label>
                <input v-model="editForm.name" type="text" placeholder="如：客服问候模板"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">所属用户<span class="text-error-500">*</span></label>
                <select v-model="editForm.owner" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板类型</label>
                <select v-model="editForm.scene"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择模板类型</option>
                  <option value="reply_comment">回复评论</option>
                  <option value="reply_message">回复消息</option>
                  <option value="post">发帖</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">是否激活</label>
                <select v-model="editForm.enabled"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option :value="true">是</option>
                  <option :value="false">否</option>
                </select>
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
import { getPromptsConfigs, createPromptsConfig, updatePromptsConfig, deletePromptsConfig, getPromptsConfig } from '@/api/prompts'

const currentPageTitle = ref('提示词模板')

const templates = ref([])

// 用户下拉选项
const userOptions = ref([])

async function fetchUsers() {
  const res = await getUser({})
  const list = (res && res.results) ? res.results : res
  userOptions.value = Array.isArray(list) ? list.map((u) => ({
    id: u.id ?? u.pk ?? u.uuid,
    name: u.username || u.name || u.email || `用户${u.id}`,
  })) : []
}

async function fetchTemplates() {
  try {
    const res = await getPromptsConfigs()
    const list = (res && res.results) ? res.results : res
    templates.value = Array.isArray(list) ? list.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.scene || item.type,
      user: item.owner || item.user,
      isActive: item.enabled !== undefined ? item.enabled : item.isActive,
      content: item.content,
      createdAt: item.createdAt || item.created_at,
    })) : []
  } catch (error) {
    console.error('Failed to fetch templates:', error)
    templates.value = []
  }
}

const showAdd = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isLoading = ref(false)
const form = ref({
  name: '',
  scene: '',
  owner: '',
  enabled: true,
  content: '',
})

function openAdd() {
  // 重置为新增模式
  isEditMode.value = false
  editingId.value = null

  // 重置表单数据
  form.value = {
    owner: '',
    scene: '',
    name: '',
    content: '',
    enabled: true
  }

  // 直接打开弹窗，不需要调用接口
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  isEditMode.value = false
  editingId.value = null
  form.value = {
    owner: '',
    scene: '',
    name: '',
    content: '',
    enabled: true
  }
}

async function submitAdd() {
  // 防止重复提交
  if (isLoading.value) return

  // 表单验证
  if (!form.value.owner || !form.value.name || !form.value.content) {
    toast.error('请填写必填字段')
    return
  }

  isLoading.value = true

  try {
    // 准备提交数据
    const submitData = {
      owner: form.value.owner,
      scene: form.value.scene,
      name: form.value.name.trim(),
      content: form.value.content.trim(),
      enabled: form.value.enabled
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
    toast.error(isEditMode.value ? '更新失败，请重试' : '新增失败，请重试')
  } finally {
    isLoading.value = false
  }
}

async function openEdit(item) {
  showEdit.value = true
  try {
    const detail = await getPromptsConfig(String(item.id))
    editForm.value = {
      id: detail.id ?? item.id,
      name: detail.name ?? item.name,
      scene: detail.scene ?? item.type,
      owner: detail.owner ?? item.user,
      enabled: typeof detail.enabled === 'boolean' ? detail.enabled : (typeof detail.isActive === 'boolean' ? detail.isActive : item.isActive),
      content: detail.content ?? item.content,
      createdAt: detail.createdAt ?? detail.created_at ?? item.createdAt,
    }
  } catch (error) {
    console.error('Failed to fetch template detail:', error)
    editForm.value = {
      id: item.id,
      name: item.name,
      scene: item.type,
      owner: item.user,
      enabled: item.isActive,
      content: item.content,
      createdAt: item.createdAt,
    }
  }
}


async function onDelete(item) {
  // 确认删除
  if (!confirm(`确定要删除模板 "${item.name}" 吗？此操作不可撤销。`)) {
    return
  }

  try {
    await deletelist(item.id)
    toast.success('删除成功')
    await fetchTemplates()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败，请重试')
  }
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function getTemplateTypeText(type) {
  const typeMap = {
    'reply_comment': '回复评论',
    'reply_message': '回复消息',
    'post': '发帖'
  }
  return typeMap[type] || type
}

onMounted(() => {
  fetchUsers()
  fetchTemplates()
})
</script>
