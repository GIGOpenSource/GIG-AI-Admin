import { get, post, put, patch, del } from '@/lib/http'

export const getTags = (params:any) => get('/tasks/follow-targets/',{params})

export const getDetailsTags = (id: string) => get(`/tasks/follow-targets/${id}/`)

export const createTags = (data: any) => post('/tasks/follow-targets/', data)

export const updateTags = (id: string, data: any) => put(`/tasks/follow-targets/${id}/`, data)

export const deleteTags = (id: string) => del(`/tasks/follow-targets/${id}/`)
