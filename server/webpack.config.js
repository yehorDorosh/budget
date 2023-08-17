/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52

const path = require('path')

const nodeExternals = require('webpack-node-externals')
// const WebpackShellPluginNext = require('webpack-shell-plugin-next')
const CopyPlugin = require('copy-webpack-plugin')

const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'

module.exports = {
  target: 'node',
  // externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

  entry: './src/index.ts',

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },

  mode: isDev ? 'development' : 'production',
  devtool: isDev && 'source-map',
  watch: isDev,

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  plugins: [
    // new WebpackShellPluginNext({
    //   onBuildStart: {
    //     scripts: ['echo "===> Starting packing with WEBPACK 5"'],
    //     blocking: true,
    //     parallel: false
    //   },
    //   onBuildEnd: {
    //     scripts: isDev ? ['npm run nodemon'] : ['echo "===> Finished packing with WEBPACK 5"'],
    //     blocking: false,
    //     parallel: true
    //   }
    // }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/public',
          to: 'public'
        },
        {
          from: './src/.env',
          to: '[path][name]'
        }
      ]
    })
  ]
}
