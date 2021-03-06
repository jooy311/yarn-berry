const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    static: {directory: path.join(__dirname, 'dist')
    },
    port: 3001 //news가 이용할 포트
  },
  output: {
    publicPath: 'http://localhost:3001/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: 'ts-loader', //ts쓰는 경우에만 추가하는 것 같은데 
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'news',
      library: { type: 'var', name: 'news' },
      filename: 'remoteEntry.js',
      exposes: {
        // expose each component
        './CounterAppOne': './src/components/CounterAppOne',
        './ButtonMUI': './src/components/ButtonMUI',
      },
      shared: {
        ...deps,
        react: { singleton: true, eager: true, requiredVersion: deps.react },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: deps['react-dom'],
        //   '@mui/material/styles ': {
        //     singleton: true, // Sharing styles package as singleton                 
        // }      
                    
        }       
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};