<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-4 mx-auto md:p-6" :class="isDatastatisticsPage ? '' : ''">
        <!-- max-w-(--breakpoint-2xl) -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
import { useRoute } from 'vue-router'

const { isExpanded, isHovered } = useSidebar()
const route = useRoute()

// 检查是否是数据统计页面
const isDatastatisticsPage = computed(() => {
  return route.name === 'Datastatistics'
})
</script>
