let webpack = require("webpack");
let path = require("path");

// variables
let sourcePath = path.join(__dirname, "./src");
let outPath = path.join(__dirname, "../dist");
let root = path.resolve(__dirname, ".");

let isProduction = process.argv.indexOf("-p") >= 0;

// plugins
let HtmlWebpackPlugin = require("html-webpack-plugin");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssLoadersDev = [
  {
    loader: "style-loader"
  },
  {
    loader: "css-loader"
  }
];

const cssLoadersProd = [
  {
    loader: MiniCssExtractPlugin.loader
  },
  {
    loader: "css-loader"
  }
];

module.exports = {
  context: sourcePath,
  entry: {
    main: "./main.tsx"
  },
  output: {
    path: outPath,
    filename: "[name].bundle.js",
    publicPath: "/"
  },
  target: "web",
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    mainFields: ["module", "browser", "main"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.css$/,
        use: isProduction ? cssLoadersProd : cssLoadersDev
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|eot|svg|woff|otf|ttf|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      },
      { test: /\.html$/, use: "html-loader" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./assets/index.html",
      favicon: "./assets/favicon.ico"
    }),
    new webpack.NamedModulesPlugin(),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(isProduction ? false : true)
    })
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    disableHostCheck: true,
    compress: isProduction ? false : true
  },
  performance: {
    hints: false
  },
  devtool: "cheap-source-map",
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: "empty",
    net: "empty"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  }
};
