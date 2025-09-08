import { get, post, put, patch, del } from '@/lib/http'

// 定义接口类型
export interface PromptTemplateData {
  name: string // 模板名称
  template_type: string
  system_prompt: string
  user_prompt_template: string
  is_active: boolean
  user: string
  ai_config?: string
}

export interface PromptTemplateListParams {
  page: number
  search?: string
}

// 获取提示词模板列表
export const getlist = (data: PromptTemplateListParams) => get('/core/templates/', { params: data })

// 新增提示词模板
export const addlist = (data: PromptTemplateData) => post('/core/templates/', data)

// 获取提示词模板详情
export const detailslist = (id: string) => get(`/core/templates/${id}`)

// 更新提示词模板
export const updatelist = (id: string, data: PromptTemplateData) => put(`/core/templates/${id}/`, data)

// 删除提示词模板
export const deletelist = (id: string) => del(`/core/templates/${id}`)

