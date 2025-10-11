<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
  >
    <div class="flex items-center gap-3 mb-4">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        style="margin: 0 auto"
        :class="platform.bgColor"
      >
        <img
          v-if="!imageError"
          :src="platform.icon"
          :alt="platform.name"
          class="w-full h-full object-cover rounded-lg"
          @error="handleImageError"
          @load="handleImageLoad"
        />
        <div v-else class="w-full h-full bg-white rounded-lg flex items-center justify-center">
          <span class="text-sm font-bold text-gray-600">{{ platform.name.charAt(0) }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-sm" :style="{ color: getPlatformDataColor(platform.name) }">发布数</span>
        <span class="text-lg font-semibold text-gray-900">{{ data.posts }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm" :style="{ color: getPlatformDataColor(platform.name) }">曝光量</span>
        <span class="text-lg font-semibold text-gray-900">{{ data.impressions }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm" :style="{ color: getPlatformDataColor(platform.name) }"
          >回复评论数</span
        >
        <span class="text-lg font-semibold text-gray-900">{{ data.replyComments }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm" :style="{ color: getPlatformDataColor(platform.name) }"
          >回复消息数</span
        >
        <span class="text-lg font-semibold text-gray-900">{{ data.replyMessages }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm" :style="{ color: getPlatformDataColor(platform.name) }">点赞数</span>
        <span class="text-lg font-semibold text-gray-900">{{ data.likes }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm" :style="{ color: getPlatformDataColor(platform.name) }">点击量</span>
        <span class="text-lg font-semibold text-gray-900">{{ data.clicks }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'

interface Platform {
  name: string
  icon: string
  bgColor: string
}

interface PlatformData {
  posts: number
  impressions: number
  replyComments: number
  replyMessages: number
  likes: number
  clicks: number
}

const props = defineProps<{
  platform: Platform
  data: PlatformData
}>()

const imageError = ref(false)

// 获取平台数据标签颜色
const getPlatformDataColor = (platformName: string) => {
  switch (platformName) {
    case 'Instagram':
      return '#D76E83'
    case 'Facebook':
      return '#5C7CBE'
    default:
      return '#6B7280' // 默认灰色
  }
}

// 调试函数
const handleImageError = (event: Event) => {
  console.error('Image failed to load:', props.platform.icon)
  console.error('Error event:', event)
  imageError.value = true
}

const handleImageLoad = (event: Event) => {
  console.log('Image loaded successfully:', props.platform.icon)
  imageError.value = false
}
</script>
