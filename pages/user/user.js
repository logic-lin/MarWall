const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    nickname: null,
    avatar: null,
    certification: false,
    isRegister: false,
    app: app,
    functions: [{
      name: '个人信息',
      icon: '/icon/user/info.png',
      url: "info/info"
    }, {
      name: '消息通知',
      icon: '/icon/user/inform.png',
      url: 'inform/inform'
    }, {
      name: '我的发布',
      icon: '/icon/user/send.png',
      url: 'send/send'
    }, {
      name: '意见反馈',
      icon: '/icon/user/feedback.png',
      url: "feedback/feedback"
    }],
    loaded: false
  },

  onFunc: function (e){
    let url = null
    if (!app.globalData.userinfo.register) {
      url = 'register/register'
    } else {
      url = this.data.functions[e.currentTarget.dataset.index]['url']
    }
    wx.navigateTo({
      url: url,
    })
  },

  init: function (e) {
    var that = this
    this.setData({
      nickname : app.globalData.userinfo.nickname,
      avatar: app.globalData.userinfo.avatar,
      certification: app.globalData.userinfo.certification,
      isRegister: app.globalData.userinfo.register
    }, () => {
      if (!this.data.isRegister) {
        wx.showModal({
          title: '注册',
          content: '是否前往注册',
          showCancel: true,
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: 'register/register',
              })
            }
          }
        })
      } else {
        that.setData({
          loaded: true
        })
      }
    })
  },

  checkAdmin: function () {
    if (app.globalData.userinfo.organization.indexOf('admin')!=-1)
      wx.navigateTo({
        url: 'admin/admin',
      })
  },

  load: function (timeout) {
    var that = this
    var recursive = () => {
      if (!app.globalData.loadeduserinfo) {
        setTimeout(recursive, 50)
      } else {
        that.init()
      }
    }
    recursive()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})