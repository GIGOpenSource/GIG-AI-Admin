<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div></div>
          <Button size="sm" @click="openAdd">新增</Button>
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">序号</TableHead>
              <TableHead class="whitespace-nowrap">平台名称</TableHead>
              <TableHead class="whitespace-nowrap">触发关键词</TableHead>
              <TableHead class="whitespace-nowrap">提示词</TableHead>
              <TableHead class="whitespace-nowrap">任务类型</TableHead>
              <TableHead class="whitespace-nowrap">状态</TableHead>
              <TableHead class="whitespace-nowrap">循环周期</TableHead>
              <TableHead class="whitespace-nowrap">循环类型</TableHead>
              <TableHead class="whitespace-nowrap">执行时间</TableHead>
              <TableHead class="whitespace-nowrap">话题</TableHead>
              <!-- <TableHead class="whitespace-nowrap">回复最大限制数</TableHead> -->
              <TableHead v-if="hasFollowTasks" class="whitespace-nowrap">对方账号</TableHead>
              <TableHead v-if="hasFollowTasks" class="whitespace-nowrap">AI账号</TableHead>
              <TableHead v-if="hasFollowTasks" class="whitespace-nowrap">关注执行结果</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="tasks.length">
              <TableRow v-for="(item, idx) in tasks" :key="item.id">
                <TableCell class="whitespace-nowrap">{{ idx + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ getPlatformText(item.provider) }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ item.keyword_config_id }}</TableCell>
                <TableCell class="max-w-[380px] truncate" :title="item.prompt_config_id">{{ item.prompt_config_id }}
                </TableCell>
                <TableCell class="whitespace-nowrap">{{ getTaskTypeText(item.type) }}</TableCell>
                <TableCell class="whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                    item.enabled
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                      : 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
                  ]">
                    {{ item.enabled ? '启用' : '停用' }}
                  </span>
                </TableCell>
                <TableCell class="whitespace-nowrap">{{ item.day_of_month }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ getRecurrenceTypeText(item.recurrence_type) }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ item.time_of_day }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ getTagsText(item.tags) }}</TableCell>
                <!-- <TableCell class="whitespace-nowrap">最大限制数</TableCell> -->
                <TableCell v-if="hasFollowTasks" class="whitespace-nowrap">{{ item.target_account || '--' }}</TableCell>
                <TableCell v-if="hasFollowTasks" class="whitespace-nowrap">{{ getAiAccountsText(item.ai_accounts) }}</TableCell>
                <TableCell v-if="hasFollowTasks" class="whitespace-nowrap">{{ getFollowResultText(item.follow_result) }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ formatTime(item.created_at) }}</TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" @click="openEdit(item)">编辑</Button>
                    <button
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(item, $event)">
                      删除
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell :colspan="10" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
              </TableRow>
            </template>


          </TableBody>
        </Table>
        <div class="mt-4" v-if="total > 0">
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1">
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </ComponentCard>

      <Modal v-if="showForm" :fullScreenBackdrop="true" @close="closeForm">
        <template #body>
          <div class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">{{ isEditing ? '编辑任务' : '新增任务' }}</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
              <!-- 关注任务时只显示类型选择 -->
              <div v-if="form.type === 'follow_task'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">类型<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.type"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                      <option value="">请选择类型</option>
                      <option v-for="option in TASK_TYPE_OPTIONS" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                  </select>
                </div>
              </div>

              <!-- 其他任务类型显示完整字段 -->
              <div v-else>
                <div v-if="role == 'admin'">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">目标用户<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.owner"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="" disabled>请选择目标用户</option>
                    <option v-for="user in userOptions" :key="user.id" :value="user.id">{{ user.name }}</option>
                  </select>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span
                        class="text-error-500">*</span></label>
                    <select v-model="form.provider"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                      <option value="">请选择平台</option>
                      <option v-for="option in PLATFORM_OPTIONS" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">类型<span
                        class="text-error-500">*</span></label>
                    <select v-model="form.type"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                      <option value="">请选择类型</option>
                      <option v-for="option in TASK_TYPE_OPTIONS" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <!-- 关注任务专用字段 -->
              <div v-if="form.type === 'follow_task'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">对方账号<span
                      class="text-error-500">*</span></label>
                  <input v-model="form.target_account" type="text" placeholder="请输入对方账号"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">AI账号选择<span
                      class="text-error-500">*</span></label>

                  <!-- 自定义多选下拉框 -->
                  <div class="relative ai-account-dropdown">
                    <!-- 显示区域 -->
                    <div @click="toggleAiAccountDropdown"
                      class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs cursor-pointer focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 min-h-[44px] flex items-center">
                      <div v-if="form.ai_accounts.length === 0" class="text-gray-400">请选择AI账号</div>
                      <div v-else class="flex flex-wrap gap-1">
                        <span v-for="account in form.ai_accounts" :key="account.id"
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {{ getAiAccountName(account.id) }}
                          <button type="button" @click.stop="removeAiAccountById(account.id)"
                            class="ml-1.5 inline-flex items-center justify-center w-3 h-3 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300">
                            <!-- <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                              <path d="m0 0 2 2m0 0 2 2m-2-2 2-2m-2 2-2 2"/>
                            </svg> -->
                            X
                          </button>
                        </span>
                      </div>
                      <!-- 下拉箭头 -->
                      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showAiAccountDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>

                    <!-- 下拉选项 -->
                    <div v-if="showAiAccountDropdown"
                      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div v-if="aiAccountOptions.length === 0" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        暂无AI账号选项
                      </div>
                      <div v-else>
                        <div v-for="account in aiAccountOptions" :key="account.id"
                          @click="toggleAiAccount(account.id)"
                          class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                          <span>{{ account.name }}</span>
                          <div v-if="form.ai_accounts.some(acc => acc.id === account.id)" class="text-blue-500">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">关注执行结果<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.follow_result"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="pending">未执行</option>
                    <option value="failed">执行失败</option>
                    <option value="success">执行成功</option>
                  </select>
                </div>
              </div>

              <!-- 其他任务类型的字段 -->
              <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">关键词<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.keyword"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option disabled value="">请选择关键词</option>
                    <option v-for="opt in keywordOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">提示词<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.prompt"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option disabled value="">请选择提示词</option>
                    <option v-for="opt in availablePrompts" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">循环类型<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.recurrence_type"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="daily">日</option>
                    <option value="weekly">周</option>
                    <option value="monthly">月</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">循环周期<span
                      class="text-error-500">*</span></label>
                  <input v-model.number="form.day_of_month" type="number" min="1" placeholder="如：1"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">执行时间<span
                      class="text-error-500">*</span></label>
                  <input v-model="form.time_of_day" type="time"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">话题<span class="text-gray-500 text-xs ml-1">(最多选择5个)</span></label>
                  <!-- 自定义多选下拉框 -->
                  <div class="relative tag-dropdown">
                    <!-- 显示区域 -->
                    <div @click="toggleDropdown"
                      class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs cursor-pointer focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 min-h-[44px] flex items-center">
                      <div v-if="form.tags.length === 0" class="text-gray-400">请选择话题</div>
                      <div v-else class="flex flex-wrap gap-1">
                        <span v-for="tagId in form.tags" :key="tagId"
                          class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
                          <span class="px-1">{{ getTagName(tagId) }}</span>
                           <button type="button" @click.stop="removeTag(tagId)"
                             class="inline-flex items-center justify-center w-3 h-3 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300">
                             <!-- <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                               <path d="m0 0 2 2m0 0 2 2m-2-2 2-2m-2 2-2 2"/>
                             </svg> -->
                             X
                           </button>
                        </span>
                      </div>
                      <!-- 下拉箭头 -->
                      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showTagDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>

                    <!-- 下拉选项 -->
                    <div v-if="showTagDropdown"
                      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div v-if="tagOptions.length === 0" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        暂无话题选项
                      </div>
                      <div v-else>
                        <div v-for="tag in tagOptions" :key="tag.id"
                          @click="toggleTag(tag.id)"
                          class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                          <span>{{ tag.name }}</span>
                          <div v-if="form.tags.includes(tag.id)" class="text-blue-500">
                            X
                            <!-- <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg> -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    已选择: {{ form.tags.length }}/5
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">状态</label>
                <select v-model="form.enabled"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option :value="true">启用</option>
                  <option :value="false">停用</option>
                </select>
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeForm">取消</Button>
                <Button type="submit">保存</Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- 删除确认气泡弹窗 -->
      <DeleteConfirmDialog :isOpen="showDeleteDialog" :title="'删除'" :description="'确定要删除吗？此操作不可撤销。'"
        :isLoading="deleteLoading" :triggerRect="triggerRect" @close="closeDeleteDialog" @confirm="confirmDelete" />
    </div>
  </AdminLayout>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getScheduledTasks, createScheduledTask, getScheduledTask, updateScheduledTask, deleteScheduledTask } from '@/api/task'
