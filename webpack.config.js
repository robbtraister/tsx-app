const path = require("path");

const { DllReferencePlugin } = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const { version } = require("./package.json");

const PRODUCTION_PATTERN = /^prod/i;

let apiApp;

class OnBuildPlugin {
  constructor(fn) {
    this.fn = fn;
  }

  apply(compiler) {
    compiler.hooks.done.tap(this.constructor.name, this.fn);
  }
}

const devServer = ({ liveReload, open, port }) => ({
  compress: true,
  contentBase: "./public",
  disableHostCheck: true,
  historyApiFallback: true,
  host: "0.0.0.0",
  https: false,
  index: "",
  injectClient: liveReload && (({ target }) => target === "web"),
  liveReload,
  open: open !== false,
  openPage: `http://localhost:${port}`,
  port,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300,
    ignored: liveReload ? /node_modules/ : /./,
  },
  writeToDisk: (filePath) => /\/server\.js$/.test(filePath),
  before(app) {
    app.use((req, res, next) => {
      // we only want to match /api, but we don't want to route it
      if (/^\/api(\/|$)/.test(req.originalUrl)) {
        if (apiApp) {
          apiApp(req, res, next);
        } else {
          res.sendStatus(500);
        }
      } else {
        next();
      }
    });
  },
});

const resolve = {
  extensions: [".tsx", ".ts", ".js", ".mjs"],
  plugins: [
    new TsconfigPathsPlugin({
      configFile: path.resolve(__dirname, "tsconfig.json"),
    }),
  ],
};

const getRules = (isProd, exportOnlyLocals) => [
  {
    test: /\.s?[ac]ss$/,
    use: {
      loader: "css-loader",
      options: {
        modules: {
          exportLocalsConvention: "camelCase",
          exportOnlyLocals,
          localIdentContext: path.resolve(__dirname, "src/ui"),
          localIdentName: isProd
            ? "[local]__[contenthash:base64:5]"
            : "[path][name]_[local]",
        },
        sourceMap: isProd,
      },
    },
  },
  {
    test: /\.s[ac]ss$/,
    use: {
      loader: "sass-loader",
      options: {
        sourceMap: isProd,
        sassOptions: {
          includePaths: ["src/ui/"],
        },
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /[\\/]node_modules[\\/]/,
    use: {
      loader: "ts-loader",
      options: {
        configFile: path.resolve(__dirname, "tsconfig.json"),
        experimentalWatchApi: true,
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: "@svgr/webpack",
  },
  {
    test: /\.(jpg|png|gif)$/,
    use: "file-loader",
  },
];

module.exports = (env, argv) => {
  const isProd =
    argv.production ||
    PRODUCTION_PATTERN.test(process.env.NODE_ENV) ||
    PRODUCTION_PATTERN.test(argv.mode);

  const port = Number(argv.port) || Number(process.env.PORT) || 8080;
  const vendors = Boolean(isProd ? false : argv.vendors !== false);
  const watch = Boolean(isProd ? argv.watch : argv.watch !== false);
  const liveReload = watch && argv.liveReload;

  return [
    {
      name: "ui",
      devServer: devServer({ liveReload, open: argv.open, port }),
      devtool: isProd ? "source-map" : "eval-source-map",
      entry: {
        main: "./src/ui",
      },
      mode: isProd ? "production" : "development",
      module: {
        rules: [
          {
            test: /\.s?[ac]ss$/,
            use: isProd
              ? {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    sourceMap: true,
                  },
                }
              : "style-loader",
          },
          ...getRules(isProd),
        ],
      },
      optimization: isProd
        ? {
            minimize: true,
            splitChunks: {
              chunks: "all",
            },
            minimizer: [
              new TerserWebpackPlugin({
                sourceMap: true,
              }),
              new OptimizeCSSAssetsPlugin({}),
            ],
          }
        : undefined,
      output: {
        filename: isProd ? "[name].[contenthash].js" : "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
      },
      plugins: [
        new ForkTsCheckerWebpackPlugin({
          eslint: {
            enabled: true,
            files: ["src/ui/**/*.{ts,tsx}"],
          },
          logger: {
            devServer: false,
          },
          typescript: {
            configFile: path.resolve(__dirname, "tsconfig.json"),
          },
        }),
        new HtmlWebpackPlugin({
          minify: isProd,
          scriptLoading: "defer",
          template: "./src/ui/index.html",
          title: "Application",
          version,
        }),
        ...(isProd
          ? [
              new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css",
                chunkFilename: "[id].[contenthash].css",
              }),
            ]
          : []),
        ...(vendors
          ? [
              new HtmlWebpackTagsPlugin({
                tags: ["vendors.js"],
                append: false,
              }),
              new DllReferencePlugin({
                context: __dirname,
                manifest: require("./public/vendors-manifest.json"),
              }),
            ]
          : []),
      ],
      resolve,
      target: "web",
      watch,
    },
    {
      name: "server",
      devServer: devServer({ liveReload, open: false, port }),
      devtool: isProd ? "source-map" : "eval-source-map",
      entry: {
        server: ["source-map-support/register", "./src/server"],
      },
      externals: isProd ? undefined : nodeExternals(),
      mode: isProd ? "production" : "development",
      module: {
        rules: getRules(isProd, true),
      },
      optimization: isProd
        ? {
            minimize: true,
            splitChunks: false,
            minimizer: [
              new TerserWebpackPlugin({
                sourceMap: true,
              }),
            ],
          }
        : undefined,
      output: {
        // use ../ because the output file is in dist/
        devtoolModuleFilenameTemplate: "../[resource-path]",
        filename: "[name].js",
        libraryTarget: "commonjs2",
        path: path.resolve(__dirname, "dist"),
      },
      plugins: [
        new ForkTsCheckerWebpackPlugin({
          eslint: {
            enabled: true,
            files: ["src/server/**/*.{ts,tsx}"],
          },
          logger: {
            devServer: false,
          },
          typescript: {
            configFile: path.resolve(__dirname, "tsconfig.json"),
          },
        }),
        new OnBuildPlugin(() => {
          const serverPath = require.resolve("./dist/server");
          delete require.cache[serverPath];
          apiApp = require(serverPath).createApp();
        }),
      ],
      resolve,
      target: "node",
      watch,
    },
  ];
};
