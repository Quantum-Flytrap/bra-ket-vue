module.exports = {
  chainWebpack: (config) => {
    // make sure babel-loader is not confused when using "yarn link"
    config.resolve.symlinks(false);
  },
};
