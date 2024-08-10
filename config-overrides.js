const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const {
  override,
  addBabelPreset,
  addWebpackPlugin,
  babelInclude,
} = require('customize-cra')
const path = require('path')

module.exports = override(
  addBabelPreset('@babel/preset-env'),
  babelInclude([
    path.resolve('src'),
    path.resolve('node_modules/@dtinsight/molecule'),
  ]),
  addWebpackPlugin(
    new MonacoWebpackPlugin([
      'javascript',
      'typescript',
      'css',
      'html',
      'json',
      'rust',
      'cpp',
      'c',
      'python',
      'go',
    ])
  ),
  (config, env) => {
    if (env === 'production') {
      const TerserPlugin = config.optimization.minimizer.find(
        (i) => i.constructor.name === 'TerserPlugin'
      )
      if (TerserPlugin) {
        TerserPlugin.options.terserOptions.compress['drop_console'] = false
      }
    }
    return config
  }
)
