<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <!-- 左侧：企业按钮、日期选择、平台数据、数据对比 -->
      <div class="lg:col-span-5 space-y-6">
        <!-- 企业按钮 -->
        <!-- <div class="mb-6">
          <Button
            variant="primary"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            @click="openCompanyPicker"
          >
            {{ selectedCompany?.name || '切换企业数据' }}
          </Button>
        </div> -->

        <!-- 企业数据选择弹窗 -->
        <Modal v-if="showCompanyPicker" :fullScreenBackdrop="true" @close="closeCompanyPicker">
          <template #body>
            <div class="relative bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">选择企业数据</h3>
                <button
                  @click="closeCompanyPicker"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- 搜索框 -->
              <div class="mb-4">
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索企业名称..."
                    class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <!-- 当前选中的企业 -->
              <div class="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p class="text-sm text-gray-600">
                  当前企业:
                  <span class="font-semibold text-orange-600">
                    {{ companies.find((c) => c.id === tempSelectedCompanyId)?.name || '未选择' }}
                  </span>
                </p>
              </div>

              <!-- 企业列表 -->
              <div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <div
                  v-for="company in filteredCompanies"
                  :key="company.id"
                  :class="[
                    'p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50',
                    tempSelectedCompanyId === company.id
                      ? 'bg-orange-50 border-l-4 border-l-orange-500'
                      : '',
                  ]"
                  @click="selectCompany(company)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">{{ company.name }}</h4>
                    </div>
                    <div v-if="tempSelectedCompanyId === company.id">
                      <svg class="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 没有搜索结果 -->
              <div v-if="filteredCompanies.length === 0" class="p-8 text-center text-gray-500">
                <svg
                  class="w-16 h-16 mx-auto mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>未找到匹配的企业</p>
              </div>

              <!-- 操作按钮 -->
              <div class="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  class="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  @click="closeCompanyPicker"
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white"
                  @click="confirmCompanySelection"
                  :disabled="!tempSelectedCompanyId"
                >
                  确定
                </Button>
              </div>
            </div>
          </template>
        </Modal>

        <!-- 日期选择器 -->
        <div class="mb-6">
          <div class="flex gap-2">
            <Button
              v-for="(option, index) in dateOptions"
              :key="index"
              :variant="selectedDate === option.value ? 'primary' : 'outline'"
              :class="
                selectedDate === option.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              "
              class="px-4 py-2 rounded-lg text-sm"
              @click="selectDate(option.value)"
            >
              {{ option.label }}
            </Button>
          </div>
        </div>

        <!-- 自定义日期选择器弹窗 -->
        <Modal v-if="showDatePicker" :fullScreenBackdrop="true" @close="closeDatePicker">
          <template #body>
            <div class="relative bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">选择日期范围</h3>
                <button
                  @click="closeDatePicker"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- 日期范围选择器 -->
              <div class="mb-6">
                <RangeCalendar
                  v-model="dateRange"
                  :locale="'zh-CN'"
                  class="border border-gray-200 rounded-lg"
                />
              </div>

              <!-- 选中的日期范围显示 -->
              <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">
                  已选择:
                  <span class="font-semibold text-gray-900">
                    {{ formatDateRange }}
                  </span>
                </p>
              </div>

              <!-- 操作按钮 -->
              <div class="flex justify-end gap-3">
                <Button
                  variant="outline"
                  class="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  @click="closeDatePicker"
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white"
                  @click="confirmDateRange"
                  :disabled="!isDateRangeValid"
                >
                  确定
                </Button>
              </div>
            </div>
          </template>
        </Modal>

        <!-- 平台数据卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlatformCard
            v-for="platform in platforms"
            :key="platform.name"
            :platform="platform"
            :data="getPlatformData(platform.name)"
          />
        </div>

        <!-- 数据对比组件 -->
        <DataComparison
          :selected-date="selectedDate"
          :api-data="apiData"
          @platform-change="handlePlatformChange"
        />
      </div>

      <!-- 右侧：总数据量 -->
      <div class="lg:col-span-2">
        <TotalVolume :total-data="totalData" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { type DateRange } from 'reka-ui'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { RangeCalendar } from '@/components/ui/range-calendar'