import { getKeywordsConfigs } from '@/api/keywrods'
import { getPromptsConfigs } from '@/api/prompts'
import { getUser } from '@/api/index'
import { getTags } from '@/api/tag'
import { toast } from "vue-sonner"
import { formatTime } from '@/lib/utils'
import { PLATFORM_OPTIONS, TASK_TYPE_OPTIONS } from '@/config/platforms'
const role = localStorage.getItem('role')
const userinfo = JSON.parse(localStorage.getItem('profile'))
const currentPageTitle = ref('任务列表')

const tasks = ref([])

// 用户下拉选项
const userOptions = ref([])

// AI账号选项
const aiAccountOptions = ref([])

// Tag选项
const tagOptions = ref([])

// 下拉框状态
const showTagDropdown = ref(false)
const showAiAccountDropdown = ref(false)

// 分页参数
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const showForm = ref(false)
const editingId = ref(null)
const form = ref({
  owner: role == 'user' ? userinfo.id : '',
  provider: '',
  type: '',
  keyword: '',
  prompt: '',
  recurrence_type: 'daily',
  day_of_month: 1,
  time_of_day: '09:00',
  enabled: true,
  tags: [],//tags - 存储话题ID数组
  // 关注任务专用字段
  target_account: '',
  ai_accounts: [{ id: '' }],
  follow_result: 'pending'
})

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })

