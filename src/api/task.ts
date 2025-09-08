import { get, post, put, patch, del } from '@/lib/http'

export const getScheduledTasks = () => get('/tasks/scheduled/')

export const getScheduledTask = (id: string) => get(`/tasks/scheduled/${id}/`)

export const createScheduledTask = (data: any) => post('/tasks/scheduled/', data)

export const updateScheduledTask = (id: string, data: any) => put(`/tasks/scheduled/${id}/`, data)

export const deleteScheduledTask = (id: string) => del(`/tasks/scheduled/${id}/`)





