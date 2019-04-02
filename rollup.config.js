// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/OneTimer.js',
  output: [
    {
      file: 'dist/OneTimer.es.js',
      format: 'es'
    },
    {
      file: 'dist/OneTimer.umd.js',
      format: 'umd',
      name: 'OneTimer'
    },
    {
      file: 'dist/OneTimer.cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [
    resolve(),
    commonjs(/*{
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/singlie/index.js': ['Linear']
      }
    }*/) // 将npm 包打包在一起
  ]
}