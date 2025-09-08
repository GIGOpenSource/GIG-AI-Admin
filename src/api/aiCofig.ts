import { get, post, put, patch, del } from '@/lib/http'

// 定义接口类型
export interface AIConfigData {
  name: string
  service_type: string
  api_base: string
  api_key: string
  model_name: string
  max_tokens: string
  temperature: string
  is_active: boolean
}

export interface AIConfigListParams {
  search: string
  page: number
}

// 获取AI配置列表
export const getlist = (data: AIConfigListParams) => get('/core/ai/configs', { params: data })

// 新增AI配置
export const addlist = (data: AIConfigData) => post('/core/ai/configs/', data)

// 获取AI配置详情
export const details = (id: string) => get(`/core/ai/configs/${id}`)

// 更新AI配置
export const updatelist = (id: string, data: AIConfigData) => put(`/core/ai/configs/${id}/`, data)

//删除配置
export const deletelist = (id: string) => del(`/core/ai/configs/${id}`)

