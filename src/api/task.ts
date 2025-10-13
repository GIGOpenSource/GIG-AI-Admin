import { get, post, put, patch, del } from '@/lib/http'

export const getScheduledTasks = (params:any) => get('/tasks/scheduled/',{params})

export const getScheduledTask = (id: string) => get(`/tasks/scheduled/${id}/`)

export const createScheduledTask = (data: any) => post('/tasks/scheduled/', data)

export const updateScheduledTask = (id: string, data: any) => put(`/tasks/scheduled/${id}/`, data)

export const deleteScheduledTask = (id: string) => del(`/tasks/scheduled/${id}/`)

// 任务日志相关接口
export const getTaskLogs = (params: any) => get('/tasks/logs/', { params })

export const getTaskLogDetail = (id: string) => get(`/tasks/logs/${id}/`)

export const deleteTaskLog = (id: string) => del(`/tasks/logs/${id}/`)





