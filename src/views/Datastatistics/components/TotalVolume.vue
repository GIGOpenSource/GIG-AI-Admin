<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">总数据量</h3>

    <!-- ECharts环形图和图例布局 -->
    <div class="relative flex justify-center items-center mb-8">
      <!-- 左侧图例 -->
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-4">
        <div
          v-for="(item, index) in leftLegendData"
          :key="item.name"
          class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          @click="selectPlatform(item.name)"
        >
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
          <div class="text-sm text-gray-600">
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-xs text-gray-500">{{ item.value }} ({{ item.percentage }}%)</div>
          </div>
        </div>
      </div>

      <!-- 中间环形图 -->
      <div class="w-48 h-48">
        <v-chart
          class="w-full h-full"
          :option="donutChartOption"
          :autoresize="true"
          @click="handleDonutClick"
        />
      </div>

      <!-- 右侧图例 -->
      <div class="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4">
        <div
          v-for="(item, index) in rightLegendData"
          :key="item.name"
          class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          @click="selectPlatform(item.name)"
        >
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
          <div class="text-sm text-gray-600">
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-xs text-gray-500">{{ item.value }} ({{ item.percentage }}%)</div>
          </div>
        </div>
      </div>

      <!-- 底部图例 -->
      <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div
          v-for="(item, index) in bottomLegendData"
          :key="item.name"
          class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity justify-center"
          @click="selectPlatform(item.name)"
        >
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
          <div class="text-sm text-gray-600">
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-xs text-gray-500">{{ item.value }} ({{ item.percentage }}%)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 水平条形图 - 可点击 -->
    <div class="space-y-1">
      <div
        v-for="metric in metrics"
        :key="metric.key"
        :class="['cursor-pointer p-3 rounded-lg transition-all']"
        @click="selectMetric(metric.key)"
      >
        <div class="flex items-center gap-3">
          <span
            class="text-sm text-gray-600 min-w-[80px] px-3 py-2 rounded-full"
            :class="selectedMetric === metric.key ? 'bg-gray-200' : ''"
            >{{ metric.label }}</span
          >
          <div class="flex-1 rounded-full h-3" style="background-color: #ced5ff">
            <div
              class="bg-blue-600 h-3 rounded-full transition-all duration-300"
              :style="{ width: metric.percentage + '%' }"
            ></div>
          </div>
          <span class="text-sm text-gray-600 min-w-[60px] text-right">{{ metric.value }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
    <!-- 分段控制器 -->
    <div class="flex mb-6">
      <div
        class="cursor-pointer px-4 py-1 rounded-l-2xl border border-gray-300 font-medium text-black"
        :class="selectedSegment === 'X' ? 'bg-blue-100' : 'bg-white'"
        @click="selectSegment('X')"
      >
        X
      </div>
      <div
        class="cursor-pointer px-4 py-1 border-t border-b border-gray-300 font-medium text-black"
        :class="selectedSegment === 'Ins' ? 'bg-blue-100' : 'bg-white'"
        @click="selectSegment('Ins')"
      >
        Ins
      </div>
      <div
        class="cursor-pointer px-4 py-1 rounded-r-2xl border border-gray-300 font-medium text-black"
        :class="selectedSegment === 'FB' ? 'bg-blue-100' : 'bg-white'"
        @click="selectSegment('FB')"
      >
        FB
      </div>
    </div>
    <!-- 比率统计 - 可点击 -->
    <div class="space-y-1">
      <div
        v-for="rate in rates"
        :key="rate.key"
        :class="['cursor-pointer p-3 rounded-lg transition-all']"
        @click="selectRate(rate.key)"
      >
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600 min-w-[80px]">{{ rate.label }}</span>
          <div class="flex-1 rounded-full h-3" style="background-color: #ced5ff">
            <div
              class="bg-blue-600 h-3 rounded-full transition-all duration-300"
              :style="{ width: rate.value + '%' }"
            ></div>
          </div>
          <span class="text-sm text-gray-600 min-w-[60px] text-right">{{ rate.value }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import type { ECElementEvent } from 'echarts/core'
import VChart from 'vue-echarts'

// 注册ECharts组件
use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

interface TotalData {
  total: number
  instagram: number
  x: number
  facebook: number
  totalPosts: number
  totalImpressions: number
  totalComments: number
  totalReplies: number
  totalLikes: number
  totalClicks: number
}

interface MetricItem {
  key: string
  label: string
  value: number
  percentage: number
}

interface RateItem {
  key: string
  label: string
  value: number
}

const props = defineProps<{
  totalData: TotalData
}>()

// 选择状态
const selectedPlatform = ref('')
const selectedMetric = ref('')
const selectedRate = ref('')
const selectedSegment = ref('X') // 默认选中X

// 环形图数据 - 重新排序以匹配图例显示
const donutData = computed(() => [
  {
    name: 'Instagram',
    value: props.totalData.instagram,
    color: '#10B981', // 绿色
    percentage: Math.round((props.totalData.instagram / props.totalData.total) * 100),
  },
  {
    name: 'X (Twitter)',
    value: props.totalData.x,
    color: '#F59E0B', // 橙色
    percentage: Math.round((props.totalData.x / props.totalData.total) * 100),
  },
  {
    name: 'Facebook',
    value: props.totalData.facebook,
    color: '#3B82F6', // 蓝色
    percentage: Math.round((props.totalData.facebook / props.totalData.total) * 100),
  },
])

// 图例分组数据
const leftLegendData = computed(() => [donutData.value[0]]) // Instagram
const rightLegendData = computed(() => [donutData.value[1]]) // X (Twitter)
const bottomLegendData = computed(() => [donutData.value[2]]) // Facebook

// ECharts环形图配置
const donutChartOption = computed(() => ({
  backgroundColor: 'transparent',
  series: [
    {
      name: '平台数据',
      type: 'pie',
      radius: ['60%', '80%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      sort: null, // 禁用自动排序，保持数据原始顺序
      startAngle: 210, // 固定起始角度
      roseType: false, // 确保不是玫瑰图模式
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold',
          color: '#333',
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      labelLine: {
        show: false,
      },
      data: donutData.value.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: item.color,
        },
        // 添加索引确保顺序
        _index: index,
      })),
    },
  ],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    textStyle: {
      color: '#fff',
    },
  },
  graphic: {
    type: 'text',
    left: 'center',
    top: 'center',
    style: {
      text: props.totalData.total.toString(),
      textAlign: 'center',
      fill: '#333',
      fontSize: 24,
      fontWeight: 'bold',
    },
  },
  animation: true,
  animationType: 'scale',
  animationEasing: 'elasticOut' as const,
  animationDelay: () => Math.random() * 200,
}))

