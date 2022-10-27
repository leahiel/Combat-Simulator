const path = require("path");

module.exports = {
  // mode: "development",
  // devtool: "eval-source-map",
  mode: "production",
  entry: {
    itch_oauth: "./src/itch_oauth.js",
    game_ssr: "./src/game_ssr.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public_html"),
    library: 'db',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
};
