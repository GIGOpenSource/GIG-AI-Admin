import { get, post, put, patch, del } from '@/lib/http'

export const getdate = (params:any) => get('/stats/summary/', {params})

export const statsdetail = (params:any) => get('/stats/detail/', {params})

export const tasklog = (params:any) => get('/tasks/task_log/', {params})

export const logdetail = (params:any) => get('/tasks/log_detail/', {params})
// 提示词配置
export const promptconfigs = (params:any) => get('/prompts/configs/', {params})
// 重试失败任务
export const postlogdetail = (params: any) => post('/tasks/log_detail/', null, { params })
