const cloud = require('wx-server-sdk');
var req = require('request-promise');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取小程序二维码云函数入口函数
exports.main = async (event, context) => {
  options = {
    uri: 'https://kidwei.eu.org:5601/list',
    method:"GET",
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true 
  };
  return await req(options);
};
