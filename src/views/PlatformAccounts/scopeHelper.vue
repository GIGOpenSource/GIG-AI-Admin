<template>
  <Drawer v-model:open="isOpen" direction="right">
    <DrawerOverlay class="bg-black/5" />
    <DrawerContent class="max-w-4xl">

      <div class="flex-1 overflow-y-auto px-4 pb-4 pt-22">
        <div class="space-y-6">
          <!-- 基本说明 -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              什么是权限类型（Scopes）？
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              权限类型定义了您的应用程序可以访问哪些数据和执行哪些操作。不同的平台有不同的权限类型。
            </p>
          </div>

          <!-- 输入格式 -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              输入格式
            </h4>
            <div class="rounded-lg p-3">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                多个权限用逗号分隔：
              </p>
              <code class="text-sm text-blue-600 dark:text-blue-400">
                email,pages_read_engagement,pages_show_list
              </code>
            </div>
          </div>

          <!-- 平台权限说明 -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Facebook 权限类型
            </h4>

            <!-- Facebook 权限内容 -->
            <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('business_management')">
                    business_management
                  </div>
                  <div class="text-xs">business_management 权限允许您的应用使用商务管理平台 API 执行读取和写入操作。</div>
                </div>

                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('email')">
                    email
                  </div>
                  <div class="text-xs">email 权限允许您的应用读取用户的首选邮箱。</div>
                </div>

                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('pages_manage_engagement')">
                    pages_manage_engagement
                  </div>
                  <div class="text-xs">pages_manage_engagement 权限允许您的应用创建、编辑和删除发布到公共主页上的评论。</div>
                </div>

                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('pages_manage_metadata')">
                    pages_manage_metadata
                  </div>
                  <div class="text-xs">pages_manage_metadata 权限允许您的应用订阅和接收有关公共主页动态的Webhook，以及配置信息。</div>
                </div>

                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('pages_manage_posts')">
                    pages_manage_posts
                  </div>
                  <div class="text-xs">pages_manage_posts 权限允许您的应用创建、编辑和删除您的公共主页帖子。</div>
                </div>

                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('pages_read_engagement')">
                    pages_read_engagement
                  </div>
                  <div class="text-xs">pages_read_engagement 权限允许您的应用读取下列内容和数据：公共主页发布的内容(帖子、动态)、粉丝数据(包括粉丝的姓名、公共主页范围编号)和头像，以及有关公共主页的元数据。</div>
                </div>

                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('pages_read_user_content')">
                    pages_read_user_content
                  </div>
                  <div class="text-xs">pages_read_user_content 权限允许您的应用读取公共主页中的用户生成内容(例如用户或其他公共主页发布的帖子、评论和评分)，以及删除公共主页帖子的用户评论。</div>
                </div>

                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('pages_show_list')">
                    pages_show_list
                  </div>
                  <div class="text-xs">pages_show_list 权限允许您的应用访问用户管理的公共主页列表。</div>
                </div>

                <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('public_profile')">
                    public_profile
                  </div>
                  <div class="text-xs">public_profile(公开资料)权限允许应用读取User (用户) 节点的 Default Public Profile Fields (默认的公开资料字段)。系统将自动授予所有应用此权限。</div>
                </div>

                <div class="pb-2">
                  <div class="font-medium text-gray-800 dark:text-gray-200 mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="copyToClipboard('read_insights')">
                    read_insights
                  </div>
                  <div class="text-xs">read_insights 权限允许您的应用读取用户拥有的公共主页、应用和网域的成效分析数据。</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  Drawer,
  DrawerOverlay,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { toast } from 'vue-sonner'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isOpen'])

const isOpen = computed({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
})


// 复制权限标识到剪贴板
const copyToClipboard = async (scope) => {
  try {
    await navigator.clipboard.writeText(scope)
    toast.success('权限标识已复制到剪贴板', {
      description: scope
    })
  } catch (err) {
    console.error('复制失败:', err)
    toast.error('复制失败', {
      description: '请手动复制权限标识'
    })
  }
}
</script>

<style scoped>
/* 代码样式 */
code {
  background-color: rgba(59, 130, 246, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
