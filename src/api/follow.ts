import { get, post, put, patch, del } from '@/lib/http'

export const getFollow = (params:any) => get('/tasks/follow-targets/',{params})

//获取账号下拉选择
export const getBoot = (params:any) => get('/ai/configs/picker/',{params})

export const getDetailsFollow = (id: string) => get(`/tasks/follow-targets/${id}/`)

export const createFollow = (data: any) => post('/tasks/follow-targets/', data)

export const updateFollow = (id: string, data: any) => put(`/tasks/follow-targets/${id}/`, data)

export const deleteFollow = (id: string) => del(`/tasks/follow-targets/${id}/`)
