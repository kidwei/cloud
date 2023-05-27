const cloud = require('wx-server-sdk');
var req = require('request-promise');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取小程序二维码云函数入口函数
exports.main = async (event, context) => {
  var url = `http://43.156.93.30:5600/chat?input=${event.message}&format=json`
  options = {
    uri: encodeURI(url),
    method:"GET",
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true 
  };
  return await req(options);
};
