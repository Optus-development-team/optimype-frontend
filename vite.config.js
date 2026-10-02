import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  // /v1 se reenvía al backend de OPTUS: con un solo túnel (ngrok) se sirven la
  // página /autorizar/:id, su API y el webhook de WhatsApp.
  const apiProxy = {
    '/v1': {
      target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
      changeOrigin: false,
    },
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '__vite-optional-peer-dep:@solana-program/system:@privy-io/react-auth:false': resolve(__dirname, 'src/shims/solanaProgramSystem.js')
      }
    },
    server: {
      host: true,
      allowedHosts: [
        'azalee-superfine-sydney.ngrok-free.dev',
        '.ngrok-free.dev',
        '.ngrok-free.app',
        '.ngrok.io'
      ],
      proxy: apiProxy,
    },
    preview: {
      host: true,
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'],
      proxy: apiProxy,
    },
  }
})
