import { get, post, put, patch, del } from '@/lib/http'

export const getAutoPlay = (params:any) => get('/tasks/simple/', {params})

export const getAutoPlayDetail = (id:string) => get(`/tasks/simple/${id}/`)

export const createAutoPlay = (data:any) => post('/tasks/simple/', data)

export const updateAutoPlay = (id:string, data:any) => put(`/tasks/simple/${id}/`, data)

export const deleteAutoPlay = (id:string) => del(`/tasks/simple/${id}/`)


//立即执行
export const runNow = (id:string,data: any) => post(`/tasks/simple/${id}/run/`, data)

//暂停或继续
export const editNow = (id:string,data: any) => post(`/tasks/simple/${id}/schedule/`, data)



