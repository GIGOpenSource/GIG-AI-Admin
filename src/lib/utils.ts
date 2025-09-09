import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 时间格式化方法
 * @param timeString 时间字符串或时间戳
 * @returns 格式化后的时间字符串 (YYYY-MM-DD HH:mm:ss)
 */
export function formatTime(timeString: string | number | Date | null | undefined): string {
  if (!timeString) return '-'

  try {
    // 创建日期对象
    const date = new Date(timeString)

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return String(timeString) // 如果无法解析，返回原始字符串
    }

    // 格式化日期时间
    const pad = (n: number) => String(n).padStart(2, '0')
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())

    // 返回格式化的时间字符串：YYYY-MM-DD HH:mm:ss
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('时间格式化错误:', error)
    return String(timeString) // 出错时返回原始字符串
  }
}