import PlatformCard from './components/PlatformCard.vue'
import TotalVolume from './components/TotalVolume.vue'
import DataComparison from './components/DataComparison.vue'
import { toast } from 'vue-sonner'
import { getdate } from '@/api/home'

// 导入图片
import maskGroupIcon from '@/assets/images/Mask group@3x-2.png'
import maskGroupIcon1 from '@/assets/images/Mask group@3x-1.png'
import maskGroupIcon2 from '@/assets/images/Mask group@3x.png'
const currentPageTitle = ref('数据统计')

// 获取当前日期的格式化字符串
const getCurrentDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const currentDate = getCurrentDateString()

// 当前选择的日期
const selectedDate = ref(currentDate)

// 自定义日期标签
const customDateLabel = ref('自定义日期')

// 日期选项
const dateOptions = computed(() => [
  { label: currentDate, value: currentDate },
  { label: '近3日', value: 'last3days' },
  { label: '近7日', value: 'last7days' },
  { label: '近14日', value: 'last14days' },
  { label: '近30日', value: 'last30days' },
  { label: customDateLabel.value, value: 'custom' },
])

// 企业相关
const selectedCompany = ref({
  id: '1',
  name: '阿里巴巴集团',
  industry: '电子商务 / 互联网',
  accountCount: 156,
  activeRate: 98,
  color: '#FF6600',
})

// 企业选择相关变量
const showCompanyPicker = ref(false)
const searchQuery = ref('')
const tempSelectedCompanyId = ref('1')

// 模拟企业数据
const companies = ref([
  {
    id: '1',
    name: '阿里巴巴集团',
    industry: '电子商务 / 互联网',
    accountCount: 156,
    activeRate: 98,
    color: '#FF6600',
  },
  {
    id: '2',
    name: '腾讯科技',
    industry: '互联网 / 社交媒体',
    accountCount: 238,
    activeRate: 95,
    color: '#1AAD19',
  },
  {
    id: '3',
    name: '字节跳动',
    industry: '短视频 / 内容平台',
    accountCount: 192,
    activeRate: 97,
    color: '#000000',
  },
  {
    id: '4',
    name: '华为技术',
    industry: '通信设备 / 科技',
    accountCount: 145,
    activeRate: 92,
    color: '#E60012',
  },
  {
    id: '5',
    name: '京东集团',
    industry: '电子商务 / 零售',
    accountCount: 128,
    activeRate: 89,
    color: '#E3393C',
  },
  {
    id: '6',
    name: '百度公司',
    industry: '搜索引擎 / AI',
    accountCount: 167,
    activeRate: 88,
    color: '#2932E1',
  },
  {
    id: '7',
    name: '美团点评',
    industry: '本地生活 / 外卖',
    accountCount: 134,
    activeRate: 94,
    color: '#FFD100',
  },
  {
    id: '8',
    name: '网易科技',
    industry: '游戏 / 互联网',
    accountCount: 112,
    activeRate: 86,
    color: '#C20C0C',
  },
  {
    id: '9',
    name: '小米集团',
    industry: '智能硬件 / IoT',
    accountCount: 98,
    activeRate: 91,
    color: '#FF6700',
  },
  {
    id: '10',
    name: '拼多多',
    industry: '社交电商',
    accountCount: 156,
    activeRate: 93,
    color: '#E02E24',
  },
  {
    id: '11',
    name: '滴滴出行',
    industry: '出行服务',
    accountCount: 89,
    activeRate: 87,
    color: '#FF7F00',
  },
  {
    id: '12',
    name: 'B站',
    industry: '视频 / 社区',
    accountCount: 176,
    activeRate: 96,
    color: '#00A1D6',
  },
])

// 计算过滤后的企业列表
const filteredCompanies = computed(() => {
  if (!searchQuery.value) {
    return companies.value
  }
  const query = searchQuery.value.toLowerCase()
  return companies.value.filter(
    (company) =>
      company.name.toLowerCase().includes(query) || company.industry.toLowerCase().includes(query),
  )
})

