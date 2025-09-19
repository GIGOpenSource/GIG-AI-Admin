<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { PaginationRoot, useForwardPropsEmits } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<PaginationRootProps & {
  class?: HTMLAttributes["class"]
}>()
const emits = defineEmits<PaginationRootEmits>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
console.log(props,'props');

</script>

<template>

  <PaginationRoot
    v-slot="slotProps"
    data-slot="pagination"
    v-bind="forwarded"
    :class="cn('mx-auto flex w-full justify-center', props.class)"
  >
    <div class="total">共{{ props.total }}条</div>
    <slot v-bind="slotProps" />
  </PaginationRoot>
</template>
<style scoped>
.total{
  margin-top:0.6vh;
  /* color: rgb(107, 107, 107); */

}
</style>
