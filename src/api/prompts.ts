import { get, post, put, patch, del } from '@/lib/http'

export const getPromptsConfigs = (data:any) => get('/prompts/configs/',{params:data})

export const createPromptsConfig = (data: any) => post('/prompts/configs/admin_create/', data)

export const updatePromptsConfig = (id: string, data: any) => put(`/prompts/configs/${id}/`, data)

export const deletePromptsConfig = (id: string) => del(`/prompts/configs/${id}/`)

export const getPromptsConfig = (id: string) => get(`/prompts/configs/${id}/`)
