import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    environmentMatchGlobs: [['src/http/**', 'prisma']],
    globals: true,
    reporters: 'default',
  },
})
