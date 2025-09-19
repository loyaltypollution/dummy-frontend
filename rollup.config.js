import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/main.js',
    format: 'iife',
    name: 'DummyFrontend',
    sourcemap: true
  },
  plugins: [
    typescript({
      check: false,
      clean: true
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    })
  ]
};