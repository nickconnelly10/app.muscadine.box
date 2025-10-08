import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@farcaster/miniapp-sdk': path.resolve(__dirname, 'test/__mocks__/farcaster-sdk.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    env: {
      NEXT_PUBLIC_ONCHAINKIT_API_KEY: 'test-key',
    },
    server: {
      deps: {
        inline: [
          '@farcaster/miniapp-sdk',
          'wagmi',
          'viem',
        ],
      },
    },
    isolate: false,
    coverage: {
      reporter: ['text', 'lcov'],
      enabled: false,
    },
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});


