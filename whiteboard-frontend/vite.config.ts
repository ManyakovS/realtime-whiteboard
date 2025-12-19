import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    Components({
      dirs: ['src/components'], 
      extensions: ['vue'],
      dts: true, 
      deep: true,
    }),
  ],
   resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@assets': resolve(__dirname, './src/assets'),
      '@views': resolve(__dirname, './src/views'),
      '@stores': resolve(__dirname, './src/stores'),
      '@utils': resolve(__dirname, './src/utils'),
      '@composables': resolve(__dirname, './src/composables'),
    }
  },
  server: {
    host: true, 
    port: 5173,
    watch: {
      usePolling: true,  
      interval: 1000
    }
  }
})
