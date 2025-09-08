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
              <TableHead class="whitespace-nowrap">AI配置</TableHead>
              <TableHead class="whitespace-nowrap">使用次数</TableHead>
              <TableHead class="whitespace-nowrap">是否激活</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in templates" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ item.id }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.name }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.type }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.user }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.aiConfig }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.usageCount }}</TableCell>
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
                <select v-model="form.user" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板类型</label>
                <select v-model="form.type"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择模板类型</option>
                  <option value="评论模板">评论模板</option>
                  <option value="发帖模板">发帖模板</option>
                  <option value="回复模板">回复模板</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">AI配置</label>
                <input v-model="form.aiConfig" type="text" placeholder="如：默认、GPT-4o"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">使用次数</label>
                  <input v-model.number="form.usageCount" type="number" min="0" placeholder="0"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div class="flex items-center gap-3 pt-6">
                  <input id="addActive" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  <label for="addActive" class="text-sm font-medium text-gray-700 dark:text-gray-400">是否激活</label>
                </div>
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
                <select v-model="editForm.user" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">模板类型</label>
                <select v-model="editForm.type"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择模板类型</option>
                  <option value="评论模板">评论模板</option>
                  <option value="发帖模板">发帖模板</option>
                  <option value="回复模板">回复模板</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">AI配置</label>
                <input v-model="editForm.aiConfig" type="text" placeholder="如：默认、GPT-4o"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">使用次数</label>
                  <input v-model.number="editForm.usageCount" type="number" min="0" placeholder="0"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div class="flex items-center gap-3 pt-6">
                  <input id="editActive" v-model="editForm.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  <label for="editActive" class="text-sm font-medium text-gray-700 dark:text-gray-400">是否激活</label>
                </div>
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

const currentPageTitle = ref('提示词模板')

const templates = ref([
  { id: 1, name: '客服问候模板', type: '问候', user: 'admin', aiConfig: '默认', usageCount: 12, isActive: true, content: '您好，我是客服，很高兴为您服务。', createdAt: '2024-08-01 10:23' },
  { id: 2, name: '售后回访模板', type: '售后', user: 'admin', aiConfig: '默认', usageCount: 5, isActive: false, content: '请问本次服务是否满意？欢迎反馈意见。', createdAt: '2024-08-03 14:05' },
])

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

const showAdd = ref(false)
const form = ref({
  name: '',
  type: '',
  user: '',
  aiConfig: '',
  usageCount: 0,
  isActive: true,
  content: '',
})
const showEdit = ref(false)
const editForm = ref({
  id: 0,
  name: '',
  type: '',
  user: '',
  aiConfig: '',
  usageCount: 0,
  isActive: true,
  content: '',
  createdAt: '',
})

function openAdd() {
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  form.value = { name: '', type: '', user: '', aiConfig: '', usageCount: 0, isActive: true, content: '' }
}

function submitAdd() {
  if (!form.value.user || !form.value.name || !form.value.content) {
    return
  }
  const nextId = Math.max(0, ...templates.value.map(t => t.id)) + 1
  const createdAt = formatDateTime(new Date())
  templates.value.unshift({
    id: nextId,
    name: form.value.name,
    type: form.value.type,
    user: form.value.user,
    aiConfig: form.value.aiConfig,
    usageCount: Number(form.value.usageCount) || 0,
    isActive: !!form.value.isActive,
    content: form.value.content,
    createdAt,
  })
  closeAdd()
}

function openEdit(item) {
  showEdit.value = true
  editForm.value = { ...item }
}

function closeEdit() {
  showEdit.value = false
  editForm.value = { id: 0, name: '', type: '', user: '', aiConfig: '', usageCount: 0, isActive: true, content: '', createdAt: '' }
}

function submitEdit() {
  if (!editForm.value.user || !editForm.value.name || !editForm.value.content) {
    return
  }
  const index = templates.value.findIndex(t => t.id === editForm.value.id)
  if (index !== -1) {
    templates.value.splice(index, 1, { ...editForm.value })
  }
  closeEdit()
}

function onDelete(item) {
  templates.value = templates.value.filter(t => t.id !== item.id)
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

onMounted(() => {
  fetchUsers()
})
</script>


