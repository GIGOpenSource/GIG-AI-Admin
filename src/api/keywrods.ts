import { get, post, put, patch, del } from '@/lib/http'

export const getKeywordsConfigs = (params:any) => get('/keywords/configs/', params)

export const getKeywordsConfigsDetail = (id:string) => get(`/keywords/configs/${id}/`)

export const createKeywordsConfigs = (data:any) => post('/keywords/configs/', data)

export const updateKeywordsConfigs = (id:string, data:any) => put(`/keywords/configs/${id}/`, data)

export const deleteKeywordsConfigs = (id:string) => del(`/keywords/configs/${id}/`)
