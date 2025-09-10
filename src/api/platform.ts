import { get, post, put, patch, del } from '@/lib/http'

//获取账号
export const getAccount = (params:any) => get('/social/accounts/',{params})

//获取平台
export const getConfigs = (params:any) => get('/social/configs/',{params})


export const createPlatform = (data:any) => post('/social/configs/', data)

export const createAccount = (data:any) => post('/social/accounts/', data)
