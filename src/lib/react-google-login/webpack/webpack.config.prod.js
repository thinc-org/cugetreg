const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const uglifyConf = require('./uglify.json')

const fileRoot = process.cwd()

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.join(fileRoot, 'dist'),
    filename: 'google-login.js',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== "undefined" ? self : this',
    library: 'GoogleLogin',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  targets: {
                    esmodules: false,
                  },
                },
              ],
            ],
            plugins: ['transform-react-remove-prop-types'],
          },
        },
      },
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'ReactDOM',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new UglifyJsPlugin(uglifyConf),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  performance: {
    hints: 'warning',
  },
  stats: {
    errorDetails: true,
    assets: true,
    children: false,
    chunks: false,
    hash: false,
    modules: false,
    publicPath: false,
    timings: true,
    version: false,
    warnings: true,
    colors: {
      green: '\u001b[32m',
    },
  },
}
