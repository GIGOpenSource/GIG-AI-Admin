<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- <div class="relative">
              <select v-model="platformFilter"
                class="w-48 h-10 pl-3 pr-8 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                @change="handleSearchClick">
                <option value="">请选择平台</option>
                <option :value="item.name" v-for="(item, index) in platf" :key="index">{{ item.name }}</option>
              </select>
            </div>
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="请输入项目名称"
                class="w-80 h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                @keyup.enter="handleSearchClick" />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <Button size="sm" @click="handleSearchClick" :disabled="isSearching">
              <span v-if="isSearching" class="mr-2">搜索中...</span>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              搜索
            </Button>
            <Button size="sm" variant="outline" @click="clearSearch" class="text-gray-500 hover:text-gray-700">
              重置
            </Button> -->
          </div>
          <div class="flex gap-2">
            <Button size="sm" @click="openAdd">新增</Button>
          </div>
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">序号</TableHead>
              <TableHead class="whitespace-nowrap">平台</TableHead>
              <TableHead class="whitespace-nowrap">项目名称</TableHead>
              <TableHead class="whitespace-nowrap">是否默认</TableHead>
              <TableHead class="whitespace-nowrap">API版本</TableHead>
              <!-- <TableHead class="whitespace-nowrap">回调地址</TableHead> -->
               <!-- <TableHead class="whitespace-nowrap">权限类型</TableHead> -->
              <TableHead class="whitespace-nowrap">appid</TableHead>
               <!-- <TableHead class="whitespace-nowrap">app-key</TableHead> -->
              <TableHead class="whitespace-nowrap">app密钥</TableHead>
              <TableHead class="whitespace-nowrap">读取使用token</TableHead>
              <!-- <TableHead class="whitespace-nowrap">订阅使用token</TableHead> -->
              <TableHead class="whitespace-nowrap">账号uid</TableHead>
              <TableHead class="whitespace-nowrap">用户名</TableHead>
              <TableHead class="whitespace-nowrap">输入token</TableHead>
              <TableHead class="whitespace-nowrap">最近调用时间</TableHead>
              <!-- <TableHead class="whitespace-nowrap">权限类型</TableHead> -->
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap text-right sticky right-0 bg-white dark:bg-gray-900 z-10 w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="accounts.length">
              <TableRow v-for="(acc, index) in accounts" :key="acc.id">
                <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.provider || '--' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.name || '--' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.is_default ? '是' : '否' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ acc.api_version || '--' }}</TableCell>
                 <!-- <TableCell class="max-w-[200px] truncate" :title="acc.redirect_uris || '--'">{{ acc.redirect_uris || '--' }}</TableCell> -->
                <!-- <TableCell>权限类型</TableCell> -->
                 <TableCell class="max-w-[200px] truncate" :title="acc.app_id || acc.client_id || '--'">{{ acc.app_id|| acc.client_id || '--' }}</TableCell>

                  <!-- <TableCell>app-key</TableCell> -->
                 <TableCell class="max-w-[200px] truncate" :title="acc.refresh_token || '--'">{{ acc.refresh_token || '--' }}</TableCell>
                 <TableCell class="max-w-[200px] truncate" :title="acc.bearer_token_masked || '--'">{{ acc.bearer_token_masked || '--' }}</TableCell>
                   <!-- <TableCell>订阅使用token</TableCell> -->
                 <TableCell class="max-w-[200px] truncate" :title="acc.external_user_id || '--'">{{ acc.external_user_id || '--' }}</TableCell>
                 <TableCell class="max-w-[200px] truncate" :title="acc.external_username || '--'">{{ acc.external_username || '--' }}</TableCell>
                 <TableCell class="max-w-[200px] truncate" :title="acc.access_token || '--'">{{ acc.access_token || '--' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ formatTime(acc.updated_at) || '--' }}</TableCell>
                   <!-- <TableCell>权限类型</TableCell> -->
                <!-- <TableCell class="whitespace-nowrap">{{ acc.status }}</TableCell> -->
                <TableCell class="whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    acc.status
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                  ]">
                    {{ acc.status == 'active' ? '正常' : '禁用' }}
                  </span>
                </TableCell>
                <TableCell class="text-right whitespace-nowrap sticky right-0 bg-white dark:bg-gray-900 z-10 w-[280px]">
                  <div class="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" @click="onViewCallbackUrl(acc)" :disabled="loadingCallbackUrl">
                      <span v-if="loadingCallbackUrl" class="mr-2">获取中...</span>
                      查看回调地址
                    </Button>
                    <Button size="sm" variant="outline" @click="onEdit(acc)">编辑</Button>
                    <button
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(acc, $event)">
                      删除
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell :colspan="12" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
        <div class="mt-4" v-if="total > 0">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1">
            <PaginationContent v-slot="{ items }">
              <!-- <PaginationFirst>首页</PaginationFirst> -->
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext />
              <!-- <PaginationLast>末页</PaginationLast> -->
            </PaginationContent>
          </Pagination>
        </div>
      </ComponentCard>

      <!-- 删除确认气泡弹窗 -->
      <DeleteConfirmDialog :isOpen="showDeleteDialog" :title="'删除'" :description="'确定要删除吗？此操作不可撤销。'"
        :isLoading="deleteLoading" :triggerRect="triggerRect" @close="closeDeleteDialog" @confirm="confirmDelete" />

      <!-- 查看回调地址弹窗 -->
      <CallbackUrlModal
        :isOpen="showCallbackUrlModal"
        :url="selectedCallbackUrl"
        @close="closeCallbackUrlModal"
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
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import CallbackUrlModal from '@/components/common/CallbackUrlModal.vue'
// import { getlist, addlist, details, updatelist, deletelist } from '@/api/aiCofig.ts'
import { getAccount, getConfigs, deletePlatform, deleteAccount, getFacebookStart, getInstagramStart, getThreadsStart, getTwitterStart } from '@/api/platform.ts'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'
import { useRouter } from 'vue-router'
const router = useRouter()
const itemToDelete = ref({})
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const showCallbackUrlModal = ref(false)
const selectedCallbackUrl = ref('')
const loadingCallbackUrl = ref(false)
const currentPageTitle = ref('平台账户配置')
const accounts = ref([])
const page = ref(1)
const pageSize = ref(20) // 默认一页20条
const total = ref(0)
const searchQuery = ref('')
const platf = ref([])
const platformFilter = ref('')
const searchTimeout = ref(null)
const isSearching = ref(false)
const type = ref([
  {
    title: 'OpenAI',
    value: 'openai'
  },
  {
    title: 'Azure OpenAI',
    value: 'azure'
  }, {
    title: 'Google Gemini',
    value: 'gemini'
  }, {
    title: 'Anthropic',
    value: 'anthropic'
  }, {
    title: 'Custom',
    value: 'custom'
  },

])

