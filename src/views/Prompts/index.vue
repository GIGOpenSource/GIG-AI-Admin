<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <input
                v-model="remarkQuery"
                type="text"
                placeholder="请输入备注关键字"
                class="w-60 h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                @keyup.enter="handleRemarkSearchClick"
              />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <select
              v-model="statusFilter"
              @change="handleFilterChange"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              <option value="">请选择账号状态</option>
              <option value="normal">正常</option>
              <option value="banned">已封禁</option>
            </select>
            <select
              v-model="companyFilter"
              @change="handleFilterChange"
              class="w-48 h-10 px-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              <option value="">请选择企业</option>
              <option
                v-for="enterprise in enterpriseList"
                :key="enterprise.id || enterprise.username"
                :value="enterprise.id"
              >
                {{ enterprise.username || enterprise.name || enterprise.company }}
              </option>
            </select>
            <Button size="sm" @click="handleRemarkSearchClick" :disabled="isRemarkSearching">
              <span v-if="isRemarkSearching" class="mr-2">搜索中...</span>
              <svg
                v-else
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              搜索
            </Button>
            <Button size="sm" variant="outline" @click="clearSearch"> 重置 </Button>
            <button
              @click="openBatchManagement"
              class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-2.5 text-sm bg-green-50 text-green-600 border border-green-300 hover:bg-green-100 hover:border-green-400 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-500/20 h-10 min-h-[2.5rem]"
            >
              批量管理
            </button>
          </div>
          <div class="flex gap-2" v-if="isAdmin">
            <Button size="sm" @click="openImport">导入</Button>
            <Button size="sm" @click="openAdd">新增</Button>
          </div>
        </div>
        <div class="overflow-x-auto relative">
          <Table class="[&_td]:py-3.5 [&_th]:py-3.5 min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead class="whitespace-nowrap">序号</TableHead>
                <TableHead class="whitespace-nowrap">平台</TableHead>
                <TableHead class="whitespace-nowrap w-[120px]">名称</TableHead>
                <TableHead class="whitespace-nowrap w-[150px]">API Key</TableHead>
                <TableHead class="whitespace-nowrap w-[150px]">所属企业</TableHead>
                <TableHead class="whitespace-nowrap w-[150px]">API Secret</TableHead>
                <TableHead class="whitespace-nowrap w-[150px]">Access Token</TableHead>
                <TableHead class="whitespace-nowrap w-[150px]">Access Token Secret</TableHead>
                <TableHead class="whitespace-nowrap min-w-[100px]">是否封禁</TableHead>
                <TableHead class="whitespace-nowrap">状态</TableHead>
                <TableHead class="whitespace-nowrap">限制次数</TableHead>
                <TableHead class="whitespace-nowrap">备注</TableHead>
                <TableHead class="whitespace-nowrap">创建时间</TableHead>
                <TableHead
                  class="whitespace-nowrap text-right sticky right-0 bg-white dark:bg-gray-900 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_8px_-2px_rgba(255,255,255,0.1)] z-10"
                >
                  操作</TableHead
                >
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="accounts.length">
                <TableRow v-for="(acc, index) in accounts" :key="acc.id">
                  <TableCell class="whitespace-nowrap">{{ index + 1 }}</TableCell>
                  <TableCell class="whitespace-nowrap">{{
                    formdata[acc.provider] || acc.provider
                  }}</TableCell>
                  <TableCell class="whitespace-nowrap w-[120px]">
                    <div class="max-w-[100px] truncate" :title="acc.name">
                      {{ acc.name || '-' }}
                    </div>
                  </TableCell>
                  <TableCell class="w-[150px]">
                    <div class="max-w-[130px] truncate" :title="acc.api_key">
                      {{ acc.api_key || '-' }}
                    </div>
                  </TableCell>
                  <TableCell class="w-[150px]">
                    <div class="max-w-[130px] truncate" :title="acc.company">
                      {{ currentUserRole }}
                    </div>
                  </TableCell>
                  <TableCell class="w-[150px]">
                    <div class="max-w-[130px] truncate" :title="acc.api_secret">
                      {{ acc.api_secret || '-' }}
                    </div>
                  </TableCell>
                  <TableCell class="w-[150px]">
                    <div class="max-w-[130px] truncate" :title="acc.access_token">
                      {{ acc.access_token || '-' }}
                    </div>
                  </TableCell>
                  <TableCell class="w-[150px]">
                    <div class="max-w-[130px] truncate" :title="acc.access_token_secret">
                      {{ acc.access_token_secret || '-' }}
                    </div>
                  </TableCell>
                  <TableCell class="whitespace-nowrap min-w-[100px]">
                    <span
                      :class="[
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                        acc.is_ban
                          ? 'bg-rose-50 text-rose-600 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30'
                          : 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
                      ]"
                    >
                      {{ acc.is_ban ? '已封禁' : '正常' }}
                    </span>
                  </TableCell>
                  <TableCell class="whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                        acc.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30'
                          : 'bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/30',
                      ]"
                    >
                      {{ acc.status === 'active' ? '激活' : '未激活' }}
                    </span>
                  </TableCell>
                  <TableCell class="whitespace-nowrap"
                    >{{ acc.usage_policy == 'unlimited' ? '不限次' : '每天最多 2 次' }}
                  </TableCell>
                  <TableCell class="whitespace-nowrap">
                    <div class="max-w-[200px] truncate" :title="acc.remark">
                      {{ acc.remark || '-' }}
                    </div>
                  </TableCell>
                  <TableCell class="whitespace-nowrap">{{ formatTime(acc.created_at) }}</TableCell>
                  <TableCell
                    class="text-right whitespace-nowrap sticky right-0 bg-white dark:bg-gray-900 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_8px_-2px_rgba(255,255,255,0.1)] z-10"
                  >
                    <div class="flex items-center justify-end gap-2" v-if="isAdmin">
                      <Button size="sm" variant="outline" @click="onEdit(acc)">编辑</Button>
                      <button
                        class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 text-rose-600 ring-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:ring-rose-500/30"
                        @click="onDelete(acc, $event)"
                      >
                        删除
                      </button>
                    </div>
                    <div v-else class="text-gray-400 text-sm">无权限</div>
                  </TableCell>
                </TableRow>
              </template>

              <template v-else>
                <TableRow>
                  <TableCell
                    :colspan="14"
                    class="py-16 text-center text-gray-400 dark:text-white/40"
                    >暂无数据</TableCell
                  >
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>
        <div class="mt-4" v-if="total > 0">
          <Pagination
            v-model:page="page"
            :total="total"
            :items-per-page="pageSize"
            :sibling-count="1"
            show-edges
          >
            <PaginationContent v-slot="{ items }">
              <!-- <PaginationFirst>首页</PaginationFirst> -->
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === page"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext />
              <!-- <PaginationLast>末页</PaginationLast> -->
            </PaginationContent>
          </Pagination>
        </div>
      </ComponentCard>
      <Modal v-if="showAdd" :fullScreenBackdrop="true" @close="closeAdd">
        <template #body>
          <div
            class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 mt-8"
          >
            <div style="height: 5vh"></div>
            <h3 class="mb-4 text-lg font-semibold">
              {{ isEditMode ? '编辑账号池' : '新增账号池' }}
            </h3>
            <form @submit.prevent="submitAdd" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >平台<span class="text-error-500">*</span></label
                >
                <select
                  v-model="form.provider"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="">请选择平台</option>
                  <option :value="item.value" v-for="(item, index) in type" :key="index">
                    {{ item.title }}
                  </option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >名称<span class="text-error-500">*</span></label
                >
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="请输入账号名称"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >API Key<span class="text-error-500">*</span></label
                >
                <input
                  v-model="form.api_key"
                  type="text"
                  placeholder="请输入API Key"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >API Secret</label
                >
                <input
                  v-model="form.api_secret"
                  type="text"
                  placeholder="请输入API Secret"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >Access Token</label
                >
                <input
                  v-model="form.access_token"
                  type="text"
                  placeholder="请输入Access Token"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >Access Token Secret</label
                >
                <input
                  v-model="form.access_token_secret"
                  type="text"
                  placeholder="请输入Access Token Secret"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >是否封禁<span class="text-error-500">*</span></label
                >
                <select
                  v-model="form.is_ban"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option :value="false">正常</option>
                  <option :value="true">已封禁</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >状态<span class="text-error-500">*</span></label
                >
                <select
                  v-model="form.status"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="inactive">未激活</option>
                  <option value="active">激活</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >限制次数<span class="text-error-500">*</span></label
                >
                <select
                  v-model="form.usage_policy"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="unlimited">不限次</option>
                  <option value="limited">每天最多2次</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >备注</label
                >
                <textarea
                  v-model="form.remark"
                  placeholder="请输入备注信息（可选）"
                  rows="3"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 resize-none"
                ></textarea>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" @click="closeAdd" :disabled="isLoading"
                  >取消</Button
                >
                <Button type="submit" :disabled="isLoading">
                  <span v-if="isLoading" class="mr-2">处理中...</span>
                  {{ isEditMode ? '更新' : '保存' }}
                </Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- 导入Excel弹窗 -->
      <Modal v-if="showImport" :fullScreenBackdrop="true" @close="closeImport">
        <template #body>
          <div
            class="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 mt-8"
          >
            <h3 class="mb-4 text-lg font-semibold">导入账号池</h3>
            <div class="space-y-4">
              <!-- 文件上传区域 -->
              <div
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept=".xlsx,.xls"
                  @change="handleFileSelect"
                  class="hidden"
                />
                <div v-if="!selectedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span class="font-medium text-blue-600 hover:text-blue-500">点击选择文件</span>
                    或拖拽文件到此区域
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">支持 .xlsx, .xls 格式</p>
                </div>
                <div
                  v-else
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div class="flex items-center">
                    <svg class="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ selectedFile.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatFileSize(selectedFile.size) }}
                      </p>
                    </div>
                  </div>
                  <button @click="clearFile" class="text-red-500 hover:text-red-700">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 导入说明 -->
              <div
                class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
              >
                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">导入说明</h4>
                <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Excel文件必须包含以下列：平台、名称、API Key、是否封禁、状态、限制次数</li>
                  <li>• 可选列：API Secret、Access Token、Access Token Secret、备注</li>
                  <li>• 平台：twitter、facebook</li>
                  <li>• 状态：激活、未激活</li>
                  <li>• 限制次数：不限次、每天最多两次</li>
                  <li>• 是否封禁：正常、已封禁</li>
                  <li>• 备注：可选，用于记录额外信息</li>
                </ul>
              </div>

              <!-- 预览数据 -->
              <div
                v-if="previewData.length > 0"
                class="border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div
                  class="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700"
                >
                  <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    预览数据 ({{ previewData.length }} 条)
                  </h4>
                </div>
                <div class="max-h-48 overflow-y-auto">
                  <table class="w-full text-xs">
                    <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0">
                      <tr>
                        <th class="px-2 py-1 text-left">平台</th>
                        <th class="px-2 py-1 text-left">名称</th>
                        <th class="px-2 py-1 text-left">API Key</th>
                        <th class="px-2 py-1 text-left">状态</th>
                        <th class="px-2 py-1 text-left">备注</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr
                        v-for="(item, index) in previewData.slice(0, 5)"
                        :key="index"
                        class="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td class="px-2 py-1">{{ item.provider }}</td>
                        <td class="px-2 py-1">{{ item.name }}</td>
                        <td class="px-2 py-1 truncate max-w-[100px]">{{ item.api_key }}</td>
                        <td class="px-2 py-1">{{ item.status }}</td>
                        <td class="px-2 py-1 truncate max-w-[80px]">{{ item.remark || '-' }}</td>
                      </tr>
                      <tr v-if="previewData.length > 5">
                        <td colspan="5" class="px-2 py-1 text-center text-gray-500">
                          ... 还有 {{ previewData.length - 5 }} 条数据
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex justify-end gap-3 pt-4">
                <Button variant="outline" @click="closeImport" :disabled="isImporting">取消</Button>
                <Button @click="handleImport" :disabled="!selectedFile || isImporting">
                  <span v-if="isImporting" class="mr-2">导入中...</span>
                  <svg
                    v-else
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    ></path>
                  </svg>
                  确认导入
                </Button>
              </div>
            </div>
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

      <!-- 批量管理弹窗 -->
      <BatchManagementDialog
        :isOpen="showBatchManagement"
        :enterpriseList="enterpriseList"
        @close="closeBatchManagement"
        @showError="showTransferErrorDialog"
      />

      <!-- 转移错误弹窗 -->
      <TransferErrorDialog :isOpen="showTransferError" @close="closeTransferError" />
    </div>
  </AdminLayout>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import BatchManagementDialog from './components/BatchManagementDialog.vue'
