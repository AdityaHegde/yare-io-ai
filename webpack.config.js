const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: [
    "./src/index.ts",
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [{
      test: /(src|test)\/.*\.tsx?$/,
      loader: "ts-loader",
      options: {
        configFile: "tsconfig-webpack.json",
      },
    }],
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
  ],

  optimization: {
    minimize: false,
    splitChunks: {
      chunks: "all",
    },
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
};