function openAdd() {
  router.push('/platform-accounts/new')
}
function onEdit(account) {

  // 跳转到编辑页面并携带查询参数
  router.push({
    path: '/platform-accounts/edit',
    query: { id: account.account_id, config: account.config }
  })
}

// 查看回调地址
async function onViewCallbackUrl(account) {
  if (!account.provider) {
    toast.error('平台信息不完整')
    return
  }

  loadingCallbackUrl.value = true
  selectedCallbackUrl.value = ''

  try {
    // 根据不同平台调用不同的接口
    const apiMap = {
      twitter: getTwitterStart,
      facebook: getFacebookStart,
      instagram: getInstagramStart,
      threads: getThreadsStart
    }

    const apiFunction = apiMap[account.provider]
    if (!apiFunction) {
      toast.error('暂不支持该平台的回调地址获取')
      return
    }

    const response = await apiFunction()
    if (response && response.auth_url) {
      selectedCallbackUrl.value = response.auth_url
      showCallbackUrlModal.value = true
    } else {
      toast.error('获取回调地址失败')
    }
  } catch (error) {
    console.error('获取回调地址失败:', error)
    toast.error('获取回调地址失败', {
      description: error.response?.data?.message || error.message || '请稍后重试'
    })
  } finally {
    loadingCallbackUrl.value = false
  }
}

// 关闭回调地址弹窗
function closeCallbackUrlModal() {
  showCallbackUrlModal.value = false
  selectedCallbackUrl.value = ''
}

function onDelete(account, event) {
  itemToDelete.value = account
  console.log(event, 'evet');

  // 获取触发按钮的位置信息
  const buttonRect = event.target.getBoundingClientRect()

  console.log(buttonRect, 'buttonRect');

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
    await deletePlatform(itemToDelete.value.id)
    await deleteAccount(itemToDelete.value.account_id)
    toast.success('删除成功')
    await fetchlist()
    closeDeleteDialog()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除配置时发生错误'
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


// 手动搜索按钮点击
const handleSearchClick = async () => {
  if (isSearching.value) return

  isSearching.value = true
  page.value = 1 // 搜索时重置到第一页
  try {
    await fetchlist()
  } finally {
    isSearching.value = false
  }
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  platformFilter.value = ''
  page.value = 1 // 重置到第一页
  fetchlist()
}
const fetchlist = async () => {
  try {
    const accountResponse = await getAccount({ page: page.value })
    const accountData = accountResponse.results || accountResponse || []
    const configsResponse = await getConfigs({
      search: searchQuery.value,
      provider: platformFilter.value,
      page: page.value
    })
    const configsData = configsResponse.results || configsResponse || []
    console.log(configsData, '配置数据');
    const mergedAccounts = accountData.map(account => {
      // 查找匹配的配置
      const matchingConfig = configsData.find(config =>
        config.id === account.config ||
        config.id === account.config_id ||
        config.id === account.configId
      )

      if (matchingConfig) {
        return {
          ...account,
          ...matchingConfig,
          account_id: account.id,
          account_owner: account.owner,
          account_created_at: account.created_at,
          account_updated_at: account.updated_at,
        }
      }

      return {
        ...account,
        account_id: account.id,
        account_owner: account.owner,
        account_created_at: account.created_at,
        account_updated_at: account.updated_at,
      }
    })


    let filteredAccounts = mergedAccounts
    accounts.value = filteredAccounts
    total.value = accountResponse.count
    if (configsData.length == 0 || accountData.length == 0) {
      accounts.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    toast.error('获取列表失败', {
      description: error.response?.data?.message || error.message || '获取配置列表时发生错误'
    })
    accounts.value = []
    total.value = 0
  }
}

// 监听分页变化
watch(page, (newPage) => {
  console.log('Page changed to:', newPage)
  fetchlist()
})

onMounted(() => {
  fetchlist()

})
</script>

<style>

</style>