import TransferErrorDialog from './components/TransferErrorDialog.vue'
import { getPool, createPool, getPooldetails, updatePool, deletePool } from '@/api/pool.ts'
import { getUser } from '@/api/index.ts'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { formatTime } from '@/lib/utils'
const currentPageTitle = ref('账号池')
const accounts = ref([])
const page = ref(1)
const pageSize = ref(20) // 默认一页20条
const total = ref(0)
const statusFilter = ref('')
const companyFilter = ref('')
const remarkQuery = ref('')
const isRemarkSearching = ref(false)
const type = ref([
  {
    title: 'Twitter',
    value: 'twitter',
  },
  {
    title: 'Facebook',
    value: 'facebook',
  },
])
const formdata = {
  facebook: 'Facebook',
  twitter: 'Twitter',
}

// 权限检查 - 只有role为admin的用户才能看到导入和新增按钮
const isAdmin = computed(() => {
  // 从localStorage获取用户信息
  const userInfo = localStorage.getItem('role')
  console.log('userInfo', userInfo)
  if (userInfo) {
    try {
      return userInfo === 'admin'
    } catch (e) {
      console.error('解析用户信息失败:', e)
      return false
    }
  }
  return false
})

// 获取当前用户角色
const currentUserRole = computed(() => {
  // 安全地获取 localStorage 中的 role 值
  if (typeof window !== 'undefined' && window.localStorage) {
    const profile = JSON.parse(window.localStorage.getItem('profile') || '{}')
    return profile.username || '-'
  }
  return '-'
})

