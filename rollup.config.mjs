import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/area-control-card.ts',
  output: {
    file: 'dist/area-control-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript(),
    json(),
    terser({
      format: {
        comments: false,
      },
    }),
  ],
};
