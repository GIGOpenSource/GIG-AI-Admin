<template>
  <header
    class="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b"
  >
    <div class="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
      <div
        class="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4"
      >
        <button
          @click="handleToggle"
          class="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
          :class="[
            isMobileOpen
              ? 'lg:bg-transparent dark:lg:bg-transparent bg-gray-100 dark:bg-gray-800'
              : '',
          ]"
        >
          <svg
            v-if="isMobileOpen"
            class="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
              fill=""
            />
          </svg>
          <svg
            v-else
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <HeaderLogo />
        <button
          @click="toggleApplicationMenu"
          class="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <!-- <SearchBar /> -->
      </div>

      <div
        v-if="role == 'admin'"
        :class="[isApplicationMenuOpen ? 'flex' : 'hidden']"
        class="items-center justify-between w-full gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none"
      >
        <div class="flex items-center gap-2 2xsm:gap-3">
          <button
            @click="openUserModal"
            class="!text-blue-600 px-4 py-2 text-sm font-medium rounded-lg"
            style="border: 1px solid #2563eb; background-color: white !important"
            onmouseover="this.style.backgroundColor='white'"
            onmouseout="this.style.backgroundColor='white'"
            title="切换企业数据"
          >
            <span v-if="selectedUser">{{ selectedUser.username }}</span>
            <span v-else>切换企业数据</span>
          </button>
          <ThemeToggler />
          <!-- <NotificationMenu /> -->
        </div>
        <UserMenu />
      </div>
    </div>

    <!-- 切换企业数据弹窗 -->
    <div
      v-if="showUserModal"
      class="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50"
      @click="closeUserModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-[600px] max-w-[90vw] mx-4 border border-gray-200"
        @click.stop
      >
        <!-- 标题栏和关闭按钮 -->
        <div class="relative px-6 py-4 border-b border-gray-200">
          <button
            @click="closeUserModal"
            class="absolute left-6 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <h3 class="text-lg font-semibold text-gray-900 text-center">切换企业数据</h3>
        </div>

        <div class="p-6">
          <div v-if="isLoadingUsers" class="text-center py-8">
            <div
              class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
            ></div>
            <p class="mt-2 text-sm text-gray-500">加载中...</p>
          </div>

          <div v-else-if="users.length === 0" class="text-center py-8">
            <p class="text-sm text-gray-500">暂无用户</p>
          </div>

          <div v-else class="grid grid-cols-4 gap-3">
            <!-- admin选项 -->
            <label
              class="flex items-center p-3 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': !tempSelectedUser }"
            >
              <input
                type="radio"
                :checked="!tempSelectedUser"
                @change="selectNoUser"
                class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-3 text-sm font-medium text-gray-900">admin</span>
            </label>

            <!-- 用户列表 -->
            <label
              v-for="user in users.slice(0, 7)"
              :key="user.id"
              class="flex items-center p-3 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': tempSelectedUser?.id === user.id }"
            >
              <input
                type="radio"
                :value="user.id"
                :checked="tempSelectedUser?.id === user.id"
                @change="selectUser(user)"
                class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-3 text-sm font-medium text-gray-900">{{ user.username }}</span>
            </label>

            <!-- 如果用户超过8个，显示更多用户 -->
            <template v-if="users.length > 7">
              <div
                v-for="user in users.slice(7)"
                :key="user.id"
                class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="{ 'border-blue-500 bg-blue-50': tempSelectedUser?.id === user.id }"
              >
                <input
                  type="radio"
                  :value="user.id"
                  :checked="tempSelectedUser?.id === user.id"
                  @change="selectUser(user)"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-3 text-sm font-medium text-gray-900">{{ user.username }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-center gap-4">
          <button
            @click="confirmSelection"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            确认
          </button>
          <button
            @click="closeUserModal"
            class="px-6 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { getUser } from '@/api/index'
import ThemeToggler from '../common/ThemeToggler.vue'
import SearchBar from './header/SearchBar.vue'
import HeaderLogo from './header/HeaderLogo.vue'
import NotificationMenu from './header/NotificationMenu.vue'
import UserMenu from './header/UserMenu.vue'

const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar()
const role = localStorage.getItem('role')

const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    toggleMobileSidebar()
  }
}

const dropdownOpen = ref(false)
const notifying = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  notifying.value = false
}

const isApplicationMenuOpen = ref(false)

const toggleApplicationMenu = () => {
  isApplicationMenuOpen.value = !isApplicationMenuOpen.value
}

// 用户类型定义
interface User {
  id: number | string
  username: string
  [key: string]: any
}

// 用户选择相关状态
const showUserModal = ref(false)
const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const isLoadingUsers = ref(false)
const tempSelectedUser = ref<User | null>(null) // 临时选择，用于弹窗中的选择

// 打开用户选择弹窗
const openUserModal = async () => {
  showUserModal.value = true
  tempSelectedUser.value = selectedUser.value // 初始化临时选择

  if (users.value.length === 0) {
    await fetchUsers()
  }
}

// 关闭用户选择弹窗
const closeUserModal = () => {
  showUserModal.value = false
  tempSelectedUser.value = null
}

// 获取用户列表
const fetchUsers = async () => {
  isLoadingUsers.value = true
  try {
    const response = await getUser({ page: 1, page_size: 100 })
    users.value = response.results || response.data || []

    // 设置当前选中的用户（从localStorage获取）
    const currentUserId = localStorage.getItem('selectedUserId')
    if (currentUserId) {
      const foundUser = users.value.find((user) => user.id.toString() === currentUserId)
      selectedUser.value = foundUser || null
    }
    // 注意：不自动选择第一个用户，让用户主动选择
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    isLoadingUsers.value = false
  }
}

// 在弹窗中选择用户（临时选择）
const selectUser = (user: User) => {
  tempSelectedUser.value = user
}

// 在弹窗中选择不选择任何用户（临时选择）
const selectNoUser = () => {
  tempSelectedUser.value = null
}

// 确认选择
const confirmSelection = () => {
  selectedUser.value = tempSelectedUser.value

  if (selectedUser.value) {
    localStorage.setItem('selectedUserId', selectedUser.value.id.toString())
    console.log('切换到用户:', selectedUser.value.username)
  } else {
    localStorage.removeItem('selectedUserId')
    console.log('重置选择，不选择任何用户')
  }

  showUserModal.value = false
  tempSelectedUser.value = null

  // 这里可以触发切换企业数据的事件
  // 例如：emit('userChanged', selectedUser.value) 或者调用相关的API
}

onMounted(() => {
  // 初始化时尝试从localStorage获取已保存的用户信息
  const savedUserId = localStorage.getItem('selectedUserId')
  if (savedUserId && users.value.length === 0) {
    // 如果有保存的用户ID但没有用户列表，则获取用户列表
    fetchUsers()
  }
})
</script>
