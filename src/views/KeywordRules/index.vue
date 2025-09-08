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
              <TableHead class="whitespace-nowrap">目标用户</TableHead>
              <TableHead class="whitespace-nowrap">关键词</TableHead>
              <TableHead class="whitespace-nowrap">匹配模式</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in rules" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ item.id }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ getUserName(item.owner) }}</TableCell>
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
              <TableCell class="whitespace-nowrap">{{ item.createdAt || item.updatedAt }}</TableCell>
              <TableCell class="text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" @click="onEdit(item)">编辑</Button>
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
            <h3 class="mb-4 text-lg font-semibold">新增关键词规则</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">目标用户<span class="text-error-500">*</span></label>
                <select v-model="form.owner"
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
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">目标用户<span class="text-error-500">*</span></label>
                <select v-model="editForm.owner"
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
import { ref, onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getKeywordsConfigs, getKeywordsConfigsDetail, createKeywordsConfigs, updateKeywordsConfigs, deleteKeywordsConfigs } from '@/api/keywrods'
import { getUser } from '@/api/index'

const currentPageTitle = ref('关键词规则')

const rules = ref([])
const loading = ref(false)
const userOptions = ref([])

function getUserName(userId) {
  const user = userOptions.value.find(u => u.id == userId)
  return user ? user.name : `用户${userId}`
}

function getMatchModeText(matchMode) {
  const modeMap = {
    'any': '任意匹配',
    'all': '匹配全部',
    'regex': '正则匹配'
  }
  return modeMap[matchMode] || '任意匹配'
}

async function fetchUsers() {
  const res = await getUser({})
  const list = (res && res.results) ? res.results : res
  userOptions.value = Array.isArray(list) ? list.map((u) => ({
    id: u.id ?? u.pk ?? u.uuid,
    name: u.username || u.name || u.email || `用户${u.id}`,
  })) : []
}

async function fetchRules() {
  try {
    loading.value = true
    const res = await getKeywordsConfigs({})
    const payload = (res && res.results) ? res.results : res
    const list = Array.isArray(payload) ? payload : []
    rules.value = list.map((r) => ({
      id: r.id,
      owner: (r.owner != null) ? r.owner : (r.user_id ?? r.target_user ?? r.user ?? r.userId ?? ''),
      provider: r.provider || r.platform || 'twitter',
      keywords: Array.isArray(r.include_keywords) ? r.include_keywords : (Array.isArray(r.keywords) ? r.keywords : (typeof r.include_keywords === 'string' ? r.include_keywords.split(',').map((s) => s.trim()).filter(Boolean) : (typeof r.keywords === 'string' ? r.keywords.split(',').map((s) => s.trim()).filter(Boolean) : []))),
      match_mode: r.match_mode || 'any',
      createdAt: r.created_at || r.createdAt || r.updated_at || r.updatedAt || '',
      enabled: (typeof r.enabled === 'boolean') ? r.enabled : (r.status ? r.status === '启用' : true),
    }))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchRules()])
})

const showAdd = ref(false)
const form = ref({
  provider: 'twitter',
  owner: '',
  include_keywords: '',
  match_mode: 'any',
  enabled: true,
})
const showEdit = ref(false)
const editLoading = ref(false)
const editForm = ref({
  id: 0,
  provider: 'twitter',
  owner: '',
  include_keywords: '',
  match_mode: 'any',
  enabled: true,
})

function openAdd() {
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  form.value = { provider: 'twitter', owner: '', include_keywords: '', match_mode: 'any', enabled: true }
}

async function submitAdd() {
  console.log(form.value);

  if (!form.value.owner || !form.value.provider || !form.value.include_keywords || !form.value.match_mode) {
    return
  }
  const keywordsArray = form.value.include_keywords.split(',').map(s => s.trim()).filter(Boolean)
  const payload = {
    owner: form.value.owner,
    provider: form.value.provider,
    include_keywords: keywordsArray,
    match_mode: form.value.match_mode,
    enabled: form.value.enabled,
  }
  try {
    await createKeywordsConfigs(payload)
    await fetchRules()
    closeAdd()
  } catch (e) {
    console.error('create keywords config failed', e)
  }
}

async function onDelete(item) {
  try {
    await deleteKeywordsConfigs(String(item.id))
    rules.value = rules.value.filter(r => r.id !== item.id)
  } catch (e) {
    console.error('delete keywords config failed', e)
  }
}

async function onEdit(item) {
  showEdit.value = true
  editLoading.value = true
  try {
    const detail = await getKeywordsConfigsDetail(String(item.id))
    const r = detail || {}
    const normalized = {
      id: r.id ?? item.id,
      owner: (r.owner != null) ? r.owner : (r.user_id ?? r.target_user ?? r.user ?? r.userId ?? item.owner ?? ''),
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
  } finally {
    editLoading.value = false
  }
}

function closeEdit() {
  showEdit.value = false
}

async function submitEdit() {
  if (!editForm.value.owner || !editForm.value.provider || !editForm.value.include_keywords || !editForm.value.match_mode) {
    return
  }
  const kw = editForm.value.include_keywords.split(',').map(s => s.trim()).filter(Boolean)
  const payload = {
    owner: editForm.value.owner,
    provider: editForm.value.provider,
    include_keywords: kw,
    match_mode: editForm.value.match_mode,
    enabled: editForm.value.enabled,
  }
  try {
    await updateKeywordsConfigs(String(editForm.value.id), payload)
    await fetchRules()
    closeEdit()
  } catch (e) {
    console.error('update keywords config failed', e)
  }
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
</script>


