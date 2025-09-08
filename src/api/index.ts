import { get, post, put, patch, del } from '@/lib/http'

export const getAIAccounts = () => get('/stats/dashboard')

export const login = (data: { username: string, password: string }) => post('/accounts/auth/login/', data)