// 企业列表
const enterpriseList = ref([])
const isLoadingEnterprises = ref(false)

// 获取企业列表
const fetchEnterpriseList = async () => {
  try {
    isLoadingEnterprises.value = true
    const response = await getUser({ page: 1 })
    // 假设API返回的用户数据中包含企业信息
    // 根据实际API响应结构调整
    enterpriseList.value = response.results || response.data || []
  } catch (error) {
    console.error('获取企业列表失败:', error)
    toast.error('获取企业列表失败', {
      description: error.response?.data?.message || error.message || '获取企业列表时发生错误',
    })
  } finally {
    isLoadingEnterprises.value = false
  }
}

async function onEdit(account) {
  try {
    // 获取详细信息
    const detailData = await getPooldetails(account.id)

    // pe
    isEditMode.value = true
    editingId.value = account.id

    // 填充表单数据
    form.value = {
      provider: detailData.provider || '',
      name: detailData.name || '',
      api_key: detailData.api_key || '',
      api_secret: detailData.api_secret || '',
      access_token: detailData.access_token || '',
      access_token_secret: detailData.access_token_secret || '',
      is_ban: detailData.is_ban || false,
      status: detailData.status || 'inactive',
      usage_policy: detailData.usage_policy || 'unlimited',
      remark: detailData.remark || '',
    }

    // 打开弹窗
    showAdd.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    toast.error('获取详情失败')
  }
}

