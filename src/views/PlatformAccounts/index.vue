<template>
    <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        平台账户配置
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        管理平台账户配置信息
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6">
        <div class="text-center py-12">
          <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            平台账户配置
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            此页面用于配置平台账户相关设置
          </p>
          <div class="space-y-4">
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              添加账户配置
            </button>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              功能开发中...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </ComponentCard>
  </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

// 页面数据
const loading = ref(false)

onMounted(() => {
  // 页面初始化逻辑
  console.log('平台账户配置页面已加载')
})
</script>

<style scoped>
/* 页面特定样式 */
</style>