const isEditing = computed(() => editingId.value !== null)

// 检查是否有关注任务
const hasFollowTasks = computed(() => {
  return tasks.value.some(task => task.type === 'follow_task')
})

function openAdd() {
  editingId.value = null
  showForm.value = true
}

async function openEdit(item) {
  editingId.value = item.id
  try {
    const detail = await getScheduledTask(String(item.id))
    form.value = {
      owner: detail.owner ?? item.owner,
      provider: detail.provider ?? item.provider,
      type: detail.type ?? item.type,
      keyword: detail.keyword_config_id ?? item.keyword_config_id,
      prompt: detail.prompt_config_id ?? item.prompt_config_id,
      recurrence_type: detail.recurrence_type ?? item.recurrence_type,
      day_of_month: detail.day_of_month ?? item.day_of_month,
      time_of_day: detail.time_of_day ?? item.time_of_day,
      enabled: typeof detail.enabled === 'boolean' ? detail.enabled : item.enabled,
      tags: Array.isArray(detail.tags) ? detail.tags : (Array.isArray(item.tags) ? item.tags : []),
      // 关注任务字段
      target_account: detail.target_account ?? item.target_account ?? '',
      ai_accounts: detail.ai_accounts ?? item.ai_accounts ?? [{ id: '' }],
      follow_result: detail.follow_result ?? item.follow_result ?? 'pending'
    }
  } catch (error) {
    console.error('Failed to fetch task detail:', error)
    toast.error('获取任务详情失败', {
      description: error.response?.data?.message || error.message || '获取任务详情时发生错误'
    })
    form.value = {
      owner: item.owner,
      provider: item.provider,
      type: item.type,
      keyword: item.keyword_config_id,
      prompt: item.prompt_config_id,
      recurrence_type: item.recurrence_type,
      day_of_month: item.day_of_month,
      time_of_day: item.time_of_day,
      enabled: item.enabled,
      tags: Array.isArray(item.tags) ? item.tags : [],
      // 关注任务字段
      target_account: item.target_account ?? '',
      ai_accounts: item.ai_accounts ?? [{ id: '' }],
      follow_result: item.follow_result ?? 'pending'
    }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  form.value = {
    owner: role == 'user' ? userinfo.id : '',
    provider: '',
    type: '',
    keyword: '',
    prompt: '',
    recurrence_type: 'daily',
    day_of_month: 1,
    time_of_day: '09:00',
    enabled: true,
    tags: [],
    target_account: '',
    ai_accounts: [{ id: '' }],
    follow_result: 'pending'
  }
}

async function submitForm() {
  // 验证话题选择数量
  if (form.value.tags.length > 5) {
    toast.error('话题选择数量超限', {
      description: '最多只能选择5个话题'
    })
    return
  }

  // 关注任务的特殊验证
  if (form.value.type === 'follow_task') {
    if (!form.value.target_account) {
      toast.error('对方账号不能为空', {
        description: '请输入对方账号'
      })
      return
    }
    if (!form.value.ai_accounts.some(account => account.id)) {
      toast.error('AI账号不能为空', {
        description: '请至少选择一个AI账号'
      })
      return
    }
  } else {
    // 其他任务类型的验证
    if (!form.value.owner) {
      toast.error('目标用户不能为空', {
        description: '请选择目标用户'
      })
      return
    }
    if (!form.value.keyword) {
      toast.error('关键词不能为空', {
        description: '请选择关键词'
      })
      return
    }
    if (!form.value.prompt) {
      toast.error('提示词不能为空', {
        description: '请选择提示词'
      })
      return
    }

    // 其他任务类型需要验证的字段
    if (!form.value.day_of_month) {
      toast.error('循环周期不能为空', {
        description: '请输入循环周期'
      })
      return
    }
    if (!form.value.time_of_day) {
      toast.error('执行时间不能为空', {
        description: '请选择执行时间'
      })
      return
    }
  }

  try {
    const payload = {
      type: form.value.type,
      enabled: form.value.enabled
    }

    // 根据任务类型添加不同的字段
    if (form.value.type === 'follow_task') {
      payload.target_account = form.value.target_account
      payload.ai_accounts = form.value.ai_accounts.filter(account => account.id)
      payload.follow_result = form.value.follow_result
    } else {
      payload.owner = form.value.owner
      payload.provider = form.value.provider
      payload.keyword_config_id = form.value.keyword
      payload.prompt_config_id = form.value.prompt
      payload.recurrence_type = form.value.recurrence_type
      payload.day_of_month = form.value.day_of_month
      payload.time_of_day = form.value.time_of_day
      payload.tags = form.value.tags
    }

    if (isEditing.value) {
      await updateScheduledTask(String(editingId.value), payload)
      toast.success('任务更新成功')
    } else {
      await createScheduledTask(payload)
      toast.success('任务创建成功')
    }

    await fetchTasks() // Refresh the list
    closeForm()
  } catch (error) {
    console.error('Failed to save task:', error)
    toast.error(isEditing.value ? '更新失败' : '创建失败', {
      description: error.response?.data?.message || error.message || (isEditing.value ? '更新任务时发生错误' : '创建任务时发生错误')
    })
  }
}

function onDelete(item, event) {
  itemToDelete.value = item

  // 获取触发按钮的位置信息
  const buttonRect = event.target.getBoundingClientRect()
  triggerRect.value = {
    top: buttonRect.top,
    left: buttonRect.left,
    width: buttonRect.width,
    height: buttonRect.height,
    bottom: buttonRect.bottom
  }

  showDeleteDialog.value = true
}

// 确认删除
async function confirmDelete() {
  if (!itemToDelete.value) return

  deleteLoading.value = true

  try {
    await deleteScheduledTask(String(itemToDelete.value.id))
    toast.success('任务删除成功')
    await fetchTasks() // Refresh the list after deletion
    closeDeleteDialog()
  } catch (error) {
    console.error('Failed to delete task:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除任务时发生错误'
    })
  } finally {
    deleteLoading.value = false
  }
}

