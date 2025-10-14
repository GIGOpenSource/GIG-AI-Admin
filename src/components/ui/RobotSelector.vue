<template>
  <div class="robot-selector-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-input-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索机器人"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <div class="search-buttons">
          <button
            type="button"
            @click="handleSearch"
            :disabled="isSearching"
            class="search-btn"
          >
            {{ isSearching ? '搜索中...' : '搜索' }}
          </button>
          <button
            type="button"
            @click="handleReset"
            class="reset-btn"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 选择区域 -->
    <div class="selection-section">
      <div class="selection-box">
        <div class="selection-header">
          <label class="select-all-label">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="toggleSelectAll"
              class="select-all-checkbox"
            />
            <span class="select-all-text">全选</span>
          </label>
        </div>

        <div class="selection-list" ref="selectionList" @scroll="handleScroll">
          <div v-if="isLoading && robots.length === 0" class="loading-state">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>

          <div v-else-if="robots.length === 0" class="empty-state">
            {{ searchQuery ? '无搜索结果' : '暂无机器人' }}
          </div>

          <div v-else class="robot-list">
            <label
              v-for="robot in filteredRobots"
              :key="robot.id"
              class="robot-item"
            >
              <input
                type="checkbox"
                :checked="isRobotSelected(robot)"
                @change="toggleRobot(robot)"
                class="robot-checkbox"
              />
              <span class="robot-name">{{ getRobotDisplayName(robot) }}</span>
            </label>

            <!-- 加载更多指示器 -->
            <div v-if="isLoadingMore" class="loading-more">
              <div class="loading-spinner-small"></div>
              <span>加载更多...</span>
            </div>

            <!-- 没有更多数据提示 -->
            <div v-else-if="!hasMoreData && robots.length > 0" class="no-more-data">
              没有更多数据了
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  // 获取机器人列表的API函数
  fetchApi: {
    type: Function,
    required: true
  },
  // 已选中的机器人列表
  modelValue: {
    type: Array,
    default: () => []
  },
  // 显示名称的字段
  labelKey: {
    type: String,
    default: 'name'
  },
  // 值的字段
  valueKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['update:modelValue'])

// 响应式数据
const searchQuery = ref('')
const robots = ref([])
const isLoading = ref(false)
const isSearching = ref(false)
const isLoadingMore = ref(false)
const currentPage = ref(1)
const hasMoreData = ref(true)
const totalCount = ref(0)
const pageSize = ref(20)
const isGlobalSelectAll = ref(false) // 全局全选状态

// 计算属性
const filteredRobots = computed(() => {
  if (!searchQuery.value.trim()) {
    return robots.value
  }

  const query = searchQuery.value.toLowerCase()
  return robots.value.filter(robot => {
    const name = getRobotDisplayName(robot).toLowerCase()
    return name.includes(query)
  })
})

const selectedRobotIds = computed(() => {
  return props.modelValue.map(robot =>
    typeof robot === 'object' ? robot[props.valueKey] : robot
  )
})

const isAllSelected = computed(() => {
  return filteredRobots.value.length > 0 &&
         filteredRobots.value.every(robot => isRobotSelected(robot))
})

const isIndeterminate = computed(() => {
  const selectedCount = filteredRobots.value.filter(robot => isRobotSelected(robot)).length
  return selectedCount > 0 && selectedCount < filteredRobots.value.length
})

// 方法
const getRobotDisplayName = (robot) => {
  const name = robot[props.labelKey] || robot[props.valueKey] || String(robot)
  const remark = robot.remark ? `(${robot.remark})` : ''
  return remark + name
}

const isRobotSelected = (robot) => {
  const robotId = robot[props.valueKey]
  return selectedRobotIds.value.includes(robotId)
}

const toggleRobot = (robot) => {
  const robotId = robot[props.valueKey]
  const isSelected = isRobotSelected(robot)

  let newSelected = [...props.modelValue]

  if (isSelected) {
    // 移除 - 如果处于全局全选状态，退出全选状态
    if (isGlobalSelectAll.value) {
      isGlobalSelectAll.value = false
    }
    newSelected = newSelected.filter(item => {
      const itemId = typeof item === 'object' ? item[props.valueKey] : item
      return itemId !== robotId
    })
  } else {
    // 添加
    newSelected.push(robot)
  }

  emit('update:modelValue', newSelected)
}

const toggleSelectAll = () => {
  const shouldSelectAll = !isAllSelected.value

  // 更新全局全选状态
  isGlobalSelectAll.value = shouldSelectAll

  if (shouldSelectAll) {
    // 全选当前过滤结果
    const newSelected = [...props.modelValue]
    filteredRobots.value.forEach(robot => {
      const robotId = robot[props.valueKey]
      const alreadySelected = newSelected.some(item => {
        const itemId = typeof item === 'object' ? item[props.valueKey] : item
        return itemId === robotId
      })

      if (!alreadySelected) {
        newSelected.push(robot)
      }
    })
    emit('update:modelValue', newSelected)
  } else {
    // 取消全选当前过滤结果
    const filteredIds = filteredRobots.value.map(robot => robot[props.valueKey])
    const newSelected = props.modelValue.filter(item => {
      const itemId = typeof item === 'object' ? item[props.valueKey] : item
      return !filteredIds.includes(itemId)
    })
    emit('update:modelValue', newSelected)
  }
}

