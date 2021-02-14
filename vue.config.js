module.exports = {
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.txt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
      
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(args => {
        // stupid workaround to prevent vue loader from stripping &nbsp;
        args.compilerOptions.whitespace = 'preserve'
      }) 
  }
}