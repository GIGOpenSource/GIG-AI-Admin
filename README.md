# AI 智能客服管理系统

基于 Vue 3 + TypeScript + Tailwind CSS 构建的现代化 AI 智能客服管理后台系统，提供完整的客服自动化解决方案。


## 📋 项目概述

这是一个功能完整的 AI 智能客服管理系统，集成了多种 AI 服务配置、关键词规则管理、提示词模板、自动回复任务等核心功能。系统采用现代化的前端技术栈，提供直观易用的管理界面。

## ✨ 核心功能

### 🤖 AI 服务配置
- 支持多种 AI 平台（OpenAI、Azure OpenAI、Google Gemini、Anthropic 等）
- API Key 安全管理
- 模型配置与优先级设置
- 服务状态监控

### 🔍 关键词规则管理
- 智能关键词匹配（任意匹配、全部匹配、正则匹配）
- 多平台支持（Twitter、Facebook、Instagram）
- 用户定向配置
- 规则启用/停用控制

### 📝 提示词模板
- 多场景模板（回复评论、回复消息、发帖）
- 模板内容管理
- 用户权限控制
- 模板激活状态管理

### ⚡ 自动回复任务
- 定时任务调度
- 循环类型配置（日/周/月）
- 执行时间设置
- 任务状态监控

### 📊 数据统计
- 实时数据可视化
- 图表展示（柱状图、折线图）
- 数据导出功能

## 🛠️ 技术栈

### 前端框架
- **Vue 3.5.13** - 渐进式 JavaScript 框架
- **TypeScript 5.7.3** - 类型安全的 JavaScript
- **Vite 6.0.11** - 快速构建工具

### UI 框架
- **Tailwind CSS 4.0** - 实用优先的 CSS 框架
- **Reka UI 2.5.0** - 现代化组件库
- **Lucide Vue Next** - 图标库

### 状态管理与路由
- **Vue Router 4.5.0** - 官方路由管理器
- **Pinia** - Vue 状态管理库

### 数据可视化
- **ApexCharts 4.4.0** - 交互式图表库
- **JSVectorMap 1.6.0** - 矢量地图

### 工具库
- **Axios 1.11.0** - HTTP 客户端
- **Vue Sonner 2.0.8** - 通知组件
- **VueUse 13.9.0** - Vue 组合式 API 工具集

## 🚀 快速开始

### 环境要求

- **Node.js** 18.x 或更高版本（推荐 20.x+）
- **npm** 或 **yarn** 包管理器
- **Git** 版本控制工具

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd tailwin-admin

# 安装依赖
npm install
# 或
yarn install
```

### 开发环境

```bash
# 启动开发服务器
npm run dev
# 或
yarn dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用

### 代码质量

```bash
# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

## 🏗️ 项目结构

```
src/
├── api/                    # API 接口层
│   ├── aiCofig.ts         # AI 配置接口
│   ├── keywrods.ts        # 关键词接口
│   ├── prompts.ts         # 提示词接口
│   └── task.ts            # 任务接口
├── assets/                # 静态资源
├── components/            # 公共组件
│   ├── charts/           # 图表组件
│   ├── common/           # 通用组件
│   ├── forms/            # 表单组件
│   ├── layout/           # 布局组件
│   ├── profile/          # 用户资料组件
│   ├── tables/           # 表格组件
│   └── ui/               # UI 组件库
├── composables/          # 组合式函数
├── icons/                # 图标组件
├── lib/                  # 工具库
│   ├── http.ts           # HTTP 请求封装
│   └── utils.ts          # 通用工具函数
├── router/               # 路由配置
└── views/                # 页面组件
    ├── AIAccounts/       # AI 账户管理
    ├── AIConfig/         # AI 配置管理
    ├── AutoReply/        # 自动回复任务
    ├── KeywordRules/     # 关键词规则
    ├── PromptTemplates/  # 提示词模板
    ├── Datastatistics/   # 数据统计
    └── Auth/             # 认证页面
```

## 🔧 环境配置

### 开发环境变量

创建 `.env.development` 文件：

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000/api

# 应用标题
VITE_APP_TITLE=AI 智能客服管理系统

# 是否启用开发工具
VITE_DEV_TOOLS=true
```

### 生产环境变量

创建 `.env.production` 文件：

```env
# API 基础地址
VITE_API_BASE_URL=https://api.yourdomain.com

# 应用标题
VITE_APP_TITLE=AI 智能客服管理系统

# 是否启用开发工具
VITE_DEV_TOOLS=false
```

## 📦 构建部署

### 生产构建

```bash
# 构建生产版本
npm run build
# 或
yarn build
```

构建完成后，`dist` 目录包含所有静态文件。

### 预览构建结果

```bash
# 本地预览构建结果
npm run preview
# 或
yarn preview
```

### 部署方式

#### 1. 静态文件部署

将 `dist` 目录上传到 Web 服务器：

```bash
# 使用 nginx 示例配置
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 2. Docker 部署

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建和运行：

```bash
# 构建镜像
docker build -t ai-customer-service .

# 运行容器
docker run -p 80:80 ai-customer-service
```

#### 3. 云平台部署

**Vercel 部署：**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

**Netlify 部署：**

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod --dir=dist
```

## 🔐 API 接口

### 认证接口

```typescript
// 用户登录
POST /api/auth/login
{
  "username": "string",
  "password": "string"
}

// 用户注册
POST /api/auth/register
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

## 🎨 自定义主题

### 颜色配置

在 `tailwind.config.js` 中自定义主题：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### 组件样式

使用 CSS 变量进行主题定制：

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

## 📱 响应式设计

系统采用移动优先的响应式设计：

- **移动端**: < 768px
- **平板端**: 768px - 1024px  
- **桌面端**: > 1024px

## 🔍 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 技术支持

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/your-repo/issues)
- 发送邮件至 support@yourdomain.com

## 🎯 路线图

- [ ] 多语言支持
- [ ] 实时消息推送
- [ ] 高级数据分析
- [ ] 移动端应用
- [ ] 第三方集成

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！