// 指标数据
const metrics = computed((): MetricItem[] => [
  {
    key: 'totalPosts',
    label: '总发布数',
    value: props.totalData.totalPosts,
    percentage: 95,
  },
  {
    key: 'totalImpressions',
    label: '总曝光量',
    value: props.totalData.totalImpressions,
    percentage: 95,
  },
  {
    key: 'totalComments',
    label: '总评论数',
    value: props.totalData.totalComments,
    percentage: 10,
  },
  {
    key: 'totalReplies',
    label: '总回复数',
    value: props.totalData.totalReplies,
    percentage: 10,
  },
  {
    key: 'totalLikes',
    label: '总点赞数',
    value: props.totalData.totalLikes,
    percentage: 95,
  },
  {
    key: 'totalClicks',
    label: '总点击量',
    value: props.totalData.totalClicks,
    percentage: 10,
  },
])

// 比率数据
const rates = computed((): RateItem[] => [
  {
    key: 'impressionRate',
    label: '曝光率',
    value: 100,
  },
  {
    key: 'likeRate',
    label: '点赞率',
    value: 15,
  },
  {
    key: 'clickRate',
    label: '点击率',
    value: 12,
  },
])

// 事件处理函数
const selectPlatform = (platformName: string) => {
  selectedPlatform.value = platformName
  console.log('Selected platform:', platformName)
}

const selectMetric = (metricKey: string) => {
  selectedMetric.value = metricKey
  console.log('Selected metric:', metricKey)
}

const selectRate = (rateKey: string) => {
  selectedRate.value = rateKey
  console.log('Selected rate:', rateKey)
}

const handleDonutClick = (params: ECElementEvent) => {
  console.log('Donut chart clicked:', params)
  if (params?.data && typeof params.data === 'object' && 'name' in params.data) {
    selectPlatform(params.data.name as string)
  }
}

const selectSegment = (segment: string) => {
  selectedSegment.value = segment
  console.log('Selected segment:', segment)
}
</script>

<style scoped>
/* 悬停效果 */
.cursor-pointer:hover {
  transform: translateY(-1px);
}

/* 选中状态动画 */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* 条形图动画 */
.bg-blue-600,
.bg-green-600 {
  transition: width 0.3s ease-in-out;
}
</style>
