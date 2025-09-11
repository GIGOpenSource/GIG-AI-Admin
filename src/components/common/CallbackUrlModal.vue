<template>
  <Modal v-if="isOpen" :fullScreenBackdrop="true" @close="closeModal">
    <template #body>
      <div class="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">查看回调地址</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              回调地址
            </label>
            <div class="flex gap-2">
              <input
                ref="urlInput"
                v-model="callbackUrl"
                type="text"
                readonly
                class="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="暂无回调地址"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="copyToClipboard"
                :disabled="!callbackUrl"
                class="px-4"
              >
                <svg v-if="!copied" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ copied ? '已复制' : '复制' }}
              </Button>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" @click="closeModal">
              关闭
            </Button>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { toast } from 'vue-sonner'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const callbackUrl = ref('')
const copied = ref(false)
const urlInput = ref(null)


// 监听url变化
watch(() => props.url, (newUrl) => {
  callbackUrl.value = newUrl || ''
}, { immediate: true })

// 复制到剪贴板
const copyToClipboard = async () => {
  if (!callbackUrl.value) return

  try {
    await navigator.clipboard.writeText(callbackUrl.value)
    copied.value = true
    toast.success('回调地址已复制到剪贴板')

    // 2秒后重置复制状态
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    toast.error('复制失败，请手动复制')
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
  copied.value = false
}
</script>

<style scoped>
/* 组件特定样式 */
</style>
