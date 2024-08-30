const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/ngi-cs/',
    createProxyMiddleware({
      target: 'https://ngi.cs.co.il/',
      changeOrigin: true,
      pathRewrite: {
        '^/ngi-cs/': '',
      },
    })
  );
};
