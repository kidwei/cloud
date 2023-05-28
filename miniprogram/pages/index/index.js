// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    value:"",
    list:[],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onShareAppMessage({from,target}){
    console.log(from,target);
    let myObj = {
      title:`小小云端个人助手`,
      path:"/pages/index/index"
    }
    return myObj;
  },
  onLoad(options) {
    this.setData({
      envId: options.envId,
      list:getApp().list,
      value:""
    });
    getApp().id = getApp().list.length;

    wx.cloud.callFunction({
      name: 'minicloudFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getSoundList'
      }
    }).then((resp) => {
      thiz.sounds = JSON.parse(resp.result.response)
      thiz.sounds.sort(function(){
          return 0.5 - Math.random();
      })
    }).catch((e) => {
    });
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  sendMsg(e){
    var item_user = {
      content:e.detail.value,
      user:1,
      id:getApp().id,
      icon:"../images/wechat.png"
    }
    getApp().list.push(item_user);
    this.setData({
      list:getApp().list,
      value:""
    })
    getApp().id++;
    wx.showLoading({
      title: '发送中...',
    })
    var thiz = this
    wx.cloud.callFunction({
      name: 'minicloudFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getChatMessage',
        message:e.detail.value
      }
    }).then((resp) => {
      console.log(resp);
      console.log(resp.result.response);
      var item_remote = {
        content:resp.result.response,
        user:0,
        id:getApp().id,
        icon:"../images/chatgpt.png"
      }
      getApp().id++;
      getApp().list.push(item_remote)
      wx.hideLoading()
      thiz.setData({
        list:getApp().list
      })
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  },
  onLongPress(e){
    var thiz = this;
    wx.showActionSheet({
      itemList: ['复制文本', '播放语音'],
      success(res) {
        var id = parseInt(e.target.id.substring(4))
        var content = getApp().list[id].content;
        if (res.tapIndex == 0) {
          wx.setClipboardData({
            data: content,
            success(res) {
              wx.showToast({
                title: '复制成功',
                icon: 'success'
              })
            }
          });
        }
        else if (res.tapIndex == 1) {
          wx.showLoading({
            title: '生成语音中...',
          })
          console.log(content)
          var voice = '晓伊';
          if(thiz.sounds){
            voice = thiz.sounds[0]
          }
          var url = `https://kidwei.eu.org:5601/tts?text=${content}&voice=${voice}`
          let innerAudioContext = wx.createInnerAudioContext();
          // 解决IOS无法播放音频问题
          var music = wx.setInnerAudioOption({
            obeyMuteSwitch: false,
            success: function (res) {
            console.log("开启静音模式下播放音乐的功能");
            },
            fail: function (err) {
            console.log("静音设置失败");
            },
          });
          thiz.setData({
            innerAudioContext: innerAudioContext
          });
          innerAudioContext.src = encodeURI(url);
          innerAudioContext.play();
          innerAudioContext.onError((e) => {
            console.log(e);
            wx.hideLoading();
          });
          innerAudioContext.onPlay(() => {
            wx.hideLoading();
          });

          // var thiz = this
          // wx.cloud.callFunction({
          //   name: 'minicloudFunctions',
          //   config: {
          //     env: this.data.envId
          //   },
          //   data: {
          //     type: 'playTextSound',
          //     message:content,
          //     type: '晓伊'
          //   }
          // }).then((resp) => {
          //   wx.hideLoading()
          //   thiz.setData({
          //     imageUrl:resp.result.response
          //   })
          // }).catch((e) => {
          //   console.log(e);
          //   wx.hideLoading();
          // });
        }
      }
    });
  }
})
