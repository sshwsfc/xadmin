module.exports = function(api) {
  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "debug": false,
          "modules": api.env('esbuild') ? false : 'auto',
          "useBuiltIns": false,
          "targets": { "esmodules": true }
        }
      ],
      "@babel/preset-react"
    ],
    "plugins": [
      "@babel/plugin-proposal-object-rest-spread",
      [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
      [ "@babel/plugin-proposal-class-properties", { "loose": true } ]
    ]
  }
};