// 关闭删除确认弹窗
function closeDeleteDialog() {
  showDeleteDialog.value = false
  itemToDelete.value = null
  deleteLoading.value = false
}


function getRecurrenceTypeText(recurrenceType) {
  const typeMap = {
    'daily': '日',
    'weekly': '周',
    'monthly': '月'
  }
  return typeMap[recurrenceType] || recurrenceType
}

function getTaskTypeText(type) {
  const taskType = TASK_TYPE_OPTIONS.find(option => option.value === type)
  return taskType ? taskType.label : type
}

// 获取平台显示名称
function getPlatformText(provider) {
  const platform = PLATFORM_OPTIONS.find(option => option.value === provider)
  return platform ? platform.label : provider
}

// 关注执行结果文本
function getFollowResultText(result) {
  const resultMap = {
    'pending': '未执行',
    'failed': '执行失败',
    'success': '执行成功'
  }
  return resultMap[result] || result || '--'
}

// AI账号文本格式化
function getAiAccountsText(aiAccounts) {
  if (!aiAccounts || !Array.isArray(aiAccounts) || aiAccounts.length === 0) {
    return '--'
  }

  // 过滤掉空的账号ID
  const validAccounts = aiAccounts.filter(account => account && account.id)

  if (validAccounts.length === 0) {
    return '--'
  }

  // 根据AI账号ID获取对应的名称
  const accountNames = validAccounts.map(account => {
    const aiAccount = aiAccountOptions.value.find(option => option.id === account.id)
    return aiAccount ? aiAccount.name : `账号${account.id}`
  })

  return accountNames.join(', ')
}

