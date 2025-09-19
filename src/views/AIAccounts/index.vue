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
              <TableHead class="whitespace-nowrap">序号</TableHead>
              <TableHead class="whitespace-nowrap">用户名</TableHead>
              <TableHead class="whitespace-nowrap">电子邮件地址</TableHead>
              <TableHead class="whitespace-nowrap">角色</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="accounts.length > 0">
              <TableRow v-for="(acc,index) in accounts" :key="acc.id">
                <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.username }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.email || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.is_superuser ? '超级管理员' : (acc.is_staff ? '管理员' : '用户') }}</TableCell>
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
                    <!-- <Button size="sm" variant="outline" @click="openChangePwd(acc)">修改密码</Button> -->
                    <Button
                      v-if="isAdmin && !acc.is_staff && !acc.is_superuser"
                      size="sm"
                      variant="outline"
                      @click="openResetPassword(acc)"
                    >
                      重置密码
                    </Button>
                    <button
                      v-if="!acc.is_superuser"
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(acc, $event)"
                    >
                      删除
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell :colspan="6" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
        <div class="mt-4" v-if="total > 0">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1">
            <PaginationContent v-slot="{ items }">
              <!-- <PaginationFirst /> -->
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext />
              <!-- <PaginationLast /> -->
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
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">密码<span class="text-error-500">*</span></label>
                  <input v-model="form.password" type="password" required placeholder="输入密码"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">电子邮件地址</label>
                  <input v-model.trim="form.email" type="email" placeholder="name@example.com"
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

      <!-- 修改密码弹窗 -->
      <Modal v-if="showPwdModal" :fullScreenBackdrop="true" @close="closePwdModal">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">修改密码</h3>
            <form @submit.prevent="submitPwd" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">旧密码<span class="text-error-500">*</span></label>
                <input v-model="pwdForm.old_password" type="password" required placeholder="输入旧密码"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">新密码<span class="text-error-500">*</span></label>
                <input v-model="pwdForm.new_password" type="password" required placeholder="输入新密码"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closePwdModal" :disabled="pwdLoading">取消</Button>
                <Button type="submit" :disabled="pwdLoading">
                  <span v-if="pwdLoading" class="mr-2">处理中...</span>
                  确认
                </Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- 重置密码弹窗 -->
      <Modal v-if="showResetPwdModal" :fullScreenBackdrop="true" @close="closeResetPwdModal">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">重置密码</h3>
            <div class="space-y-4">
              <!-- 密码输入表单界面 -->
              <div v-if="!resetSuccess">
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  为用户 <strong>{{ resetPwdForm.username }}</strong> 设置新密码
                </p>
                <form @submit.prevent="submitResetPwd" class="space-y-4">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">新密码<span class="text-error-500">*</span></label>
                    <input
                      v-model="resetPwdForm.password"
                      type="password"
                      required
                      placeholder="输入新密码"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>
                  <div class="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" @click="closeResetPwdModal" :disabled="resetPwdLoading">取消</Button>
                    <Button type="submit" :disabled="resetPwdLoading">
                      <span v-if="resetPwdLoading" class="mr-2">处理中...</span>
                      确认重置
                    </Button>
                  </div>
                </form>
              </div>

              <!-- 重置成功界面 -->
              <div v-else>
                <div class="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                        密码重置成功
                      </h3>
                      <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>用户 <strong>{{ resetPwdForm.username }}</strong> 的新密码已生成</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">新密码</label>
                  <div class="flex items-center gap-2">
                    <input
                      :value="newPassword"
                      type="text"
                      readonly
                      class="flex-1 h-11 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 font-mono dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      @click="copyPassword"
                      class="whitespace-nowrap"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      复制
                    </Button>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    请妥善保存此密码，关闭窗口后将无法再次查看
                  </p>
                </div>

                <div class="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" @click="closeResetPwdModal">关闭</Button>
                </div>
              </div>
            </div>
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import Modal from '@/components/ui/Modal.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { getUser, getUserDetail, deleteUser, createUser, updateUser, changePassword, resetPassword } from '@/api'
import { toast } from "vue-sonner"

const currentPageTitle = ref('AI 用户列表')

// 获取当前用户信息并判断是否为管理员
const userinfo = JSON.parse(localStorage.getItem('profile') || '{}')
const isAdmin = computed(() => userinfo.is_staff && userinfo.is_superuser)

// 列表数据源
const accounts = ref([])

// 分页参数
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

function onEdit(account) {
  openEdit(account)
}

function onDelete(account, event) {
  itemToDelete.value = account

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
    await deleteUser(String(itemToDelete.value.id))
    accounts.value = accounts.value.filter(a => a.id !== itemToDelete.value.id)
    toast.success('用户删除成功')
    closeDeleteDialog()
  } catch (e) {
    console.error('delete failed', e)
    toast.error('删除失败', {
      description: e.response?.data?.message || e.message || '删除用户时发生错误'
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

// 弹窗与表单状态（新增/编辑）
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ id: 0, username: '', email: '', password: '', is_active: true })

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })

