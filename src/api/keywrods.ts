import { get, post, put, patch, del } from '@/lib/http'
export const getKeywordsRules = (params:any) => get('/core/keywords/rules/', params)

export const getKeywordsRulesDetail = (id:string) => get(`/core/keywords/rules/${id}/`)

export const createKeywordsRules = (data:any) => post('/core/keywords/rules/admin-create/', data)
