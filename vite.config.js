import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import svgr from 'vite-plugin-svgr'
import svgr from 'vite-plugin-svgr'


// https://vitejs.dev/config/
export default defineConfig({
  // Cho phep Vite su dung process.env, mac dinh la import.meta.env
  define: {
    'process.env': process.env
  },
  plugins: [
    react(),
    svgr()
  ],
  // base: './'
  resolve: {
    alias: [
      {
        find: '~', replacement: '/src'
      }
    ]
  }
})
