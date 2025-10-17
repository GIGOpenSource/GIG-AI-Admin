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
            <option
              v-for="enterprise in props.enterpriseList"
              :key="enterprise.id || enterprise.username"
              :value="enterprise.username || enterprise.name"
            >
              {{ enterprise.username || enterprise.name || enterprise.company }}
            </option>
          </select>
        </div>

        <!-- 账号数据统计 -->
        <div class="mb-8">
          <div v-if="isLoadingAllocation" class="text-center py-4 text-gray-500">加载中...</div>
          <div v-else class="grid grid-cols-3 gap-4">
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
                正常: {{ accountStats.active }}
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
              <option
                v-for="enterprise in props.enterpriseList"
                :key="enterprise.id || enterprise.username"
                :value="enterprise.username || enterprise.name"
              >
                {{ enterprise.username || enterprise.name || enterprise.company }}
              </option>
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

            <div class="flex flex-col relative">
              <div class="text-xs text-gray-500 absolute -top-5 left-0 whitespace-nowrap">
                可用数量: {{ fromEnterpriseData.active || '暂无数据' }}
              </div>
              <input
                v-model="transferForm.quantity"
                type="number"
                placeholder="请输入数量"
                @input="handleQuantityInput"
                @keypress="handleQuantityKeypress"
                class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <span class="text-gray-600 whitespace-nowrap">到</span>

            <select
              v-model="transferForm.toEnterprise"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="">请选择企业</option>
              <option
                v-for="enterprise in props.enterpriseList"
                :key="enterprise.id || enterprise.username"
                :value="enterprise.username || enterprise.name"
              >
                {{ enterprise.username || enterprise.name || enterprise.company }}
              </option>
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
import { ref, computed, watch, onMounted } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { toast } from 'vue-sonner'
import { getAllocation, transferAccounts } from '@/api/pool.ts'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  enterpriseList: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits(['close', 'showError'])

// 获取当前用户username
const currentUsername = computed(() => {
  console.log('currentUsername computed triggered')
  if (typeof window !== 'undefined' && window.localStorage) {
    const profile = window.localStorage.getItem('profile')
    console.log('localStorage profile:', profile)
    if (profile) {
      try {
        const profileData = JSON.parse(profile)
        console.log('parsed profile data:', profileData)
        const username = profileData.username || 'admin'
        console.log('currentUsername result:', username)
        return username
      } catch (e) {
        console.error('解析profile失败:', e)
        return 'admin'
      }
    }
  }
  console.log('fallback to admin')
  return 'admin'
})

// 响应式数据
const selectedEnterprise = ref('admin')
const isLoading = ref(false)
const allocationData = ref([])
const isLoadingAllocation = ref(false)

// 转移账号相关数据
const fromEnterpriseData = ref({})
const isLoadingFromEnterprise = ref(false)

// 监听当前用户username变化，设置默认选中的企业
watch(
  currentUsername,
  (newUsername) => {
    console.log('currentUsername watcher triggered with:', newUsername)
    if (newUsername) {
      console.log('setting selectedEnterprise to:', newUsername)
      selectedEnterprise.value = newUsername
    }
  },
  { immediate: true },
)

// 获取分配数据的函数
const fetchAllocationDataForEnterprise = (enterpriseName) => {
  console.log('fetchAllocationDataForEnterprise called with:', enterpriseName)
  console.log('current enterpriseList:', props.enterpriseList)

  if (enterpriseName && enterpriseName !== 'admin') {
    // 从enterpriseList中找到对应的ID
    const enterprise = props.enterpriseList.find(
      (ent) => (ent.username || ent.name) === enterpriseName,
    )
    console.log('found enterprise:', enterprise)

    if (enterprise && enterprise.id) {
      console.log('calling fetchAllocationData with ID:', enterprise.id)
      fetchAllocationData(enterprise.id)
    } else {
      console.log('enterprise not found or no ID')
    }
  } else if (enterpriseName === 'admin') {
    console.log('admin selected, clearing allocation data')
    // 如果是admin，清空分配数据
    allocationData.value = []
  }
}

// 监听选中企业变化，获取对应的分配数据
watch(
  selectedEnterprise,
  (newEnterprise) => {
    console.log('selectedEnterprise watcher triggered with:', newEnterprise)
    fetchAllocationDataForEnterprise(newEnterprise)
  },
  { immediate: true },
)

