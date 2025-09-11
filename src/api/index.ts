import { get, post, put, patch, del } from '@/lib/http'

export const login = (data: { username: string, password: string, remember_me: boolean }) => post('/api/auth/login', data, { skipAuth: true } as any)

// get user
export const getUser = (params: any) => get('/api/accounts/users/', {params})

// update user (password/status, etc.)
export const updateUser = (id: string, data: any) => patch(`/api/accounts/users/${id}/`, data)

// delete user
export const deleteUser = (id: string) => del(`/api/accounts/users/${id}/`)

// create user
export const createUser = (data: { username: string, password: string}) => post('/api/accounts/auth/register/', data)

// user detail
export const getUserDetail = (id: string) => get(`/api/accounts/users/${id}/`)

//数据统计
export const getdate = (data:{page:number}) => get('/api/stats/overview/', {params:data})

// 修改密码
export const changePassword = (data: { old_password: string, new_password: string }) => post('/api/accounts/auth/change-password/', data)
