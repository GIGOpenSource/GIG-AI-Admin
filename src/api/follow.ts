import { get, post, put, patch, del } from '@/lib/http'

export const getTags = (params:any) => get('/tasks/folloe-targets/',{params})

export const getDetailsTags = (id: string) => get(`/tasks/folloe-targets/${id}/`)

export const createTags = (data: any) => post('/tasks/folloe-targets/', data)

export const updateTags = (id: string, data: any) => put(`/tasks/folloe-targets/${id}/`, data)

export const deleteTags = (id: string) => del(`/tasks/folloe-targets/${id}/`)
