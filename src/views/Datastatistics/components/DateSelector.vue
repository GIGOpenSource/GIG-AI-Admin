<template>
  <div class="flex items-center gap-4 mb-6">
    <Button variant="primary" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
      切换企业数据
    </Button>

    <div class="flex gap-2">
      <Button
        v-for="(option, index) in dateOptions"
        :key="index"
        :variant="selectedDate === option.value ? 'primary' : 'outline'"
        :class="
          selectedDate === option.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
        "
        class="px-4 py-2 rounded-lg text-sm"
        @click="selectDate(option.value)"
      >
        {{ option.label }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import Button from '../../../components/ui/Button.vue'

interface DateOption {
  label: string
  value: string
}

const selectedDate = ref('2025-10-15')

const dateOptions: DateOption[] = [
  { label: '2025-10-15', value: '2025-10-15' },
  { label: '近3日', value: 'last3days' },
  { label: '近7日', value: 'last7days' },
  { label: '近14日', value: 'last14days' },
  { label: '近30日', value: 'last30days' },
  { label: '自定义日期', value: 'custom' },
]

const emit = defineEmits(['date-change'])

const selectDate = (value: string) => {
  selectedDate.value = value
  emit('date-change', value)
}
</script>
