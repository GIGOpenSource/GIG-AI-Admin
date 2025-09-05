<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard >
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
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const currentPageTitle = ref('AI 用户列表')

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

function onEdit(account) {
  console.log('edit', account)
}

function onDelete(account) {
  console.log('delete', account)
}
</script>