const handleSearch = async () => {
  isSearching.value = true
  try {
    // 搜索时重置全选状态
    isGlobalSelectAll.value = false
    await fetchRobots(true) // 重置分页
  } finally {
    isSearching.value = false
  }
}

const handleReset = () => {
  searchQuery.value = ''
  // 重置时也重置全选状态
  isGlobalSelectAll.value = false
  fetchRobots(true) // 重置分页
}

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target

  // 当滚动到底部附近时加载更多数据
  if (scrollTop + clientHeight >= scrollHeight - 10 && hasMoreData.value && !isLoadingMore.value) {
    loadMoreRobots()
  }
}

const fetchRobots = async (reset = false) => {
  if (reset) {
    currentPage.value = 1
    robots.value = []
    hasMoreData.value = true
  }

  isLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value
    }

    if (searchQuery.value.trim()) {
      params.remark = searchQuery.value.trim()
    }

    const response = await props.fetchApi(params)
    const newRobots = response.results || response.data || []
    totalCount.value = response.count || response.total || 0

    if (reset) {
      robots.value = newRobots
    } else {
      // 合并新数据，避免重复
      const existingIds = new Set(robots.value.map(robot => robot[props.valueKey]))
      const uniqueNewRobots = newRobots.filter(robot => !existingIds.has(robot[props.valueKey]))
      robots.value = [...robots.value, ...uniqueNewRobots]

      // 如果处于全局全选状态，自动选择新加载的数据
      if (isGlobalSelectAll.value && uniqueNewRobots.length > 0) {
        const newSelected = [...props.modelValue]
        uniqueNewRobots.forEach(robot => {
          const robotId = robot[props.valueKey]
          const alreadySelected = newSelected.some(item => {
            const itemId = typeof item === 'object' ? item[props.valueKey] : item
            return itemId === robotId
          })

          if (!alreadySelected) {
            newSelected.push(robot)
          }
        })
        emit('update:modelValue', newSelected)
      }
    }

    // 检查是否还有更多数据
    hasMoreData.value = robots.value.length < totalCount.value

  } catch (error) {
    console.error('获取机器人列表失败:', error)
    if (reset) {
      robots.value = []
    }
  } finally {
    isLoading.value = false
  }
}

const loadMoreRobots = async () => {
  if (isLoadingMore.value || !hasMoreData.value) return

  isLoadingMore.value = true
  currentPage.value += 1

  try {
    await fetchRobots(false)
  } finally {
    isLoadingMore.value = false
  }
}

// 监听搜索查询变化，自动搜索
watch(searchQuery, (newQuery) => {
  if (newQuery.trim() === '') {
    // 清空搜索时重置全选状态
    isGlobalSelectAll.value = false
    fetchRobots(true) // 重置分页
  }
})

// 组件挂载时获取数据
onMounted(() => {
  fetchRobots(true) // 初始加载
})
</script>

<style scoped>
.robot-selector-container {
  width: 100%;
  max-width: 400px;
}

.search-section {
  margin-bottom: 12px;
}

.search-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-buttons {
  display: flex;
  gap: 8px;
}

.search-btn {
  height: 40px;
  padding: 0 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.search-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.reset-btn {
  height: 40px;
  padding: 0 16px;
  background-color: white;
  color: #3b82f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.selection-section {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  overflow: hidden;
}

.selection-box {
  display: flex;
  flex-direction: column;
  height: 200px;
}

.selection-header {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.select-all-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.select-all-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  cursor: pointer;
}

.select-all-text {
  user-select: none;
}

.selection-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  font-size: 14px;
}

.robot-list {
  display: flex;
  flex-direction: column;
}

.robot-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.robot-item:hover {
  background-color: #f9fafb;
}

.robot-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  cursor: pointer;
}

.robot-name {
  font-size: 14px;
  color: #374151;
  user-select: none;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  color: #6b7280;
  font-size: 14px;
  border-top: 1px solid #e5e7eb;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-more-data {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: #9ca3af;
  font-size: 12px;
  border-top: 1px solid #e5e7eb;
}

/* 滚动条样式 */
.selection-list::-webkit-scrollbar {
  width: 6px;
}

.selection-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.selection-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.selection-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 暗色主题支持 */
.dark .search-input {
  background-color: #1f2937;
  border-color: #4b5563;
  color: white;
}

.dark .search-input:focus {
  border-color: #3b82f6;
}

.dark .reset-btn {
  background-color: #1f2937;
  border-color: #4b5563;
  color: #3b82f6;
}

.dark .reset-btn:hover {
  background-color: #374151;
}

.dark .selection-section {
  background-color: #1f2937;
  border-color: #4b5563;
}

.dark .selection-header {
  background-color: #374151;
  border-bottom-color: #4b5563;
}

.dark .select-all-text {
  color: #d1d5db;
}

.dark .robot-item:hover {
  background-color: #374151;
}

.dark .robot-name {
  color: #d1d5db;
}

.dark .empty-state {
  color: #9ca3af;
}

.dark .loading-state {
  color: #9ca3af;
}

.dark .loading-more {
  color: #9ca3af;
  border-top-color: #4b5563;
}

.dark .no-more-data {
  color: #6b7280;
  border-top-color: #4b5563;
}
</style>
