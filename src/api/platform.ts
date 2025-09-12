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

export const deletePlatform = (id: string) => del(`/social/configs/${id}/`)



export const getFacebookStart = () => get(`/social/oauth/facebook/start/`)

export const getInstagramStart = () => get(`/social/oauth/instagram/start/`)

export const getThreadsStart = () => get(`/social/oauth/threads/start/`)

export const getTwitterStart = () => get(`/social/oauth/twitter/start/`)



//立即执行
export const runNow = (id:string,data: any) => post(`/tasks/scheduled/${id}/run_now/`, data)

//查看执行结果
export const lookResult = (id:string) => post(`/tasks/runs/?task_id=${id}`)
