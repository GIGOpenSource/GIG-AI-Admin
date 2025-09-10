import { get, post, put, patch, del } from '@/lib/http'

//获取账号
export const getAccount = (params:any) => get('/social/accounts/',{params})

//获取平台
export const getConfigs = (params:any) => get('/social/configs/',{params})


export const createPlatform = (data:any) => post('/social/configs/', data)

export const createAccount = (data:any) => post('/social/accounts/', data)

export const updateAccount = (id:string, data:any) => put(`/social/accounts/${id}/`, data)

export const deleteAccount = (id:string) => del(`/social/accounts/${id}/`)

export const getAccountById = (id:string) => get(`/social/accounts/${id}/`)

export const getConfigById = (id:string) => get(`/social/configs/${id}/`)

export const updateConfig = (id:string, data:any) => put(`/social/configs/${id}/`, data)

export const deleteConfig = (id:string) => del(`/social/configs/${id}/`)
