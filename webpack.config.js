const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      externals: ["fs"],
      template: "index.html",
      filename: "index.html"
    })
  ]
};
