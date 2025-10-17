<template>
  <Modal v-if="isOpen" :fullScreenBackdrop="true" @close="closeDialog">
    <template #body>
      <div
        class="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 mt-8"
      >
        <div style="height: 5vh"></div>

        <!-- 错误提示内容 -->
        <div class="text-center py-8">
          <div class="text-blue-600 dark:text-blue-400 text-lg font-medium leading-relaxed mb-6">
            <div>您所选择的机器数量超出拥有的</div>
            <div>机器人数量，请重新修改</div>
          </div>

          <!-- 确认按钮 -->
          <Button @click="closeDialog" class="bg-blue-600 hover:bg-blue-700 text-white">
            确认
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['close'])

// 关闭弹窗
const closeDialog = () => {
  emit('close')
}
</script>
