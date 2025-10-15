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
            <!-- 选择状态显示 -->
            <div v-if="supportSelectAll" class="text-xs text-gray-500">
              <span v-if="isGlobalSelectAll" class="text-orange-600 font-medium">全局全选模式</span>
              <span v-else-if="selectedLeftItemsArray.length > 0" class="text-blue-600">已选 {{ selectedLeftItemsArray.length }} 项</span>
              <span v-else class="text-gray-400">未选择</span>
            </div>
          </div>
          <!-- 搜索框 -->
          <div class="mt-2 relative">
            <input
              v-model="leftSearchQuery"
              type="text"
                placeholder="请搜索机器人备注"
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
            <button
              v-if="supportSelectAll && (isGlobalSelectAll || selectedLeftItemsArray.length > 0)"
              type="button"
              @click="toggleInvertSelection"
              class="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              反选
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
              <span class="text-sm truncate max-w-[220px] block" :title="getItemLabel(item)">{{ getItemLabel(item) }}</span>
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
            :disabled="selectedLeftItemsArray.length === 0"
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
          :disabled="selectedRightItemsArray.length === 0"
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
              v-for="(item,index) in rightItems"
              :key="item.id"
              class="transfer-item"
            >
              <input
                type="checkbox"
                :checked="item.selected"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                @click="toggleRightItem(item,index)"
              />
              <span class="text-sm truncate max-w-[220px] block" :title="getItemLabel(item)">{{ getItemLabel(item) }}</span>
            </div>
            <div v-if="rightItems.length === 0" class="text-center py-8 text-gray-500 text-sm">
              {{ rightSearchQuery ? '无搜索结果' : '无已选项' }}
            </div>
          </div>
        </div>

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
  },
  // 是否支持全选模式
  supportSelectAll: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'selectionChange'])

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

// 选中的项目 - 使用数组保存所有选中的数据
const selectedLeftItemsArray = ref([]) // 保存左侧所有选中的完整项目对象
const selectedRightItemsArray = ref([]) // 保存右侧所有选中的完整项目对象

// 全选状态管理
const isGlobalSelectAll = ref(false) // 全局全选状态
const allAvailableItems = ref([]) // 所有可用的项目（用于全选）
const totalAvailableCount = ref(0) // 所有可用项目的总数

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

// 左侧是否有选中项目
const hasLeftSelected = computed(() => selectedLeftItemsArray.value.length > 0)

// 右侧是否有选中项目
const hasRightSelected = computed(() => selectedRightItemsArray.value.length > 0)

