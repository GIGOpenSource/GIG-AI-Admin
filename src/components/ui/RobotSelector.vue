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
import { ref, computed, watch, onMounted, nextTick } from 'vue'

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

const emit = defineEmits(['update:modelValue', 'selectionChange'])

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
const allAvailableItems = ref([]) // 所有可用的项目（用于全选）
const totalAvailableCount = ref(0) // 所有可用项目的总数

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
    String(typeof robot === 'object' ? robot[props.valueKey] : robot)
  )
})

// 监听 robots 变化，确保在全选状态下数据正确显示
watch([robots, isGlobalSelectAll], () => {
  if (isGlobalSelectAll.value && props.modelValue.length === 0) {
    // 真正的全选状态，确保所有机器人显示为选中
    console.log('全选状态：robots 变化，所有机器人应该显示为选中')
  } else if (isGlobalSelectAll.value && props.modelValue.length > 0) {
    // 反选状态，根据 modelValue 决定选中状态
    console.log('反选状态：robots 变化，根据 modelValue 决定选中状态')
  }
}, { deep: true })

const isAllSelected = computed(() => {
  // 如果处于全局全选状态
  if (isGlobalSelectAll.value) {
    // 如果 modelValue 为空，说明是真正的全选状态
    if (props.modelValue.length === 0) {
      return true
    }
    // 如果 modelValue 不为空，说明是反选状态，全选复选框应该显示为未选中
    return false
  }

  // 非全局全选状态下的正常逻辑
  return filteredRobots.value.length > 0 &&
         filteredRobots.value.every(robot => isRobotSelected(robot))
})

const isIndeterminate = computed(() => {
  // 如果处于全局全选状态
  if (isGlobalSelectAll.value) {
    // 如果是反选状态（modelValue 不为空），显示为半选状态
    if (props.modelValue.length > 0) {
      return true
    }
    // 如果是真正的全选状态，不显示半选状态
    return false
  }

  // 非全局全选状态下的正常逻辑
  const selectedCount = filteredRobots.value.filter(robot => isRobotSelected(robot)).length
  return selectedCount > 0 && selectedCount < filteredRobots.value.length
})

// 选择状态计算 - 优化性能，只在必要时重新计算
const selectionStatus = computed(() => {
  // 如果处于全局全选状态
  if (isGlobalSelectAll.value) {
    if (props.modelValue.length === 0) {
      // 全选时：selected: true, selected_accounts: []
      return {
        selected: true,
        selected_accounts: []
      }
    } else {
      // 反选时（从全选中移除了一些）：selectStatus: false, selected_accounts: [未被选中的项]
      // 优化：直接使用 modelValue 作为未选中项，不需要重新过滤 allAvailableItems
      return {
        selectStatus: false,
        selected_accounts: props.modelValue.map(item => ({
          id: String(typeof item === 'object' ? item[props.valueKey] : item),
          name: typeof item === 'object' ? (item[props.labelKey] || item[props.valueKey] || String(item)) : String(item)
        }))
      }
    }
  } else if (props.modelValue.length > 0) {
    // 自定义选择时：selected: true, selected_accounts: [具体选中项]
    return {
      selected: true,
      selected_accounts: props.modelValue.map(item => ({
        id: String(typeof item === 'object' ? item[props.valueKey] : item),
        name: typeof item === 'object' ? (item[props.labelKey] || item[props.valueKey] || String(item)) : String(item)
      }))
    }
  } else {
    // 未选择任何项：selected: false, selected_accounts: []
    return {
      selected: false,
      selected_accounts: []
    }
  }
})

// 方法
const getRobotDisplayName = (robot) => {
  const name = robot[props.labelKey] || robot[props.valueKey] || String(robot)
  const remark = robot.remark ? `(${robot.remark})` : ''
  return remark + name
}

