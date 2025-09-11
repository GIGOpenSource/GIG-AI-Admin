<template>
  <Modal v-if="showModal" :fullScreenBackdrop="true" @close="closeModal">
    <template #body>
      <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <h3 class="mb-4 text-lg font-semibold">{{ isEditMode ? '编辑关注列表' : '新增关注列表' }}</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">对方账号<span
                class="text-error-500">*</span></label>
            <input v-model="form.external_user_id" type="text" placeholder="请输入对方账号"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">AI账号选择<span
                class="text-error-500">*</span></label>

            <!-- 自定义多选下拉框 -->
            <div class="relative ai-account-dropdown">
              <!-- 显示区域 -->
              <div @click="toggleAiAccountDropdown"
                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs cursor-pointer focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 min-h-[44px] flex items-center">
                <div v-if="form.runner_accounts.length === 0" class="text-gray-400">请选择AI账号</div>
                <div v-else class="flex flex-wrap gap-1">
                  <span v-for="accountId in form.runner_accounts" :key="accountId"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
                    <span class="px-1">{{ getAiAccountName(accountId) }}</span>
                    <button type="button" @click.stop="removeAiAccount(accountId)"
                      class="inline-flex items-center justify-center w-3 h-3 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300">
                      X
                    </button>
                  </span>
                </div>
                <!-- 下拉箭头 -->
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400 transition-transform duration-200"
                    :class="{ 'rotate-180': showAiAccountDropdown }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <!-- 下拉选项 -->
              <div v-if="showAiAccountDropdown"
                class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div v-if="aiAccountOptions.length === 0" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  暂无AI账号选项
                </div>
                <div v-else>
                  <div v-for="account in aiAccountOptions" :key="account.id" @click="toggleAiAccount(account.id)"
                    class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                    <span>{{ account.bot }}</span>
                    <div v-if="form.runner_accounts.includes(account.id)" class="text-blue-500">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" @click="closeModal">取消</Button>
            <Button type="submit" :disabled="isLoading">
              {{ isLoading ? '保存中...' : '保存' }}
            </Button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { createFollow, updateFollow, getBoot } from '@/api/follow.ts'
import { toast } from 'vue-sonner'

// Props
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['close', 'success'])

// 表单数据
const form = ref({
  external_user_id: '', // 对方账号
  runner_accounts: [] // AI账号选择
})

// 加载状态
const isLoading = ref(false)

// AI账号相关状态
const aiAccountOptions = ref([])
const showAiAccountDropdown = ref(false)

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    form.value = {
      external_user_id: newData.external_user_id || '',
      runner_accounts: newData.runner_accounts || []
    }
  }
}, { immediate: true, deep: true })

// 关闭弹窗
function closeModal() {
  emit('close')
  resetForm()
}

// 重置表单
function resetForm() {
  form.value = {
    external_user_id: '',
    runner_accounts: []
  }
}

// 提交表单
async function submitForm() {
  if (isLoading.value) return

  // 表单验证
  if (!form.value.external_user_id.trim()) {
    toast.error('请填写对方账号', {
      description: '对方账号不能为空'
    })
    return
  }

  if (form.value.runner_accounts.length === 0) {
    toast.error('请选择AI账号', {
      description: '至少需要选择一个AI账号'
    })
    return
  }

  isLoading.value = true

  try {
    const payload = {
      external_user_id: form.value.external_user_id.trim(),
      runner_accounts: form.value.runner_accounts
    }

    if (props.isEditMode) {
      await updateFollow(props.editData.id, payload)
      toast.success('更新成功', {
        description: '关注列表已成功更新'
      })
    } else {
      await createFollow(payload)
      toast.success('创建成功', {
        description: '关注列表已成功创建'
      })
    }

    emit('success')
    closeModal()
  } catch (error) {
    console.error('Failed to save follow config:', error)
    toast.error(props.isEditMode ? '更新失败' : '创建失败', {
      description: error.response?.data?.message || error.message || (props.isEditMode ? '更新关注列表时发生错误' : '创建关注列表时发生错误')
    })
  } finally {
    isLoading.value = false
  }
}

// AI账号相关方法
function toggleAiAccountDropdown() {
  showAiAccountDropdown.value = !showAiAccountDropdown.value
}

function toggleAiAccount(accountId) {
  const existingIndex = form.value.runner_accounts.indexOf(accountId)
  if (existingIndex > -1) {
    // 如果已选择，则移除
    form.value.runner_accounts.splice(existingIndex, 1)
  } else {
    // 如果未选择，则添加
    form.value.runner_accounts.push(accountId)
  }
}

function removeAiAccount(accountId) {
  const index = form.value.runner_accounts.indexOf(accountId)
  if (index > -1) {
    form.value.runner_accounts.splice(index, 1)
  }
}

function getAiAccountName(accountId) {
  const account = aiAccountOptions.value.find(option => option.id === accountId)
  return account ? account.bot : `账号${accountId}`
}

// 获取AI账号列表
async function fetchrunner_accounts() {
  try {
    // 这里需要调用获取AI账号的API，暂时使用模拟数据
    aiAccountOptions.value = [
      { id: '1', name: 'AI账号1' },
      { id: '2', name: 'AI账号2' },
      { id: '3', name: 'AI账号3' }
    ]
  } catch (error) {
    console.error('Failed to fetch AI accounts:', error)
    aiAccountOptions.value = []
  }
}

// 点击外部关闭下拉框
function handleClickOutside(event) {
  if (showAiAccountDropdown.value && !event.target.closest('.ai-account-dropdown')) {
    showAiAccountDropdown.value = false
  }
}
const getboot = () => {
  getBoot({})
    .then(res => {
      aiAccountOptions.value = res

    })
}
// 组件挂载时获取AI账号列表
onMounted(() => {
  console.log(111);

  getboot()
  fetchrunner_accounts()
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped></style>
