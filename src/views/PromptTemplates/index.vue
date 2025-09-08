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
              <TableHead class="whitespace-nowrap">ID</TableHead>
              <TableHead class="whitespace-nowrap">模板名称</TableHead>
              <TableHead class="whitespace-nowrap">模板类型</TableHead>
              <TableHead class="whitespace-nowrap">所属用户</TableHead>
              <TableHead class="whitespace-nowrap">是否激活</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in templates" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ item.id }}</TableCell>
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
      </ComponentCard>

      <Modal v-if="showAdd" :fullScreenBackdrop="true" @close="closeAdd">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">新增提示词模板</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板名称<span class="text-error-500">*</span></label>
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
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">内容<span class="text-error-500">*</span></label>
                <textarea v-model="form.content" rows="3" placeholder="请输入模板内容"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeAdd">取消</Button>
                <Button type="submit">保存</Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <Modal v-if="showEdit" :fullScreenBackdrop="true" @close="closeEdit">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">编辑提示词模板</h3>
            <form @submit.prevent="submitEdit" class="space-y-4">
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
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">内容<span class="text-error-500">*</span></label>
                <textarea v-model="editForm.content" rows="3" placeholder="请输入模板内容"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeEdit">取消</Button>
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
import { ref, onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
const form = ref({
  name: '',
  scene: '',
  owner: '',
  enabled: true,
  content: '',
})
const showEdit = ref(false)
const editForm = ref({
  id: 0,
  name: '',
  scene: '',
  owner: '',
  enabled: true,
  content: '',
  createdAt: '',
})

function openAdd() {
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  form.value = { name: '', scene: '', owner: '', enabled: true, content: '' }
}

async function submitAdd() {
  if (!form.value.owner || !form.value.name || !form.value.content) {
    return
  }
  try {
    const payload = {
      name: form.value.name,
      scene: form.value.scene,
      owner: form.value.owner,
      enabled: !!form.value.enabled,
      content: form.value.content,
    }
    await createPromptsConfig(payload)
    await fetchTemplates() // Refresh the list
    closeAdd()
  } catch (error) {
    console.error('Failed to create template:', error)
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

function closeEdit() {
  showEdit.value = false
  editForm.value = { id: 0, name: '', scene: '', owner: '', enabled: true, content: '', createdAt: '' }
}

async function submitEdit() {
  if (!editForm.value.owner || !editForm.value.name || !editForm.value.content) {
    return
  }
  try {
    const payload = {
      name: editForm.value.name,
      scene: editForm.value.scene,
      owner: editForm.value.owner,
      enabled: !!editForm.value.enabled,
      content: editForm.value.content,
    }
    await updatePromptsConfig(String(editForm.value.id), payload)
    await fetchTemplates() // Refresh the list
    closeEdit()
  } catch (error) {
    console.error('Failed to update template:', error)
  }
}

async function onDelete(item) {
  try {
    await deletePromptsConfig(String(item.id))
    await fetchTemplates() // Refresh the list
  } catch (error) {
    console.error('Failed to delete template:', error)
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


