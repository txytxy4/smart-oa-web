import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3012
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['antd']
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // 将有问题的样式文件标记为外部依赖
        if (id.includes('antd/es/time-picker/style')) {
          return true;
        }
        return false;
      }
    }
  }
})
