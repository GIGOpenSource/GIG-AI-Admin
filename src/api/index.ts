import { get, post, put, patch, del } from '@/lib/http'

export const getAIAccounts = () => get('/stats/dashboard')

export const login = (data: { username: string, password: string }) => post('/accounts/auth/login/', data, { skipAuth: true } as any)

export const register = (data: { username: string, password: string, email: string, password_confirm: string }) => post('/accounts/auth/register/', data, { skipAuth: true } as any)

// get user
export const getUser = (params: any) => get('/accounts/profiles/', params)

// update user status
export const updateUserStatus = (id: string, data: any) => patch(`/accounts/profiles/${id}/update_status/`, data)

// delete user
export const deleteUser = (id: string) => del('/accounts/profiles/'+ id)

// create user
export const createUser = (data: { username: string, password: string, password_confirm: string, is_active: boolean }) => post('/accounts/profiles/', data)
