import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-test.ts'],
    root: './',
  },
  plugins: [
    // Necesario para transpilar con SWC: esbuild no soporta emitDecoratorMetadata,
    // y sin `design:paramtypes` la DI de Nest no resuelve en los tests.
    swc.vite({
      // Explicito para no heredar este valor de un posible .swcrc
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      // Para que vitest resuelva los imports absolutos `src/...`
      src: resolve(__dirname, './src'),
    },
  },
});
