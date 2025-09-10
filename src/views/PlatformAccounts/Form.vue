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
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  平台 <span class="text-error-500">*</span>
                </label>
                <select
                  v-model="form.provider"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                >
                  <option value="">请选择平台</option>
                  <option value="twitter">X</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>

              <!-- 项目名称 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  项目名称 <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="请输入项目名称"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- 是否默认 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
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
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  API版本
                </label>
                <input
                  v-model="form.api_version"
                  type="text"
                  placeholder="如：1.0、2.1"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- 回调地址 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  回调地址
                </label>
                <input
                  v-model="form.redirect_uris"
                  type="url"
                  placeholder="https://example.com/callback"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- App ID -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  App ID / Client ID
                </label>
                <input
                  v-model="form.app_id"
                  type="text"
                  placeholder="请输入App ID或Client ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- App 密钥 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  App 密钥 / Client Secret
                </label>
                <input
                  v-model="form.app_secret"
                  type="password"
                  placeholder="请输入App密钥或Client Secret"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- 读取使用Token -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  读取使用Token
                </label>
                <input
                  v-model="form.bearer_token"
                  type="password"
                  placeholder="根据平台要求输入"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  用户名 <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="form.account_external_username"
                  type="text"
                  placeholder="请输入用户名"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  required
                />
              </div>

              <!-- 账户UID -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  账户UID
                </label>
                <input
                  v-model="form.account_external_user_id"
                  type="text"
                  placeholder="根据平台要求输入"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- 输入Token -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  输入Token
                </label>
                <input
                  v-model="form.account_access_token"
                  type="password"
                  placeholder="根据平台要求输入"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <!-- 输入密钥 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  输入密钥
                </label>
                <input
                  v-model="form.account_refresh_token"
                  type="password"
                  placeholder="根据平台要求输入"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <!-- 所属用户 - 仅当用户角色为admin时显示 -->
            <div v-if="isAdminRole" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import { createPlatform, createAccount } from '@/api/platform.ts'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

// 页面数据
const loading = ref(false)
const userList = ref([])
const isEditMode = computed(() => !!route.params.id)

const currentPageTitle = computed(() =>
  isEditMode.value ? '编辑平台账户配置' : '新增平台账户配置'
)

// 获取当前用户信息
const currentUser = JSON.parse(localStorage.getItem('profile') || '{}')

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
  account_external_username: '',
  account_external_user_id: '',
  account_access_token: '',
  account_refresh_token: '',
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
  if (!form.value.account_external_username) {
    toast.error('请填写用户名')
    return
  }
  if (isAdminRole.value && !form.value.owner) {
    toast.error('请选择所属用户')
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
      redirect_uris: form.value.redirect_uris,
      bearer_token: form.value.bearer_token
    }

    // 根据平台类型设置不同的ID和Secret字段
    if (form.value.provider === 'twitter') {
      platformData.client_id = form.value.app_id
      platformData.client_secret = form.value.app_secret
    } else {
      platformData.app_id = form.value.app_id
      platformData.app_secret = form.value.app_secret
    }

    // 准备账户数据
    const accountData = {
      account_external_username: form.value.account_external_username,
      account_external_user_id: form.value.account_external_user_id,
      account_access_token: form.value.account_access_token,
      account_refresh_token: form.value.account_refresh_token,
      owner: form.value.owner
    }

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

    // 保存成功后返回列表页
    // router.push('/platform-accounts')
  } catch (error) {
    console.error('保存失败:', error)
    toast.error('保存失败', {
      description: error.response?.data?.message || error.message || '创建配置时发生错误'
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
    // TODO: 调用API获取用户列表
    // const response = await getUsers()
    // userList.value = response.data

    // 模拟数据
    userList.value = [
      { id: 1, username: 'admin', email: 'admin@example.com' },
      { id: 2, username: 'user1', email: 'user1@example.com' },
      { id: 3, username: 'user2', email: 'user2@example.com' },
      { id: 4, username: 'manager', email: 'manager@example.com' }
    ]
  } catch (error) {
    console.error('获取用户列表失败:', error)
    // TODO: 显示错误提示
  }
}

// 加载编辑数据
const loadEditData = async () => {
  if (!isEditMode.value) return

  loading.value = true
  try {
    // TODO: 调用API获取数据
    // const data = await getPlatformAccount(route.params.id)
    // form.value = { ...data }

    // 模拟数据
    form.value = {
      // 平台配置信息
      provider: 'openai',
      name: 'OpenAI GPT-4 项目',
      is_default: 'true',
      api_version: 'v1',
      redirect_uris: 'https://example.com/callback',
      app_id: 'app_123456789',
      app_secret: 'sk-***',
      bearer_token: 'bearer_***',
      // 用户信息
      account_external_username: 'john_doe',
      account_external_user_id: 'user_123456',
      account_access_token: 'access_***',
      account_refresh_token: 'refresh_***'
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    // TODO: 显示错误提示
  } finally {
    loading.value = false
  }
}

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