// 监听企业列表变化，当列表加载完成后触发默认选择
watch(
  () => props.enterpriseList,
  (newList) => {
    console.log('enterpriseList watcher triggered with:', newList)
    console.log('selectedEnterprise.value:', selectedEnterprise.value)

    if (newList && newList.length > 0 && selectedEnterprise.value) {
      console.log('triggering fetchAllocationDataForEnterprise from enterpriseList watcher')
      // 企业列表加载完成后，重新触发当前选中企业的数据获取
      fetchAllocationDataForEnterprise(selectedEnterprise.value)
    }
  },
  { immediate: true },
)

// 监听弹窗打开状态，当弹窗打开时确保调用接口
watch(
  () => props.isOpen,
  (isOpen) => {
    console.log('Modal isOpen watcher triggered with:', isOpen)

    if (isOpen) {
      // 重置转移账号表单数据
      console.log('Modal opened, resetting transfer form data')
      transferForm.value = {
        fromEnterprise: '',
        platform: '',
        quantity: '',
        toEnterprise: '',
      }

      // 重置来源企业数据
      fromEnterpriseData.value = {}

      // 弹窗打开时，确保有默认选中的企业并调用接口
      console.log('Modal opened, ensuring default selection and API call')

      // 确保默认选中企业已设置
      const username = currentUsername.value
      console.log('Current username from localStorage:', username)

      if (username && username !== selectedEnterprise.value) {
        console.log('Setting default enterprise on modal open:', username)
        selectedEnterprise.value = username
      }

      // 强制测试API调用 - 使用一个固定的ID进行测试
      console.log('=== FORCE TESTING API CALL ===')
      setTimeout(() => {
        console.log('Testing API call with fixed ID: 1')
        fetchAllocationData(1)
      }, 500)

      // 延迟执行，确保DOM更新完成
      setTimeout(() => {
        console.log('=== NORMAL API CALL ===')
        console.log('Conditions check:', {
          selectedEnterprise: selectedEnterprise.value,
          enterpriseListLength: props.enterpriseList.length,
          username: username,
        })

        if (selectedEnterprise.value && props.enterpriseList.length > 0) {
          console.log('Modal opened - calling fetchAllocationDataForEnterprise')
          fetchAllocationDataForEnterprise(selectedEnterprise.value)
        } else {
          console.log('Modal opened but conditions not met, trying alternative approach')

          // 如果正常流程失败，尝试直接使用用户名作为企业名称
          if (username) {
            console.log('Trying direct approach with username:', username)
            fetchAllocationDataForEnterprise(username)
          }
        }
      }, 1000)
    }
  },
)

// 账号统计数据
const accountStats = computed(() => {
  console.log('accountStats computed triggered, allocationData:', allocationData.value)

  // 检查是否有统计数据
  if (
    !allocationData.value ||
    (typeof allocationData.value === 'object' && !allocationData.value.total)
  ) {
    console.log('No allocation data, returning zeros')
    return {
      total: 0,
      x: 0,
      ins: 0,
      facebook: 0,
      normal: 0,
      banned: 0,
      active: 0,
    }
  }

  // API返回的是统计数据对象，直接使用
  const apiStats = allocationData.value
  console.log('Using API stats directly:', apiStats)

  const stats = {
    total: apiStats.total || 0,
    x: apiStats.twitter || 0, // 直接使用API返回的twitter数据
    ins: 0, // API没有返回instagram数据，设为0
    facebook: apiStats.facebook || 0,
    normal: 0, // 这个字段在API中没有，设为0
    banned: apiStats.banned || 0,
    active: apiStats.active || 0,
  }

  console.log('Final stats:', stats)
  return stats
})

// 转移表单
const transferForm = ref({
  fromEnterprise: '',
  platform: '',
  quantity: '',
  toEnterprise: '',
})

// 监听转移表单中来源企业的变化
watch(
  () => transferForm.value.fromEnterprise,
  (newFromEnterprise) => {
    console.log('transferForm.fromEnterprise changed to:', newFromEnterprise)

    if (newFromEnterprise && newFromEnterprise !== 'admin') {
      // 从enterpriseList中找到对应的ID
      const enterprise = props.enterpriseList.find(
        (ent) => (ent.username || ent.name) === newFromEnterprise,
      )
      console.log('Found enterprise for from enterprise:', enterprise)

      if (enterprise && enterprise.id) {
        console.log('Calling fetchFromEnterpriseData with ID:', enterprise.id)
        fetchFromEnterpriseData(enterprise.id)
      }
    } else if (newFromEnterprise === 'admin') {
      console.log('Admin selected for from enterprise, clearing data')
      fromEnterpriseData.value = {}
    }
  },
)

