const webpack = require('webpack');
const path = require('path');

const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const argv = require('yargs').argv

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const paths = require('./paths')

// Common plugins
const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor-[hash].js',
    minChunks(module) {
      const context = module.context;
      return context && context.indexOf('node_modules') >= 0;
    },
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(paths.appSrc, 'index.html'),
    path: paths.appPublic,
    filename: 'index.html',
  }),
  // new webpack.LoaderOptionsPlugin({
  //   options: {
  //     postcss: [
  //       autoprefixer({
  //         browsers: [
  //           'last 3 version',
  //           'ie >= 10',
  //         ],
  //       }),
  //     ],
  //     context: sourcePath,
  //   },
  // }),
];

// Common rules
const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
    ],
  },
  {
    test: /\.json$/,
    use: 'json-loader'
  },
  {
    test: /\.(png|gif|jpg|svg|ttf|eot|woff2?)$/,
    use: 'file-loader?limit=20480&name=assets/[name]-[hash].[ext]',
  },
  { test: /\.less$/, use: [ 'style-loader', 'css-loader', 'less-loader' ] },
  { test: /\.css?$/, use: [ 'style-loader', 'css-loader' ] },
];

if (isProduction) {
  // Production plugins
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin('style-[hash].css')
  );

  // Production rules
  rules.push(
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!postcss-loader!sass-loader',
      }),
    }
  );
} else {
  // Development plugins
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin()
  );

  // Development rules
  rules.push(
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        // Using source maps breaks urls in the CSS loader
        // https://github.com/webpack/css-loader/issues/232
        // This comment solves it, but breaks testing from a local network
        // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
        // 'css-loader?sourceMap',
        'css-loader',
        'postcss-loader',
        'sass-loader?sourceMap',
      ],
    }
  );
}

module.exports = {
  devtool: isProduction ? false : 'source-map',
  context: paths.appSrc,
  entry: {
    app: [ 'babel-polyfill', paths.appIndexJs ]
  },
  output: {
    path: paths.appPublic,
    publicPath: '/',
    filename: '[name]-[hash].js'
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'src': paths.appSrc
    },
    modules: [
      paths.appNodeModules,
      paths.appSrc,
    ],
  },
  plugins,
  devServer: {
    contentBase: isProduction ? paths.appPublic : path.join(paths.appSrcStatic, '..'),
    historyApiFallback: true,
    port: parseInt(argv.port || '8080'),
    compress: isProduction,
    inline: !isProduction,
    hot: !isProduction,
    host: '0.0.0.0',
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: false,
      colors: {
        green: '\u001b[32m',
      },
    },
  },
};
