import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/core/deviceFingerprint.ts',
  output: {
    file: 'dist/deviceFingerprint.js',
    format: 'umd',
    name: 'DeviceFingerprint',
    exports: 'named'
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs()
  ]
}; 