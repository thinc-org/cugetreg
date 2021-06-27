const path = require('path')
const webpack = require('webpack')

const fileRoot = process.cwd()

module.exports = {
  target: 'web',
  mode: 'development',
  devtool: 'eval',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './demo/index.js',
    ],
  },
  output: {
    path: path.join(fileRoot, 'demo'),
    filename: 'bundle.js',
    publicPath: '/',
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
            plugins: ['react-hot-loader/babel'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  resolve: {
    extensions: ['*', '.js'],
  },
  devServer: {
    contentBase: path.join(fileRoot, 'demo'),
    historyApiFallback: true,
    compress: false,
    host: process.env.IP || '0.0.0.0',
    port: parseInt(process.env.PORT, 0) || 8080,
    hot: true,
    open: false,
    quiet: false,
    noInfo: false,
    inline: true,
    lazy: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    stats: {
      colors: true,
    },
  },
}
