var path = require('path');
var webpack = require('webpack');

var plugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  })
];

// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    library: 'ImageProcessor',
    path: __dirname + '/dist',
    filename: 'image-worker.js'
  },
  plugins: plugins,
  resolve: {
    modules: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
};
