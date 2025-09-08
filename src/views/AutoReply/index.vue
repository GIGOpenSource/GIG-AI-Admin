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
              <TableHead class="whitespace-nowrap">平台</TableHead>
              <TableHead class="whitespace-nowrap">类型</TableHead>
              <TableHead class="whitespace-nowrap">关键词</TableHead>
              <TableHead class="whitespace-nowrap">提示词</TableHead>
              <TableHead class="whitespace-nowrap">循环周期</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in tasks" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ item.id }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.platform }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.type }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.keyword }}</TableCell>
              <TableCell class="max-w-[380px] truncate" :title="item.prompt">{{ item.prompt }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ formatCycle(item) }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.createdAt }}</TableCell>
              <TableCell class="whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    item.status === '启用'
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                  ]"
                >
                  {{ item.status }}
                </span>
              </TableCell>
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

      <Modal v-if="showForm" :fullScreenBackdrop="true" @close="closeForm">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">{{ isEditing ? '编辑任务' : '新增任务' }}</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span class="text-error-500">*</span></label>
                  <select v-model="form.platform"
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
                    <option value="回复评论">回复评论</option>
                    <option value="发帖">发帖</option>
                    <option value="回复消息">回复消息</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="sm:col-span-3">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">关键词<span class="text-error-500">*</span></label>
                  <input v-model="form.keyword" type="text" placeholder="如：下单"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">循环类型<span class="text-error-500">*</span></label>
                  <select v-model="form.cycleType"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="周">周</option>
                    <option value="日">日</option>
                    <option value="时">时</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">循环周期<span class="text-error-500">*</span></label>
                  <input v-model.number="form.cycleValue" type="number" min="1" placeholder="如：1"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">执行时间<span class="text-error-500">*</span></label>
                  <input v-model="form.executeTime" type="time"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">提示词<span class="text-error-500">*</span></label>
                <textarea v-model="form.prompt" rows="3" placeholder="请输入提示词（Prompt）"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">状态</label>
                <select v-model="form.status"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="启用">启用</option>
                  <option value="停用">停用</option>
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
import { ref, computed } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const currentPageTitle = ref('任务列表')

const tasks = ref([
  { id: 1, platform: 'Twitter', type: '回复评论', keyword: '你好', prompt: '友好欢迎语并引导关注店铺。', cycleType: '日', cycleValue: 1, executeTime: '09:00', status: '启用', createdAt: '2024-08-01 10:23' },
  { id: 2, platform: 'Facebook', type: '发帖', keyword: '下单', prompt: '收到关键词后发送下单链接。', cycleType: '周', cycleValue: 1, executeTime: '10:30', status: '停用', createdAt: '2024-08-03 14:05' },
])

const showForm = ref(false)
const editingId = ref(null)
const form = ref({
  platform: 'Twitter',
  type: '回复评论',
  keyword: '',
  prompt: '',
  cycleType: '日',
  cycleValue: 1,
  executeTime: '09:00',
  status: '启用',
})

const isEditing = computed(() => editingId.value !== null)

function openAdd() {
  editingId.value = null
  showForm.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.value = {
    platform: item.platform,
    type: item.type,
    keyword: item.keyword,
    prompt: item.prompt,
    cycleType: item.cycleType,
    cycleValue: item.cycleValue,
    executeTime: item.executeTime,
    status: item.status,
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  form.value = { platform: 'Twitter', type: '回复评论', keyword: '', prompt: '', cycleType: '日', cycleValue: 1, executeTime: '09:00', status: '启用' }
}

function submitForm() {
  if (!form.value.platform || !form.value.type || !form.value.keyword || !form.value.prompt || !form.value.cycleType || !form.value.cycleValue || !form.value.executeTime) {
    return
  }
  if (isEditing.value) {
    const index = tasks.value.findIndex(t => t.id === editingId.value)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        platform: form.value.platform,
        type: form.value.type,
        keyword: form.value.keyword,
        prompt: form.value.prompt,
        cycleType: form.value.cycleType,
        cycleValue: form.value.cycleValue,
        executeTime: form.value.executeTime,
        status: form.value.status,
      }
    }
  } else {
    const nextId = Math.max(0, ...tasks.value.map(r => r.id)) + 1
    const createdAt = formatDateTime(new Date())
    tasks.value.unshift({
      id: nextId,
      platform: form.value.platform,
      type: form.value.type,
      keyword: form.value.keyword,
      prompt: form.value.prompt,
      cycleType: form.value.cycleType,
      cycleValue: form.value.cycleValue,
      executeTime: form.value.executeTime,
      status: form.value.status,
      createdAt,
    })
  }
  closeForm()
}

function onDelete(item) {
  tasks.value = tasks.value.filter(r => r.id !== item.id)
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatCycle(item) {
  if (!item.cycleType || !item.cycleValue || !item.executeTime) return '-'
  return `${item.cycleValue}${item.cycleType} / ${item.executeTime}`
}
</script>


