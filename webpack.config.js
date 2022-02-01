const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'eval-cheap-source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    
  },
  devServer: {
    static: './dist',
  },
  module: {
      rules: [
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },
      ]
  }
};