// 打开编辑弹窗
function openEdit(acc) {
  isEdit.value = true
  form.value = { id: acc.id, username: acc.username, email: acc.email || '', password: '', is_active: acc.is_active }
  showModal.value = true
}

// 打开新增弹窗
function openCreate() {
  isEdit.value = false
  form.value = { id: 0, username: '', email: '', password: '', is_active: true }
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
        username: form.value.username,
        is_active: form.value.is_active,
        ...(form.value.email ? { email: form.value.email } : {}),
        is_staff: false,
        is_superuser: false,
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
          await getList()
        toast.success('用户更新成功')
      } catch (e) {
        console.error('update failed', e)
        toast.error('更新失败', {
          description: e.response?.data?.message || e.message || '更新用户时发生错误'
        })
        return
      }
    }
  } else {
    if (!form.value.username) {
      toast.error('用户名不能为空', {
        description: '请输入用户名'
      })
      return
    }
    if (!form.value.password) {
      toast.error('密码不能为空', {
        description: '请输入密码'
      })
      return
    }
    try {
      await createUser({
        username: form.value.username,
        email: form.value.email || undefined,
        password: form.value.password,
        is_active: form.value.is_active,
        is_staff: false,
        is_superuser: false,
      })
      toast.success('用户创建成功')
      await getList()
    } catch (e) {
      console.error('create failed', e)
      toast.error('创建失败', {
        description: e.response?.data?.message || e.message || '创建用户时发生错误'
      })
      return
    }
  }
  closeModal()
}

// 获取用户列表
const getList = async () => {
  try {
    const res = await getUser({
      page: page.value,
      page_size: pageSize.value,
    })

    accounts.value = res.results
    total.value = res.count
  } catch (e) {
    console.error('getList failed', e)
    toast.error('获取用户列表失败', {
      description: e.response?.data?.message || e.message || '获取用户列表时发生错误'
    })
  }
}

// 监听页码变化，自动刷新列表
watch(page, () => {
  getList()
})

// 初始化加载列表
onMounted(() => {
  getList()
})

const showPwdModal = ref(false)
const pwdLoading = ref(false)
const pwdForm = ref({ id: 0, old_password: '', new_password: '' })

// 重置密码相关状态
const showResetPwdModal = ref(false)
const resetPwdLoading = ref(false)
const resetPwdForm = ref({ id: 0, username: '', password: '' })
const resetSuccess = ref(false)
const newPassword = ref('')

function openChangePwd(acc) {
  pwdForm.value = { id: acc.id, old_password: '', new_password: '' }
  showPwdModal.value = true
}

function closePwdModal() {
  showPwdModal.value = false
}

async function submitPwd() {
  if (!pwdForm.value.old_password || !pwdForm.value.new_password) return
  pwdLoading.value = true
  try {
    await changePassword({
      old_password: pwdForm.value.old_password,
      new_password: pwdForm.value.new_password,
    })
    toast.success('密码修改成功')
    closePwdModal()
  } catch (e) {
    console.error('change password failed', e)
    toast.error('修改失败', {
      description: e.response?.data?.message || e.message || '修改密码时发生错误'
    })
  } finally {
    pwdLoading.value = false
  }
}

// 重置密码相关函数
function openResetPassword(acc) {
  resetPwdForm.value = { id: acc.id, username: acc.username, password: '' }
  resetSuccess.value = false
  newPassword.value = ''
  showResetPwdModal.value = true
}

function closeResetPwdModal() {
  showResetPwdModal.value = false
  resetPwdForm.value = { id: 0, username: '', password: '' }
  resetSuccess.value = false
  newPassword.value = ''
}

async function submitResetPwd() {
  // 密码验证
  if (!resetPwdForm.value.password) {
    toast.error('密码不能为空', {
      description: '请输入新密码'
    })
    return
  }

  if (resetPwdForm.value.password.length < 6) {
    toast.error('密码长度不足', {
      description: '密码长度至少需要6位'
    })
    return
  }

  resetPwdLoading.value = true
  try {
    // 调用重置密码接口，传递用户输入的密码
    const response = await resetPassword({
      user_id: resetPwdForm.value.id,
      password: resetPwdForm.value.password
    })

    // 显示用户输入的密码
    newPassword.value = resetPwdForm.value.password
    resetSuccess.value = true

    toast.success('密码重置成功')
  } catch (e) {
    console.error('reset password failed', e)
    toast.error('重置失败', {
      description: e.response?.data?.message || e.message || '重置密码时发生错误'
    })
  } finally {
    resetPwdLoading.value = false
  }
}

// 复制密码功能
async function copyPassword() {
  try {
    await navigator.clipboard.writeText(newPassword.value)
    toast.success('密码已复制到剪贴板')
  } catch (err) {
    // 如果clipboard API不可用，使用传统方法
    const textArea = document.createElement('textarea')
    textArea.value = newPassword.value
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      toast.success('密码已复制到剪贴板')
    } catch (fallbackErr) {
      toast.error('复制失败，请手动复制密码')
    }
    document.body.removeChild(textArea)
  }
}
</script>


