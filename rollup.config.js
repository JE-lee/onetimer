// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/LineTimer.js',
  output: {
    file: 'dist/LineTimer.js',
    format: 'es'
  },
  plugins: [
    resolve(),
    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/singlie/index.js': ['Linear']
      }
    })
  ]
}