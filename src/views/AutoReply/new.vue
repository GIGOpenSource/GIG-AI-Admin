<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="flex justify-between items-center mb-4">
          <!-- <Button size="sm" class="!text-blue-600"
            style="border: 1px solid #2563eb; background-color: white !important;"
            onmouseover="this.style.backgroundColor='white'"
            onmouseout="this.style.backgroundColor='white'">切换企业数据</Button> -->
            <div></div>
          <div class="relative">
            <Button size="sm" class="!text-blue-600 flex items-center gap-2"
              style="border: 1px solid #2563eb; background-color: white !important;"
              onmouseover="this.style.backgroundColor='white'" onmouseout="this.style.backgroundColor='white'"
              @click="toggleTaskMenu">
              <img src="/src/assets/images/add.png" alt="">
              新建任务
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </Button>

            <!-- 下拉菜单 -->
            <div v-if="showTaskMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div class="py-1">
                <button @click="createInstantTask('once')" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  创建即时任务
                </button>
                <button @click="createScheduledTask('timing')" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke-width="2"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2v2M16 2v2"/>
                  </svg>
                  创建定时任务
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 任务列表类型选择 -->
        <div class="mb-4 flex items-center gap-1 border-b border-gray-200">
          <button class="px-4 py-2 text-sm font-medium transition-colors relative"
            :class="activeTaskType === 'once' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            @click="activeTaskType = 'once'">
            <div v-if="activeTaskType === 'once'"
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-600"></div>
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            即时任务列表
          </button>
          <button class="px-4 py-2 text-sm font-medium transition-colors relative"
            :class="activeTaskType === 'timing' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            @click="activeTaskType = 'timing'">
            <div v-if="activeTaskType === 'timing'"
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-600"></div>
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2v2M16 2v2" />
            </svg>
            定时任务列表
          </button>
        </div>

        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <select v-model="typeFilter" @change="handleFilterChange"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
              <option value="">请选择类型</option>
              <option value="post">发帖</option>
              <option value="reply_comment">回复评论</option>
            </select>

            <select v-model="providerFilter" @change="handleFilterChange"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
              <option value="">请选择平台</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
            </select>

            <select v-model="statusFilter" @change="handleFilterChange"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
              <option value="">请选择状态</option>
              <option value="active">待执行</option>
              <option value="inactive">执行中</option>
              <option value="inactive">已完成</option>
              <option value="inactive">已暂停</option>
              <option value="inactive">部分成功</option>
              <option value="inactive">部分失败</option>
            </select>

            <Button size="sm" @click="handleFilterChange" :disabled="isFiltering">
              <span v-if="isFiltering" class="mr-2">搜索中...</span>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              搜索
            </Button>
            <Button size="sm" variant="outline" @click="clearSearch">
              重置
            </Button>
          </div>

        </div>
        <Table class="[&_td]:py-3.5 [&_th]:py-3.5">
          <TableHeader>
            <TableRow>
              <TableHead class="whitespace-nowrap w-[60px]">序号</TableHead>
              <TableHead class="whitespace-nowrap w-[80px]">类型</TableHead>
              <TableHead class="whitespace-nowrap w-[80px]">平台</TableHead>
              <TableHead class="whitespace-nowrap w-[80px]">语言</TableHead>
              <TableHead class="whitespace-nowrap w-[120px]">文本内容</TableHead>
              <TableHead class="whitespace-nowrap w-[100px]">提及</TableHead>
              <TableHead class="whitespace-nowrap w-[100px]">话题</TableHead>
              <!-- <TableHead class="whitespace-nowrap">载荷</TableHead> -->
              <TableHead class="whitespace-nowrap w-[120px]">机器人</TableHead>
              <TableHead class="whitespace-nowrap w-[100px]">提示词</TableHead>
              <TableHead class="whitespace-nowrap w-[100px]">备注</TableHead>
              <!-- <TableHead class="whitespace-nowrap">Twitter回复ID</TableHead>
              <TableHead class="whitespace-nowrap">Facebook页面ID</TableHead>
              <TableHead class="whitespace-nowrap">Facebook评论ID</TableHead> -->
              <TableHead class="whitespace-nowrap w-[120px]">创建时间</TableHead>
              <TableHead class="whitespace-nowrap w-[120px]">发布时间</TableHead>
              <TableHead class="whitespace-nowrap w-[80px]">状态</TableHead>
              <TableHead class="whitespace-nowrap text-right sticky right-0 bg-white z-10 w-[160px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="tasks.length">
              <TableRow v-for="(task, index) in tasks" :key="task.id">
                <TableCell class="whitespace-nowrap w-[60px]">{{ index + 1 }}</TableCell>
                <TableCell class="whitespace-nowrap w-[80px]">{{ task.type == 'post' ? '发帖' : '回复评论' }}</TableCell>
                <TableCell class="whitespace-nowrap w-[80px]">{{ task.provider || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap w-[80px]">{{ langer[task.language] || '-' }}</TableCell>
                <TableCell class="w-[120px] max-w-[100px] truncate" :title="task.text">{{ task.text || '-' }}</TableCell>
                <TableCell class="w-[100px] max-w-[80px] truncate" :title="task.mentions">{{ task.mentions || '-' }}</TableCell>
                <TableCell class="w-[100px] max-w-[80px] truncate" :title="task.tags">{{task.tags.map(item => item).join(',') ||
                  '-'}}</TableCell>
                <!-- <TableCell class="max-w-[200px] truncate" :title="task.payload">{{ task.payload || '-' }}</TableCell> -->
                <TableCell class="w-[120px] max-w-[100px] truncate"
                  :title="task.selected_accounts.map(item => item.name).join(',')">{{task.selected_accounts.map(item =>
                    item.name).join(',') || '-'}}</TableCell>
                <TableCell class="w-[100px] max-w-[80px] truncate" :title="task.prompt">{{ task.prompt_name || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap w-[100px]">
                  <div class="max-w-[80px] truncate" :title="task.task_remark">{{ task.task_remark || '无' }}</div>
                </TableCell>
                <!-- <TableCell class="whitespace-nowrap">{{ task.twitter_reply_to_tweet_id || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.facebook_page_id || '-' }}</TableCell>
                <TableCell class="whitespace-nowrap">{{ task.facebook_comment_id || '-' }}</TableCell> -->
                <TableCell class="whitespace-nowrap w-[120px]">{{ formatTime(task.created_at) }}</TableCell>
                <TableCell class="whitespace-nowrap w-[120px]">{{ formatTime(task.created_at) }}</TableCell>
                <TableCell class="whitespace-nowrap w-[80px] text-blue-600">状态</TableCell>
                <TableCell class="text-right whitespace-nowrap sticky right-0 bg-white z-10 w-[160px]">
                  <div class="flex items-center justify-end gap-2">
                    <!-- <Button size="sm" variant="outline" @click="btn(task)">
                      执行任务
                    </Button> -->
                    <Button size="sm" variant="outline" @click="btn(task)">
                      暂停任务
                    </Button>
                    <Button size="sm" variant="outline" @click="onEdit(task)"
                      class="!text-blue-600 hover:!text-blue-700">编辑任务</Button>
                    <button
                      class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                      @click="onDelete(task, $event)">
                      删除任务
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
          <Pagination v-model:page="page" :total="total" :items-per-page="pageSize" :sibling-count="1" show-edges>
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
            <div style="height:24vh"></div>
            <h3 class="mb-4 text-lg font-semibold">{{ isEditMode ? '编辑任务' : '新增任务' }}</h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div class="grid grid-cols-3 gap-4">
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
                  <select v-model="form.provider" @change="handleProviderChange"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择平台</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
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
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">执行频率<span
                    class="text-error-500">*</span></label>
                <div class="grid grid-cols-2 gap-4">
                  <select v-model="form.frequency_type" @change="handleFrequencyTypeChange"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option value="">请选择频率类型</option>
                    <option value="hourly">每小时</option>
                    <option value="daily">每天</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                  </select>
                  <select v-model="form.frequency_value"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    :disabled="!form.frequency_type">
                    <option value="">请选择频率值</option>
                    <option v-for="option in frequencyValueOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">文本内容<span
                    class="text-error-500">*</span></label>
                <div class="relative">
                  <textarea
                    v-model="form.text"
                    placeholder="请输入文本内容，最多300字"
                    maxlength="300"
                    rows="4"
                    class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none"></textarea>
                  <div class="absolute bottom-2 right-2 text-xs text-gray-400">
                    {{ form.text?.length || 0 }}/300
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">提及账号<span
                    class="text-error-500">*</span></label>
                <input v-model="form.mentions" type="text" placeholder="多个提及账号使用逗号隔开 如：user1，user2"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">话题<span
                    class="text-error-500">*</span></label>
                <input v-model="form.tags" type="text" placeholder="多个话题使用逗号隔开 如：品牌牛奶，优质水管"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              </div>

              <!-- <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">载荷</label>
                <textarea v-model="form.payload" placeholder="请输入载荷数据（JSON格式）"
                  class="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none"></textarea>
              </div> -->

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">机器人<span
                    class="text-error-500">*</span></label>
                <RobotSelector
                  v-model="form.selected_accounts"
                  :fetchApi="fetchBotListPaginated"
                  labelKey="name"
                  valueKey="id"
                  @selectionChange="handleSelectionChange"
                  :key="`robot-selector-${isEditMode ? editingId : 'new'}-${robotSelectorKey}`" />
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

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">备注</label>
                <textarea v-model="form.task_remark" placeholder="请输入备注信息（可选）" rows="3"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none"></textarea>
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
      <DeleteConfirmDialog :isOpen="showDeleteDialog" :title="'删除'" :description="'确定要删除吗？此操作不可撤销。'"
        :isLoading="deleteLoading" :triggerRect="triggerRect" @close="closeDeleteDialog" @confirm="confirmDelete" />

      <!-- 执行任务时的透明蒙层 -->
      <div v-if="executeLoading" class="fixed inset-0 bg-transparent flex items-center justify-center z-50">
        <div class="flex flex-col items-center gap-3">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          <span class="text-blue-600 dark:text-blue-400 font-medium text-sm">任务正在执行，请稍后...</span>
        </div>
      </div>
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
import RobotSelector from '@/components/ui/RobotSelector.vue'
import { getAutoPlay, getAutoPlayDetail, createAutoPlay, updateAutoPlay, deleteAutoPlay, runNow } from '@/api/autoPlay.ts'
import { getUser } from '@/api/index.ts'
import { getTags } from '@/api/tag.ts'
import { getPromptsConfigs } from '@/api/prompts.ts'
import { getPool } from '@/api/pool.ts'
import { toast } from 'vue-sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'

const currentPageTitle = ref('任务列表')
const tasks = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const task_timing_type = ref('task_timing_type')
// 任务类型选择
const activeTaskType = ref('once')

// 新建任务下拉菜单
const showTaskMenu = ref(false)

// 筛选条件
const typeFilter = ref('')
const providerFilter = ref('')
const statusFilter = ref('')
const isFiltering = ref(false)
const langer = {
  zh: '中文',
  en: '英文',
  ja: '日文',
  ko: '韩文',
  es: '西班牙文',
  fr: '法文',
  de: '德文'
}
// 下拉列表数据
const promptList = ref([])
const botList = ref([])

// 已移除多选下拉框状态，改用分页穿梭框

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

// 立即执行loading状态
const executeLoading = ref(false)
const executingTaskId = ref(null)

// 表单数据
const form = ref({
  type: '',
  provider: '',
  language: '',
  text: '',
  mentions: '',
  tags: '',
  payload: '',
  selected_accounts: [],
  prompt: '',
  twitter_reply_to_tweet_id: '',
  facebook_page_id: '',
  facebook_comment_id: '',
  task_orig_id: '',
  task_remark: '',
  frequency_type: '',
  frequency_value: ''
})

const type = ref('once')

// 选择状态管理
const selectionStatus = ref({
  selected: false,
  selectStatus: false,
  selected_accounts: []
})

// RobotSelector 组件的 key，用于强制重新渲染
const robotSelectorKey = ref(0)

// 处理选择状态变化
const handleSelectionChange = (status) => {
  console.log('机器人选择状态变化:', status)
  selectionStatus.value = { ...status }

  // 注意：不要在这里修改 form.value.selected_accounts
  // 因为 v-model 会自动处理这个更新
  // 这里只保存状态信息，用于提交时的数据处理
}

// 处理平台变化
const handleProviderChange = () => {
  console.log('平台变化:', form.value.provider)

  // 清空已选择的机器人，因为不同平台的机器人不兼容
  form.value.selected_accounts = []
  selectionStatus.value = {
    selected: false,
    selectStatus: false,
    selected_accounts: []
  }

  // 强制重新渲染 RobotSelector 组件，让它重新获取对应平台的机器人数据
  // 通过改变 key 值来强制重新渲染
  robotSelectorKey.value = Date.now()
}

// 执行频率值选项
const frequencyValueOptions = ref([])

// 处理频率类型变化
const handleFrequencyTypeChange = () => {
  form.value.frequency_value = ''

  switch (form.value.frequency_type) {
    case 'hourly':
      frequencyValueOptions.value = Array.from({ length: 24 }, (_, i) => ({
        value: `${i}`,
        label: `${i}时`
      }))
      break
    case 'daily':
      frequencyValueOptions.value = Array.from({ length: 24 }, (_, i) => ({
        value: `${i}:00`,
        label: `${i}:00`
      }))
      break
    case 'weekly':
      frequencyValueOptions.value = [
        { value: '1', label: '星期一' },
        { value: '2', label: '星期二' },
        { value: '3', label: '星期三' },
        { value: '4', label: '星期四' },
        { value: '5', label: '星期五' },
        { value: '6', label: '星期六' },
        { value: '7', label: '星期日' }
      ]
      break
    case 'monthly':
      frequencyValueOptions.value = Array.from({ length: 31 }, (_, i) => ({
        value: `${i + 1}`,
        label: `${i + 1}号`
      }))
      break
    default:
      frequencyValueOptions.value = []
  }
}
// 立即执行任务 - 使用btn接口
async function btn(item) {
  // 防止重复执行
  if (executeLoading.value) return

  executeLoading.value = true
  executingTaskId.value = item.id

  try {
    const res = await runNow(String(item.id), {})
    toast.success('任务执行成功', {
      description: `任务已开始执行，成功${res.summary.ok}条，失败${res.summary.error}条`
    })
    fetchlist()
  } catch (error) {
    console.error('Failed to run task:', error)
    toast.error('执行失败', {
      description: error.response?.data?.message || error.message || '执行任务时发生错误'
    })
  } finally {
    executeLoading.value = false
    executingTaskId.value = null
  }
}
// 编辑功能
async function onEdit(task) {
  try {
    // 获取详细信息
    const detailData = await getAutoPlayDetail(task.id)

    // 设置为编辑模式
    isEditMode.value = true
    editingId.value = task.id

    // 处理从后端返回的数据格式
    // 处理 tags：如果是数组，转换为字符串；如果是字符串，直接使用
    let tagsValue = ''
    if (Array.isArray(detailData.tags)) {
      tagsValue = detailData.tags.join(',')
    } else {
      tagsValue = detailData.tags || ''
    }

    // 处理 selected_accounts：确保是数组格式，包含id和name
    let selectedAccountsValue = []
    console.log('=== 编辑时处理 selected_accounts ===')
    console.log('原始 selected_accounts 数据:', detailData.selected_accounts)
    console.log('数据类型:', typeof detailData.selected_accounts)
    console.log('是否为数组:', Array.isArray(detailData.selected_accounts))

    if (Array.isArray(detailData.selected_accounts)) {
      // 如果是数组格式，确保id是字符串格式
      selectedAccountsValue = detailData.selected_accounts.map(account => {
        const accountObj = {
          id: String(account.id || account),
          name: account.name || account.remark || String(account.id || account)
        }
        console.log('处理数组中的账户:', account, '->', accountObj)
        return accountObj
      })
    } else if (typeof detailData.selected_accounts === 'object' && detailData.selected_accounts !== null) {
      // 如果是对象格式，转换为数组
      selectedAccountsValue = Object.keys(detailData.selected_accounts).map(key => {
        const accountObj = {
          id: String(key),
          name: detailData.selected_accounts[key] || String(key)
        }
        console.log('处理对象中的账户:', key, '->', accountObj)
        return accountObj
      })
    } else if (typeof detailData.selected_accounts === 'string') {
      // 如果是字符串格式，分割后转换
      selectedAccountsValue = detailData.selected_accounts.split(',').map(id => {
        const accountObj = {
          id: String(id.trim()),
          name: String(id.trim())
        }
        console.log('处理字符串中的账户:', id, '->', accountObj)
        return accountObj
      })
    }

    console.log('处理后的 selectedAccountsValue:', selectedAccountsValue)

    // 填充表单数据
    form.value = {
      type: detailData.type || '',
      provider: detailData.provider || '',
      language: detailData.language || '',
      text: detailData.text || '',
      mentions: detailData.mentions || '',
      tags: tagsValue,
      payload: detailData.payload || '',
      selected_accounts: selectedAccountsValue,
      prompt: detailData.prompt || '',
      twitter_reply_to_tweet_id: detailData.twitter_reply_to_tweet_id || '',
      facebook_page_id: detailData.facebook_page_id || '',
      facebook_comment_id: detailData.facebook_comment_id || '',
      task_remark: detailData.task_remark || '',
      frequency_type: detailData.frequency_type || '',
      frequency_value: detailData.frequency_value || ''
    }

    // 重置选择状态，确保编辑模式下状态正确
    selectionStatus.value = {
      selected: false,
      selectStatus: false,
      selected_accounts: []
    }

    console.log('=== 编辑模式表单数据填充完成 ===')
    console.log('form.value.selected_accounts:', form.value.selected_accounts)
    console.log('selectionStatus.value:', selectionStatus.value)

    // 如果有频率类型，则加载对应的频率值选项
    if (detailData.frequency_type) {
      form.value.frequency_type = detailData.frequency_type
      handleFrequencyTypeChange()
      form.value.frequency_value = detailData.frequency_value || ''
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
    mentions: '',
    tags: '',
    payload: '',
    selected_accounts: [],
    prompt: '',
    twitter_reply_to_tweet_id: '',
    facebook_page_id: '',
    facebook_comment_id: '',
    task_remark: '',
    frequency_type: '',
    frequency_value: '',
    task_timing_type:task_timing_type.value
  }
  frequencyValueOptions.value = []
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
    mentions: '',
    tags: '',
    payload: '',
    selected_accounts: [],
    prompt: '',
    twitter_reply_to_tweet_id: '',
    facebook_page_id: '',
    facebook_comment_id: '',
    task_remark: '',
    frequency_type: '',
    frequency_value: ''
  }
  frequencyValueOptions.value = []
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

  // 检查是否选择了机器人（包括全选状态）
  const hasSelectedRobots = selectionStatus.value.selected === true ||
                           (selectionStatus.value.selectStatus === false && selectionStatus.value.selected_accounts.length > 0) ||
                           form.value.selected_accounts.length > 0

  if (!hasSelectedRobots) {
    toast.error('请选择机器人', {
      description: '机器人不能为空'
    })
    return
  }

  if (!form.value.frequency_type || form.value.frequency_type.trim() === '') {
    toast.error('请选择执行频率类型', {
      description: '执行频率类型不能为空'
    })
    return
  }

  if (!form.value.frequency_value || form.value.frequency_value.trim() === '') {
    toast.error('请选择执行频率值', {
      description: '执行频率值不能为空'
    })
    return
  }

  isLoading.value = true

  try {
    // 准备提交数据
    // 处理 tags 格式：将字符串转换为数组
    let tagsArray = []
    if (form.value.tags && form.value.tags.trim() !== '') {
      // 如果 tags 是字符串，按逗号分割转换为数组
      tagsArray = form.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    }

    // 处理 selected_accounts 格式：根据选择状态传递不同的数据格式
    let submitDataForAPI = {}

    if (selectionStatus.value.selected === true && selectionStatus.value.selected_accounts.length === 0) {
      // 全选模式
      submitDataForAPI = {
       select_status: true,
        selected_accounts: []
      }
    } else if (selectionStatus.value.selected === true && selectionStatus.value.selected_accounts.length > 0) {
      // 自定义选择模式
      submitDataForAPI = {
        select_status: true,
        selected_accounts: selectionStatus.value.selected_accounts.map(account => ({
          id: String(account.id),
          name: account.name || String(account.id)
        }))
      }
    } else if (selectionStatus.value.selectStatus === false) {
      // 反选模式
      submitDataForAPI = {
        select_status: false,
        selected_accounts: selectionStatus.value.selected_accounts.map(account => ({
          id: String(account.id),
          name: account.name || String(account.id)
        }))
      }
    } else {
      // 默认情况
      submitDataForAPI = {
        select_status: true,
        selected_accounts: []
      }
    }

    const submitData = {
      type: form.value.type,
      provider: form.value.provider,
      language: form.value.language,
      text: form.value.text.trim(),
      mentions: form.value.mentions || '',
      tags: tagsArray,
      payload: '',
      // 根据选择状态传递不同的数据格式
      ...submitDataForAPI,
      prompt: form.value.prompt || '',
      twitter_reply_to_tweet_id: '',
      facebook_page_id: '',
      facebook_comment_id: '',
      task_remark: form.value.task_remark.trim() || '',
      frequency_type: form.value.frequency_type,
      frequency_value: form.value.frequency_value
    }

    // 调试：打印提交数据
    console.log('=== 提交给 createAutoPlay 的数据 ===', submitData)

    // 根据模式调用不同的接口
    if (isEditMode.value) {
      // 编辑模式：调用更新接口
      await updateAutoPlay(editingId.value, submitData)
      toast.success('任务更新成功')
    } else {
      // 新增模式：调用新增接口
      await createAutoPlay(submitData)
      toast.success('任务新增成功')
    }

    // 成功后关闭弹窗并刷新列表
    closeAdd()
    await fetchlist()

  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '新增失败:', error)
    toast.error(isEditMode.value ? '更新失败' : '新增失败', {
      description: error.response?.data?.message || error.message || (isEditMode.value ? '更新任务时发生错误' : '新增任务时发生错误')
    })
  } finally {
    isLoading.value = false
  }
}

// 获取机器人列表
// 获取机器人列表（分页版本，用于穿梭框，与账号池分页逻辑保持一致）
const fetchBotListPaginated = async (params) => {
  console.log(111);

  try {
    const apiParams = {
      page: params.page,
      provider:form.value.provider || ''
    }
    if (params.search) {
      apiParams.remark = params.search // 使用remark字段进行搜索
    }

    const res = await getPool(apiParams)
    console.log('=== API返回原始数据 ===', res)

    // 完全在前端进行过滤，不依赖后端API参数
    let filteredResults = res.results || res.data || []
    console.log('=== 过滤前的数据 ===', filteredResults)

    // 排除已选中的项目（用于左侧列表）
    if (params.exclude_ids && params.exclude_ids.length > 0) {
      console.log('=== 排除ID列表 ===', params.exclude_ids)
      filteredResults = filteredResults.filter(item => {
        const shouldExclude = params.exclude_ids.includes(String(item.id))
        console.log(`项目 ${item.id} (${item.name}) 是否排除: ${shouldExclude}`)
        return !shouldExclude
      })
    }

    // 只包含已选中的项目（用于右侧列表）
    if (params.include_ids && params.include_ids.length > 0) {
      console.log('=== 包含ID列表 ===', params.include_ids)
      filteredResults = filteredResults.filter(item => {
        const shouldInclude = params.include_ids.includes(String(item.id))
        console.log(`项目 ${item.id} (${item.name}) 是否包含: ${shouldInclude}`)
        return shouldInclude
      })
    }

    console.log('=== 过滤后的数据 ===', filteredResults)

    return {
      results: filteredResults,
      count: res.count || res.total || 0,
      total: res.count || res.total || 0
    }
  } catch (error) {
    console.error('获取机器人列表失败:', error)
    return {
      results: [],
      count: 0,
      total: 0
    }
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

// 切换任务菜单
const toggleTaskMenu = () => {
  showTaskMenu.value = !showTaskMenu.value
}

// 创建即时任务
const createInstantTask = (type) => {
  showTaskMenu.value = false
  activeTaskType.value = 'instant'
   task_timing_type.value = type
  openAdd()
}

// 创建定时任务
const createScheduledTask = () => {
  showTaskMenu.value = false
  activeTaskType.value = 'scheduled'
  openAdd()
}

// 筛选处理函数
const handleFilterChange = async () => {
  isFiltering.value = true
  page.value = 1 // 重置到第一页
  try {
    await fetchlist()
  } finally {
    isFiltering.value = false
  }
}

// 清除搜索
const clearSearch = () => {
  typeFilter.value = ''
  providerFilter.value = ''
  statusFilter.value = ''
  page.value = 1
  fetchlist()
}

// 获取列表数据
const fetchlist = async () => {
  try {
    const params = {
      page: page.value,
      page_size: pageSize.value,
      task_timing_type:activeTaskType.value
    }

    // 添加筛选条件
    if (typeFilter.value) {
      params.type = typeFilter.value
    }
    if (providerFilter.value) {
      params.provider = providerFilter.value
    }
    if (statusFilter.value) {
      params.status = statusFilter.value
    }

    let res = await getAutoPlay(params)

    tasks.value = res.results || res.data || []
    total.value = res.count || res.total || 0

  } catch (error) {
    console.error('获取列表失败:', error)
    toast.error('获取列表失败', {
      description: error.response?.data?.message || error.message || '获取任务列表时发生错误'
    })
  }
}

// 已移除多选下拉框相关函数，改用分页穿梭框组件

// 监听分页变化
watch([page,activeTaskType],() => {
  fetchlist()
})

// 已移除点击外部关闭下拉框的逻辑

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (showTaskMenu.value && !event.target.closest('.relative')) {
    showTaskMenu.value = false
  }
}

onMounted(() => {
  fetchlist()
  fetchPromptList()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style></style>
