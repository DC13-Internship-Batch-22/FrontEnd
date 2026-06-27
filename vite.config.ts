import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20000,
          groups: [
            {
              name: 'antd-icons',
              test: /@ant-design\/icons/,
            },
            {
              name: 'antd-core',
              test: /node_modules\/antd\/(es|lib)\/(button|input|form|modal|table|select|dropdown)/,
            },
            {
              name: 'chart-vendor',
              test: /node_modules\/recharts/,
            },
            {
              name: 'vendor',
              test: /node_modules/,
            },
          ],
        },
      },
    },
  },
})
