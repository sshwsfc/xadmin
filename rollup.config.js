import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss"
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import nodePolyfills from 'rollup-plugin-node-polyfills'

import fs from 'fs'
import path from 'path'

const appDirectory = fs.realpathSync(process.cwd());
const pkg = require(path.resolve(appDirectory, 'package.json'))
const appName = pkg.name
const pkgName = appName.replace(/-(\w)/g, function(all, letter){
  return letter.toUpperCase();
 });

const extensions = ['.js', '.jsx']

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})$`)
  return (id) => pattern.test(id)
}

const babelConfig = {
  extensions,
  presets: [
    require.resolve("@babel/preset-env"),
    require.resolve("@babel/preset-react")
  ],
  plugins: [
    require.resolve("@babel/plugin-transform-runtime"),
    require.resolve("@babel/plugin-proposal-object-rest-spread"),
    [require.resolve("@babel/plugin-proposal-decorators"), { "legacy": true }],
    require.resolve("@babel/plugin-proposal-class-properties")
  ],
  exclude: [ '../../node_modules/**', 'node_modules/**' ],
  babelHelpers: 'runtime'
}

const globals = {
  react: 'React',
  redux: 'Redux',
  'react-dom': 'ReactDOM',
  'react-router': 'ReactRouter',
  'react-router-dom': 'ReactRouterDOM',
  'react-redux': 'ReactRedux',
  'redux-saga': 'ReduxSaga',
  'lodash': '_',
  'xadmin': 'xadmin',
  'xadmin-i18n': 'xadminI18n',
  'xadmin-ui': 'xadminUi',
  'xadmin-form': 'xadminForm',
  'xadmin-model': 'xadminModel'
}

export default [
  // UMD Development
  {
    input: 'src/index.js',
    output: {
      file: `dist/${appName}.js`,
      format: 'umd',
      name: pkgName,
      indent: false,
      exports: 'named',
      globals
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: true
      }),
      nodePolyfills(),
      babel(babelConfig),
      commonjs(),
      json(),
      postcss({
        plugins: [
          require('autoprefixer')()
        ]
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'preventAssignment': true
      }),
    ],
  },

  // UMD Production
  {
    input: 'src/index.js',
    output: {
      file: `dist/${appName}.min.js`,
      format: 'umd',
      name: pkgName,
      indent: false,
      exports: 'named',
      globals
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: true
      }),
      nodePolyfills(),
      babel(babelConfig),
      commonjs(),
      json(),
      postcss({
        plugins: [
          require('autoprefixer')()
        ]
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'preventAssignment': true
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
]
