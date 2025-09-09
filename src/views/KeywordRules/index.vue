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
              <TableHead class="whitespace-nowrap">配置名称</TableHead>
              <TableHead class="whitespace-nowrap">目标用户</TableHead>
              <TableHead class="whitespace-nowrap">关键词</TableHead>
              <TableHead class="whitespace-nowrap">匹配模式</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              <template v-if="rules.length">
               <TableRow v-for="item in rules" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ item.id }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.name || '-' }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.owner_detail?.username || '-' }}</TableCell>
              <TableCell class="max-w-[320px] truncate" :title="item.keywords.join(', ')">{{ item.keywords.join(', ') }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ getMatchModeText(item.match_mode) }}</TableCell>
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
              <TableCell class="whitespace-nowrap">{{ formatTime(item.createdAt || item.updatedAt) }}</TableCell>
              <TableCell class="text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" @click="onEdit(item)">编辑</Button>
                    <Button size="sm" variant="outline"
                    :className="'text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30'"
                    @click="onDelete(item)">删除</Button>
                  </div>
              </TableCell>
            </TableRow>

              </template>
               <template v-else>
              <TableRow>
                <TableCell :colspan="7" class="py-16 text-center text-gray-400 dark:text-white/50">暂无数据</TableCell>
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

      <Modal v-if="showAdd" :fullScreenBackdrop="true" @close="closeAdd">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">新增关键词规则</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">配置名称<span class="text-error-500">*</span></label>
                <input v-model="form.name" type="text" placeholder="请输入配置名称"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div v-if="userRole === 'admin'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">目标用户<span class="text-error-500">*</span></label>
                <select v-model="form.owner_id"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span class="text-error-500">*</span></label>
                <select v-model="form.provider"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="ins">Ins</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">关键词（逗号分隔）<span class="text-error-500">*</span></label>
                <input v-model="form.include_keywords" type="text" placeholder="如：差评, 垃圾, 退款"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">匹配模式<span class="text-error-500">*</span></label>
                <select v-model="form.match_mode"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="any">任意匹配</option>
                  <option value="all">匹配全部</option>
                  <option value="regex">正则匹配</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">是否启用</label>
                <select v-model="form.enabled"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option :value="true">启用</option>
                  <option :value="false">停用</option>
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

      <Modal v-if="showEdit" :fullScreenBackdrop="true" @close="closeEdit">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">编辑关键词规则</h3>
            <form @submit.prevent="submitEdit" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">配置名称<span class="text-error-500">*</span></label>
                <input v-model="editForm.name" type="text" placeholder="请输入配置名称"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div v-if="userRole === 'admin'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">目标用户<span class="text-error-500">*</span></label>
                <select v-model="editForm.owner_id"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span class="text-error-500">*</span></label>
                <select v-model="editForm.provider"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="ins">Ins</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">关键词（逗号分隔）<span class="text-error-500">*</span></label>
                <input v-model="editForm.include_keywords" type="text" placeholder="如：差评, 垃圾, 退款"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">匹配模式<span class="text-error-500">*</span></label>
                <select v-model="editForm.match_mode"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="any">任意匹配</option>
                  <option value="all">匹配全部</option>
                  <option value="regex">正则匹配</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">是否启用</label>
                <select v-model="editForm.enabled"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option :value="true">启用</option>
                  <option :value="false">停用</option>
                </select>
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
import { ref, onMounted, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getKeywordsConfigs, getKeywordsConfigsDetail, createKeywordsConfigs, createUserKeywordsConfigs, updateKeywordsConfigs, deleteKeywordsConfigs } from '@/api/keywrods'
import { getUser } from '@/api/index'
import { toast } from "vue-sonner"
import { formatTime } from '@/lib/utils'

const currentPageTitle = ref('关键词规则')

const rules = ref([])
const loading = ref(false)
// 当前用户信息
const currentUser = ref(null)
const userRole = ref('')
// 用户选项
const userOptions = ref([])

// 分页参数
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)


