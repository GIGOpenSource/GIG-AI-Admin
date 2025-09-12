<template>
  <div class="relative" ref="selectRef">
    <div
      @click="toggleDropdown"
      class="dark:bg-dark-900 h-11 flex items-center w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      :class="{ 'text-gray-800 dark:text-white/90': isOpen }"
    >
      <span v-if="!selectedItem" class="text-gray-400">{{ placeholder }}</span>
      <span v-else class="text-gray-800 dark:text-white/90">{{ selectedItem.label }}</span>
      <svg
        class="ml-auto"
        :class="{ 'transform rotate-180': isOpen }"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-sm dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      >
        <!-- 搜索框 -->
        <div class="p-2 border-b border-gray-200 dark:border-gray-700">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="搜索..."
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            @click.stop
          />
        </div>
        <!-- 选项列表 -->
        <ul
          class="overflow-y-auto divide-y divide-gray-200 custom-scrollbar max-h-60 dark:divide-gray-800"
          role="listbox"
        >
          <li
            v-for="item in filteredOptions"
            :key="item.value"
            @click="selectItem(item)"
            class="relative flex items-center w-full px-3 py-2 border-transparent cursor-pointer first:rounded-t-lg last:rounded-b-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="{ 'bg-gray-50 dark:bg-white/[0.03]': isSelected(item) }"
            role="option"
            :aria-selected="isSelected(item)"
          >
            <span class="grow">{{ item.label }}</span>
            <svg
              v-if="isSelected(item)"
              class="w-5 h-5 text-gray-400 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </li>
          <li v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            没有找到匹配的选项
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '请选择...',
  },
  searchable: {
    type: Boolean,
    default: true,
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref(null)
const searchInput = ref(null)

// 计算选中的项目
const selectedItem = computed(() => {
  return props.options.find(option => option.value === props.modelValue) || null
})

// 计算过滤后的选项
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && props.searchable) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const selectItem = (item) => {
  emit('update:modelValue', item.value)
  isOpen.value = false
  searchQuery.value = ''
}

const isSelected = (item) => {
  return item.value === props.modelValue
}

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

// 监听下拉框打开状态，重置搜索
watch(isOpen, (newValue) => {
  if (!newValue) {
    searchQuery.value = ''
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
