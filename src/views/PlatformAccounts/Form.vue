<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- 平台配置信息 -->
          <div class="space-y-6">
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">平台配置信息</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">配置平台的基本信息和连接参数</p>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- 平台 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  平台 <span class="text-error-500">*</span>
                </label>
                <select
                  v-model="form.provider"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                >
                  <option value="">请选择平台</option>
                  <option v-for="option in PLATFORM_OPTIONS" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- 项目名称 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  项目名称 <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Project Name / App Name"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- 是否默认 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  是否默认 <span class="text-error-500">*</span>
                </label>
                <select
                  v-model="form.is_default"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                >
                  <option value="">请选择</option>
                  <option value="true">是</option>
                  <option value="false">否</option>
                </select>
              </div>

              <!-- API版本 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  API版本 <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.api_version"
                  type="text"
                  placeholder="x: Default 1.1, other:Graph API Version"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- 回调地址 -->
              <!-- <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  回调地址 <span class="text-error-500">*</span>
                </label>
                <div class="flex gap-2">
                  <input
                    v-model="form.redirect_uris"
                    type="url"
                    placeholder="Callback URI / OAuth Redirect URI"
                    class="dark:bg-dark-900 h-11 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    required
                    readonly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="getCallbackUrl"
                    :disabled="!form.provider"
                    class="h-11 px-4"
                  >
                    获取地址
                  </Button>
                </div>
              </div> -->

              <!-- App ID -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  App ID <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.app_id"
                  type="text"
                  placeholder="x: Client ID, other: App ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>

              <!-- App 密钥 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  App 密钥 <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.app_secret"
                  type="password"
                  placeholder="x: API Secret Key, other: App Secret"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">

              <!-- 读取使用Token -->
              <div v-if="form.provider !== 'twitter'">
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  读取使用Token <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.bearer_token"
                  type="password"
                  placeholder="App Token"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 用户信息 -->
          <div class="space-y-6">
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">用户信息</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">配置用户相关的信息和权限设置</p>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- 用户名 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  用户名 <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.external_username"
                  type="text"
                  placeholder="x: Screen Name, other: Username"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>

              <!-- 账户UID -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  账户UID
                </label>
                <input
                  v-model="form.external_user_id"
                  type="text"
                  placeholder="x: User ID, fb: ID, ins: Instagram Business Account ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  :readonly="form.provider === 'twitter'"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- 输入Token -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  输入Token <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.access_token"
                  type="password"
                  placeholder="x: Access Token, fb: User Access Token, ins: Page Access Token (Graph API)"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>

              <!-- 输入密钥 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  输入密钥 <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.refresh_token"
                  type="password"
                  placeholder="x: Access Token Secret, other: Refresh Token"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>
            </div>

            <!-- 所属用户 - 仅当用户角色为admin时显示 -->
            <div v-if="isAdminRole" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-bold text-black dark:text-white">
                  所属用户 <span class="text-error-500">*</span>
                </label>
                <select
                  v-model="form.owner"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  :required="isAdminRole"
                >
                  <option value="">请选择所属用户</option>
                  <option v-for="user in userList" :key="user.id" :value="user.id">
                    {{ user.username }} ({{ user.email }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              @click="handleCancel"
              :disabled="loading"
            >
              取消
            </Button>
            <Button
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" class="mr-2">保存中...</span>
              {{ isEditMode ? '更新配置' : '创建配置' }}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import { createPlatform, createAccount, getAccountById, getConfigById, updateConfig, updateAccount, getTwitterStart, getFacebookStart, getInstagramStart, getThreadsStart } from '@/api/platform.ts'
import { toast } from 'vue-sonner'
import { getUser } from '@/api/index.ts'
import { PLATFORM_OPTIONS } from '@/config/platforms'

const route = useRoute()
const router = useRouter()

// 页面数据
const loading = ref(false)
const userList = ref([])
const isEditMode = computed(() => !!route.query.id)

const currentPageTitle = computed(() =>
  isEditMode.value ? '编辑平台账户配置' : '新增平台账户配置'
)

// 获取当前用户信息
const currentUser = JSON.parse(localStorage.getItem('profile') || '{}')
const currentUserId = currentUser?.id || currentUser?.user_id || ''

// 判断是否为admin角色
const isAdminRole = computed(() => {
  return currentUser && (currentUser.is_superuser || currentUser.is_staff)
})

// 表单数据
const form = ref({
  // 平台配置信息
  provider: '',
  name: '',
  is_default: '',
  api_version: '',
  redirect_uris: '',
  app_id: '',
  app_secret: '',
  bearer_token: '',
  // 用户信息
  external_username: '',
  external_user_id: '',
  access_token: '',
  refresh_token: '',
  owner: ''
})

// 提交表单
const handleSubmit = async () => {
  // 表单验证
  if (!form.value.provider) {
    toast.error('请选择平台')
    return
  }
  if (!form.value.name) {
    toast.error('请填写项目名称')
    return
  }
  if (!form.value.is_default) {
    toast.error('请选择是否默认')
    return
  }
  if (!form.value.api_version) {
    toast.error('请填写API版本')
    return
  }
  // if (!form.value.redirect_uris) {
  //   toast.error('请填写回调地址')
  //   return
  // }
  if (!form.value.app_id) {
    toast.error('请填写App ID或Client ID')
    return
  }
  if (!form.value.app_secret) {
    toast.error('请填写App密钥或Client Secret')
    return
  }
  if (!form.value.bearer_token && form.value.provider !== 'twitter') {
    toast.error('请填写读取使用Token')
    return
  }
  if (!form.value.external_username) {
    toast.error('请填写用户名')
    return
  }
  if (isAdminRole.value && !form.value.owner) {
    toast.error('请选择所属用户')
    return
  }
  if (!form.value.access_token) {
    toast.error('请填写输入Token')
    return
  }
  if (!form.value.refresh_token) {
    toast.error('请填写输入密钥')
    return
  }

  loading.value = true
  try {
    console.log('提交表单数据:', form.value)

    // 准备平台配置数据
    const platformData = {
      provider: form.value.provider,
      name: form.value.name,
      is_default: form.value.is_default === 'true',
      api_version: form.value.api_version,
      // redirect_uris: form.value.redirect_uris,
      bearer_token: form.value.bearer_token
    }

    // 根据平台类型设置不同的ID和Secret字段
    if (form.value.provider === 'twitter') {
      platformData.client_id = form.value.app_id
    } else {
      platformData.app_id = form.value.app_id
    }
    // 新增时同时传递 client_secret 与 app_secret，取值均为 form.app_secret
    platformData.client_secret = form.value.app_secret
    platformData.app_secret = form.value.app_secret

    // 准备账户数据
    const accountData = {
      external_username: form.value.external_username,
      external_user_id: form.value.external_user_id,
      access_token: form.value.access_token,
      refresh_token: form.value.refresh_token,
      owner: isAdminRole.value ? form.value.owner : currentUserId
    }

    if (isEditMode.value) {
      // 编辑模式：更新现有配置
      const id = String(route.query.id || '')
      const configId = String(route.query.config || '')

      // 更新平台配置
      await updateConfig(configId, platformData)

      // 更新账户信息，确保provider使用平台配置的provider
      const updatedAccountData = {
        ...accountData,
        provider: form.value.provider
      }
      await updateAccount(id, updatedAccountData)

      toast.success('配置更新成功')
    } else {
      // 新增模式：创建新配置
      // 调用API创建平台配置
      const platformResponse = await createPlatform(platformData)

      // 使用平台配置的返回值更新账户数据
      const updatedAccountData = {
        ...accountData,
        config: platformResponse.id,
        provider: form.value.provider
      }

      // 调用API创建账户
      await createAccount(updatedAccountData)

      toast.success('配置创建成功')
    }

    // 保存成功后返回列表页
    router.push('/platform-accounts')
  } catch (error) {
    console.error('保存失败:', error)
    toast.error('保存失败', {
      description: error.response?.data?.message || error.message || (isEditMode.value ? '更新配置时发生错误' : '创建配置时发生错误')
    })
  } finally {
    loading.value = false
  }
}

// 取消操作
const handleCancel = () => {
  router.push('/platform-accounts')
}


// 获取用户列表
const getUserList = async () => {
  try {
    const response = await getUser({ page: 1, page_size: 100 })
    const results = response?.results || response || []
    userList.value = results
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 加载编辑数据
const loadEditData = async () => {
  if (!isEditMode.value) return
  const id = String(route.query.id || '')
  const configId = String(route.query.config || '')

  loading.value = true
  try {
    const [accountRes, configRes] = await Promise.all([
      id ? getAccountById(id) : Promise.resolve(null),
      configId ? getConfigById(configId) : Promise.resolve(null)
    ])

    // 渲染平台配置
    if (configRes) {
      form.value.provider = configRes.provider || ''
      form.value.name = configRes.name || ''
      form.value.is_default = String(!!configRes.is_default)
      form.value.api_version = configRes.api_version || ''
      // form.value.redirect_uris = configRes.redirect_uris || ''
      // 兼容 twitter 与其他平台的ID/secret
      form.value.app_id = configRes.client_id || configRes.app_id || ''
      form.value.app_secret = configRes.client_secret || configRes.app_secret || ''
      form.value.bearer_token = configRes.bearer_token || ''
    }

    // 渲染账户信息
    if (accountRes) {
      form.value.external_username = accountRes.external_username || ''
      form.value.external_user_id = accountRes.external_user_id || ''
      form.value.access_token = accountRes.access_token || ''
      form.value.refresh_token = accountRes.refresh_token || ''
      // 若接口返回归属用户
      if (accountRes.owner) {
        form.value.owner = accountRes.owner
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    toast.error('加载数据失败', { description: error?.response?.data?.message || error.message })
  } finally {
    loading.value = false
  }
}

// 监听provider变化，清空回调地址
// watch(() => form.value.provider, (newProvider, oldProvider) => {
//   if (newProvider !== oldProvider) {
//     form.value.redirect_uris = ''
//   }
// })

onMounted(() => {
  // 如果是admin角色，获取用户列表
  if (isAdminRole.value) {
    getUserList()
  }
  loadEditData()
})
</script>

<style scoped>
/* 页面特定样式 */
</style>
