import { get, post, put, patch, del } from '@/lib/http'

export const getPool = (data:any) => get('/social/pool-accounts/',{params:data})

export const createPool = (data: any) => post('/social/pool-accounts/', data)

export const updatePool = (id: string, data: any) => put(`/social/pool-accounts/${id}/`, data)

export const deletePool = (id: string) => del(`/social/pool-accounts/${id}/`)

export const getPooldetails = (id: string) => get(`/social/pool-accounts/${id}/`)

// 获取账号分配数据
export const getAllocation = (data: any) => get('/social/oauth/pool/allocation', { params: data })

// 转移账号
export const transferAccounts = (data: any) => post('/social/oauth/pool/allocation', data)
