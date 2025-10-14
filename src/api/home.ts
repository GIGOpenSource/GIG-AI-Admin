import { get, post, put, patch, del } from '@/lib/http'

export const getdate = (params:any) => get('/stats/summary/', {params})

export const statsdetail = (params:any) => get('/stats/detail/', {params})