// 获取当前用户信息
function getCurrentUserInfo() {
  try {
    const profileStr = localStorage.getItem('profile')
    const role = localStorage.getItem('role')

    if (profileStr) {
      currentUser.value = JSON.parse(profileStr)
    }
    if (role) {
      userRole.value = role
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 获取用户列表
async function fetchUsers() {
  try {
    const res = await getUser()
    const users = Array.isArray(res) ? res : (res?.results || [])
    userOptions.value = users.map(user => ({
      id: user.id,
      name: user.username || user.name || `用户${user.id}`
    }))
  } catch (error) {
    console.error('获取用户列表失败:', error)
    toast.error('获取用户列表失败', {
      description: error.response?.data?.message || error.message || '获取用户列表时发生错误'
    })
  }
}

function getMatchModeText(matchMode) {
  const modeMap = {
    'any': '任意匹配',
    'all': '匹配全部',
    'regex': '正则匹配'
  }
  return modeMap[matchMode] || '任意匹配'
}


async function fetchRules() {
  try {
    loading.value = true
    const res = await getKeywordsConfigs({
      page: page.value,
      page_size: pageSize.value,
    })
    const payload = (res && res.results) ? res.results : res
    const list = Array.isArray(payload) ? payload : []
    rules.value = list.map((r) => ({
      id: r.id,
      name: r.name || '',
      owner: (r.owner != null) ? r.owner : (r.user_id ?? r.target_user ?? r.user ?? r.userId ?? ''),
      owner_detail: r.owner_detail || null,
      provider: r.provider || r.platform || 'twitter',
      keywords: Array.isArray(r.include_keywords) ? r.include_keywords : (Array.isArray(r.keywords) ? r.keywords : (typeof r.include_keywords === 'string' ? r.include_keywords.split(',').map((s) => s.trim()).filter(Boolean) : (typeof r.keywords === 'string' ? r.keywords.split(',').map((s) => s.trim()).filter(Boolean) : []))),
      match_mode: r.match_mode || 'any',
      createdAt: r.created_at || r.createdAt || r.updated_at || r.updatedAt || '',
      enabled: (typeof r.enabled === 'boolean') ? r.enabled : (r.status ? r.status === '启用' : true),
    }))
    total.value = res.count || 0
  } catch (error) {
    console.error('Failed to fetch rules:', error)
    toast.error('获取关键词规则失败', {
      description: error.response?.data?.message || error.message || '获取关键词规则时发生错误'
    })
    rules.value = []
  } finally {
    loading.value = false
  }
}

// 监听页码变化，自动刷新列表
watch(page, () => {
  fetchRules()
})

onMounted(async () => {
  try {
    getCurrentUserInfo()

    // 只有管理员才需要获取用户列表
    if (userRole.value === 'admin') {
      await Promise.all([fetchUsers(), fetchRules()])
    } else {
      await fetchRules()
    }
  } catch (e) {
    console.error('fetch data failed', e)
  }
})

const showAdd = ref(false)
const form = ref({
  name: '',
  provider: 'twitter',
  owner_id: '',
  include_keywords: '',
  match_mode: 'any',
  enabled: true,
})
const showEdit = ref(false)
const editLoading = ref(false)
const editForm = ref({
  id: 0,
  name: '',
  provider: 'twitter',
  owner_id: '',
  include_keywords: '',
  match_mode: 'any',
  enabled: true,
})

async function openAdd() {
  showAdd.value = true

  // 如果用户角色为 user，自动设置 owner_id 为当前用户 ID
  if (userRole.value === 'user' && currentUser.value?.id) {
    form.value.owner_id = currentUser.value.id
  }

  // 如果是管理员且用户列表为空，则获取用户列表
  if (userRole.value === 'admin' && userOptions.value.length === 0) {
    await fetchUsers()
  }
}

function closeAdd() {
  showAdd.value = false
  form.value = { name: '', provider: 'twitter', owner_id: '', include_keywords: '', match_mode: 'any', enabled: true }
}

async function submitAdd() {
  // 表单验证
  if (!form.value.name) {
    toast.error('配置名称不能为空', {
      description: '请输入配置名称'
    })
    return
  }
  // 只有管理员需要验证目标用户字段
  if (userRole.value === 'admin' && !form.value.owner_id) {
    toast.error('目标用户不能为空', {
      description: '请选择目标用户'
    })
    return
  }
  if (!form.value.include_keywords) {
    toast.error('关键词不能为空', {
      description: '请输入关键词'
    })
    return
  }

  const keywordsArray = form.value.include_keywords.split(',').map(s => s.trim()).filter(Boolean)
  const payload = {
    name: form.value.name,
    owner_id: form.value.owner_id,
    owner: form.value.owner_id,
    provider: form.value.provider,
    include_keywords: keywordsArray,
    match_mode: form.value.match_mode,
    enabled: form.value.enabled,
  }
  try {
    // 根据用户角色使用不同的创建方法
    if (userRole.value === 'user') {
      await createUserKeywordsConfigs(payload)
    } else {
      await createKeywordsConfigs(payload)
    }
    toast.success('关键词规则创建成功')
    await fetchRules()
    closeAdd()
  } catch (e) {
    console.error('create keywords config failed', e)
    toast.error('创建失败', {
      description: e.response?.data?.message || e.message || '创建关键词规则时发生错误'
    })
  }
}

async function onDelete(item) {
  try {
    await deleteKeywordsConfigs(String(item.id))
    toast.success('关键词规则删除成功')
    rules.value = rules.value.filter(r => r.id !== item.id)
  } catch (e) {
    console.error('delete keywords config failed', e)
    toast.error('删除失败', {
      description: e.response?.data?.message || e.message || '删除关键词规则时发生错误'
    })
  }
}

async function onEdit(item) {
  showEdit.value = true
  editLoading.value = true

  // 如果是管理员且用户列表为空，则获取用户列表
  if (userRole.value === 'admin' && userOptions.value.length === 0) {
    await fetchUsers()
  }

  try {
    const detail = await getKeywordsConfigsDetail(String(item.id))
    const r = detail || {}
    const normalized = {
      id: r.id ?? item.id,
      name: r.name ?? item.name ?? '',
      owner_id: (r.owner_id != null) ? r.owner_id : (r.owner != null) ? r.owner : (r.user_id ?? r.target_user ?? r.user ?? r.userId ?? item.owner ?? ''),
      provider: r.provider ?? r.platform ?? item.provider ?? 'twitter',
      include_keywords: Array.isArray(r.include_keywords)
        ? r.include_keywords.join(', ')
        : (Array.isArray(r.keywords)
          ? r.keywords.join(', ')
          : (typeof r.include_keywords === 'string' ? r.include_keywords : (typeof r.keywords === 'string' ? r.keywords : (Array.isArray(item.keywords) ? item.keywords.join(', ') : '')))),
      match_mode: r.match_mode ?? item.match_mode ?? 'any',
      enabled: (typeof r.enabled === 'boolean') ? r.enabled : (r.status ? r.status === '启用' : (item.enabled != null ? item.enabled : true)),
    }
    editForm.value = normalized
  } catch (error) {
    console.error('Failed to fetch rule detail:', error)
    toast.error('获取规则详情失败', {
      description: error.response?.data?.message || error.message || '获取规则详情时发生错误'
    })
  } finally {
    editLoading.value = false
  }
}

function closeEdit() {
  showEdit.value = false
}

async function submitEdit() {
  // 表单验证
  if (!editForm.value.name) {
    toast.error('配置名称不能为空', {
      description: '请输入配置名称'
    })
    return
  }
  // 只有管理员需要验证目标用户字段
  if (userRole.value === 'admin' && !editForm.value.owner_id) {
    toast.error('目标用户不能为空', {
      description: '请选择目标用户'
    })
    return
  }
  if (!editForm.value.include_keywords) {
    toast.error('关键词不能为空', {
      description: '请输入关键词'
    })
    return
  }

  const kw = editForm.value.include_keywords.split(',').map(s => s.trim()).filter(Boolean)
  const payload = {
    name: editForm.value.name,
    owner_id: editForm.value.owner_id,
    owner: editForm.value.owner_id,
    provider: editForm.value.provider,
    include_keywords: kw,
    match_mode: editForm.value.match_mode,
    enabled: editForm.value.enabled,
  }
  try {
    await updateKeywordsConfigs(String(editForm.value.id), payload)
    toast.success('关键词规则更新成功')
    await fetchRules()
    closeEdit()
  } catch (e) {
    console.error('update keywords config failed', e)
    toast.error('更新失败', {
      description: e.response?.data?.message || e.message || '更新关键词规则时发生错误'
    })
  }
}

</script>


