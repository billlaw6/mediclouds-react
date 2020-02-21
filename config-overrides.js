/* config-overrides.js */
const path = require("path");
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addWebpackPlugin,
} = require("customize-cra");
const copyWebpackPlugin = require("copy-webpack-plugin");

const SRC = path.resolve(__dirname, "src");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css",
  }),
  addLessLoader({
    javascriptEnable: true,
    // modifyVars: { "@primary-color": "#7398FF" }, // 不注释掉不能修改主题色
  }),
  addWebpackPlugin(
    new copyWebpackPlugin([
      { from: "src/assets/styles/qrcode.css", to: "static/css/[name].[ext]" },
    ]),
  ),
  addWebpackAlias({
    ["_components"]: path.join(SRC, "components"),
    ["_pages"]: path.join(SRC, "pages"),
    ["_constants"]: path.join(SRC, "constants"),
    ["_layout"]: path.join(SRC, "Layout"),
    ["_images"]: path.join(SRC, "assets", "images"),
    ["_actions"]: path.join(SRC, "store", "actions"),
    ["_helper"]: path.join(SRC, "helper", "index.ts"),
    ["_services"]: path.join(SRC, "services"),
    ["_store"]: path.join(SRC, "store"),
  }),
);
