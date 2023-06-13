const { createProxyMiddleware } = require('http-proxy-middleware');

const QB_API = process.env.QB_API || 'http://192.168.124.7:8080';
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: QB_API,
      changeOrigin: true,
    })
  );
};
