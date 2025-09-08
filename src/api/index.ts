import { get, post, put, patch, del } from '@/lib/http'

export const getAIAccounts = () => get('/stats/dashboard')

export const login = (data: { username: string, password: string }) => post('/accounts/auth/login/', data, { skipAuth: true } as any)

export const register = (data: { username: string, password: string, email: string, password_confirm: string }) => post('/accounts/auth/register/', data, { skipAuth: true } as any)
