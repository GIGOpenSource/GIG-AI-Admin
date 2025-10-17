<template>
  <Modal v-if="isOpen" :fullScreenBackdrop="true" @close="closeDialog">
    <template #body>
      <div
        class="relative z-10 w-full max-w-4xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 mt-8"
      >
        <div style="height: 5vh"></div>

        <!-- 弹窗标题 -->
        <h3 class="mb-6 text-lg font-semibold">账号数据</h3>

        <!-- 企业选择 -->
        <div class="mb-6">
          <select
            v-model="selectedEnterprise"
            class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          >
            <option value="admin">admin</option>
            <option value="企业A">企业A</option>
            <option value="企业B">企业B</option>
            <option value="企业C">企业C</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <!-- 账号数据统计 -->
        <div class="mb-8">
          <h4 class="mb-4 text-md font-medium">账号数据</h4>
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                总数: {{ accountStats.total }}
              </div>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                x: {{ accountStats.x }}
              </div>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                ins: {{ accountStats.ins }}
              </div>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                Facebook: {{ accountStats.facebook }}
              </div>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div class="text-green-600 dark:text-green-400 text-lg font-semibold">
                正常: {{ accountStats.normal }}
              </div>
            </div>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div class="text-red-600 dark:text-red-400 text-lg font-semibold">
                已封禁: {{ accountStats.banned }}
              </div>
            </div>
          </div>
        </div>

        <!-- 转移账号 -->
        <div class="mb-8">
          <h4 class="mb-4 text-md font-medium">转移账号</h4>
          <div class="flex items-center gap-4 flex-nowrap overflow-x-auto">
            <select
              v-model="transferForm.fromEnterprise"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="">请选择企业</option>
              <option value="admin">admin</option>
              <option value="企业A">企业A</option>
              <option value="企业B">企业B</option>
              <option value="企业C">企业C</option>
              <option value="其他">其他</option>
            </select>

            <select
              v-model="transferForm.platform"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="">请选择平台</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
            </select>

            <span class="text-gray-600 whitespace-nowrap">转移</span>

            <input
              v-model="transferForm.quantity"
              type="number"
              placeholder="请输入数量"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />

            <span class="text-gray-600 whitespace-nowrap">到</span>

            <select
              v-model="transferForm.toEnterprise"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="">请选择企业</option>
              <option value="admin">admin</option>
              <option value="企业A">企业A</option>
              <option value="企业B">企业B</option>
              <option value="企业C">企业C</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-center gap-3 pt-4">
          <Button type="button" variant="outline" @click="closeDialog" :disabled="isLoading">
            取消
          </Button>
          <Button type="button" @click="handleConfirm" :disabled="isLoading">
            <span v-if="isLoading" class="mr-2">处理中...</span>
            确认
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { toast } from 'vue-sonner'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['close', 'showError'])

// 响应式数据
const selectedEnterprise = ref('admin')
const isLoading = ref(false)

// 账号统计数据
const accountStats = ref({
  total: 500,
  x: 200,
  ins: 200,
  facebook: 200,
  normal: 100,
  banned: 100,
})

// 转移表单
const transferForm = ref({
  fromEnterprise: '',
  platform: '',
  quantity: '',
  toEnterprise: '',
})

// 关闭弹窗
const closeDialog = () => {
  emit('close')
}

// 确认操作
const handleConfirm = async () => {
  // 验证表单
  if (!transferForm.value.fromEnterprise) {
    toast.error('请选择来源企业', {
      description: '来源企业不能为空',
    })
    return
  }
  if (!transferForm.value.platform) {
    toast.error('请选择平台', {
      description: '平台不能为空',
    })
    return
  }
  if (!transferForm.value.quantity || transferForm.value.quantity <= 0) {
    toast.error('请输入有效的数量', {
      description: '数量必须大于0',
    })
    return
  }
  if (!transferForm.value.toEnterprise) {
    toast.error('请选择目标企业', {
      description: '目标企业不能为空',
    })
    return
  }

  // 检查数量是否超出
  const quantity = parseInt(transferForm.value.quantity)
  const availableCount = getAvailableCount(
    transferForm.value.fromEnterprise,
    transferForm.value.platform,
  )

  if (quantity > availableCount) {
    emit('showError')
    return
  }

  // 执行转移操作
  isLoading.value = true
  try {
    // TODO: 调用API执行转移操作
    console.log('执行转移操作:', transferForm.value)

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success('转移成功')
    closeDialog()
  } catch (error) {
    console.error('转移失败:', error)
    toast.error('转移失败', {
      description: error.response?.data?.message || error.message || '转移操作时发生错误',
    })
  } finally {
    isLoading.value = false
  }
}

// 获取可用数量
const getAvailableCount = (enterprise, platform) => {
  // 这里应该根据实际的企业和平台返回可用数量
  // 暂时返回一个较小的数值用于测试
  return 50
}
</script>
