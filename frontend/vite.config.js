import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // You can add aliases here if needed, e.g.
      // '@': '/src',
      // '@services': '/src/services',
    },
  },
  server: {
    // Ensure the server runs on a specific port and watches for changes
    port: 5173,
    open: true, // Automatically open the browser
  }
})
