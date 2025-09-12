import { get, post, put, patch, del } from '@/lib/http'

export const getFollow = (params:any) => get('/tasks/follow-targets/',{params})

//获取账号下拉选择
export const getBoot = (params:any) => get('/ai/configs/picker/',{params})

//立即执行
export const runNow = (id:string,data: any) => post(`/tasks/scheduled/${id}/run_now/`, data)

//查看执行结果
export const lookResult = (id:string) => post(`/tasks/runs/?task_id=${id}`)

export const getDetailsFollow = (id: string) => get(`/tasks/follow-targets/${id}/`)

export const createFollow = (data: any) => post('/tasks/follow-targets/', data)

export const updateFollow = (id: string, data: any) => put(`/tasks/follow-targets/${id}/`, data)

export const deleteFollow = (id: string) => del(`/tasks/follow-targets/${id}/`)
