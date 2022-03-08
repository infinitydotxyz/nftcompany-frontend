module.exports = {
  plugins: {
    tailwindcss: { config: "./src/settings/theme/tailwind/index.js" },
    "postcss-preset-env": {
      autoprefixer: {
        flexbox: "no-2009"
      },
      stage: 3,
      features: {
        "custom-properties": false
      }
    }
  }
}
