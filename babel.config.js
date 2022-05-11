const isEs = process.env.BABEL_ENV === 'es'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        "debug": false,
        "modules": isEs ? false : 'commonjs',
        "useBuiltIns": false,
        "targets": { "esmodules": true }
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    "@babel/plugin-proposal-object-rest-spread",
    [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
    "@babel/plugin-proposal-class-properties"
  ]
}