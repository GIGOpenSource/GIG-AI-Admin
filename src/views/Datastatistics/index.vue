<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <!-- 日期选择器 -->
      <DateSelector @date-change="handleDateChange" />

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：平台数据卡片 -->
        <div class="lg:col-span-2 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PlatformCard
              v-for="platform in platforms"
              :key="platform.name"
              :platform="platform"
              :data="getPlatformData()"
            />
          </div>

          <!-- 数据对比组件 -->
          <DataComparison @platform-change="handlePlatformChange" />
        </div>

        <!-- 右侧：总数据量 -->
        <div class="lg:col-span-1">
          <TotalVolume :total-data="totalData" />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import DateSelector from './components/DateSelector.vue'
import PlatformCard from './components/PlatformCard.vue'
import TotalVolume from './components/TotalVolume.vue'
import DataComparison from './components/DataComparison.vue'
import { getdate } from '@/api/index.ts'
import { toast } from 'vue-sonner'

// 导入图片
import maskGroupIcon from '@/assets/images/Mask group@3x-2.png'
import maskGroupIcon1 from '@/assets/images/Mask group@3x-1.png'
import maskGroupIcon2 from '@/assets/images/Mask group@3x.png'
const currentPageTitle = ref('数据统计')

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

// 总数据量
const totalData = ref({
  total: 36942,
  instagram: 12314,
  x: 12314,
  facebook: 12314,
  totalPosts: 12314,
  totalImpressions: 12314,
  totalComments: 114,
  totalReplies: 114,
  totalLikes: 12314,
  totalClicks: 114,
})
// 获取平台数据
const getPlatformData = () => {
  // 这里可以根据实际API返回的数据进行映射
  return {
    posts: 46,
    impressions: 12314,
    replyComments: 12314,
    replyMessages: 12314,
    likes: 12314,
    clicks: 12314,
  }
}

// 处理日期变化
const handleDateChange = (date: string) => {
  console.log('Date changed to:', date)
  // 这里可以调用API获取对应日期的数据
  fetchData()
}

// 处理平台变化
const handlePlatformChange = (platform: string) => {
  console.log('Platform changed to:', platform)
  // 这里可以更新数据对比图表
}

const fetchData = async () => {
  try {
    const res = await getdate({
      page: 1,
    })

    // 处理API返回的数据
    console.log('Data fetched successfully:', res)

    // 这里可以根据实际API返回的数据更新totalData
    // 例如：totalData.value = processApiData(res)
  } catch (error) {
    console.error('获取数据统计失败:', error)
    toast.error('获取数据统计失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>
