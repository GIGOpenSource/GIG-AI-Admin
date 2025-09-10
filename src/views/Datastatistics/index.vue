<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="请搜索配置名称"
                class="w-80 h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                @keyup.enter="handleSearchClick"
              />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <Button
              size="sm"
              @click="handleSearchClick"
              :disabled="isSearching"
            >
              <span v-if="isSearching" class="mr-2">搜索中...</span>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              搜索
            </Button>
            <Button
              v-if="searchQuery"
              size="sm"
              variant="outline"
              @click="clearSearch"
              class="text-gray-500 hover:text-gray-700"
            >
              清除
            </Button> -->
          </div>
          <!-- <div class="flex gap-2">
            <Button size="sm">导出Excel</Button>
          </div> -->
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">日期</TableHead>
              <TableHead class="whitespace-nowrap">账号数量</TableHead>
              <TableHead class="whitespace-nowrap">ins</TableHead>
               <TableHead class="whitespace-nowrap">x</TableHead>
              <TableHead class="whitespace-nowrap">FB</TableHead>
              <TableHead class="whitespace-nowrap">发帖数</TableHead>
              <TableHead class="whitespace-nowrap">回复评论数</TableHead>
              <TableHead class="whitespace-nowrap">回复消息数</TableHead>
              <TableHead class="whitespace-nowrap">总曝光量 </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             <template v-if="accounts.length">
                <TableRow v-for="acc in accounts" :key="acc.id">
              <TableCell class="whitespace-nowrap">{{ acc.date }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.account_count }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.ins }}</TableCell>
               <TableCell class="whitespace-nowrap">{{ acc.x }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.fb }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.post_count }}</TableCell>
               <TableCell class="whitespace-nowrap">{{ acc.reply_comment_count }}</TableCell>
               <TableCell class="whitespace-nowrap">{{ acc.reply_message_count }}</TableCell>
              <TableCell class="whitespace-nowrap">{{ acc.total_impressions }}</TableCell>
            </TableRow>
             </template>
             <template v-else>
              <TableRow>
                <TableCell :colspan="8" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
        <div class="mt-4" v-if="total > 0">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1">
            <PaginationContent v-slot="{ items }">
              <!-- <PaginationFirst>首页</PaginationFirst> -->
              <PaginationPrevious/>
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext/>
              <!-- <PaginationLast>末页</PaginationLast> -->
            </PaginationContent>
          </Pagination>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { getdate} from '@/api/index.ts'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
const currentPageTitle = ref('数据统计')
const accounts = ref([])
const page = ref(1)
const pageSize = ref(20) // 与AIAccounts保持一致
const total = ref(0)
const searchQuery = ref('')
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
  },
   {
    title: 'Google Gemini',
    value: 'gemini'
  }, {
    title: 'Anthropic Claude',
    value: 'anthropic'
  },{
    title: 'Together Al',
    value: 'together'
  },{
    title: 'Deepseek',
    value: 'deepseek'
  },{
    title: 'Moonshot',
    value: 'moonshot'
  },{
    title: '智谱AI',
    value: 'zhipuai'
  },{
    title: '自定义OpenAl兼容接口',
    value: 'custom'
  },

])
const formdata = {
   openai:'OpenAI',
   azure:'Azure OpenAI',
   gemini:'Google Gemini',
   anthropic:'Anthropic Claude',
   together:'Together Al',
   deepseek:'Deepseek',
   moonshot:'Moonshot',
   zhipuai:'智谱AI',
   custom:'自定义OpenAl兼容接口'
}
async function onEdit(account) {
  try {
    // 获取详细信息
    const detailData = await details(account.id)

    // 设置为编辑模式
    isEditMode.value = true
    editingId.value = account.id

    // 填充表单数据
    form.value = {
      name: detailData.name || '',
      service_type: detailData.service_type || '',
      api_base: detailData.api_base || '',
      api_key: detailData.api_key || '',
      model_name: detailData.model_name || '',
      max_tokens: detailData.max_tokens || '',
      temperature: detailData.temperature || '',
      is_active: detailData.is_active !== undefined ? detailData.is_active : true,
    }

    // 打开弹窗
    showAdd.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    toast.error('获取详情失败')
  }
}

 async function onDelete(account) {
  // console.log('delete', account)
  const res = await deletelist(account.id)
  console.log(res,'resresssss');
  await fetchlist()

}

const showAdd = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isLoading = ref(false)
const form = ref({
  name: '',
  service_type: '',
  api_base: '',
  api_key: '',
  model_name: '',
  max_tokens: '',
  temperature: '',
  is_active: true,
})

function openAdd() {
  // 重置为新增模式
  isEditMode.value = false
  editingId.value = null
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  isEditMode.value = false
  editingId.value = null
  form.value = {
    name: '',
    service_type: '',
    api_base: '',
    api_key: '',
    model_name: '',
    max_tokens: '',
    temperature: '',
    is_active: true,
  }
}

async function submitAdd() {


  isLoading.value = true

  try {
    // 准备提交数据
    const submitData = {
      name: form.value.name.trim(),
      service_type: form.value.service_type,
      api_base: form.value.api_base.trim(),
      api_key: form.value.api_key.trim(),
      model_name: form.value.model_name.trim(),
      max_tokens: form.value.max_tokens || '4096',
      temperature: form.value.temperature || '0.7',
      is_active: form.value.is_active
    }

    // 根据模式调用不同的接口
    if (isEditMode.value) {
      // 编辑模式：调用更新接口
      await updatelist(editingId.value, submitData)
      toast.success('配置更新成功')
    } else {
      // 新增模式：调用新增接口
      await addlist(submitData)
      toast.success('配置新增成功')
    }

    // 成功后关闭弹窗并刷新列表
    closeAdd()
    await fetchlist()

  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '新增失败:', error)

    // 更详细的错误处理
    let errorMessage = isEditMode.value ? '更新失败' : '新增失败'
    if (error.response?.data?.message) {
      errorMessage += `: ${error.response.data.message}`
    } else if (error.message) {
      errorMessage += `: ${error.message}`
    } else {
      errorMessage += '，请重试'
    }

    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
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
  page.value = 1 // 重置到第一页
  fetchlist()
}


const fetchlist = async () => {
  try {
    let res = await getdate({
      page: page.value,
      // page_size: pageSize.value
    })

    // 与AIAccounts保持一致的API返回格式处理
    accounts.value = res.results || res
    total.value = res.count || res.length || 0
    console.log('Data fetched successfully, total:', total.value)
  } catch (error) {
    console.error('获取数据统计失败:', error)
    toast.error('获取数据统计失败')
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
