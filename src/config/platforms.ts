// 平台配置类型定义
export interface PlatformOption {
  value: string
  label: string
}

// 任务类型配置类型定义
export interface TaskTypeOption {
  value: string
  label: string
}

// 平台配置数据
export const PLATFORM_OPTIONS: PlatformOption[] = [
  {
    value: 'twitter',
    label: 'X',
  },
  {
    value: 'facebook',
    label: 'Facebook',
  },
  {
    value: 'instagram',
    label: 'Instagram',
  },
  {
    value: 'threads',
    label: 'Threads',
  }
]

// 任务类型配置数据
export const TASK_TYPE_OPTIONS: TaskTypeOption[] = [
  {
    value: 'reply_comment',
    label: '回复评论'
  },
  {
    value: 'reply_message',
    label: '回复消息'
  },
  {
    value: 'post',
    label: '发帖'
  },
  {
    value: 'follow',
    label: '关注'
  }
]

// 平台类型枚举
export enum PlatformType {
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  THREADS = 'threads'
}

// 任务类型枚举
export enum TaskType {
  REPLY_COMMENT = 'reply_comment',
  REPLY_MESSAGE = 'reply_message',
  POST = 'post',
  follow = 'follow'
}