function onDelete(account, event) {
  itemToDelete.value = account

  // 获取触发按钮的位置信息
  const buttonRect = event.target.getBoundingClientRect()
  triggerRect.value = {
    top: buttonRect.top,
    left: buttonRect.left,
    width: buttonRect.width,
    height: buttonRect.height,
    bottom: buttonRect.bottom,
  }

  showDeleteDialog.value = true
}

// 确认删除
async function confirmDelete() {
  if (!itemToDelete.value) return

  deleteLoading.value = true

  try {
    await deletePool(itemToDelete.value.id)
    toast.success('删除成功')
    await fetchlist()
    closeDeleteDialog()
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败', {
      description: error.response?.data?.message || error.message || '删除账号池时发生错误',
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

const showAdd = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isLoading = ref(false)

// 导入相关状态
const showImport = ref(false)
const selectedFile = ref(null)
const previewData = ref([])
const isImporting = ref(false)

// 删除确认弹窗相关状态
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref(null)
const triggerRect = ref({ top: 0, left: 0, width: 0, height: 0 })

// 批量管理弹窗相关状态
const showBatchManagement = ref(false)
const showTransferError = ref(false)
const form = ref({
  provider: '',
  name: '',
  api_key: '',
  api_secret: '',
  access_token: '',
  access_token_secret: '',
  is_ban: false,
  status: 'inactive',
  usage_policy: 'unlimited',
  remark: '',
})

function openAdd() {
  // 重置为新增模式
  isEditMode.value = false
  editingId.value = null
  form.value = {
    provider: '',
    name: '',
    api_key: '',
    api_secret: '',
    access_token: '',
    access_token_secret: '',
    is_ban: false,
    status: 'inactive',
    usage_policy: 'unlimited',
    remark: '',
  }
  showAdd.value = true
}

function closeAdd() {
  showAdd.value = false
  isEditMode.value = false
  editingId.value = null
  form.value = {
    provider: '',
    name: '',
    api_key: '',
    api_secret: '',
    access_token: '',
    access_token_secret: '',
    is_ban: false,
    status: 'inactive',
    usage_policy: 'unlimited',
    remark: '',
  }
}

async function submitAdd() {
  // 防止重复提交
  if (isLoading.value) return

  // 表单验证 - 逐个检查并提示具体字段
  if (!form.value.provider || form.value.provider === '') {
    toast.error('请选择平台', {
      description: '平台不能为空',
    })
    return
  }

  if (!form.value.name || form.value.name.trim() === '') {
    toast.error('请填写名称', {
      description: '名称不能为空',
    })
    return
  }

  if (!form.value.api_key || form.value.api_key.trim() === '') {
    toast.error('请填写API Key', {
      description: 'API Key不能为空',
    })
    return
  }

  // if (!form.value.api_secret || form.value.api_secret.trim() === '') {
  //   toast.error('请填写API Secret', {
  //     description: 'API Secret不能为空'
  //   })
  //   return
  // }

  // if (!form.value.access_token || form.value.access_token.trim() === '') {
  //   toast.error('请填写Access Token', {
  //     description: 'Access Token不能为空'
  //   })
  //   return
  // }

  // if (!form.value.access_token_secret || form.value.access_token_secret.trim() === '') {
  //   toast.error('请填写Access Token Secret', {
  //     description: 'Access Token Secret不能为空'
  //   })
  //   return
  // }

  if (form.value.is_ban === null || form.value.is_ban === undefined) {
    toast.error('请选择是否封禁', {
      description: '是否封禁不能为空',
    })
    return
  }

  if (!form.value.status || form.value.status === '') {
    toast.error('请选择状态', {
      description: '状态不能为空',
    })
    return
  }

  if (!form.value.usage_policy || form.value.usage_policy === '') {
    toast.error('请选择限制次数', {
      description: '限制次数不能为空',
    })
    return
  }

  isLoading.value = true

  try {
    // 准备提交数据
    const submitData = {
      provider: form.value.provider,
      name: form.value.name.trim(),
      api_key: form.value.api_key.trim(),
      api_secret: form.value.api_secret.trim() || '',
      access_token: form.value.access_token.trim() || '',
      access_token_secret: form.value.access_token_secret.trim() || '',
      is_ban: form.value.is_ban,
      status: form.value.status,
      usage_policy: form.value.usage_policy,
      remark: form.value.remark.trim() || '',
    }

    // 根据模式调用不同的接口
    if (isEditMode.value) {
      // 编辑模式：调用更新接口
      await updatePool(editingId.value, submitData)
      toast.success('账号池更新成功')
    } else {
      // 新增模式：调用新增接口
      await createPool(submitData)
      toast.success('账号池新增成功')
    }

    // 成功后关闭弹窗并刷新列表
    closeAdd()
    await fetchlist()
  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '新增失败:', error)
    toast.error(isEditMode.value ? '更新失败' : '新增失败', {
      description:
        error.response?.data?.message ||
        error.message ||
        (isEditMode.value ? '更新账号池时发生错误' : '新增账号池时发生错误'),
    })
  } finally {
    isLoading.value = false
  }
}

// 综合搜索按钮点击处理（备注 + 状态筛选）
const handleRemarkSearchClick = async () => {
  if (isRemarkSearching.value) return

  isRemarkSearching.value = true
  page.value = 1 // 搜索时重置到第一页
  try {
    await fetchlist()
  } finally {
    isRemarkSearching.value = false
  }
}

// 状态筛选处理（仅在下拉框改变时触发）
const handleFilterChange = () => {
  // 状态筛选改变时不自动搜索，等待用户点击搜索按钮
  // 这样用户可以先选择状态，再输入备注，最后一起搜索
}

// 清除筛选
const clearSearch = () => {
  statusFilter.value = ''
  companyFilter.value = ''
  remarkQuery.value = ''
  page.value = 1 // 重置到第一页
  fetchlist()
}

// 批量管理功能
const openBatchManagement = () => {
  showBatchManagement.value = true
}

// 关闭批量管理弹窗
const closeBatchManagement = () => {
  showBatchManagement.value = false
}

// 显示转移错误弹窗
const showTransferErrorDialog = () => {
  showTransferError.value = true
}

// 关闭转移错误弹窗
const closeTransferError = () => {
  showTransferError.value = false
}

const fetchlist = async () => {
  try {
    // 构建查询参数
    const params = {
      page: page.value,
    }

    // 添加状态筛选参数
    if (statusFilter.value) {
      if (statusFilter.value === 'normal') {
        params.status = 'active'
      } else if (statusFilter.value === 'banned') {
        params.status = 'banned'
      }
    }

    // 添加企业筛选参数
    if (companyFilter.value) {
      params.owner_id = companyFilter.value
    }

    // 添加备注搜索参数
    if (remarkQuery.value && remarkQuery.value.trim()) {
      params.remark = remarkQuery.value.trim()
    }

    const res = await getPool(params)

    accounts.value = res.results || res.data || []
    total.value = res.count || res.total || 0
  } catch (error) {
    console.error('获取列表失败:', error)
    toast.error('获取列表失败', {
      description: error.response?.data?.message || error.message || '获取账号池列表时发生错误',
    })
  }
}

// 监听分页变化
watch(page, (newPage) => {
  console.log('Page changed to:', newPage)
  fetchlist()
})

// 导入相关方法
function openImport() {
  showImport.value = true
  clearFile()
}

function closeImport() {
  showImport.value = false
  clearFile()
}

function clearFile() {
  selectedFile.value = null
  previewData.value = []
  if (document.querySelector('input[type="file"]')) {
    document.querySelector('input[type="file"]').value = ''
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  // 检查文件类型
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ]

  if (!allowedTypes.includes(file.type)) {
    toast.error('文件格式不支持', {
      description: '请选择 .xlsx 或 .xls 格式的Excel文件',
    })
    return
  }

  // 检查文件大小 (10MB限制)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('文件过大', {
      description: '文件大小不能超过10MB',
    })
    return
  }

  selectedFile.value = file
  parseExcelFile(file)
}

function parseExcelFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })

      // 获取第一个工作表
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // 转换为JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      if (jsonData.length < 2) {
        toast.error('Excel文件格式错误', {
          description: 'Excel文件至少需要包含表头和一行数据',
        })
        return
      }

      // 获取表头
      const headers = jsonData[0]
      const requiredHeaders = ['平台', '名称', 'API Key', '是否封禁', '状态', '限制次数']

      // 检查必需的列是否存在
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
      if (missingHeaders.length > 0) {
        toast.error('Excel文件格式错误', {
          description: `缺少必需的列: ${missingHeaders.join(', ')}`,
        })
        return
      }

      // 解析数据行
      const parsedData = []
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        if (row.length === 0) continue // 跳过空行

        // 获取原始值
        const isBanValue = row[headers.indexOf('是否封禁')] || ''
        const statusValue = row[headers.indexOf('状态')] || ''
        const usagePolicyValue = row[headers.indexOf('限制次数')] || ''

        // 转换是否封禁
        let isBan = false
        if (isBanValue === '已封禁' || isBanValue === 'true' || isBanValue === true) {
          isBan = true
        } else if (isBanValue === '正常' || isBanValue === 'false' || isBanValue === false) {
          isBan = false
        }

        // 转换状态
        let status = 'inactive'
        if (statusValue === '激活' || statusValue === 'active') {
          status = 'active'
        } else if (statusValue === '未激活' || statusValue === 'inactive') {
          status = 'inactive'
        }

        // 转换使用策略
        let usagePolicy = 'unlimited'
        if (usagePolicyValue === '不限次' || usagePolicyValue === 'unlimited') {
          usagePolicy = 'unlimited'
        } else if (
          usagePolicyValue === '每天最多两次' ||
          usagePolicyValue === '每天最多2次' ||
          usagePolicyValue === 'limited'
        ) {
          usagePolicy = 'limited'
        }

        const item = {
          provider: row[headers.indexOf('平台')] || '',
          name: row[headers.indexOf('名称')] || '',
          api_key: row[headers.indexOf('API Key')] || '',
          api_secret: row[headers.indexOf('API Secret')] || '',
          access_token: row[headers.indexOf('Access Token')] || '',
          access_token_secret: row[headers.indexOf('Access Token Secret')] || '',
          is_ban: isBan,
          status: status,
          usage_policy: usagePolicy,
          remark: row[headers.indexOf('备注')] || '',
        }

        // 验证必填字段
        if (!item.provider || !item.name || !item.api_key) {
          toast.error(`第${i + 1}行数据不完整`, {
            description: '平台、名称、API Key为必填字段',
          })
          return
        }

        // 验证平台值
        if (!['twitter', 'facebook'].includes(item.provider)) {
          toast.error(`第${i + 1}行平台值错误`, {
            description: '平台只支持: twitter, facebook',
          })
          return
        }

        // 验证状态值
        if (!['active', 'inactive'].includes(item.status)) {
          toast.error(`第${i + 1}行状态值错误`, {
            description: '状态只支持: 激活、未激活、active、inactive',
          })
          return
        }

        // 验证使用策略值
        if (!['unlimited', 'limited'].includes(item.usage_policy)) {
          toast.error(`第${i + 1}行限制次数值错误`, {
            description: '限制次数只支持: 不限次、每天最多两次、unlimited、limited',
          })
          return
        }

        parsedData.push(item)
      }

      if (parsedData.length === 0) {
        toast.error('Excel文件中没有有效数据')
        return
      }

      previewData.value = parsedData
      toast.success(`成功解析${parsedData.length}条数据`, {
        description: '请检查预览数据后确认导入',
      })
    } catch (error) {
      console.error('解析Excel文件失败:', error)
      toast.error('解析Excel文件失败', {
        description: error.message || '文件格式可能不正确',
      })
    }
  }

  reader.readAsArrayBuffer(file)
}

