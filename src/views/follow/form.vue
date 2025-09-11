<template>
  <Modal v-if="showModal" :fullScreenBackdrop="true" @close="closeModal">
    <template #body>
      <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <h3 class="mb-4 text-lg font-semibold">{{ isEditMode ? '编辑关注列表' : '新增关注列表' }}</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">配置名称<span
                class="text-error-500">*</span></label>
            <input v-model="form.name" type="text" placeholder="如：OpenAI GPT-4配置"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台名称<span
                class="text-error-500">*</span></label>
            <input v-model="form.platform" type="text" placeholder="如：OpenAI"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">API Key<span
                class="text-error-500">*</span></label>
            <input v-model="form.apiKey" type="text" placeholder="如：sk-xxxxxxxxxxxxxxxx"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">状态<span
                class="text-error-500">*</span></label>
            <select v-model="form.status"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
              <option value="active">启用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">优先级</label>
            <input v-model.number="form.priority" type="number" min="1" placeholder="如：1"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
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
import { ref, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { createFollow, updateFollow } from '@/api/follow.ts'
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
  name: '',
  platform: '',
  apiKey: '',
  status: 'active',
  priority: 1
})

// 加载状态
const isLoading = ref(false)

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    form.value = {
      name: newData.name || '',
      platform: newData.platform || '',
      apiKey: newData.apiKey || '',
      status: newData.status || 'active',
      priority: newData.priority || 1
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
    name: '',
    platform: '',
    apiKey: '',
    status: 'active',
    priority: 1
  }
}

// 提交表单
async function submitForm() {
  if (isLoading.value) return

  // 表单验证
  if (!form.value.name.trim()) {
    toast.error('请填写配置名称', {
      description: '配置名称不能为空'
    })
    return
  }

  if (!form.value.platform.trim()) {
    toast.error('请填写平台名称', {
      description: '平台名称不能为空'
    })
    return
  }

  if (!form.value.apiKey.trim()) {
    toast.error('请填写API Key', {
      description: 'API Key不能为空'
    })
    return
  }

  isLoading.value = true

  try {
    const payload = {
      name: form.value.name.trim(),
      platform: form.value.platform.trim(),
      apiKey: form.value.apiKey.trim(),
      status: form.value.status,
      priority: form.value.priority
    }

    if (props.isEditMode) {
      await updateFollow(props.editData.id, payload)
      toast.success('更新成功', {
        description: '服务配置已成功更新'
      })
    } else {
      await createFollow(payload)
      toast.success('创建成功', {
        description: '服务配置已成功创建'
      })
    }

    emit('success')
    closeModal()
  } catch (error) {
    console.error('Failed to save follow config:', error)
    toast.error(props.isEditMode ? '更新失败' : '创建失败', {
      description: error.response?.data?.message || error.message || (props.isEditMode ? '更新服务配置时发生错误' : '创建服务配置时发生错误')
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>

</style>
