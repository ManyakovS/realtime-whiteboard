import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import Components from 'unplugin-vue-components/vite'

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
  server: {
    host: true, 
    port: 5173,
    watch: {
      usePolling: true,  
      interval: 1000
    }
  }
})
