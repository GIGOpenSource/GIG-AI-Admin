<template>
  <div class="paginated-transfer-container">
    <div class="flex gap-4">
      <!-- 左侧可选列表 -->
      <div class="transfer-panel">
        <div class="transfer-header">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="isAllLeftSelected"
                :indeterminate="isLeftIndeterminate"
                @change="toggleAllLeft"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm font-medium">全选</span>
            </div>
          </div>
          <!-- 搜索框 -->
          <div class="mt-2 relative">
            <input
              v-model="leftSearchQuery"
              type="text"
              placeholder="请搜索机器人名称"
              class="w-full h-8 pl-8 pr-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              @keyup.enter="searchLeft"
            />
            <div class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <div class="flex gap-2 mt-2">
            <button
              type="button"
              @click="searchLeft"
              class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              搜索
            </button>
            <button
              v-if="leftSearchQuery"
              type="button"
              @click="clearLeftSearch"
              class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              重置
            </button>
          </div>
          <!-- 搜索结果全选 -->
          <div v-if="leftSearchQuery && leftItems.length > 0" class="mt-1">
            <button
              type="button"
              @click="selectAllLeftSearchResults"
              class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              选择当前页结果 ({{ leftItems.length }})
            </button>
          </div>
        </div>
        <div class="transfer-body">
          <div v-if="leftLoading" class="flex justify-center items-center h-32">
            <div class="text-sm text-gray-500">加载中...</div>
          </div>
          <div v-else>
            <div
              v-for="(item,index) in leftItems"
              :key="item.id"
              class="transfer-item"
            >
                <input
                  type="checkbox"
                  :checked="item.selected"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  @change="toggleLeftItem(item,index)"
                />
              <span class="text-sm truncate">{{ getItemLabel(item) }}</span>
            </div>
            <div v-if="leftItems.length === 0" class="text-center py-8 text-gray-500 text-sm">
              {{ leftSearchQuery ? '无搜索结果' : '无可选项' }}
            </div>
          </div>
        </div>
        <!-- 左侧分页 -->
        <div v-if="leftTotalPages > 1" class="transfer-pagination">
          <button
            type="button"
            @click="leftPage > 1 && changeLeftPage(leftPage - 1)"
            :disabled="leftPage <= 1"
            class="pagination-btn"
          >
            上一页
          </button>
          <span class="text-xs text-gray-600">{{ leftPage }} / {{ leftTotalPages }}</span>
          <button
            type="button"
            @click="leftPage < leftTotalPages && changeLeftPage(leftPage + 1)"
            :disabled="leftPage >= leftTotalPages"
            class="pagination-btn"
          >
            下一页
          </button>
        </div>
      </div>

      <!-- 中间操作按钮 -->
      <div class="transfer-buttons">
          <button
            type="button"
            @click="moveToRight"
            :disabled="selectedLeftItems.size === 0"
            class="transfer-btn"
            title="添加选中项"
          >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        <button
          type="button"
          @click="moveToLeft"
          :disabled="!hasRightSelected"
          class="transfer-btn"
          title="移除选中项"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- 右侧已选列表 -->
      <div class="transfer-panel">
        <div class="transfer-header">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="isAllRightSelected"
                :indeterminate="isRightIndeterminate"
                @change="toggleAllRight"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm font-medium">全选</span>
            </div>
          </div>
          <!-- 搜索框 -->
          <div class="mt-2 relative">
            <input
              v-model="rightSearchQuery"
              type="text"
              placeholder="搜索已选项..."
              class="w-full h-8 pl-8 pr-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              @keyup.enter="searchRight"
            />
            <div class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <div class="flex gap-2 mt-2">
            <button
              type="button"
              @click="searchRight"
              class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              搜索
            </button>
            <button
              v-if="rightSearchQuery"
              type="button"
              @click="clearRightSearch"
              class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              重置
            </button>
          </div>
        </div>
        <div class="transfer-body">
          <div v-if="rightLoading" class="flex justify-center items-center h-32">
            <div class="text-sm text-gray-500">加载中...</div>
          </div>
          <div v-else>
            <div
              v-for="item in rightItems"
              :key="item.id"
              class="transfer-item"
            >
              <input
                type="checkbox"
                :checked="item.selected"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                @click="toggleRightItem(item,index)"
              />
              <span class="text-sm truncate">{{ getItemLabel(item) }}</span>
            </div>
            <div v-if="rightItems.length === 0" class="text-center py-8 text-gray-500 text-sm">
              {{ rightSearchQuery ? '无搜索结果' : '无已选项' }}
            </div>
          </div>
        </div>
        <!-- 右侧分页 -->
        <div v-if="rightTotalPages > 1" class="transfer-pagination">
          <button
            type="button"
            @click="rightPage > 1 && changeRightPage(rightPage - 1)"
            :disabled="rightPage <= 1"
            class="pagination-btn"
          >
            上一页
          </button>
          <span class="text-xs text-gray-600">{{ rightPage }} / {{ rightTotalPages }}</span>
          <button
            type="button"
            @click="rightPage < rightTotalPages && changeRightPage(rightPage + 1)"
            :disabled="rightPage >= rightTotalPages"
            class="pagination-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // 获取数据的API函数
  fetchApi: {
    type: Function,
    required: true
  },
  // 已选中的值
  modelValue: {
    type: Array,
    default: () => []
  },
  // 获取项目标签的函数
  labelKey: {
    type: String,
    default: 'name'
  },
  // 获取项目值的函数
  valueKey: {
    type: String,
    default: 'id'
  },
  // 每页数量（固定为20，与账号池保持一致）
  pageSize: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['update:modelValue'])

