var path = require('path');
var webpack = require('webpack');

var plugins = [];

// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    library: 'ImageProcessor',
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    filename: 'image-worker.js'
  },
  mode: "production",
  plugins: plugins,
  resolve: {
    modules: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: "worker-loader",
          options: {
            "inline" : "fallback"
          }
        },
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [["@babel/preset-env", {
              "targets": {
                "browsers": ["last 2 versions", "ie >= 11", "ios_saf >= 9"],
              },
              "modules": false,
              "useBuiltIns": "entry",
              "corejs": 3,
              "debug": false
            }]],
            "plugins": ["@babel/plugin-transform-runtime", ["@babel/plugin-transform-modules-umd", {
              "index.js": "imageSize"
            }]]
          }
        }
      }
    ]
  }
};