// 日期选择函数
const selectDate = (value: string) => {
  if (value === 'custom') {
    // 打开自定义日期选择器
    showDatePicker.value = true
  } else {
    selectedDate.value = value
    // 这里可以调用API获取对应日期的数据
    fetchData()
  }
}

// 企业选择相关函数
const openCompanyPicker = () => {
  // 打开弹窗时，将当前选中的企业ID复制到临时变量
  tempSelectedCompanyId.value = selectedCompany.value.id
  showCompanyPicker.value = true
  searchQuery.value = ''
}

const closeCompanyPicker = () => {
  // 取消时不做任何改变，只关闭弹窗
  showCompanyPicker.value = false
  searchQuery.value = ''
}

const selectCompany = (company: any) => {
  // 在弹窗中选择企业时，只修改临时变量
  tempSelectedCompanyId.value = company.id
}

const confirmCompanySelection = () => {
  if (!tempSelectedCompanyId.value) return

  // 确定时，将临时选择的企业ID赋给实际的selectedCompany
  const company = companies.value.find((c) => c.id === tempSelectedCompanyId.value)
  if (company) {
    selectedCompany.value = company
    toast.success(`已切换到 ${company.name}`)
    // 这里可以根据选择的企业重新获取数据
    fetchData()
  }
  showCompanyPicker.value = false
}

// 自定义日期相关变量
const showDatePicker = ref(false)
const dateRange = ref({
  start: undefined,
  end: undefined,
})

