module.exports = {
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.txt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
    // according to https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader you don't need to write this second config.module and can go right to .rule()  
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(args => {
        // stupid workaround to prevent vue loader from stripping &nbsp;
        args.compilerOptions.whitespace = 'preserve'
      }) 
  }
}