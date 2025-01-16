module.exports = {
  presets: [
    "@babel/preset-env",
    "@vue/cli-plugin-babel/preset",
    // 其他预设
  ],
  plugins: [
    "@babel/plugin-transform-class-static-block", // 添加这个插件
    // 其他插件
  ],
};