const isRobotSelected = (robot) => {
  // 如果处于全局全选状态
  if (isGlobalSelectAll.value) {
    // 如果 modelValue 为空（真正的全选），所有机器人都显示为选中
    if (props.modelValue.length === 0) {
      console.log(`全选状态：机器人 ${robot[props.valueKey]} 应该显示为选中`)
      return true
    }
    // 如果 modelValue 不为空（反选模式），检查是否不在反选列表中
    // 反选模式下，modelValue 中存储的是未选中的项目
    const robotId = String(robot[props.valueKey])
    const isInUnselectedList = props.modelValue.some(item => {
      const itemId = typeof item === 'object' ? String(item[props.valueKey]) : String(item)
      return itemId === robotId
    })
    // 如果不在未选中列表中，说明是选中的
    const result = !isInUnselectedList
    console.log(`反选模式：机器人 ${robotId} 是否在未选中列表中: ${isInUnselectedList}, 应该显示为选中: ${result}`)
    return result
  }

  // 非全选状态下的正常选择逻辑
  const robotId = String(robot[props.valueKey])
  const result = selectedRobotIds.value.includes(robotId)
  console.log(`普通模式：机器人 ${robotId} 是否选中: ${result}`)
  console.log(`当前 modelValue:`, props.modelValue)
  console.log(`selectedRobotIds:`, selectedRobotIds.value)
  return result
}

const toggleRobot = (robot) => {
  const robotId = String(robot[props.valueKey])
  const isSelected = isRobotSelected(robot)

  console.log('=== toggleRobot 被调用 ===')
  console.log('机器人:', robot)
  console.log('机器人ID:', robotId)
  console.log('当前是否选中:', isSelected)
  console.log('是否全局全选:', isGlobalSelectAll.value)
  console.log('当前modelValue:', props.modelValue)

  // 如果当前是全局全选状态，需要特殊处理
  if (isGlobalSelectAll.value) {
    if (props.modelValue.length === 0) {
      // 真正的全选状态，点击任何机器人都进入反选模式
      // 只将当前点击的机器人添加到反选列表
      const robotObj = {
        id: String(robotId),
        name: robot[props.labelKey] || String(robotId)
      }
      emit('update:modelValue', [robotObj])
      console.log('从全局全选中移除项目，进入反选模式，反选列表:', [robotObj])
    } else {
      // 反选模式，点击机器人切换其选中状态
      let newSelected = [...props.modelValue]

      if (isSelected) {
        // 如果当前项目已选中（不在反选列表中），取消选择（添加到反选列表）
        const robotObj = {
          id: String(robotId),
          name: robot[props.labelKey] || String(robotId)
        }
        newSelected.push(robotObj)
        console.log('添加到反选列表:', robotObj)
        emit('update:modelValue', newSelected)
      } else {
        // 如果当前项目未选中（在反选列表中），选择它（从反选列表中移除）
        newSelected = newSelected.filter(item => {
          const itemId = typeof item === 'object' ? String(item[props.valueKey]) : String(item)
          return itemId !== robotId
        })
        console.log('从反选列表中移除项目')

        // 如果反选列表为空，回到真正的全选状态
        if (newSelected.length === 0) {
          emit('update:modelValue', [])
          console.log('反选列表为空，回到真正的全选状态')
        } else {
          emit('update:modelValue', newSelected)
        }
      }
    }

    // 延迟触发选择状态变化事件，确保 modelValue 已更新
    nextTick(() => {
      emit('selectionChange', selectionStatus.value)
    })
    return
  }

  let newSelected = [...props.modelValue]

  if (isSelected) {
    // 移除
    newSelected = newSelected.filter(item => {
      const itemId = String(typeof item === 'object' ? item[props.valueKey] : item)
      return itemId !== robotId
    })
  } else {
    // 添加
    newSelected.push(robot)
    console.log('添加机器人到选择列表:', robot)
    console.log('新的选择列表:', newSelected)
  }

  console.log('准备发送 update:modelValue 事件:', newSelected)
  emit('update:modelValue', newSelected)

  // 延迟触发选择状态变化事件，确保 modelValue 已更新
  nextTick(() => {
    console.log('触发 selectionChange 事件:', selectionStatus.value)
    emit('selectionChange', selectionStatus.value)
  })
}

