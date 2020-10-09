/* config-overrides.js */
const path = require("path");
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addWebpackPlugin,
  setWebpackPublicPath,
  overrideDevServer,
} = require("customize-cra");
const copyWebpackPlugin = require("copy-webpack-plugin");

const SRC = path.resolve(__dirname, "src");

const addProxy = () => (config) => ({
  ...config,
  proxy: {
    "/case_files": {
      target: "https://mi.mediclouds.cn",
      secure: true,
      changeOrigin: true,
    },
  },
});

module.exports = {
  webpack: override(
    setWebpackPublicPath(process.env.NODE_ENV === "production" ? "/web" : "/"),
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: "css",
    }),
    addLessLoader({
      lessOptions: {
        javascriptEnable: true,
        // modifyVars: { "@primary-color": "#7398FF" }, // 不注释掉不能修改主题色
      },
    }),
    addWebpackPlugin(
      new copyWebpackPlugin({
        patterns: [{ from: "src/assets/styles/qrcode.css", to: "static/css/[name].[ext]" }],
      }),
    ),
    addWebpackAlias({
      ["_components"]: path.join(SRC, "components"),
      ["_pages"]: path.join(SRC, "pages"),
      ["_constants"]: path.join(SRC, "constants"),
      ["_layout"]: path.join(SRC, "Layout"),
      ["_images"]: path.join(SRC, "assets", "images"),
      ["_actions"]: path.join(SRC, "store", "actions"),
      ["_helper"]: path.join(SRC, "helper", "index.ts"),
      ["_axios"]: path.join(SRC, "api", "index.ts"),
      ["_api"]: path.join(SRC, "api"),
      ["_store"]: path.join(SRC, "store"),
      ["_assets"]: path.join(SRC, "assets"),
      ["_types"]: path.join(SRC, "types"),
      ["_config"]: path.join(SRC, "config.ts"),
      ["_hooks"]: path.join(SRC, "hooks"),
    }),
  ),
  // devServer: overrideDevServer(addProxy()),
};
