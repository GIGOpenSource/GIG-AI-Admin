import { get, post, put, patch, del } from '@/lib/http'

export const getPromptsConfigs = () => get('/prompts/configs/')

export const createPromptsConfig = (data: any) => post('/prompts/configs/', data)

export const updatePromptsConfig = (id: string, data: any) => put(`/prompts/configs/${id}/`, data)

export const deletePromptsConfig = (id: string) => del(`/prompts/configs/${id}/`)

export const getPromptsConfig = (id: string) => get(`/prompts/configs/${id}/`)
