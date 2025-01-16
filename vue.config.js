const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack(config) {
    config.plugin("monaco-editor").use(
      new MonacoWebpackPlugin({
        languages: ["java"],
        features: [
          "bracketMatching", // 保留基础括号匹配
          "folding", // 代码折叠
          "indentation", // 缩进辅助
        ],
      })
    );
  },
  devServer: {
    client: {
      overlay: false,
    },
  },
});