async function handleImport() {
  if (!selectedFile.value || previewData.value.length === 0) {
    toast.error('请先选择并解析Excel文件')
    return
  }

  isImporting.value = true

  try {
    let successCount = 0
    let errorCount = 0
    const errors = []

    // 批量导入数据
    for (const item of previewData.value) {
      try {
        await createPool(item)
        successCount++
      } catch (error) {
        errorCount++
        errors.push(`${item.name}: ${error.response?.data?.message || error.message}`)
      }
    }

    if (successCount > 0) {
      toast.success(`导入成功`, {
        description: `成功导入${successCount}条数据${errorCount > 0 ? `，失败${errorCount}条` : ''}`,
      })

      // 刷新列表
      await fetchlist()

      // 关闭弹窗
      closeImport()
    }

    if (errorCount > 0 && errors.length > 0) {
      console.error('导入错误详情:', errors)
      toast.error(`导入完成，但有${errorCount}条数据导入失败`, {
        description: errors.slice(0, 3).join('; ') + (errors.length > 3 ? '...' : ''),
      })
    }
  } catch (error) {
    console.error('导入失败:', error)
    toast.error('导入失败', {
      description: error.response?.data?.message || error.message || '导入时发生未知错误',
    })
  } finally {
    isImporting.value = false
  }
}

onMounted(() => {
  fetchlist()
  fetchEnterpriseList()
})
</script>

<style></style>
