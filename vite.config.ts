import react from '@vitejs/plugin-react';
import { defineConfig, UserConfigExport } from 'vite';

export default defineConfig(({ command }) => {
  const baseConfig: UserConfigExport = {
    base: '/hypixel-attribute-search/',
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            mui: ['@mui/material', '@mui/icons-material']
          }
        }
      }
    },
    plugins: [react()]
  };
  if (command === 'serve') {
    return {
      ...baseConfig,
      define: {
        global: {}
      }
    };
  } else {
    // command === 'build'
    return {
      ...baseConfig
    };
  }
});