// 搜索查询
const leftSearchQuery = ref('')
const rightSearchQuery = ref('')

// 分页状态
const leftPage = ref(1)
const rightPage = ref(1)
const leftTotal = ref(0)
const rightTotal = ref(0)
const leftTotalPages = ref(0)
const rightTotalPages = ref(0)

// 加载状态
const leftLoading = ref(false)
const rightLoading = ref(false)

// 数据
const leftItems = ref([])
const rightItems = ref([])

// 选中的项目 - 使用Map来保存跨页面的选择状态
const selectedLeftItems = ref(new Map()) // key: itemId, value: item对象
const selectedRightItems = ref(new Set())

// 左侧全选状态
const isAllLeftSelected = computed(() =>
  leftItems.value.length > 0 &&
  leftItems.value.every(item => item.selected)
)

const isLeftIndeterminate = computed(() =>
  leftItems.value.some(item => item.selected) && !isAllLeftSelected.value
)

// 右侧全选状态
const isAllRightSelected = computed(() =>
  rightItems.value.length > 0 &&
  rightItems.value.every(item => item.selected)
)

const isRightIndeterminate = computed(() =>
  rightItems.value.some(item => item.selected) && !isAllRightSelected.value
)

// 右侧是否有选中项目
const hasRightSelected = computed(() =>
  rightItems.value.some(item => item.selected)
)

// 获取项目标签
function getItemLabel(item) {
  return item[props.labelKey] || item[props.valueKey] || String(item)
}

// 获取左侧数据
async function fetchLeftData() {
  leftLoading.value = true
  try {
    const params = {
      page: leftPage.value
    }

    if (leftSearchQuery.value) {
      params.search = leftSearchQuery.value
    }

    console.log('=== 获取左侧数据参数 ===', params)
    const response = await props.fetchApi(params)
    console.log('=== 左侧数据响应 ===', response)

    // 给每个项目添加selected属性，保留之前的选择状态
    const itemsWithSelection = (response.results || response.data || []).map(item => {
      const itemId = String(item[props.valueKey])
      const wasSelected = selectedLeftItems.value.has(itemId)

      return {
        ...item,
        selected: wasSelected // 保留之前的选择状态
      }
    })

    leftItems.value = itemsWithSelection
    leftTotal.value = response.count || response.total || 0
    leftTotalPages.value = Math.ceil(leftTotal.value / props.pageSize)

    console.log('=== 处理后的左侧数据 ===', leftItems.value)
  } catch (error) {
    console.error('获取左侧数据失败:', error)
    leftItems.value = []
    leftTotal.value = 0
    leftTotalPages.value = 0
  } finally {
    leftLoading.value = false
  }
}

