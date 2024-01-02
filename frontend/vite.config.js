import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
      format: {
        comments: false
      },
    },
  },
})