// Tags文本格式化
function getTagsText(tags) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return '--'
  }

  // 根据tag ID获取对应的名称
  const tagNames = tags.map(tagId => {
    const tag = tagOptions.value.find(option => option.id === tagId)
    return tag ? tag.name : `话题${tagId}`
  })

  return tagNames.join(', ')
}

// 获取单个tag名称
function getTagName(tagId) {
  const tag = tagOptions.value.find(option => option.id === tagId)
  return tag ? tag.name : `话题${tagId}`
}

// 移除tag
function removeTag(tagId) {
  const index = form.value.tags.indexOf(tagId)
  if (index > -1) {
    form.value.tags.splice(index, 1)
  }
}

// 验证tag选择数量
function validateTagSelection() {
  if (form.value.tags.length > 5) {
    toast.error('话题选择数量超限', {
      description: '最多只能选择5个话题，已自动移除多余选择'
    })
    // 只保留前5个
    form.value.tags = form.value.tags.slice(0, 5)
  }
}

// 切换下拉框显示状态
function toggleDropdown() {
  showTagDropdown.value = !showTagDropdown.value
}

// 切换tag选择状态
function toggleTag(tagId) {
  const index = form.value.tags.indexOf(tagId)
  if (index > -1) {
    // 如果已选择，则移除
    form.value.tags.splice(index, 1)
  } else {
    // 如果未选择且未超过限制，则添加
    if (form.value.tags.length < 5) {
      form.value.tags.push(tagId)
    } else {
      toast.error('话题选择数量超限', {
        description: '最多只能选择5个话题'
      })
    }
  }
}

// 切换AI账号下拉框显示状态
function toggleAiAccountDropdown() {
  showAiAccountDropdown.value = !showAiAccountDropdown.value
}

// 切换AI账号选择状态
function toggleAiAccount(accountId) {
  const existingIndex = form.value.ai_accounts.findIndex(account => account.id === accountId)
  if (existingIndex > -1) {
    // 如果已选择，则移除
    form.value.ai_accounts.splice(existingIndex, 1)
  } else {
    // 如果未选择，则添加
    form.value.ai_accounts.push({ id: accountId })
  }
}

// 移除AI账号
function removeAiAccountById(accountId) {
  const index = form.value.ai_accounts.findIndex(account => account.id === accountId)
  if (index > -1) {
    form.value.ai_accounts.splice(index, 1)
  }
}

// 获取AI账号名称
function getAiAccountName(accountId) {
  const account = aiAccountOptions.value.find(option => option.id === accountId)
  return account ? account.name : `账号${accountId}`
}

// AI账号管理方法
function addAiAccount() {
  form.value.ai_accounts.push({ id: '' })
}

function removeAiAccount(index) {
  if (form.value.ai_accounts.length > 1) {
    form.value.ai_accounts.splice(index, 1)
  }
}

// keyword/prompt options and linkage
const keywordOptions = ref([])
const promptOptions = ref([])

const availablePrompts = computed(() => {
  // Return all prompt options from API
  return promptOptions.value
})