// 选择状态计算
const selectionStatus = computed(() => {
  if (isGlobalSelectAll.value) {
    // 全选时：selected: true, selected_accounts: []
    return {
      selected: true,
      selected_accounts: []
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
    // 反选时（未选择任何项）：selectStatus: false, selected_accounts: [未被选中的项]
    const unselectedItems = allAvailableItems.value.filter(item => {
      const itemId = String(item[props.valueKey])
      return !props.modelValue.some(selected =>
        String(typeof selected === 'object' ? selected[props.valueKey] : selected) === itemId
      )
    })

    return {
      selectStatus: false,
      selected_accounts: unselectedItems.map(item => ({
        id: String(item[props.valueKey]),
        name: item[props.labelKey] || item[props.valueKey] || String(item)
      }))
    }
  }
})

// 获取项目标签
function getItemLabel(item) {
return  (item.remark ? `(${item.remark})` : '') + (item[props.labelKey] || item[props.valueKey] || String(item))
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

    // 过滤掉已经在右侧的数据，并给每个项目添加selected属性
    const rightSideIds = new Set(props.modelValue.map(item =>
      String(typeof item === 'object' ? item[props.valueKey] : item)
    ))

    const filteredItems = (response.results || response.data || []).filter(item => {
      const itemId = String(item[props.valueKey])
      return !rightSideIds.has(itemId) // 排除已经在右侧的数据
    })

    const itemsWithSelection = filteredItems.map(item => {
      const itemId = String(item[props.valueKey])
      const wasSelected = selectedLeftItemsArray.value.some(selectedItem =>
        String(selectedItem[props.valueKey]) === itemId
      )

      return {
        ...item,
        selected: wasSelected || isGlobalSelectAll.value // 全局全选时默认选中
      }
    })

    leftItems.value = itemsWithSelection
    console.log('=== 过滤后的左侧数据（排除右侧已有） ===', leftItems.value)
    leftTotal.value = response.count || response.total || 0
    leftTotalPages.value = Math.ceil(leftTotal.value / props.pageSize)

    // 如果是第一页且没有搜索条件，更新所有可用项目列表
    if (leftPage.value === 1 && !leftSearchQuery.value) {
      allAvailableItems.value = response.results || response.data || []
      totalAvailableCount.value = response.count || response.total || 0
    }

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
    let rightData = [...props.modelValue].map(item => {
      const itemId = String(item[props.valueKey])
      const wasSelected = selectedRightItemsArray.value.some(selectedItem =>
        String(selectedItem[props.valueKey]) === itemId
      )

      return {
        ...item,
        selected: wasSelected // 检查是否在右侧选中数组中
      }
    })

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
  console.log('全局全选状态:', isGlobalSelectAll.value)

  // 如果当前是全局全选状态，取消全局全选
  if (isGlobalSelectAll.value) {
    isGlobalSelectAll.value = false
    // 清空所有选择，然后重新选择除了当前项目之外的所有项目
    const allIds = allAvailableItems.value.map(i => String(i[props.valueKey]))
    const currentId = String(item[props.valueKey])

    if (leftItems.value[index].selected) {
      // 如果当前项目已选中，取消选择（从全局全选中移除）
      const newSelected = allAvailableItems.value.filter(i => String(i[props.valueKey]) !== currentId)
      emit('update:modelValue', newSelected)
    } else {
      // 如果当前项目未选中，选择它（保持全局全选状态）
      emit('update:modelValue', [...allAvailableItems.value])
    }

    // 刷新数据
    fetchLeftData()
    fetchRightData()

    console.log('取消全局全选，重新选择')
    emit('selectionChange', selectionStatus.value)
    return
  }

  // 直接修改项目的selected属性
  leftItems.value[index].selected = !leftItems.value[index].selected

  // 同时更新左侧选中数组，用于跨页面保持选择
  const itemId = String(item[props.valueKey])
  if (leftItems.value[index].selected) {
    // 添加到左侧选中数组（如果不存在的话）
    const alreadyExists = selectedLeftItemsArray.value.some(selectedItem =>
      String(selectedItem[props.valueKey]) === itemId
    )
    if (!alreadyExists) {
      selectedLeftItemsArray.value.push({ ...item })
    }
  } else {
    // 从左侧选中数组中移除
    selectedLeftItemsArray.value = selectedLeftItemsArray.value.filter(selectedItem =>
      String(selectedItem[props.valueKey]) !== itemId
    )
  }

  // 更新右侧显示
  const newSelected = [...selectedLeftItemsArray.value]
  emit('update:modelValue', newSelected)

  console.log('选择后状态:', leftItems.value[index].selected)
  console.log('左侧选中数组:', selectedLeftItemsArray.value)

  // 触发选择状态变化事件
  emit('selectionChange', selectionStatus.value)
}

// 切换右侧项目选择
function toggleRightItem(item, index) {
  console.log('=== 切换右侧选择 ===')
  console.log('点击的项目:', item)
  console.log('索引:', index)
  console.log('选择前状态:', item.selected)

  // 直接修改项目的selected属性
  rightItems.value[index].selected = !rightItems.value[index].selected

  // 同时更新右侧选中数组，用于跨页面保持选择
  const itemId = String(item[props.valueKey])
  if (rightItems.value[index].selected) {
    // 添加到右侧选中数组（如果不存在的话）
    const alreadyExists = selectedRightItemsArray.value.some(selectedItem =>
      String(selectedItem[props.valueKey]) === itemId
    )
    if (!alreadyExists) {
      selectedRightItemsArray.value.push({ ...item })
    }
  } else {
    // 从右侧选中数组中移除
    selectedRightItemsArray.value = selectedRightItemsArray.value.filter(selectedItem =>
      String(selectedItem[props.valueKey]) !== itemId
    )
  }

  console.log('选择后状态:', rightItems.value[index].selected)
  console.log('右侧选中数组:', selectedRightItemsArray.value)
}

// 左侧全选/取消全选
function toggleAllLeft() {
  const shouldSelectAll = !isAllLeftSelected.value

  if (shouldSelectAll && props.supportSelectAll) {
    // 启用全局全选模式
    isGlobalSelectAll.value = true
    // 清空现有的选择，因为全局全选时传递空数组
    selectedLeftItemsArray.value = []

    // 全选时传递空数组
    emit('update:modelValue', [])

    console.log('=== 启用全局全选模式 ===')
    console.log('全选模式：selected: true, selected_accounts: []')
  } else {
    // 取消全局全选模式
    isGlobalSelectAll.value = false

    // 处理当前页面的选择
    leftItems.value.forEach(item => {
      item.selected = shouldSelectAll

      // 同时更新左侧选中数组
      const itemId = String(item[props.valueKey])
      if (shouldSelectAll) {
        // 添加到左侧选中数组（如果不存在的话）
        const alreadyExists = selectedLeftItemsArray.value.some(selectedItem =>
          String(selectedItem[props.valueKey]) === itemId
        )
        if (!alreadyExists) {
          selectedLeftItemsArray.value.push({ ...item })
        }
      } else {
        // 从左侧选中数组中移除
        selectedLeftItemsArray.value = selectedLeftItemsArray.value.filter(selectedItem =>
          String(selectedItem[props.valueKey]) !== itemId
        )
      }
    })

    // 更新右侧显示
    const newSelected = [...selectedLeftItemsArray.value]
    emit('update:modelValue', newSelected)

    console.log('=== 左侧全选操作 ===')
    console.log('全选状态:', shouldSelectAll)
    console.log('左侧选中数组:', selectedLeftItemsArray.value)
  }

  // 触发选择状态变化事件
  emit('selectionChange', selectionStatus.value)
}
// 右侧全选/取消全选
function toggleAllRight() {
  const shouldSelectAll = !isAllRightSelected.value

  rightItems.value.forEach(item => {
    item.selected = shouldSelectAll

    // 同时更新右侧选中数组
    const itemId = String(item[props.valueKey])
    if (shouldSelectAll) {
      // 添加到右侧选中数组（如果不存在的话）
      const alreadyExists = selectedRightItemsArray.value.some(selectedItem =>
        String(selectedItem[props.valueKey]) === itemId
      )
      if (!alreadyExists) {
        selectedRightItemsArray.value.push({ ...item })
      }
    } else {
      // 从右侧选中数组中移除
      selectedRightItemsArray.value = selectedRightItemsArray.value.filter(selectedItem =>
        String(selectedItem[props.valueKey]) !== itemId
      )
    }
  })

  console.log('=== 右侧全选操作 ===')
  console.log('全选状态:', shouldSelectAll)
  console.log('右侧选中数组:', selectedRightItemsArray.value)
}

// 选择当前页搜索结果
function selectAllLeftSearchResults() {
  leftItems.value.forEach(item => {
    item.selected = true

    // 同时更新左侧选中数组
    const itemId = String(item[props.valueKey])
    const alreadyExists = selectedLeftItemsArray.value.some(selectedItem =>
      String(selectedItem[props.valueKey]) === itemId
    )
    if (!alreadyExists) {
      selectedLeftItemsArray.value.push({ ...item })
    }
  })

  console.log('=== 搜索结果全选 ===')
  console.log('处理后的数据:', leftItems.value)
  console.log('左侧选中数组:', selectedLeftItemsArray.value)
}

// 搜索功能
function searchLeft() {
  leftPage.value = 1
  // 搜索时不清除全局全选状态，但需要重新获取数据
  fetchLeftData()
}

function searchRight() {
  rightPage.value = 1
  // 不清除选择状态，保持跨页面选择
  fetchRightData()
}

function clearLeftSearch() {
  leftSearchQuery.value = ''
  leftPage.value = 1
  fetchLeftData()
}

function clearRightSearch() {
  rightSearchQuery.value = ''
  searchRight()
}

// 分页切换
function changeLeftPage(page) {
  leftPage.value = page
  // 不清除选择状态，保持跨页面选择
  fetchLeftData()
}

function changeRightPage(page) {
  rightPage.value = page
  // 不清除选择状态，保持跨页面选择
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
  console.log('当前已选项目:', props.modelValue)
  console.log('左侧选中数组中的所有项目:', selectedLeftItemsArray.value)
  console.log('全局全选状态:', isGlobalSelectAll.value)

  if (isGlobalSelectAll.value) {
    // 全局全选状态：所有可用项目都已选中，无需额外操作
    console.log('全局全选状态，所有项目已在右侧')
    return
  }

  if (selectedLeftItemsArray.value.length === 0) {
    console.log('没有选中的项目')
    return
  }

  const newSelected = [...props.modelValue]
  console.log('初始newSelected:', newSelected)

  // 直接使用左侧选中数组中的所有项目
  selectedLeftItemsArray.value.forEach(item => {
    console.log(`处理项目:`, item)

    // 检查是否已存在（避免重复添加）
    const alreadyExists = newSelected.some(selected =>
      String(typeof selected === 'object' ? selected[props.valueKey] : selected) === String(item[props.valueKey])
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
  selectedLeftItemsArray.value = []

  // 刷新数据
  fetchLeftData()
  fetchRightData()

  // 触发选择状态变化事件
  emit('selectionChange', selectionStatus.value)
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
  console.log('当前已选项目:', props.modelValue)
  console.log('右侧选中数组中的所有项目:', selectedRightItemsArray.value)
  console.log('全局全选状态:', isGlobalSelectAll.value)

  if (isGlobalSelectAll.value) {
    // 全局全选状态：需要取消全局全选，并移除选中的项目
    isGlobalSelectAll.value = false

    if (selectedRightItemsArray.value.length === 0) {
      console.log('全局全选状态，但没有选中的右侧项目')
      return
    }

    // 从全局全选中移除选中的项目
    const selectedIds = selectedRightItemsArray.value.map(item => String(item[props.valueKey]))
    const newSelected = allAvailableItems.value.filter(item => {
      const id = String(item[props.valueKey])
      return !selectedIds.includes(id)
    })

    console.log('从全局全选中移除后的数据:', newSelected)
    emit('update:modelValue', newSelected)

    // 清除右侧所有选择状态
    selectedRightItemsArray.value = []

    // 刷新数据
    fetchLeftData()
    fetchRightData()

    // 触发选择状态变化事件
    emit('selectionChange', selectionStatus.value)
    return
  }

  if (selectedRightItemsArray.value.length === 0) {
    console.log('没有选中的右侧项目')
    return
  }

  // 从modelValue中移除右侧选中数组中的所有项目
  const selectedIds = selectedRightItemsArray.value.map(item => String(item[props.valueKey]))
  const newSelected = props.modelValue.filter(item => {
    const id = String(typeof item === 'object' ? item[props.valueKey] : item)
    return !selectedIds.includes(id)
  })

  console.log('移除后的数据:', newSelected)
  emit('update:modelValue', newSelected)

  // 清除右侧所有选择状态
  selectedRightItemsArray.value = []

  // 刷新数据
  fetchLeftData()
  fetchRightData()

  // 触发选择状态变化事件
  emit('selectionChange', selectionStatus.value)
}

// 反选功能
function toggleInvertSelection() {
  console.log('=== 反选操作开始 ===')
  console.log('当前全局全选状态:', isGlobalSelectAll.value)
  console.log('当前选中项目数量:', selectedLeftItemsArray.value.length)
  console.log('当前modelValue数量:', props.modelValue.length)

  if (isGlobalSelectAll.value) {
    // 如果当前是全局全选，则取消全选（反选模式）
    isGlobalSelectAll.value = false
    selectedLeftItemsArray.value = []
    emit('update:modelValue', [])
    console.log('取消全局全选，进入反选模式')
  } else if (props.modelValue.length > 0) {
    // 如果有部分选中，则反选（选择未被选中的）
    const selectedIds = new Set(props.modelValue.map(item =>
      String(typeof item === 'object' ? item[props.valueKey] : item)
    ))
    const newSelected = allAvailableItems.value.filter(item => {
      const itemId = String(item[props.valueKey])
      return !selectedIds.has(itemId)
    })

    selectedLeftItemsArray.value = newSelected
    emit('update:modelValue', newSelected)
    console.log('反选完成，新选中项目数量:', newSelected.length)
  } else {
    // 如果没有选中任何项目，则全选
    isGlobalSelectAll.value = true
    selectedLeftItemsArray.value = []
    emit('update:modelValue', []) // 全选时传空数组
    console.log('启用全局全选')
  }

  // 刷新数据
  fetchLeftData()
  fetchRightData()

  // 触发选择状态变化事件
  emit('selectionChange', selectionStatus.value)
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
