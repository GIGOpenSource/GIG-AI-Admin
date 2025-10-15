<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">数据对比</h3>

    <!-- 平台选择按钮 -->
    <div class="flex gap-2 mb-6 justify-between items-center">
      <div class="flex">
        <div
          v-for="(platform, index) in platforms"
          :key="platform.value"
          class="cursor-pointer px-4 py-1 font-medium text-black border border-gray-300 transition-all hover:bg-blue-50"
          :class="[
            index === 0 ? 'rounded-l-2xl' : '',
            index === platforms.length - 1 ? 'rounded-r-2xl' : '',
            index > 0 ? 'border-l-0' : '',
            selectedPlatform === platform.value ? 'bg-blue-100' : 'bg-white',
          ]"
          @click="selectPlatform(platform.value)"
        >
          {{ platform.label }}
        </div>
      </div>
      <!-- 日期显示 -->
      <div>
        <span class="text-sm text-gray-900" style="color: #4d63f2">{{ displayDate }}</span>
      </div>
    </div>

    <!-- 柱形图容器 -->
    <div class="h-92 bg-gray-50 rounded-lg p-4">
      <v-chart class="w-full h-full" :option="barChartOption" :autoresize="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, computed, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册ECharts组件
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

interface Platform {
  label: string
  value: string
}

// Props
const props = defineProps<{
  selectedDate: string
  apiData?: any
}>()

const selectedPlatform = ref('all')
const displayDate = ref('2015-10-18')

// 监听选择的日期变化
watch(
  () => props.selectedDate,
  (newDate) => {
    if (newDate) {
      // 如果是单日日期格式，直接显示
      if (newDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        displayDate.value = newDate
      } else {
        // 其他情况显示当前日期
        displayDate.value = new Date().toISOString().split('T')[0]
      }
    }
  },
  { immediate: true },
)

const platforms: Platform[] = [
  { label: '全部', value: 'all' },
  { label: 'X', value: 'X' },
  { label: 'Ins', value: 'Ins' },
  { label: 'FB', value: 'FB' },
]

// 根据 apiData 生成柱形图数据
const barChartData = computed(() => {
  const categories = ['发布数', '回复评论数', '回复消息数', '点赞数', '点击量', '总曝光量']

  // 获取各平台数据
  const twitter = props.apiData?.twitter || {
    total_public_count: 0,
    total_comment_count: 0,
    total_message_count: 0,
    total_like_count: 0,
    total_click_count: 0,
    total_impression_count: 0,
  }

  const ins = props.apiData?.ins || {
    total_public_count: 0,
    total_comment_count: 0,
    total_message_count: 0,
    total_like_count: 0,
    total_click_count: 0,
    total_impression_count: 0,
  }

  const fb = props.apiData?.fb || {
    total_public_count: 0,
    total_comment_count: 0,
    total_message_count: 0,
    total_like_count: 0,
    total_click_count: 0,
    total_impression_count: 0,
  }

  return {
    categories,
    X: [
      twitter.total_public_count,
      twitter.total_comment_count,
      twitter.total_message_count,
      twitter.total_like_count,
      twitter.total_click_count,
      twitter.total_impression_count,
    ],
    Ins: [
      ins.total_public_count,
      ins.total_comment_count,
      ins.total_message_count,
      ins.total_like_count,
      ins.total_click_count,
      ins.total_impression_count,
    ],
    FB: [
      fb.total_public_count,
      fb.total_comment_count,
      fb.total_message_count,
      fb.total_like_count,
      fb.total_click_count,
      fb.total_impression_count,
    ],
  }
})

// 根据选择的平台过滤数据
const filteredData = computed(() => {
  if (selectedPlatform.value === 'all') {
    // 显示所有平台
    return {
      categories: barChartData.value.categories,
      data: [
        { name: 'X (Twitter)', data: barChartData.value.X, color: '#F59E0B' },
        { name: 'Instagram', data: barChartData.value.Ins, color: '#10B981' },
        { name: 'Facebook', data: barChartData.value.FB, color: '#3B82F6' },
      ],
    }
  } else if (selectedPlatform.value === 'X') {
    return {
      categories: barChartData.value.categories,
      data: [{ name: 'X (Twitter)', data: barChartData.value.X, color: '#F59E0B' }],
    }
  } else if (selectedPlatform.value === 'Ins') {
    return {
      categories: barChartData.value.categories,
      data: [{ name: 'Instagram', data: barChartData.value.Ins, color: '#10B981' }],
    }
  } else if (selectedPlatform.value === 'FB') {
    return {
      categories: barChartData.value.categories,
      data: [{ name: 'Facebook', data: barChartData.value.FB, color: '#3B82F6' }],
    }
  } else {
    // 默认显示所有平台
    return {
      categories: barChartData.value.categories,
      data: [
        { name: 'X (Twitter)', data: barChartData.value.X, color: '#F59E0B' },
        { name: 'Instagram', data: barChartData.value.Ins, color: '#10B981' },
        { name: 'Facebook', data: barChartData.value.FB, color: '#3B82F6' },
      ],
    }
  }
})

// ECharts柱形图配置
const barChartOption = computed(() => {
  const series = filteredData.value.data.map((item) => ({
    name: item.name,
    type: 'bar',
    data: item.data,
    itemStyle: {
      color: item.color,
    },
    barWidth: filteredData.value.data.length === 1 ? '40%' : '20%',
    label: {
      show: true,
      position: 'top',
      color: '#374151',
      fontSize: 11,
      fontWeight: 'normal',
    },
  }))

  return {
    backgroundColor: 'transparent',
    grid: {
      left: '60px',
      right: '40px',
      top: '40px',
      bottom: '10px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: filteredData.value.categories,
      axisLine: {
        lineStyle: {
          color: '#E5E7EB',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12,
        interval: 0,
        rotate: 0,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12,
        formatter: '{value}',
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6',
          type: 'solid',
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      formatter: (params: any[]) => {
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0]?.name || ''}</div>`
        params.forEach((param: any) => {
          result += `
            <div style="display: flex; align-items: center; margin: 2px 0;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${param.color}; margin-right: 8px;"></span>
              <span style="flex: 1;">${param.seriesName}:</span>
              <span style="font-weight: bold; margin-left: 8px;">${param.value}</span>
            </div>
          `
        })
        return result
      },
    },
    legend: {
      show: false, // 隐藏默认图例，因为我们有自定义的
    },
    series: series,
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
  }
})

const emit = defineEmits(['platform-change'])

const selectPlatform = (value: string) => {
  selectedPlatform.value = value
  emit('platform-change', value)
}
</script>

<style scoped>
/* 图表容器样式 */
.h-90 {
  transition: all 0.3s ease;
}

/* 选中状态动画 */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .lg\\:grid-cols-5 {
    grid-template-columns: 1fr;
  }

  .lg\\:col-span-4,
  .lg\\:col-span-1 {
    grid-column: span 1;
  }
}
</style>
