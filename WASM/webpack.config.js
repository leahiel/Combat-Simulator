const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: "./wasm.js",
    output: {
        path: path.resolve(__dirname, "../src/assets/wasm"),
        filename: "wasm.js",
        library: 'wasm',
    },
    plugins: [
        // new HtmlWebpackPlugin(), // We don't want the index.html
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, "."),
        }),
    ],
    mode: "development",  // "development" || "production"
};
