const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  images: {
    domains: ['ui8-crypter-nft-html.herokuapp.com']
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=180'
          }
        ]
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=180'
          }
        ]
      }
    ];
  },
};

module.exports = withBundleAnalyzer({});
