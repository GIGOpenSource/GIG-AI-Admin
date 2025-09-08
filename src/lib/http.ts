import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface ApiResponse<T = unknown> {
  code?: number
  message?: string
  data: T
}

function getBaseURL() {
  return import.meta.env.VITE_API_BASE_URL || '/'
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

const http: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  withCredentials: false,
})

http.interceptors.request.use(
  (config) => {
    // Allow specific requests to opt-out of auth header via non-standard flag
    const skipAuth = (config as any).skipAuth
    if (skipAuth) return config

    const token = getAuthToken()
    if (token) {
      config.headers = config.headers || {}
      ;(config.headers as any)['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Unified success handling: unwrap common { code, message, data }
    const res = response.data as ApiResponse
    if (typeof res === 'object' && res !== null && 'data' in res) {
      return res.data
    }
    // If backend doesn't follow wrapper, return raw response data
    return response.data as any
  },
  (error: AxiosError) => {
    // Unified error handling
    const status = error.response?.status
    const backendMessage = (error.response?.data as any)?.message
    const message = backendMessage || error.message || 'Network Error'

    if (status === 401) {
      // Optionally clear token and redirect to login
      try {
        localStorage.removeItem('token')
      } catch {}
      // location.href = '/signin' // enable if desired
    }

    return Promise.reject({ status, message, error })
  }
)

async function request<T = any>(method: HttpMethod, url: string, config?: AxiosRequestConfig): Promise<T> {
  const cfg: AxiosRequestConfig = { method, url, ...(config || {}) }
  return http.request<any, T>(cfg)
}

export const get = <T = any>(url: string, config?: AxiosRequestConfig) => request<T>('get', url, config)
export const del = <T = any>(url: string, config?: AxiosRequestConfig) => request<T>('delete', url, config)
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request<T>('post', url, { ...(config || {}), data })
export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request<T>('put', url, { ...(config || {}), data })
export const patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request<T>('patch', url, { ...(config || {}), data })

export default http


