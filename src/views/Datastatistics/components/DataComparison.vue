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
      <!-- 日期范围显示 -->
      <div>
        <span class="text-sm text-gray-900" style="color: #4d63f2">{{ dateRange }}</span>
      </div>
    </div>

    <!-- 图表和图例布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <!-- 左侧：ECharts折线图 -->
      <div class="lg:col-span-6">
        <div class="h-90 bg-gray-50 rounded-lg p-4">
          <v-chart
            class="w-full h-full"
            :option="chartOption"
            :autoresize="true"
            @mouseover="handleChartMouseOver"
            @mouseout="handleChartMouseOut"
          />
        </div>
      </div>

      <!-- 右侧：可点击图例 -->
      <div class="lg:col-span-1">
        <div class="space-y-3">
          <div
            v-for="series in chartSeries"
            :key="series.name"
            :class="[
              'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all',
              series.visible ? 'bg-gray-100  border-gray-300' : 'hover:bg-gray-50',
            ]"
            @click="toggleSeries(series.name)"
          >
            <span class="text-sm text-gray-900 text-right flex-1">{{ series.name }}</span>
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: series.color }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, computed, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
])

interface Platform {
  label: string
  value: string
}

interface ChartSeries {
  name: string
  data: number[]
  color: string
  visible: boolean
}

interface TooltipParams {
  axisValue: string
  seriesName: string
  value: number
  color: string
}

// Props
const props = defineProps<{
  selectedDate: string
}>()

const selectedPlatform = ref('X')
const dateRange = ref('2015-10-15~2015-10-20')

// 根据选择的日期生成日期范围
const generateDateRange = (dateStr: string) => {
  if (!dateStr) return '2015-10-15~2015-10-20'

  // 如果已经是日期范围格式 (YYYY-MM-DD~YYYY-MM-DD)，直接返回
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}~\d{4}-\d{2}-\d{2}$/)) {
    return dateStr
  }

  // 获取当前日期字符串
  const today = new Date()
  const currentDateStr = today.toISOString().split('T')[0]

  // 如果是当前日期，直接显示当前日期
  if (dateStr === currentDateStr) {
    return currentDateStr
  }

  // 如果是具体日期格式 (YYYY-MM-DD) 但不是当前日期
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = new Date(dateStr)
    const startDate = new Date(date)
    startDate.setDate(date.getDate() - 5) // 向前推5天作为开始日期

    const startStr = startDate.toISOString().split('T')[0]
    const endStr = date.toISOString().split('T')[0]
    return `${startStr}~${endStr}`
  }

  // 如果是相对日期 (近X日)
  const startDate = new Date(today)

  switch (dateStr) {
    case 'last3days':
      startDate.setDate(today.getDate() - 3)
      break
    case 'last7days':
      startDate.setDate(today.getDate() - 7)
      break
    case 'last14days':
      startDate.setDate(today.getDate() - 14)
      break
    case 'last30days':
      startDate.setDate(today.getDate() - 30)
      break
    default:
      startDate.setDate(today.getDate() - 5)
  }

  const startStr = startDate.toISOString().split('T')[0]
  const endStr = today.toISOString().split('T')[0]
  return `${startStr}~${endStr}`
}

// 监听选择的日期变化
watch(
  () => props.selectedDate,
  (newDate) => {
    if (newDate) {
      dateRange.value = generateDateRange(newDate)
    }
  },
  { immediate: true },
)

const platforms: Platform[] = [
  { label: 'X', value: 'X' },
  { label: 'Ins', value: 'Ins' },
  { label: 'FB', value: 'FB' },
]

// 图表数据系列 - 默认显示发布数
const chartSeries = ref<ChartSeries[]>([
  {
    name: '发布数',
    data: [200, 200, 998],
    color: '#F59E0B', // 橙色
    visible: true, // 默认显示发布数
  },
  {
    name: '回复评论数',
    data: [150, 180, 850],
    color: '#F97316', // 深橙色
    visible: false,
  },
  {
    name: '回复消息数',
    data: [120, 160, 720],
    color: '#EF4444', // 红色
    visible: false,
  },
  {
    name: '点赞数',
    data: [300, 350, 1200],
    color: '#8B5CF6', // 紫色
    visible: false,
  },
  {
    name: '点击量',
    data: [80, 100, 400],
    color: '#3B82F6', // 蓝色
    visible: false,
  },
  {
    name: '总曝光量',
    data: [500, 600, 2000],
    color: '#10B981', // 绿色
    visible: false,
  },
])

// 计算可见的数据系列
const visibleSeries = computed(() => {
  return chartSeries.value.filter((series) => series.visible)
})

// ECharts配置
const chartOption = computed(() => {
  const series = visibleSeries.value.map((item) => ({
    name: item.name,
    type: 'line',
    data: item.data,
    smooth: false,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: 2,
      color: item.color,
    },
    itemStyle: {
      color: item.color,
      borderColor: '#fff',
      borderWidth: 2,
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: item.color + '40',
      },
    },
    animationDelay: (idx: number) => idx * 100,
    animationDuration: 1000,
  }))

  return {
    backgroundColor: 'transparent',
    grid: {
      left: '50px',
      right: '20px',
      top: '30px',
      bottom: '40px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['2015-10-18', '2015-10-19', '2015-10-20'],
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
      },
    },
    yAxis: {
      type: 'value',
      min: -50,
      max: 2500,
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
          type: 'dashed',
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
      formatter: (params: TooltipParams[]) => {
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0]?.axisValue || ''}</div>`
        params.forEach((param: TooltipParams) => {
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

// 切换数据系列的可见性
const toggleSeries = (seriesName: string) => {
  const series = chartSeries.value.find((s) => s.name === seriesName)
  if (series) {
    series.visible = !series.visible
  }
}

// ECharts事件处理
const handleChartMouseOver = (params: unknown) => {
  console.log('Chart mouse over:', params)
}

const handleChartMouseOut = () => {
  console.log('Chart mouse out')
}
</script>

<style scoped>
/* 图表容器样式 */
.h-80 {
  transition: all 0.3s ease;
}

.h-80:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* 悬停效果 */
.cursor-pointer:hover {
  transform: translateY(-1px);
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
