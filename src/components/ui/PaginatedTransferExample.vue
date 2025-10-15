<template>
  <div class="paginated-transfer-example">
    <h3 class="text-lg font-semibold mb-4">PaginatedTransfer 使用示例</h3>

    <!-- 选择状态显示 -->
    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
      <h4 class="font-medium mb-2">当前选择状态：</h4>
        <div class="text-sm">
          <p v-if="selectionData.selected !== undefined"><strong>selected:</strong> {{ selectionData.selected ? 'true' : 'false' }}</p>
          <p v-if="selectionData.selectStatus !== undefined"><strong>selectStatus:</strong> {{ selectionData.selectStatus ? 'true' : 'false' }}</p>
          <p><strong>selected_accounts 数量:</strong> {{ selectionData.selected_accounts.length }}</p>
          <div class="mt-2">
            <p><strong>模式说明:</strong></p>
            <ul class="list-disc list-inside ml-4 text-xs">
              <li v-if="selectionData.selected === true && selectionData.selected_accounts.length === 0">
                全选模式：selected: true, selected_accounts: []
              </li>
              <li v-else-if="selectionData.selected === true && selectionData.selected_accounts.length > 0">
                自定义选择模式：selected: true, selected_accounts: [具体选中项]
              </li>
              <li v-else-if="selectionData.selectStatus === false">
                反选模式：selectStatus: false, selected_accounts: [未被选中的项]
              </li>
            </ul>
          </div>
          <div v-if="selectionData.selected_accounts.length > 0" class="mt-2">
            <p><strong>账号列表:</strong></p>
            <ul class="list-disc list-inside ml-4">
              <li v-for="account in selectionData.selected_accounts.slice(0, 5)" :key="account.id">
                {{ account.name }} (ID: {{ account.id }})
              </li>
              <li v-if="selectionData.selected_accounts.length > 5" class="text-gray-500">
                ... 还有 {{ selectionData.selected_accounts.length - 5 }} 个账号
              </li>
            </ul>
          </div>
        </div>
    </div>

    <!-- PaginatedTransfer 组件 -->
    <PaginatedTransfer
      :fetchApi="fetchBotList"
      v-model="selectedAccounts"
      @selectionChange="handleSelectionChange"
      labelKey="name"
      valueKey="id"
      :supportSelectAll="true"
    />

    <!-- 提交数据示例 -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h4 class="font-medium mb-2">提交给后端的数据格式：</h4>
      <pre class="text-xs bg-white p-2 rounded border overflow-auto">{{ JSON.stringify(submitData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PaginatedTransfer from './PaginatedTransfer.vue'

// 响应式数据
const selectedAccounts = ref([])
const selectionData = ref({
  selected: false,
  selectStatus: false,
  selected_accounts: []
})

// 计算提交数据
const submitData = computed(() => {
  return {
    selected: selectionData.value.selected,
    selectStatus: selectionData.value.selectStatus,
    selected_accounts: selectionData.value.selected_accounts
  }
})

// 模拟API函数
const fetchBotList = async (params) => {
  console.log('API 请求参数:', params)

  // 模拟API响应
  const mockData = {
    results: [
      { id: '40', name: '1967921567016648704RCeola90892', remark: '机器人A' },
      { id: '41', name: '1967921567016648704RCeola90892', remark: '机器人B' },
      { id: '42', name: '1967921567016648704RCeola90892', remark: '机器人C' },
      { id: '43', name: '1967921567016648704RCeola90892', remark: '机器人D' },
      { id: '44', name: '1967921567016648704RCeola90892', remark: '机器人E' },
      { id: '45', name: '1967921567016648704RCeola90892', remark: '机器人F' },
      { id: '46', name: '1967921567016648704RCeola90892', remark: '机器人G' },
      { id: '47', name: '1967921567016648704RCeola90892', remark: '机器人H' },
      { id: '48', name: '1967921567016648704RCeola90892', remark: '机器人I' },
      { id: '49', name: '1967921567016648704RCeola90892', remark: '机器人J' },
    ],
    count: 100,
    total: 100
  }

  // 模拟搜索过滤
  if (params.search) {
    mockData.results = mockData.results.filter(item =>
      item.remark.toLowerCase().includes(params.search.toLowerCase())
    )
  }

  // 模拟分页
  const startIndex = (params.page - 1) * 20
  const endIndex = startIndex + 20
  mockData.results = mockData.results.slice(startIndex, endIndex)

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData)
    }, 300) // 模拟网络延迟
  })
}

// 处理选择状态变化
const handleSelectionChange = (status) => {
  console.log('选择状态变化:', status)
  selectionData.value = { ...status }

  // 这里可以根据需要处理选择状态变化
  if (status.selected === true && status.selected_accounts.length === 0) {
    console.log('全选模式：selected: true, selected_accounts: []')
  } else if (status.selected === true && status.selected_accounts.length > 0) {
    console.log('自定义选择模式：selected: true, selected_accounts: [具体选中项]')
  } else if (status.selectStatus === false) {
    console.log('反选模式：selectStatus: false, selected_accounts: [未被选中的项]')
  }
}
</script>

<style scoped>
.paginated-transfer-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

pre {
  max-height: 200px;
}
</style>
