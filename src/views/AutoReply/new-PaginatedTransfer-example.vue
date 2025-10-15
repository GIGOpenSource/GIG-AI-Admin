<!-- 在 AutoReply/new.vue 中的使用示例 -->

<template>
  <div>
    <!-- 机器人选择部分 - 替换原有的 RobotSelector -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        机器人<span class="text-error-500">*</span>
      </label>

      <!-- 选择状态显示 -->
      <div class="mb-2 p-2 bg-gray-50 rounded text-sm">
        <span v-if="selectionStatus.selected === true && selectionStatus.selected_accounts.length === 0"
              class="text-green-600 font-medium">全选模式：selected: true, selected_accounts: []</span>
        <span v-else-if="selectionStatus.selected === true && selectionStatus.selected_accounts.length > 0"
              class="text-blue-600 font-medium">自定义选择：selected: true, selected_accounts: [{{ selectionStatus.selected_accounts.length }}项]</span>
        <span v-else-if="selectionStatus.selectStatus === false"
              class="text-orange-600 font-medium">反选模式：selectStatus: false, selected_accounts: [{{ selectionStatus.selected_accounts.length }}项]</span>
      </div>

      <!-- 使用 PaginatedTransfer 组件 -->
      <PaginatedTransfer
        v-model="form.selected_accounts"
        :fetchApi="fetchBotListPaginated"
        @selectionChange="handleSelectionChange"
        labelKey="name"
        valueKey="id"
        :supportSelectAll="true"
      />
    </div>

    <!-- 提交数据预览 -->
    <div class="mt-4 p-3 bg-blue-50 rounded">
      <h4 class="font-medium text-sm mb-2">提交给 createAutoPlay 接口的数据：</h4>
      <pre class="text-xs bg-white p-2 rounded border overflow-auto">{{ JSON.stringify(submitDataForAPI, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PaginatedTransfer from '@/components/ui/PaginatedTransfer.vue'

// 表单数据
const form = ref({
  selected_accounts: []
})

// 选择状态
const selectionStatus = ref({
  selected: false,
  selectStatus: false,
  selected_accounts: []
})

// 处理选择状态变化
const handleSelectionChange = (status) => {
  console.log('机器人选择状态变化:', status)
  selectionStatus.value = { ...status }

  // 根据状态更新表单数据
  if (status.selected === true && status.selected_accounts.length === 0) {
    // 全选模式：保持 selected_accounts 为空数组，让后端知道是全选
    form.value.selected_accounts = []
    console.log('全选模式：selected: true, selected_accounts: []')
  } else if (status.selected === true && status.selected_accounts.length > 0) {
    // 自定义选择模式：使用具体选中的账号
    form.value.selected_accounts = status.selected_accounts
    console.log('自定义选择模式：selected: true, selected_accounts: [具体选中项]')
  } else if (status.selectStatus === false) {
    // 反选模式：使用未被选中的账号
    form.value.selected_accounts = status.selected_accounts
    console.log('反选模式：selectStatus: false, selected_accounts: [未被选中的项]')
  }
}

// 计算提交给 API 的数据
const submitDataForAPI = computed(() => {
  if (selectionStatus.value.selected === true && selectionStatus.value.selected_accounts.length === 0) {
    // 全选模式
    return {
      selected: true,
      selected_accounts: []
    }
  } else if (selectionStatus.value.selected === true && selectionStatus.value.selected_accounts.length > 0) {
    // 自定义选择模式
    return {
      selected: true,
      selected_accounts: selectionStatus.value.selected_accounts
    }
  } else if (selectionStatus.value.selectStatus === false) {
    // 反选模式
    return {
      selectStatus: false,
      selected_accounts: selectionStatus.value.selected_accounts
    }
  } else {
    // 默认情况
    return {
      selected: true,
      selected_accounts: []
    }
  }
})

// 模拟 API 函数
const fetchBotListPaginated = async (params) => {
  console.log('获取机器人列表:', params)

  // 这里调用您实际的 API
  // const response = await fetch('/api/bots', {
  //   method: 'POST',
  //   body: JSON.stringify(params)
  // })
  // return response.json()

  // 模拟数据
  return {
    results: [
      { id: '40', name: '1967921567016648704RCeola90892', remark: '机器人A' },
      { id: '41', name: '1967921567016648704RCeola90892', remark: '机器人B' },
      { id: '42', name: '1967921567016648704RCeola90892', remark: '机器人C' },
    ],
    count: 100,
    total: 100
  }
}

// 提交函数示例
const submitForm = async () => {
  try {
    // 准备提交数据
    const submitData = {
      // 其他表单字段...
      type: 'post',
      provider: 'twitter',
      language: 'zh',
      text: '测试文本',
      mentions: '',
      tags: [],
      payload: '',
      selected_accounts: submitDataForAPI.value.selected_accounts,
      // 根据模式添加不同的字段
      ...(submitDataForAPI.value.selected !== undefined ? { selected: submitDataForAPI.value.selected } : {}),
      ...(submitDataForAPI.value.selectStatus !== undefined ? { selectStatus: submitDataForAPI.value.selectStatus } : {}),
      prompt: '',
      twitter_reply_to_tweet_id: '',
      facebook_page_id: '',
      facebook_comment_id: '',
      task_remark: '',
      frequency_type: 'daily',
      frequency_value: '1'
    }

    console.log('提交给 createAutoPlay 的数据:', submitData)

    // 调用 API
    // await createAutoPlay(submitData)

  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>

<style scoped>
pre {
  max-height: 200px;
}
</style>
