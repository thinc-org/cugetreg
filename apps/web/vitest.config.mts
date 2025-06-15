import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      tsDecorators: true,
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './test-setup.mjs',
    snapshotSerializers: ['enzyme-to-json/serializer'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: '../../coverage/apps/web',
    },
    testTimeout: 15000,
    typecheck: {
      tsconfig: './tsconfig.spec.json',
    },
  },
  resolve: {
    alias: {
      '@web': path.resolve('src'),
    },
  },
})
