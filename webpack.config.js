const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  }, 
  devtool: 'eval',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback : true
  },
//   externals: [nodeExternals({
//     modulesFromFile: true
    
// })],
//   target : 'node'
};
