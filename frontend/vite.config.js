import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/videos': 'http://127.0.0.1:8000',
      '/video': 'http://127.0.0.1:8000',
      '/upload_video': 'http://127.0.0.1:8000',
      '/uploaded_videos': 'http://127.0.0.1:8000',
    },
  },
})

