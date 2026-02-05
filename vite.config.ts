import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/chat-app-test/',  // GitHub Pages 的 repo 名稱
  plugins: [vue()],
})
