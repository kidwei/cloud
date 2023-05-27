const getSoundList = require('./getSoundList/index');
const getChatMessage = require('./getChatMessage/index');
const getChatImage = require('./getChatImage/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getSoundList':
      return await getSoundList.main(event, context);
    case 'getChatMessage':
      return await getChatMessage.main(event, context);
    case 'getChatImage':
      return await getChatImage.main(event, context);
  }
};
