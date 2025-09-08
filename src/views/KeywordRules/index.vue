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
              <TableHead class="whitespace-nowrap">规则名称</TableHead>
              <TableHead class="whitespace-nowrap">平台</TableHead>
              <TableHead class="whitespace-nowrap">关键词</TableHead>
              <TableHead class="whitespace-nowrap">每日上限</TableHead>
              <TableHead class="whitespace-nowrap">冷却时间</TableHead>
              <TableHead class="whitespace-nowrap">更新时间</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in rules" :key="item.id">
              <TableCell class="whitespace-nowrap">{{ item.id }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.name }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.platform }}</TableCell>
              <TableCell class="max-w-[320px] truncate" :title="item.keywords.join(', ')">{{ item.keywords.join(', ') }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.daily_cap }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ Math.floor((item.cooldown_seconds || 0) / 60) }} 分钟</TableCell>
              <TableCell class="whitespace-nowrap">{{ item.updatedAt }}</TableCell>
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
                <select v-model="form.target_user"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">规则名称<span class="text-error-500">*</span></label>
                <input v-model="form.name" type="text" placeholder="如：辱骂过滤规则"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span class="text-error-500">*</span></label>
                <select v-model="form.platform"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="ins">Ins</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">关键词（逗号分隔）<span class="text-error-500">*</span></label>
                <input v-model="form.keywords" type="text" placeholder="如：差评, 垃圾, 退款"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">回复模板（支持变量）<span class="text-error-500">*</span></label>
                <textarea v-model="form.reply_template" rows="3" placeholder="如：您好，我们已收到您的消息……"
                  class="dark:bg-dark-900 h-28 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">冷却时间（秒）<span class="text-error-500">*</span></label>
                <input v-model.number="form.cooldown_seconds" type="number" min="0" placeholder="如：600"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">每日最大回复数<span class="text-error-500">*</span></label>
                <input v-model.number="form.daily_cap" type="number" min="0" placeholder="如：100"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
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
                <select v-model="editForm.target_user"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="" disabled>请选择用户</option>
                  <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">规则名称<span class="text-error-500">*</span></label>
                <input v-model="editForm.name" type="text" placeholder="如：辱骂过滤规则"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span class="text-error-500">*</span></label>
                <select v-model="editForm.platform"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="ins">Ins</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">关键词（逗号分隔）<span class="text-error-500">*</span></label>
                <input v-model="editForm.keywords" type="text" placeholder="如：差评, 垃圾, 退款"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">回复模板（支持变量）<span class="text-error-500">*</span></label>
                <textarea v-model="editForm.reply_template" rows="3" placeholder="如：您好，我们已收到您的消息……"
                  class="dark:bg-dark-900 h-28 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">冷却时间（秒）<span class="text-error-500">*</span></label>
                <input v-model.number="editForm.cooldown_seconds" type="number" min="0" placeholder="如：600"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">每日最大回复数<span class="text-error-500">*</span></label>
                <input v-model.number="editForm.daily_cap" type="number" min="0" placeholder="如：100"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
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
import { getKeywordsRules, getKeywordsRulesDetail } from '@/api/keywrods'
import { getUser } from '@/api/index'

const currentPageTitle = ref('关键词规则')

const rules = ref([])
const loading = ref(false)
const userOptions = ref([])

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
    const res = await getKeywordsRules({})
    const payload = (res && res.results) ? res.results : res
    const list = Array.isArray(payload) ? payload : []
    rules.value = list.map((r) => ({
      id: r.id,
      target_user: r.target_user ?? r.user ?? r.user_id ?? '',
      name: r.name,
      platform: r.platform,
      keywords: Array.isArray(r.keywords) ? r.keywords : (typeof r.keywords === 'string' ? r.keywords.split(',').map((s) => s.trim()).filter(Boolean) : []),
      reply_template: r.reply_template,
      cooldown_seconds: (r.cooldown_seconds != null) ? r.cooldown_seconds : (r.cooldown ? Number(r.cooldown) * 60 : 0),
      daily_cap: (r.daily_cap != null) ? r.daily_cap : (r.dailyLimit != null ? r.dailyLimit : 0),
      updatedAt: r.updated_at || r.updatedAt || r.created_at || '',
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
  name: '',
  platform: 'twitter',
  target_user: '',
  keywords: '',
  reply_template: '',
  cooldown_seconds: 600,
  daily_cap: 100,
  enabled: true,
})
const showEdit = ref(false)
const editLoading = ref(false)
const editForm = ref({
  id: 0,
  name: '',
  platform: 'twitter',
  target_user: '',
  keywords: '',
  reply_template: '',
  cooldown_seconds: 600,
  daily_cap: 100,
  enabled: true,
})

function openAdd() {
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  form.value = { name: '', platform: 'twitter', target_user: '', keywords: '', reply_template: '', cooldown_seconds: 600, daily_cap: 100, enabled: true }
}

function submitAdd() {
  if (!form.value.target_user || !form.value.name || !form.value.platform || !form.value.keywords || !form.value.reply_template) {
    return
  }
  const nextId = Math.max(0, ...rules.value.map(r => r.id)) + 1
  const updatedAt = formatDateTime(new Date())
  const kw = form.value.keywords.split(',').map(s => s.trim()).filter(Boolean)
  rules.value.unshift({ id: nextId, target_user: form.value.target_user, name: form.value.name, platform: form.value.platform, keywords: kw, reply_template: form.value.reply_template, cooldown_seconds: form.value.cooldown_seconds, daily_cap: form.value.daily_cap, updatedAt, enabled: form.value.enabled })
  closeAdd()
}

function onDelete(item) {
  rules.value = rules.value.filter(r => r.id !== item.id)
}

async function onEdit(item) {
  showEdit.value = true
  editLoading.value = true
  try {
    const detail = await getKeywordsRulesDetail(String(item.id))
    const r = detail || {}
    const normalized = {
      id: r.id ?? item.id,
      target_user: r.target_user ?? r.user ?? r.user_id ?? item.target_user ?? '',
      name: r.name ?? item.name ?? '',
      platform: r.platform ?? item.platform ?? 'twitter',
      keywords: Array.isArray(r.keywords)
        ? r.keywords.join(', ')
        : (typeof r.keywords === 'string' ? r.keywords : (Array.isArray(item.keywords) ? item.keywords.join(', ') : '')),
      reply_template: r.reply_template ?? item.reply_template ?? '',
      cooldown_seconds: (r.cooldown_seconds != null) ? r.cooldown_seconds : (r.cooldown ? Number(r.cooldown) * 60 : (item.cooldown_seconds || 0)),
      daily_cap: (r.daily_cap != null) ? r.daily_cap : (r.dailyLimit != null ? r.dailyLimit : (item.daily_cap || 0)),
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

function submitEdit() {
  if (!editForm.value.target_user || !editForm.value.name || !editForm.value.platform || !editForm.value.keywords || !editForm.value.reply_template) {
    return
  }
  const kw = editForm.value.keywords.split(',').map(s => s.trim()).filter(Boolean)
  const updatedAt = formatDateTime(new Date())
  rules.value = rules.value.map(r => {
    if (r.id === editForm.value.id) {
      return {
        ...r,
        target_user: editForm.value.target_user,
        name: editForm.value.name,
        platform: editForm.value.platform,
        keywords: kw,
        reply_template: editForm.value.reply_template,
        cooldown_seconds: editForm.value.cooldown_seconds,
        daily_cap: editForm.value.daily_cap,
        enabled: editForm.value.enabled,
        updatedAt,
      }
    }
    return r
  })
  closeEdit()
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
</script>


