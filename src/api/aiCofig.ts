import { get, post, put, patch, del } from '@/lib/http'
import type { StringOrTemplateHeader } from '@tanstack/vue-table'

// 定义接口类型
export interface AIConfigData {
  name: string //配置名称
  provider: string //平台名称
  // api_base: string
  // api_key: string
  // model_name: string
  // max_tokens: string
  // temperature: string
  // is_active: boolean
  model:string,
  // enabled:boolean,
  // is_default:string,
   priority:number, //优先级
   api_key:string //key

}

export interface AIConfigListParams {
  search: string
  page: number
}

// 获取AI配置列表
export const getlist = (data: AIConfigListParams) => get('/ai/configs/', { params: data })

// 新增AI配置
export const addlist = (data: AIConfigData) => post('/ai/configs/', data)

// 获取AI配置详情
export const details = (id: string) => get(`/ai/configs/${id}`)

// 更新AI配置
export const updatelist = (id: string, data: AIConfigData) => put(`/ai/configs/${id}/`, data)

//删除配置
export const deletelist = (id: string) => del(`/ai/configs/${id}/`)

