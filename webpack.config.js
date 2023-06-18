/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unpublished-require */
// @ts-check
const path = require("path");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { default: HtmlInlineCssWebpackPlugin } = require("html-inline-css-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const development = process.env.DEBUG === "1";

module.exports = {
  mode: development ? "development" : "production",
  devtool: development ? "source-map" : false,
  devServer: {
    hot: true,
  },
  entry: path.join(__dirname, "./src/scripts/index.tsx"),
  output: {
    path: path.join(__dirname, "./dist/"),
    filename: "bundle.min.js",
  },
  target: [
    "web",
    "es5",
    "es6",
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              transform: {
                react: {
                  development,
                  refresh: development,
                },
              },
            },
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: development,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: development ? [] : [
                  "postcss-flexbugs-fixes",
                  [
                    "postcss-preset-env",
                    {
                      autoprefixer: {
                        flexbox: "no-2009",
                        grid: true,
                      },
                      stage: 3,
                      features: {},
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: "resolve-url-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {},
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".scss"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new DotenvWebpackPlugin({
      systemvars: true,
    }),
    ...development ? [
      new ReactRefreshWebpackPlugin(),
    ] : [
      new HtmlInlineCssWebpackPlugin({
        leaveCSSFile: false,
      }),
    ],
  ],
  optimization: {
    minimize: !development,
    usedExports: true,
    minimizer: [
      new TerserWebpackPlugin({
        minify: TerserWebpackPlugin.swcMinify,
        terserOptions: {
          ecma: 2015,
          format: {
            ascii_only: true,
          },
        },
      }),
      new HtmlMinimizerPlugin(),
      new CssMinimizerWebpackPlugin({
        minify: CssMinimizerWebpackPlugin.cssoMinify,
      }),
    ],
  },
};
