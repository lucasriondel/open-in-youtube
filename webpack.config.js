const CopyPlugin = require("copy-webpack-plugin");
const WebpackChromeExtensionBundle = require("./WebpackChromeExtensionBundle.js");

module.exports = {
  plugins: [
    new CopyPlugin([{ from: "src/manifest.json", to: "" }]),
    new WebpackChromeExtensionBundle()
  ]
};
