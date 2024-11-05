import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    'process.env.VITE_APP_LICENSE_KEY': JSON.stringify(process.env.VITE_APP_LICENSE_KEY),
    'process.env.VITE_APP_CKBOX_TOKEN_URL': JSON.stringify(process.env.VITE_APP_CKBOX_TOKEN_URL),
    'process.env.VITE_APP_UNIQUE_CHANNEL_PER_DOCUMENT': JSON.stringify(process.env.VITE_APP_UNIQUE_CHANNEL_PER_DOCUMENT),
    'process.env.VITE_APP_CLOUD_SERVICES_TOKEN_URL': JSON.stringify(process.env.VITE_APP_CLOUD_SERVICES_TOKEN_URL),
    'process.env.VITE_APP_CLOUD_SERVICES_WEBSOCKET_URL': JSON.stringify(process.env.VITE_APP_CLOUD_SERVICES_WEBSOCKET_URL),
    'process.env.VITE_APP_LOCALHOSTKEY': JSON.stringify(process.env.VITE_APP_LOCALHOSTKEY)
  },
});
