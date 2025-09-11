import { get, post, put, patch, del } from '@/lib/http'

export const getTags = (params:any) => get('/tasks/tags/',{params})

export const getDetailsTags = (id: string) => get(`/tasks/tags/${id}/`)

export const createTags = (data: any) => post('/tasks/tags/', data)

export const updateTags = (id: string, data: any) => put(`/tasks/tags/${id}/`, data)

export const deleteTags = (id: string) => del(`/tasks/tags/${id}/`)