async function fetchTasks() {
  try {
    const res = await getScheduledTasks({
      page: page.value,
      page_size: pageSize.value,
    })
    const list = (res && res.results) ? res.results : res
    tasks.value = Array.isArray(list) ? list.map((item) => ({
      id: item.id,
      owner: item.owner,
      provider: item.provider,
      type: item.type,
      keyword_config_id: item.keyword_config_id,
      prompt_config_id: item.prompt_config_id,
      recurrence_type: item.recurrence_type,
      day_of_month: item.day_of_month,
      time_of_day: item.time_of_day,
      enabled: item.enabled,
      created_at: item.created_at,
      tags: item.tags,
      // 关注任务字段
      target_account: item.target_account,
      ai_accounts: item.ai_accounts,
      follow_result: item.follow_result
    })) : []
    total.value = res.count || 0
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    toast.error('获取任务列表失败', {
      description: error.response?.data?.message || error.message || '获取任务列表时发生错误'
    })
    tasks.value = []
  }
}

async function fetchUsers() {
  if (role == 'user') return
  try {
    const res = await getUser({})
    const list = (res && res.results) ? res.results : res
    userOptions.value = Array.isArray(list) ? list.map((u) => ({
      id: u.id ?? u.pk ?? u.uuid,
      name: u.username || u.name || u.email || `用户${u.id}`,
    })) : []
  } catch (error) {
    console.error('Failed to fetch users:', error)
    toast.error('获取用户列表失败', {
      description: error.response?.data?.message || error.message || '获取用户列表时发生错误'
    })
    userOptions.value = []
  }
}

async function fetchKeywords() {
  try {
    const res = await getKeywordsConfigs()
    const list = (res && res.results) ? res.results : res
    keywordOptions.value = Array.isArray(list) ? list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        keyword: item.include_keywords
      }
    }
    ).filter(Boolean) : []
  } catch (error) {
    console.error('Failed to fetch keywords:', error)
    toast.error('获取关键词列表失败', {
      description: error.response?.data?.message || error.message || '获取关键词列表时发生错误'
    })
    keywordOptions.value = []
  }
}

async function fetchPrompts() {
  try {
    const res = await getPromptsConfigs()
    const list = (res && res.results) ? res.results : res
    promptOptions.value = Array.isArray(list) ? list.map((item) => ({
      id: item.id,
      name: item.name,
      content: item.content
    })) : []
  } catch (error) {
    console.error('Failed to fetch prompts:', error)
    toast.error('获取提示词列表失败', {
      description: error.response?.data?.message || error.message || '获取提示词列表时发生错误'
    })
    promptOptions.value = []
  }
}

async function fetchAiAccounts() {
  try {
    // 这里需要调用获取AI账号的API，暂时使用模拟数据
    // const res = await getAiAccounts()
    // 模拟数据
    aiAccountOptions.value = [
      { id: '1', name: 'AI账号1' },
      { id: '2', name: 'AI账号2' },
      { id: '3', name: 'AI账号3' }
    ]
  } catch (error) {
    console.error('Failed to fetch AI accounts:', error)
    toast.error('获取AI账号列表失败', {
      description: error.response?.data?.message || error.message || '获取AI账号列表时发生错误'
    })
    aiAccountOptions.value = []
  }
}

async function fetchTags() {
  try {
    const res = await getTags({})
    const list = (res && res.results) ? res.results : res
    tagOptions.value = Array.isArray(list) ? list.map((item) => ({
      id: item.id,
      name: item.name
    })) : []
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    toast.error('获取话题列表失败', {
      description: error.response?.data?.message || error.message || '获取话题列表时发生错误'
    })
    tagOptions.value = []
  }
}

// 监听页码变化，自动刷新列表
watch(page, () => {
  fetchTasks()
})

// 点击外部关闭下拉框
function handleClickOutside(event) {
  if (showTagDropdown.value && !event.target.closest('.tag-dropdown')) {
    showTagDropdown.value = false
  }
  if (showAiAccountDropdown.value && !event.target.closest('.ai-account-dropdown')) {
    showAiAccountDropdown.value = false
  }
}

// 监听点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

onMounted(async () => {
  await Promise.all([
    fetchTasks(),
    fetchUsers(),
    fetchKeywords(),
    fetchPrompts(),
    fetchAiAccounts(),
    fetchTags()
  ])
})


</script>
