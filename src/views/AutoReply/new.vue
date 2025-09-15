<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div></div>
          <div class="flex gap-2">
            <Button size="sm" @click="openAdd">新增</Button>
          </div>
        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap">序号</TableHead>
              <TableHead class="whitespace-nowrap">类型</TableHead>
              <TableHead class="whitespace-nowrap">平台</TableHead>
              <TableHead class="whitespace-nowrap">语言</TableHead>
              <TableHead class="whitespace-nowrap">文本内容</TableHead>
              <TableHead class="whitespace-nowrap">提及</TableHead>
              <TableHead class="whitespace-nowrap">标签</TableHead>
              <TableHead class="whitespace-nowrap">载荷</TableHead>
              <TableHead class="whitespace-nowrap">选中账户</TableHead>
              <TableHead class="whitespace-nowrap">提示词</TableHead>
              <TableHead class="whitespace-nowrap">Twitter回复ID</TableHead>
              <TableHead class="whitespace-nowrap">Facebook页面ID</TableHead>
              <TableHead class="whitespace-nowrap">Facebook评论ID</TableHead>
              <TableHead class="whitespace-nowrap">创建时间</TableHead>
              <TableHead class="whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="tasks.length">
              <TableRow v-for="(task, index) in tasks" :key="task.id">
                <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.type || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.provider || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.language || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.text">{{ task.text || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.mentions">{{ task.mentions || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.tags">{{ task.tags || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.payload">{{ task.payload || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.selected_accounts">{{ task.selected_accounts || '-' }}</TableCell>
                <TableCell class="max-w-[200px] truncate" :title="task.prompt">{{ task.prompt || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.twitter_reply_to_tweet_id || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.facebook_page_id || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.facebook_comment_id || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ formatTime(task.created_at) }}</TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" @click="onEdit(task)">编辑</Button>
                    <button
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(task, $event)"
                    >
                      删除
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell :colspan="15" class="py-16 text-center text-gray-400 dark:text-white/40">暂无数据</TableCell>
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

      <!-- 新增/编辑弹窗 -->
      <Modal v-if="showAdd" :fullScreenBackdrop="true" @close="closeAdd">
        <template #body>
          <div class="relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold">{{ isEditMode ? '编辑自动回复' : '新增自动回复' }}</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">类型<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.type"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择类型</option>
                    <option value="post">发帖</option>
                    <option value="reply_comment">回复评论</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">平台<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.provider"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择平台</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">语言<span
                      class="text-error-500">*</span></label>
                  <select v-model="form.language"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择语言</option>
                    <option value="zh">中文</option>
                    <option value="en">英文</option>
                    <option value="ja">日文</option>
                    <option value="ko">韩文</option>
                    <option value="es">西班牙文</option>
                    <option value="fr">法文</option>
                    <option value="de">德文</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">文本内容<span
                      class="text-error-500">*</span></label>
                  <input v-model="form.text" placeholder="请输入文本内容"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></input>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">提及</label>
                <div class="relative mention-dropdown">
                  <!-- 显示区域 -->
                  <div @click="toggleMentionDropdown"
                    class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs cursor-pointer focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 min-h-[44px] flex items-center">
                    <div v-if="form.mentions.length === 0" class="text-gray-400">请选择提及的用户</div>
                    <div v-else class="flex flex-wrap gap-1">
                      <span v-for="userId in form.mentions" :key="userId"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
                        <span class="px-1">{{ getUserName(userId) }}</span>
                        <button type="button" @click.stop="toggleMention(userId)"
                          class="inline-flex items-center justify-center w-3 h-3 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300">
                          X
                        </button>
                      </span>
                    </div>
                    <!-- 下拉箭头 -->
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showMentionDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- 下拉选项 -->
                  <div v-if="showMentionDropdown"
                    class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div v-if="userList.length === 0" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      暂无用户选项
                    </div>
                    <div v-else>
                      <div v-for="user in userList" :key="user.id"
                        @click="toggleMention(user.id)"
                        class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                        <span>{{ user.name || user.username }}</span>
                        <div v-if="form.mentions.includes(user.id)" class="text-blue-500">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">标签</label>
                <div class="relative tag-dropdown">
                  <!-- 显示区域 -->
                  <div @click="toggleTagDropdown"
                    class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs cursor-pointer focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 min-h-[44px] flex items-center">
                    <div v-if="form.tags.length === 0" class="text-gray-400">请选择标签</div>
                    <div v-else class="flex flex-wrap gap-1">
                      <span v-for="tagId in form.tags" :key="tagId"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
                        <span class="px-1">{{ getTagName(tagId) }}</span>
                        <button type="button" @click.stop="toggleTag(tagId)"
                          class="inline-flex items-center justify-center w-3 h-3 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300">
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
                    <div v-if="tagList.length === 0" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      暂无标签选项
                    </div>
                    <div v-else>
                      <div v-for="tag in tagList" :key="tag.id"
                        @click="toggleTag(tag.id)"
                        class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                        <span>{{ tag.name }}</span>
                        <div v-if="form.tags.includes(tag.id)" class="text-blue-500">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">载荷</label>
                <textarea v-model="form.payload" placeholder="请输入载荷数据（JSON格式）"
                  class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none"></textarea>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">选中账户</label>
                <div class="relative account-dropdown">
                  <!-- 显示区域 -->
                  <div @click="toggleAccountDropdown"
                    class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs cursor-pointer focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 min-h-[44px] flex items-center">
                    <div v-if="form.selected_accounts.length === 0" class="text-gray-400">请选择账户</div>
                    <div v-else class="flex flex-wrap gap-1">
                      <span v-for="accountId in form.selected_accounts" :key="accountId"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
                        <span class="px-1">{{ getAccountName(accountId) }}</span>
                        <button type="button" @click.stop="toggleAccount(accountId)"
                          class="inline-flex items-center justify-center w-3 h-3 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300">
                          X
                        </button>
                      </span>
                    </div>
                    <!-- 下拉箭头 -->
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showAccountDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- 下拉选项 -->
                  <div v-if="showAccountDropdown"
                    class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div v-if="accountList.length === 0" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      暂无账户选项
                    </div>
                    <div v-else>
                      <div v-for="account in accountList" :key="account.id"
                        @click="toggleAccount(account.id)"
                        class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                        <span>{{ account.name || account.username }}</span>
                        <div v-if="form.selected_accounts.includes(account.id)" class="text-blue-500">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">提示词</label>
                <select v-model="form.prompt"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                  <option value="">请选择提示词</option>
                  <option v-for="prompt in promptList" :key="prompt.id" :value="prompt.id">{{ prompt.name }}</option>
                </select>
              </div>

              <!-- Twitter回复ID：仅当 type=reply_comment 且 provider=twitter 时显示 -->
              <div v-if="form.type === 'reply_comment' && form.provider === 'twitter'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Twitter回复ID</label>
                <input v-model="form.twitter_reply_to_tweet_id" type="text" placeholder="请输入Twitter回复ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <!-- Facebook页面ID：仅当 type=post 且 provider=facebook 时显示 -->
              <div v-if="form.type === 'post' && form.provider === 'facebook'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Facebook页面ID</label>
                <input v-model="form.facebook_page_id" type="text" placeholder="请输入Facebook页面ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <!-- Facebook评论ID：仅当 type=reply_comment 且 provider=facebook 时显示 -->
              <div v-if="form.type === 'reply_comment' && form.provider === 'facebook'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Facebook评论ID</label>
                <input v-model="form.facebook_comment_id" type="text" placeholder="请输入Facebook评论ID"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeAdd" :disabled="isLoading">取消</Button>
                <Button type="submit" :disabled="isLoading">
                  <span v-if="isLoading" class="mr-2">处理中...</span>
                  {{ isEditMode ? '更新' : '保存' }}
                </Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- 删除确认气泡弹窗 -->
      <DeleteConfirmDialog
        :isOpen="showDeleteDialog"
        :title="'删除'"
        :description="'确定要删除吗？此操作不可撤销。'"
        :isLoading="deleteLoading"
        :triggerRect="triggerRect"
        @close="closeDeleteDialog"
        @confirm="confirmDelete"
      />
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
import { getAutoPlay, getAutoPlayDetail, createAutoPlay, updateAutoPlay, deleteAutoPlay } from '@/api/autoPlay.ts'
import { getUser } from '@/api/index.ts'
import { getTags } from '@/api/tag.ts'
import {getPromptsConfigs } from '@/api/prompts.ts'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'

const currentPageTitle = ref('任务列表')
const tasks = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 下拉列表数据
const userList = ref([])
const tagList = ref([])
const promptList = ref([])
const accountList = ref([])

// 多选下拉框状态
const showMentionDropdown = ref(false)
const showTagDropdown = ref(false)
const showAccountDropdown = ref(false)

// 弹窗相关状态
const showAdd = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isLoading = ref(false)

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })

// 表单数据
const form = ref({
  type: '',
  provider: '',
  language: '',
  text: '',
  mentions: [],
  tags: [],
  payload: '',
  selected_accounts: [],
  prompt: '',
  twitter_reply_to_tweet_id: '',
  facebook_page_id: '',
  facebook_comment_id: ''
})

// 编辑功能
async function onEdit(task) {
  try {
    // 获取详细信息
    const detailData = await getAutoPlayDetail(task.id)

    // 设置为编辑模式
    isEditMode.value = true
    editingId.value = task.id

    // 填充表单数据
    form.value = {
      type: detailData.type || '',
      provider: detailData.provider || '',
      language: detailData.language || '',
      text: detailData.text || '',
      mentions: Array.isArray(detailData.mentions) ? detailData.mentions : (detailData.mentions ? detailData.mentions.split(',') : []),
      tags: Array.isArray(detailData.tags) ? detailData.tags : (detailData.tags ? detailData.tags.split(',') : []),
      payload: detailData.payload || '',
      selected_accounts: Array.isArray(detailData.selected_accounts) ? detailData.selected_accounts : (detailData.selected_accounts ? detailData.selected_accounts.split(',') : []),
      prompt: detailData.prompt || '',
      twitter_reply_to_tweet_id: detailData.twitter_reply_to_tweet_id || '',
      facebook_page_id: detailData.facebook_page_id || '',
      facebook_comment_id: detailData.facebook_comment_id || ''
    }

    // 打开弹窗
    showAdd.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    toast.error('获取详情失败')
  }
}

// 删除功能
function onDelete(task, event) {
  itemToDelete.value = task

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
    await deleteAutoPlay(itemToDelete.value.id)
    toast.success('删除成功')
    await fetchlist()
    closeDeleteDialog()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除自动回复时发生错误'
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

// 新增功能
function openAdd() {
  // 重置为新增模式
  isEditMode.value = false
  editingId.value = null
  form.value = {
    type: '',
    provider: '',
    language: '',
    text: '',
    mentions: [],
    tags: [],
    payload: '',
    selected_accounts: [],
    prompt: '',
    twitter_reply_to_tweet_id: '',
    facebook_page_id: '',
    facebook_comment_id: ''
  }
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  isEditMode.value = false
  editingId.value = null
  form.value = {
    type: '',
    provider: '',
    language: '',
    text: '',
    mentions: [],
    tags: [],
    payload: '',
    selected_accounts: [],
    prompt: '',
    twitter_reply_to_tweet_id: '',
    facebook_page_id: '',
    facebook_comment_id: ''
  }
}

// 提交表单
async function submitAdd() {
  // 防止重复提交
  if (isLoading.value) return

  // 表单验证
  if (!form.value.type || form.value.type.trim() === '') {
    toast.error('请选择类型', {
      description: '类型不能为空'
    })
    return
  }

  if (!form.value.provider || form.value.provider.trim() === '') {
    toast.error('请选择平台', {
      description: '平台不能为空'
    })
    return
  }

  if (!form.value.language || form.value.language.trim() === '') {
    toast.error('请选择语言', {
      description: '语言不能为空'
    })
    return
  }

  if (!form.value.text || form.value.text.trim() === '') {
    toast.error('请填写文本内容', {
      description: '文本内容不能为空'
    })
    return
  }

  isLoading.value = true

  try {
    // 准备提交数据
    const submitData = {
      type: form.value.type,
      provider: form.value.provider,
      language: form.value.language,
      text: form.value.text.trim(),
      mentions: Array.isArray(form.value.mentions) ? form.value.mentions : [],
      tags: Array.isArray(form.value.tags) ? form.value.tags.join(',') : form.value.tags || '',
      payload: form.value.payload?.trim() || '',
      selected_accounts: Array.isArray(form.value.selected_accounts) ? form.value.selected_accounts : [],
      prompt: form.value.prompt || '',
      twitter_reply_to_tweet_id: form.value.twitter_reply_to_tweet_id?.trim() || '',
      facebook_page_id: form.value.facebook_page_id?.trim() || '',
      facebook_comment_id: form.value.facebook_comment_id?.trim() || ''
    }

    // 根据模式调用不同的接口
    if (isEditMode.value) {
      // 编辑模式：调用更新接口
      await updateAutoPlay(editingId.value, submitData)
      toast.success('自动回复更新成功')
    } else {
      // 新增模式：调用新增接口
      await createAutoPlay(submitData)
      toast.success('自动回复新增成功')
    }

    // 成功后关闭弹窗并刷新列表
    closeAdd()
    await fetchlist()

  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '新增失败:', error)
    toast.error(isEditMode.value ? '更新失败' : '新增失败', {
      description: error.response?.data?.message || error.message || (isEditMode.value ? '更新自动回复时发生错误' : '新增自动回复时发生错误')
    })
  } finally {
    isLoading.value = false
  }
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    const res = await getUser({ page: 1 })
    userList.value = res.results || res.data || []
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 获取标签列表
const fetchTagList = async () => {
  try {
    const res = await getTags({ page: 1 })
    tagList.value = res.results || res.data || []
  } catch (error) {
    console.error('获取标签列表失败:', error)
  }
}

// 获取提示词列表
const fetchPromptList = async () => {
  try {
    const res = await getPromptsConfigs({ page: 1 })
    promptList.value = res.results || res.data || []
  } catch (error) {
    console.error('获取提示词列表失败:', error)
  }
}

// 获取账户列表（使用同一个用户接口）
const fetchAccountList = async () => {
  try {
    const res = await getUser({ page: 1 })
    accountList.value = res.results || res.data || []
  } catch (error) {
    console.error('获取账户列表失败:', error)
  }
}

// 获取列表数据
const fetchlist = async () => {
  try {
    let res = await getAutoPlay({
      page: page.value,
      page_size: pageSize.value
    })

    tasks.value = res.results || res.data || []
    total.value = res.count || res.total || 0

  } catch (error) {
    console.error('获取列表失败:', error)
    toast.error('获取列表失败', {
      description: error.response?.data?.message || error.message || '获取自动回复列表时发生错误'
    })
  }
}

// 多选下拉框切换函数
function toggleMentionDropdown() {
  showMentionDropdown.value = !showMentionDropdown.value
}

function toggleTagDropdown() {
  showTagDropdown.value = !showTagDropdown.value
}

function toggleAccountDropdown() {
  showAccountDropdown.value = !showAccountDropdown.value
}

// 切换选择状态
function toggleMention(userId) {
  const index = form.value.mentions.indexOf(userId)
  if (index > -1) {
    form.value.mentions.splice(index, 1)
  } else {
    form.value.mentions.push(userId)
  }
}

function toggleTag(tagId) {
  const index = form.value.tags.indexOf(tagId)
  if (index > -1) {
    form.value.tags.splice(index, 1)
  } else {
    form.value.tags.push(tagId)
  }
}

function toggleAccount(accountId) {
  const index = form.value.selected_accounts.indexOf(accountId)
  if (index > -1) {
    form.value.selected_accounts.splice(index, 1)
  } else {
    form.value.selected_accounts.push(accountId)
  }
}

// 获取名称的辅助函数
function getUserName(userId) {
  const user = userList.value.find(u => u.id === userId)
  return user ? (user.name || user.username) : `用户${userId}`
}

function getTagName(tagId) {
  const tag = tagList.value.find(t => t.id === tagId)
  return tag ? tag.name : `标签${tagId}`
}

function getAccountName(accountId) {
  const account = accountList.value.find(a => a.id === accountId)
  return account ? (account.name || account.username) : `账户${accountId}`
}

// 监听分页变化
watch(page, (newPage) => {
  console.log('Page changed to:', newPage)
  fetchlist()
})

// 点击外部关闭下拉框
function handleClickOutside(event) {
  if (showMentionDropdown.value && !event.target.closest('.mention-dropdown')) {
    showMentionDropdown.value = false
  }
  if (showTagDropdown.value && !event.target.closest('.tag-dropdown')) {
    showTagDropdown.value = false
  }
  if (showAccountDropdown.value && !event.target.closest('.account-dropdown')) {
    showAccountDropdown.value = false
  }
}

onMounted(() => {
  fetchlist()
  fetchUserList()
  fetchTagList()
  fetchPromptList()
  fetchAccountList()

  // 监听点击事件
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style></style>