// 格式化日期对象为字符串
const formatDate = (date: any) => {
  if (!date) return ''
  const year = date.year
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 计算格式化的日期范围显示
const formatDateRange = computed(() => {
  if (!dateRange.value.start || !dateRange.value.end) {
    return '请选择日期范围'
  }
  const startStr = formatDate(dateRange.value.start)
  const endStr = formatDate(dateRange.value.end)
  return `${startStr} ~ ${endStr}`
})

// 检查日期范围是否有效
const isDateRangeValid = computed(() => {
  return dateRange.value.start && dateRange.value.end
})

// 关闭日期选择器
const closeDatePicker = () => {
  showDatePicker.value = false
  // 重置日期范围
  dateRange.value = {
    start: undefined,
    end: undefined,
  }
}

// 确认日期范围
const confirmDateRange = () => {
  if (!isDateRangeValid.value) return

  const startStr = formatDate(dateRange.value.start)
  const endStr = formatDate(dateRange.value.end)
  const customDateValue = `${startStr}~${endStr}`

  // 更新自定义日期按钮的标签
  customDateLabel.value = `${startStr}~${endStr}`

  selectedDate.value = customDateValue
  fetchData()
  showDatePicker.value = false
}

// 平台配置
const platforms = ref([
  {
    name: 'X (Twitter)',
    icon: maskGroupIcon,
    bgColor: 'bg-black',
  },
  {
    name: 'Instagram',
    icon: maskGroupIcon1,
    bgColor: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
  },
  {
    name: 'Facebook',
    icon: maskGroupIcon2,
    bgColor: 'bg-blue-600',
  },
])

// API返回的原始数据
const apiData = ref<{
  fb?: {
    total_impression_count: number
    total_comment_count: number
    total_message_count: number
    total_like_count: number
    total_click_count: number
    total_public_count: number
  }
  ins?: {
    total_impression_count: number
    total_comment_count: number
    total_message_count: number
    total_like_count: number
    total_click_count: number
    total_public_count: number
  }
  twitter?: {
    total_impression_count: number
    total_comment_count: number
    total_message_count: number
    total_like_count: number
    total_click_count: number
    total_public_count: number
  }
}>({})

// 总数据量（计算属性）
const totalData = computed(() => {
  const fb = apiData.value.fb || {
    total_impression_count: 0,
    total_comment_count: 0,
    total_message_count: 0,
    total_like_count: 0,
    total_click_count: 0,
    total_public_count: 0,
  }
  const ins = apiData.value.ins || {
    total_impression_count: 0,
    total_comment_count: 0,
    total_message_count: 0,
    total_like_count: 0,
    total_click_count: 0,
    total_public_count: 0,
  }
  const twitter = apiData.value.twitter || {
    total_impression_count: 0,
    total_comment_count: 0,
    total_message_count: 0,
    total_like_count: 0,
    total_click_count: 0,
    total_public_count: 0,
  }

  // 计算总数
  const totalPosts = fb.total_public_count + ins.total_public_count + twitter.total_public_count
  const totalImpressions =
    fb.total_impression_count + ins.total_impression_count + twitter.total_impression_count
  const totalComments =
    fb.total_comment_count + ins.total_comment_count + twitter.total_comment_count
  const totalReplies =
    fb.total_message_count + ins.total_message_count + twitter.total_message_count
  const totalLikes = fb.total_like_count + ins.total_like_count + twitter.total_like_count
  const totalClicks = fb.total_click_count + ins.total_click_count + twitter.total_click_count

  return {
    total: totalPosts + totalImpressions + totalComments + totalReplies + totalLikes + totalClicks,
    instagram: ins.total_public_count,
    x: twitter.total_public_count,
    facebook: fb.total_public_count,
    totalPosts,
    totalImpressions,
    totalComments,
    totalReplies,
    totalLikes,
    totalClicks,
  }
})

// 获取平台数据
const getPlatformData = (platformName: string) => {
  let platformData = {
    total_impression_count: 0,
    total_comment_count: 0,
    total_message_count: 0,
    total_like_count: 0,
    total_click_count: 0,
    total_public_count: 0,
  }

  // 根据平台名称映射到API返回的数据
  if (platformName === 'Facebook' && apiData.value.fb) {
    platformData = apiData.value.fb
  } else if (platformName === 'Instagram' && apiData.value.ins) {
    platformData = apiData.value.ins
  } else if (platformName === 'X (Twitter)' && apiData.value.twitter) {
    platformData = apiData.value.twitter
  }

  return {
    posts: platformData.total_public_count,
    impressions: platformData.total_impression_count,
    replyComments: platformData.total_comment_count,
    replyMessages: platformData.total_message_count,
    likes: platformData.total_like_count,
    clicks: platformData.total_click_count,
  }
}

// 处理平台变化
const handlePlatformChange = (platform: string) => {
  console.log('Platform changed to:', platform)
  // 这里可以更新数据对比图表
}

// 计算日期范围
const getDateRange = (dateValue: string) => {
  const today = new Date()
  let startDate = ''
  let endDate = ''

  // 格式化日期为 YYYY-MM-DD
  const formatDateToString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  if (dateValue.includes('~')) {
    // 自定义日期范围，格式为 "YYYY-MM-DD~YYYY-MM-DD"
    const [start, end] = dateValue.split('~')
    startDate = start
    endDate = end
  } else if (dateValue.startsWith('last')) {
    // 近几日的情况
    endDate = formatDateToString(today)
    const daysMap: Record<string, number> = {
      last3days: 3,
      last7days: 7,
      last14days: 14,
      last30days: 30,
    }
    const days = daysMap[dateValue] || 1
    const startDateObj = new Date(today)
    startDateObj.setDate(today.getDate() - days + 1)
    startDate = formatDateToString(startDateObj)
  } else {
    // 单日日期，格式为 "YYYY-MM-DD"
    startDate = dateValue
    endDate = dateValue
  }

  return { startDate, endDate }
}

const fetchData = async () => {
  try {
    const { startDate, endDate } = getDateRange(selectedDate.value)

    // 只调用汇总数据接口（折线图数据由 DataComparison 组件自己调用）
    const summaryRes = await getdate({
      start_date: startDate,
      end_date: endDate,
    })

    // 处理汇总数据
    console.log('Summary data fetched successfully:', summaryRes)
    if (summaryRes && typeof summaryRes === 'object') {
      apiData.value = summaryRes as typeof apiData.value
    }
  } catch (error) {
    console.error('获取数据统计失败:', error)
    toast.error('获取数据统计失败')
  }
}

onMounted(() => {
  // 设置默认日期并获取数据
  selectedDate.value = currentDate
  fetchData()
})
</script>