const toggleSelectAll = () => {
  const shouldSelectAll = !isAllSelected.value

  if (shouldSelectAll) {
    // 启用全局全选模式
    isGlobalSelectAll.value = true
    // 全选时传递空数组
    emit('update:modelValue', [])
    console.log('=== 启用全局全选模式 ===')
    console.log('全选模式：selected: true, selected_accounts: []')
  } else {
    // 如果当前是全局全选状态
    if (isGlobalSelectAll.value) {
      // 如果当前是反选状态（modelValue 不为空），点击全选应该回到真正的全选
      if (props.modelValue.length > 0) {
        // 清空反选列表，回到真正的全选状态
        emit('update:modelValue', [])
        console.log('从反选状态回到真正的全选状态')
      } else {
        // 如果当前是真正的全选状态，取消全选
        isGlobalSelectAll.value = false
        // 取消全选当前过滤结果
        const filteredIds = filteredRobots.value.map(robot => String(robot[props.valueKey]))
        const newSelected = props.modelValue.filter(item => {
          const itemId = String(typeof item === 'object' ? item[props.valueKey] : item)
          return !filteredIds.includes(itemId)
        })
        emit('update:modelValue', newSelected)
        console.log('取消全局全选模式')
      }
    } else {
      // 非全局全选状态下的正常逻辑
      isGlobalSelectAll.value = false
      // 取消全选当前过滤结果
      const filteredIds = filteredRobots.value.map(robot => String(robot[props.valueKey]))
      const newSelected = props.modelValue.filter(item => {
        const itemId = String(typeof item === 'object' ? item[props.valueKey] : item)
        return !filteredIds.includes(itemId)
      })
      emit('update:modelValue', newSelected)
    }
  }

  // 延迟触发选择状态变化事件，确保 modelValue 已更新
  nextTick(() => {
    emit('selectionChange', selectionStatus.value)
  })
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

    // 如果是第一页且没有搜索条件，更新所有可用项目列表
    if (reset && currentPage.value === 1 && !searchQuery.value.trim()) {
      allAvailableItems.value = response.results || response.data || []
      totalAvailableCount.value = response.count || response.total || 0
    }

    if (reset) {
      robots.value = newRobots
    } else {
      // 合并新数据，避免重复
      const existingIds = new Set(robots.value.map(robot => robot[props.valueKey]))
      const uniqueNewRobots = newRobots.filter(robot => !existingIds.has(robot[props.valueKey]))
      robots.value = [...robots.value, ...uniqueNewRobots]

      // 注意：在全选状态下，不应该自动修改 modelValue
      // 全选状态通过 isGlobalSelectAll.value 和 isRobotSelected 逻辑来处理
      // 这里只需要确保 allAvailableItems 包含所有数据即可

      // 更新所有可用项目列表（包括新加载的数据）
      if (uniqueNewRobots.length > 0) {
        allAvailableItems.value = [...allAvailableItems.value, ...uniqueNewRobots]
        totalAvailableCount.value = response.count || response.total || 0
      }
    }

    // 确保在全选状态下，当前显示的数据正确反映选中状态
    // 这解决了滚动后回到第一页时选中状态丢失的问题
    if (isGlobalSelectAll.value && props.modelValue.length === 0) {
      // 真正的全选状态，不需要额外处理，isRobotSelected 会自动返回 true
      console.log('全选状态下加载数据，当前页机器人应该都显示为选中')
    } else if (isGlobalSelectAll.value && props.modelValue.length > 0) {
      // 反选状态，确保数据一致性
      console.log('反选状态下加载数据，根据 modelValue 决定选中状态')
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
