import { get, post, put, patch, del } from '@/lib/http'

export const getKeywordsConfigs = (params:any) => get('/tasks/simple/', {params})

export const getKeywordsConfigsDetail = (id:string) => get(`/tasks/simple/${id}/`)

export const createKeywordsConfigs = (data:any) => post('/tasks/simple/', data)

export const updateKeywordsConfigs = (id:string, data:any) => put(`/tasks/simple/${id}/`, data)

export const deleteKeywordsConfigs = (id:string) => del(`/tasks/simple/${id}/`)


//立即执行
export const runNow = (id:string,data: any) => post(`/tasks/simple/${id}/run/`, data)

