<template>
  <!-- 背景遮罩 -->
  <div v-if="isOpen" class="fixed inset-0 z-50" @click="handleClose">
    <!-- 气泡弹窗 -->
    <div
      class="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] max-w-[320px]"
      :style="popupStyle"
      @click.stop
    >
      <!-- 小三角箭头 -->
      <div
        class="absolute w-3 h-3 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"
        :style="arrowStyle"
      ></div>

      <!-- 内容 -->
      <div class="flex items-start gap-3">
        <!-- 警告图标 -->
        <div class="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- 文本内容 -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {{ title }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {{ description }}
          </p>

          <!-- 按钮组 -->
          <div class="flex gap-2">
            <button
              @click="handleClose"
              :disabled="isLoading"
              class="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
            <button
              @click="handleConfirm"
              :disabled="isLoading"
              class="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <svg v-if="isLoading" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="isLoading">删除中</span>
              <span v-else>删除</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认删除'
  },
  description: {
    type: String,
    default: '此操作不可撤销，确定要删除吗？'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  // 触发元素的位置信息
  triggerRect: {
    type: Object,
    default: () => ({ top: 0, left: 0, width: 0, height: 0 })
  }
})

// Emits
const emit = defineEmits(['close', 'confirm'])

// 弹窗位置计算
const popupStyle = computed(() => {
  const rect = props.triggerRect
  const popupWidth = 320
  const popupHeight = 120
  const offset = 8

  // 计算水平位置（居中于触发元素）
  let left = rect.left + (rect.width / 2) - (popupWidth / 2)

  // 边界检查
  if (left < 10) left = 10
  if (left + popupWidth > window.innerWidth - 10) {
    left = window.innerWidth - popupWidth - 10
  }

  // 计算垂直位置（在触发元素上方）
  let top = rect.top - popupHeight - offset

  // 如果上方空间不够，显示在下方
  if (top < 10) {
    top = rect.bottom + offset
  }

  return {
    left: `${left}px`,
    top: `${top}px`
  }
})

// 箭头位置
const arrowStyle = computed(() => {
  const rect = props.triggerRect
  const popupWidth = 320
  const arrowOffset = 16

  // 计算箭头相对于弹窗的位置
  let left = rect.left + (rect.width / 2) - (rect.left + (rect.width / 2) - (rect.left + (rect.width / 2) - (popupWidth / 2)))

  // 边界检查
  if (left < arrowOffset) left = arrowOffset
  if (left > popupWidth - arrowOffset) left = popupWidth - arrowOffset

  return {
    left: `${left}px`,
    top: props.triggerRect.top > 200 ? '-6px' : 'calc(100% - 6px)',
    transform: props.triggerRect.top > 200 ? 'rotate(45deg)' : 'rotate(225deg)'
  }
})

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Methods
const handleClose = () => {
  if (!props.isLoading) {
    emit('close')
  }
}

const handleConfirm = () => {
  if (!props.isLoading) {
    emit('confirm')
  }
}
</script>
