import { get, post, put, patch, del } from '@/lib/http'

export const login = (data: { username: string, password: string, remember_me: boolean }) => post('/accounts/auth/login/', data, { skipAuth: true } as any)

// get user
export const getUser = (params: any) => get('/accounts/users/', {params})

// update user (password/status, etc.)
export const updateUser = (id: string, data: any) => patch(`/accounts/users/${id}/`, data)

// delete user
export const deleteUser = (id: string) => del(`/accounts/users/${id}/`)

// create user
export const createUser = (data: { username: string, password: string}) => post('/accounts/auth/register/', data)

// user detail
export const getUserDetail = (id: string) => get(`/accounts/users/${id}/`)

//数据统计
export const getdate = (data:{page:number}) => get('/stats/overview/', {params:data})

// 修改密码
export const changePassword = (data: { old_password: string, new_password: string }) => post('/accounts/auth/change-password/', data)

// 设置密码
export const resetPassword = ( data: any) => post(`/accounts/auth/admin/change-password/`, data)
