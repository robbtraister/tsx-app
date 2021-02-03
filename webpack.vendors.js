const path = require("path");
const webpack = require("webpack");

function getDependencies(rootDir) {
  return Object.keys(
    require(path.join(rootDir, "package.json")).dependencies || {}
  ).filter((dep) => {
    // verify that an import exists for this module
    try {
      require.resolve(dep);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        return false;
      }
    }
    return true;
  });
}

module.exports = (env, argv) => {
  argv.linting = false;
  argv.vendors = false;
  // if watch is undefined, make it false
  argv.watch = Boolean(argv.watch);

  return {
    // use the same basic configuration as other builds (primarily module.rules)
    ...require("./webpack.config.js")(env, argv).find(
      ({ name }) => name === "ui"
    ),
    devServer: undefined,
    devtool: "cheap-source-map",
    // build a static script that includes each of the following modules
    entry: {
      vendors: getDependencies(__dirname),
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "public"),
      // expose the modules via a global require function called `vendors_abc123` (or whatever)
      library: "[name]_[hash]",
    },
    plugins: [
      // export a manifest file to be used by dev config
      new webpack.DllPlugin({
        path: path.join(__dirname, "public", "[name]-manifest.json"),
        name: "[name]_[hash]",
      }),
    ],
    // don't use the TS resolve configuration
    resolve: undefined,
  };
};