// 关闭弹窗
const closeDialog = () => {
  emit('close')
}

// 处理数量输入
const handleQuantityInput = (event) => {
  // 移除所有非数字字符
  const value = event.target.value.replace(/[^0-9]/g, '')
  transferForm.value.quantity = value
}

// 处理按键输入，只允许数字
const handleQuantityKeypress = (event) => {
  // 只允许数字键（0-9）
  const charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

// 获取分配数据
const fetchAllocationData = async (ownerId) => {
  console.log('fetchAllocationData called with ownerId:', ownerId)
  try {
    isLoadingAllocation.value = true
    console.log('Calling getAllocation API with params:', { owner_id: ownerId })
    const response = await getAllocation({ owner_id: ownerId })
    console.log('getAllocation API response:', response)

    // API返回的是统计数据对象，直接保存
    const statsData = response.data || response
    console.log('Stats data from API:', statsData)

    // 将统计数据保存到allocationData中
    allocationData.value = statsData
    console.log('allocationData updated with stats:', allocationData.value)
  } catch (error) {
    console.error('获取分配数据失败:', error)
    toast.error('获取分配数据失败', {
      description: error.response?.data?.message || error.message || '获取分配数据时发生错误',
    })
  } finally {
    isLoadingAllocation.value = false
  }
}

// 获取来源企业的分配数据（用于转移账号功能）
const fetchFromEnterpriseData = async (ownerId) => {
  console.log('fetchFromEnterpriseData called with ownerId:', ownerId)
  try {
    isLoadingFromEnterprise.value = true
    console.log('Calling getAllocation API for from enterprise with params:', { owner_id: ownerId })
    const response = await getAllocation({ owner_id: ownerId })
    console.log('From enterprise API response:', response)

    // API返回的是统计数据对象，直接保存
    const statsData = response.data || response
    console.log('From enterprise stats data:', statsData)

    // 将统计数据保存到fromEnterpriseData中
    fromEnterpriseData.value = statsData
    console.log('fromEnterpriseData updated:', fromEnterpriseData.value)
  } catch (error) {
    console.error('获取来源企业数据失败:', error)
    toast.error('获取来源企业数据失败', {
      description: error.response?.data?.message || error.message || '获取来源企业数据时发生错误',
    })
  } finally {
    isLoadingFromEnterprise.value = false
  }
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
  const availableCount = getAvailableCount()

  if (quantity > availableCount) {
    emit('showError')
    return
  }

  // 执行转移操作
  isLoading.value = true
  try {
    // 获取来源企业和目标企业的ID
    const fromEnterprise = props.enterpriseList.find(
      (ent) => (ent.username || ent.name) === transferForm.value.fromEnterprise,
    )
    const toEnterprise = props.enterpriseList.find(
      (ent) => (ent.username || ent.name) === transferForm.value.toEnterprise,
    )

    if (!fromEnterprise || !toEnterprise) {
      toast.error('企业信息错误', {
        description: '无法找到对应的企业信息',
      })
      return
    }

    // 构建API参数
    const transferData = {
      provider: transferForm.value.platform,
      count: parseInt(transferForm.value.quantity),
      from_user_id: fromEnterprise.id,
      to_user_id: toEnterprise.id,
    }

    console.log('执行转移操作，API参数:', transferData)

    // 调用转移API
    await transferAccounts(transferData)

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
const getAvailableCount = () => {
  console.log('getAvailableCount called')
  console.log('fromEnterpriseData:', fromEnterpriseData.value)

  // 根据来源企业的数据返回可用数量
  if (fromEnterpriseData.value && fromEnterpriseData.value.active) {
    console.log('Available count from API:', fromEnterpriseData.value.active)
    return fromEnterpriseData.value.active
  }

  console.log('No data available, returning 0')
  return 0
}

// 组件挂载后的处理
onMounted(() => {
  console.log('BatchManagementDialog mounted')
  console.log('Initial state:', {
    isOpen: props.isOpen,
    selectedEnterprise: selectedEnterprise.value,
    enterpriseListLength: props.enterpriseList.length,
    currentUsername: currentUsername.value,
  })

  // 如果弹窗已经打开，尝试触发默认选择
  if (props.isOpen) {
    console.log('Modal is already open on mount, triggering default selection')
    setTimeout(() => {
      fetchAllocationDataForEnterprise(selectedEnterprise.value)
    }, 200)
  }
})
</script>
