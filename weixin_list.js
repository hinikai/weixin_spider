const AnyProxy = require('anyproxy');
const options = {
  port: 8001,
  rule: require('./weixin_list_rule'),
  webInterface: {
    enable: true,
    webPort: 8002
  },
  throttle: 10000,
  forceProxyHttps: true,
  wsIntercept: true, // 不开启websocket代理
  silent: true
};
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => {
    console.log('ready');
});
proxyServer.on('error', (e) => {
    console.log('erro');
});
proxyServer.start();

//when finished
proxyServer.close();
