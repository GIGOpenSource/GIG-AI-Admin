<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="">
        <div class="mb-4 flex items-center justify-between">
          <div></div>
          <Button size="sm" @click="openCreate">新增</Button>
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">ID</TableHead>
              <TableHead class="whitespace-nowrap">用户名</TableHead>
              <TableHead class="whitespace-nowrap">电子邮件地址</TableHead>
              <TableHead class="whitespace-nowrap">角色</TableHead>
              <TableHead class="whitespace-nowrap">最大爬虫账号数</TableHead>
              <TableHead class="whitespace-nowrap">最大每日任务数</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="acc in accounts" :key="acc.id">
              <TableCell class="whitespace-nowrap">{{ acc.id }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.username }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.email }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.role }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.max_crawler_accounts }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.max_daily_tasks }}</TableCell>
              <TableCell class="whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    acc.is_active
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                  ]"
                >
                  {{ acc.is_active ? '启用' : '停用' }}
                </span>
              </TableCell>
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
      <Modal v-if="showModal" :fullScreenBackdrop="true" @close="closeModal">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">{{ isEdit ? '编辑用户' : '新增用户' }}</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div v-if="!isEdit" class="space-y-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">用户名<span class="text-error-500">*</span></label>
                  <input v-model.trim="form.username" type="text" required placeholder="输入用户名"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">电子邮件地址</label>
                  <input v-model.trim="form.email" type="email" placeholder="name@example.com"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">密码<span class="text-error-500">*</span></label>
                  <input v-model="form.password" type="password" required placeholder="输入密码"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">确认密码<span class="text-error-500">*</span></label>
                  <input v-model="form.password_confirm" type="password" required placeholder="再次输入密码"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
              </div>
              <div v-else class="space-y-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">用户名</label>
                  <input v-model="form.username" type="text" disabled placeholder="用户名不可修改"
                    class="dark:bg-dark-900 h-11 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 opacity-80 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/70" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">电子邮件地址</label>
                  <input v-model.trim="form.email" type="email" placeholder="name@example.com"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">密码</label>
                  <input v-model="form.password" type="password" placeholder="留空则不修改"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">是否启用</label>
                <select v-model="form.is_active"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option :value="true">启用</option>
                  <option :value="false">停用</option>
                </select>
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeModal">取消</Button>
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
import { ref, computed, onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import Modal from '@/components/ui/Modal.vue'
import { getUser, updateUserStatus, deleteUser, createUser, updateUser } from '@/api'


const currentPageTitle = ref('AI 用户列表')

// 列表数据源
const accounts = ref([])

// 分页参数
const page = ref(1)
const pageSize = ref(10)
const total = computed(() => accounts.value.length)

function onEdit(account) {
  openEdit(account)
}

async function onDelete(account) {
  try {
    await deleteUser(String(account.id))
    accounts.value = accounts.value.filter(a => a.id !== account.id)
  } catch (e) {
    console.error('delete failed', e)
  }
}

// 弹窗与表单状态（新增/编辑）
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ id: 0, username: '', email: '', password: '', password_confirm: '', is_active: true })

// 打开编辑弹窗
function openEdit(acc) {
  isEdit.value = true
  form.value = { id: acc.id, username: acc.username, email: acc.email || '', password: '', password_confirm: '', is_active: acc.is_active }
  showModal.value = true
}

// 打开新增弹窗
function openCreate() {
  isEdit.value = false
  form.value = { id: 0, username: '', email: '', password: '', password_confirm: '', is_active: true }
  showModal.value = true
}

// 关闭弹窗
function closeModal() {
  showModal.value = false
}

// 提交新增/编辑
async function submitForm() {
  // 仅允许编辑用户启用状态
  if (isEdit.value) {
    const idx = accounts.value.findIndex(a => a.id === form.value.id)
    if (idx !== -1) {
      const payload = {
        is_active: form.value.is_active,
        ...(form.value.password ? { password: form.value.password } : {}),
        ...(form.value.email ? { email: form.value.email } : {}),
      }
      try {
        // 优先调用通用更新接口
        const updated = await updateUser(String(form.value.id), payload)
        const updatedIsActive = (updated && typeof updated.is_active === 'boolean')
          ? updated.is_active
          : (updated && updated.user && typeof updated.user.is_active === 'boolean')
            ? updated.user.is_active
            : form.value.is_active
        accounts.value[idx] = {
          ...accounts.value[idx],
          is_active: updatedIsActive,
        }
      } catch (e) {
        console.error('update failed', e)
        return
      }
    }
  } else {
    if (!form.value.username) {
      console.error('username required')
      return
    }
    if (form.value.password !== form.value.password_confirm) {
      console.error('password not match')
      return
    }
    try {
      await createUser({
        username: form.value.username,
        email: form.value.email || undefined,
        password: form.value.password,
        password_confirm: form.value.password_confirm,
        is_active: form.value.is_active,
      })
      await getList()
    } catch (e) {
      console.error('create failed', e)
      return
    }
  }
  closeModal()
}

// 获取用户列表
const getList = async ()=>{
  const res = await getUser({
    page: page.value,
    page_size: pageSize.value,
  })
  console.log('res',res);

  accounts.value = res.results
  total.value = res.count
}

// 初始化加载列表
onMounted(()=>{
  getList()
})
</script>


