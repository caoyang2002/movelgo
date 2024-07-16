const { override, addWebpackAlias } = require('react-app-rewired')

module.exports = override(
  addWebpackAlias({
    '@': './src',
  })
)
