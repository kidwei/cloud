// pages/genpic/genpic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  sendMsg(e){
    this.setData({
      imageUrl:"",
      value:""
    })
    wx.showLoading({
      title: '生成图片中...',
    })
    console.log(e.detail.value);
    var thiz = this
    // wx.request({
    //   url: url,
    //   success(res) {
    //     console.log(res.data.response);
    //     wx.hideLoading()
    //     thiz.setData({
    //       imageUrl:res.data.response
    //     })
    //   }
    // })
    wx.cloud.callFunction({
      name: 'minicloudFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getChatImage',
        message:e.detail.value
      }
    }).then((resp) => {
      wx.hideLoading()
      thiz.setData({
        imageUrl:resp.result.response
      })
    }).catch((e) => {
      console.log(e);
      wx.hideLoading();
    });
  }
})