// 获取右侧数据（从左侧选中的数据中筛选）
async function fetchRightData() {
  console.log(1111);

  rightLoading.value = true
  try {
    console.log('=== 获取右侧数据 ===')
    console.log('当前已选项目:', props.modelValue)

    // 右侧直接显示props.modelValue中的数据，支持搜索过滤
    let rightData = [...props.modelValue].map(item => ({
      ...item,
      selected: item.selected || false // 确保有selected属性
    }))

    // 如果有搜索条件，进行过滤
    if (rightSearchQuery.value) {
      rightData = rightData.filter(item => {
        const label = getItemLabel(item).toLowerCase()
        return label.includes(rightSearchQuery.value.toLowerCase())
      })
    }

    // 计算分页
    const startIndex = (rightPage.value - 1) * props.pageSize
    const endIndex = startIndex + props.pageSize

    rightItems.value = rightData.slice(startIndex, endIndex)
    rightTotal.value = rightData.length
    rightTotalPages.value = Math.ceil(rightData.length / props.pageSize)

    console.log('=== 右侧最终数据 ===', rightItems.value)
    console.log('=== 右侧总数 ===', rightTotal.value)
  } catch (error) {
    console.error('获取右侧数据失败:', error)
    rightItems.value = []
    rightTotal.value = 0
    rightTotalPages.value = 0
  } finally {
    rightLoading.value = false
  }
}

// 切换左侧项目选择
function toggleLeftItem(item, index) {
  console.log('=== 切换左侧选择 ===')
  console.log('点击的项目:', item)
  console.log('索引:', index)
  console.log('选择前状态:', item.selected)

  // 直接修改项目的selected属性
  leftItems.value[index].selected = !leftItems.value[index].selected

  // 同时更新Map中的选择状态，用于跨页面保持选择
  const itemId = String(item[props.valueKey])
  if (leftItems.value[index].selected) {
    selectedLeftItems.value.set(itemId, item)
  } else {
    selectedLeftItems.value.delete(itemId)
  }

  console.log('选择后状态:', leftItems.value[index].selected)
  console.log('Map中的选择状态:', selectedLeftItems.value)
}

// 切换右侧项目选择
function toggleRightItem(item, index) {
  if (item.selected === undefined) {
    item.selected = false
  }
  item.selected = !item.selected

}

// 左侧全选/取消全选
function toggleAllLeft() {
  const shouldSelectAll = !isAllLeftSelected.value

  leftItems.value.forEach(item => {
    item.selected = shouldSelectAll

    // 同时更新Map中的选择状态
    const itemId = String(item[props.valueKey])
    if (shouldSelectAll) {
      selectedLeftItems.value.set(itemId, item)
    } else {
      selectedLeftItems.value.delete(itemId)
    }
  })

  console.log('=== 左侧全选操作 ===')
  console.log('全选状态:', shouldSelectAll)
  console.log('Map中的选择状态:', selectedLeftItems.value)
}
// 右侧全选/取消全选
function toggleAllRight() {
  const shouldSelectAll = !isAllRightSelected.value

  rightItems.value.forEach(item => {
    // 给右侧项目添加selected属性（如果没有的话）
    if (item.selected === undefined) {
      item.selected = false
    }
    item.selected = shouldSelectAll
  })

  console.log('=== 右侧全选操作 ===')
  console.log('全选状态:', shouldSelectAll)
  console.log('处理后的数据:', rightItems.value)
}

// 选择当前页搜索结果
function selectAllLeftSearchResults() {
  leftItems.value.forEach(item => {
    item.selected = true

    // 同时更新Map中的选择状态
    const itemId = String(item[props.valueKey])
    selectedLeftItems.value.set(itemId, item)
  })

  console.log('=== 搜索结果全选 ===')
  console.log('处理后的数据:', leftItems.value)
  console.log('Map中的选择状态:', selectedLeftItems.value)
}

// 搜索功能
function searchLeft() {
  leftPage.value = 1
  selectedLeftItems.value.clear()
  fetchLeftData()
}

function searchRight() {
  rightPage.value = 1
  selectedRightItems.value.clear()
  fetchRightData()
}

function clearLeftSearch() {
  leftSearchQuery.value = ''
  searchLeft()
}

function clearRightSearch() {
  rightSearchQuery.value = ''
  searchRight()
}

// 分页切换
function changeLeftPage(page) {
  leftPage.value = page
  selectedLeftItems.value.clear()
  fetchLeftData()
}

function changeRightPage(page) {
  rightPage.value = page
  selectedRightItems.value.clear()
  fetchRightData()
}

// 移动单个项目到右侧（双击时调用）
function moveItemToRight(item) {
  console.log('666');

  const newSelected = [...props.modelValue]
  const id = item[props.valueKey]

  // 检查是否已存在
  if (!newSelected.some(selected =>
    (typeof selected === 'object' ? selected[props.valueKey] : selected) === id
  )) {
    newSelected.push(item)
    emit('update:modelValue', newSelected)

    // 刷新数据
    fetchLeftData()
    fetchRightData()
  }
}

