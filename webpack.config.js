const webpack = require('webpack');
const path = require('path');
const os = require('os');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

const DOT_ENV = require('./.env.json');

module.exports = (env = {}) => ({
  mode: env.dev ? 'development' : 'production',
  entry: {
    index: ['./src/index.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
            },
          },
        ],
        include: path.join(__dirname, 'src'),
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(DOT_ENV),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ForkTsCheckerPlugin(),
    new TSLintPlugin({
      files: ['./src/**/*.ts'],
      project: './tsconfig.json',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
      }),
    ],
  },
  // node: false,
});
