<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard >
        <div class="mb-4 flex items-center justify-between">
          <div></div>
          <Button size="sm" @click="openAdd">新增</Button>
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">ID</TableHead>
              <TableHead class="whitespace-nowrap">平台</TableHead>
              <TableHead class="whitespace-nowrap">用户名</TableHead>
              <TableHead class="whitespace-nowrap">主页地址</TableHead>
              <TableHead class="whitespace-nowrap">对话风格</TableHead>
              <TableHead class="whitespace-nowrap">补充提示词</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="acc in accounts" :key="acc.id">
              <TableCell class="whitespace-nowrap">{{ acc.id }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.platform }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.username }}</TableCell>
              <TableCell class="whitespace-nowrap">
                <a
                  :href="acc.homepage"
                  target="_blank"
                  rel="noopener"
                  class="text-brand-600 hover:underline"
                >
                  {{ acc.homepage }}
                </a>
              </TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.dialogStyle }}</TableCell>
              <TableCell class="max-w-[280px] truncate" :title="acc.extraPrompt">
                {{ acc.extraPrompt }}
              </TableCell>
              <TableCell class="whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    acc.status === '启用'
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                  ]"
                >
                  {{ acc.status }}
                </span>
              </TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.createdAt }}</TableCell>
              <TableCell class="text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="onEdit(acc)">编辑</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    :className="'text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30'"
                    @click="onDelete(acc)"
                  >
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div class="mt-4">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1">
            <PaginationContent v-slot="{ items }">
              <PaginationFirst />
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext />
              <PaginationLast />
            </PaginationContent>
          </Pagination>
        </div>
      </ComponentCard>
      <Modal v-if="showAdd" :fullScreenBackdrop="true" @close="closeAdd">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">新增服务配置</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span class="text-error-500">*</span></label>
                <input v-model="form.platform" type="text" placeholder="如：OpenAI"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">用户名<span class="text-error-500">*</span></label>
                <input v-model="form.username" type="text" placeholder="账号名"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">主页地址</label>
                <input v-model="form.homepage" type="url" placeholder="https://example.com/@user"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">对话风格</label>
                <input v-model="form.dialogStyle" type="text" placeholder="如：专业、简洁"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">补充提示词</label>
                <textarea v-model="form.extraPrompt" rows="3" placeholder="用于补充的提示词"
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
                <Button type="button" variant="outline" @click="closeAdd">取消</Button>
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

const currentPageTitle = ref('AI 服务配置')

const accounts = ref([
  {
    id: 1,
    platform: 'OpenAI',
    username: 'alice',
    homepage: 'https://example.com/@alice',
    dialogStyle: '专业、简洁',
    extraPrompt: '回答前先给要点，最后总结',
    status: '启用',
    createdAt: '2024-08-01 10:23',
  },
  {
    id: 2,
    platform: 'Anthropic',
    username: 'bob',
    homepage: 'https://example.com/@bob',
    dialogStyle: '友好、详细',
    extraPrompt: '举 2 个示例说明',
    status: '停用',
    createdAt: '2024-08-03 14:05',
  },
])

const page = ref(1)
const pageSize = ref(10)
const total = computed(() => accounts.value.length)

function onEdit(account) {
  console.log('edit', account)
}

function onDelete(account) {
  console.log('delete', account)
}

const showAdd = ref(false)
const form = ref({
  platform: '',
  username: '',
  homepage: '',
  dialogStyle: '',
  extraPrompt: '',
  status: '启用',
})

function openAdd() {
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  form.value = {
    platform: '',
    username: '',
    homepage: '',
    dialogStyle: '',
    extraPrompt: '',
    status: '启用',
  }
}

function submitAdd() {
  if (!form.value.platform || !form.value.username) {
    return
  }
  const nextId = Math.max(0, ...accounts.value.map(a => a.id)) + 1
  const createdAt = formatDateTime(new Date())
  accounts.value.unshift({ id: nextId, ...form.value, createdAt })
  closeAdd()
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
</script>


