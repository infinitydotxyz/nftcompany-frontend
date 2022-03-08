const constants = require("next/constants")

module.exports = (phase, options) => {
  /*
    ======================================
      Here you can return different config
      files based on different phases of
      next.js build process. And you can
      add plugins to include additional features.
    ======================================
  */

  return {
    ...options.defaultConfig,
    webpack5: true,
    webpack: (config, options) => {
      /*
        ======================================
          This piece of config adds YAML loader
          to the webpack config of next.js.
        ======================================
      */
      config.module.rules.push({
        test: /\.ya?ml$/,
        use: "js-yaml-loader"
      })

      /*
        ======================================
          This is done so that we can add
          audio files in our Next.js project.
        ======================================
      */
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        exclude: config.exclude,
        use: [
          {
            loader: require.resolve("url-loader"),
            options: {
              limit: config.inlineImageLimit,
              fallback: require.resolve("file-loader"),
              publicPath: `${config.assetPrefix}/_next/static/images/`,
              outputPath: `${options?.isServer ? "../" : ""}static/images/`,
              name: "[name]-[hash].[ext]",
              esModule: config.esModule || false
            }
          }
        ]
      })

      return config
    }
  }
}
