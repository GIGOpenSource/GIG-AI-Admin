import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
server: {
  host: '0.0.0.0',
  port: 5173,

  // 关键：允许通过域名访问 dev server
  allowedHosts: ['gigaisystem.com', 'www.gigaisystem.com'],
  // 关键：告知客户端用 https 域名访问（影响 HMR 客户端）
  origin: 'https://gigaisystem.com',
  // 关键：HMR 走 wss 且 host 为你的域名（Nginx 终止 TLS）
  hmr: {
    host: 'gigaisystem.com',
    protocol: 'wss'
  },

  proxy: {
    '/api': {
      target: 'http://web:8000',
      changeOrigin: true,
      secure: false,
    },
  },
},
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['gigaisystem.com', 'www.gigaisystem.com'],
  }
})