// 批量移动到右侧（点击箭头按钮时调用）
function moveToRight() {
  console.log('=== 移动到右侧开始 ===')
  console.log('左侧所有项目:', leftItems.value)
  console.log('当前已选项目:', props.modelValue)

  // 从Map中获取所有选中的项目（包括所有页面的选择）
  console.log('Map中所有选中的项目:', selectedLeftItems.value)

  if (selectedLeftItems.value.size === 0) {
    console.log('没有选中的项目')
    return
  }

  const newSelected = [...props.modelValue]
  console.log('初始newSelected:', newSelected)

  // 遍历Map中的所有选中项目
  selectedLeftItems.value.forEach((item, id) => {
    console.log(`处理项目 ${id}:`, item)

    // 检查是否已存在（避免重复添加）
    const alreadyExists = newSelected.some(selected =>
      String(typeof selected === 'object' ? selected[props.valueKey] : selected) === String(id)
    )
    console.log(`项目已存在: ${alreadyExists}`)

    if (!alreadyExists) {
      // 移除selected属性，因为移动到右侧后不需要这个属性
      const { selected, ...itemWithoutSelected } = item
      newSelected.push(itemWithoutSelected)
      console.log(`添加项目:`, itemWithoutSelected)
    }
  })

  console.log('最终newSelected:', newSelected)
  emit('update:modelValue', newSelected)

  // 清除所有选择状态
  selectedLeftItems.value.clear()

  // 刷新数据
  fetchLeftData()
  fetchRightData()
}

// 移动单个项目到左侧（双击时调用）
function moveItemToLeft(item) {
  const id = item[props.valueKey]
  const newSelected = props.modelValue.filter(selected => {
    const selectedId = typeof selected === 'object' ? selected[props.valueKey] : selected
    return selectedId !== id
  })

  emit('update:modelValue', newSelected)

  // 刷新数据
  fetchLeftData()
  fetchRightData()
}

// 批量移动到左侧（点击箭头按钮时调用）
function moveToLeft() {
  console.log('=== 移动到左侧开始 ===')
  console.log('右侧所有项目:', rightItems.value)

  // 找出所有selected为true的项目
  const selectedItems = rightItems.value.filter(item => item.selected)
  console.log('右侧选中的项目:', selectedItems)

  if (selectedItems.length === 0) {
    console.log('没有选中的右侧项目')
    return
  }

  // 从modelValue中移除选中的项目
  const selectedIds = selectedItems.map(item => String(item[props.valueKey]))
  const newSelected = props.modelValue.filter(item => {
    const id = String(typeof item === 'object' ? item[props.valueKey] : item)
    return !selectedIds.includes(id)
  })

  console.log('移除后的数据:', newSelected)
  emit('update:modelValue', newSelected)

  // 刷新数据
  fetchLeftData()
  fetchRightData()
}

// 监听modelValue变化
watch(() => props.modelValue, () => {
  fetchLeftData()
  fetchRightData()
}, { deep: true })

// 初始加载
fetchLeftData()
fetchRightData()
</script>

<style scoped>
.paginated-transfer-container {
  width: 100%;
}

.transfer-panel {
  width: 320px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
}

.dark .transfer-panel {
  background-color: #1f2937;
  border-color: #4b5563;
}

.transfer-header {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.dark .transfer-header {
  border-bottom-color: #4b5563;
  background-color: #374151;
}

.transfer-body {
  height: 320px;
  overflow-y: auto;
}

.transfer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}

.transfer-item:hover {
  background-color: #f3f4f6;
}

.dark .transfer-item {
  border-bottom-color: #4b5563;
}

.dark .transfer-item:hover {
  background-color: #374151;
}

.transfer-item:last-child {
  border-bottom: none;
}

.transfer-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.transfer-btn {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
}

.transfer-btn:hover:not(:disabled) {
  background-color: #f9fafb;
}

.transfer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark .transfer-btn {
  background-color: #1f2937;
  border-color: #4b5563;
}

.dark .transfer-btn:hover:not(:disabled) {
  background-color: #374151;
}

.transfer-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.dark .transfer-pagination {
  border-top-color: #4b5563;
  background-color: #374151;
}

.pagination-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: #e5e7eb;
  color: #374151;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #d1d5db;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark .pagination-btn {
  background-color: #4b5563;
  color: #d1d5db;
}

.dark .pagination-btn:hover:not(:disabled) {
  background-color: #6b7280;
}
</style>
