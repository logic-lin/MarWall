// pages/discover/discover.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPopUp: false,
    app: app,
    wall: [{
      name: '表白墙',
      icon: '/icon/discover/confession.png'
    }, {
      name: '问答墙',
      icon: '/icon/discover/QA.png'
    }, {
      name: '交易墙',
      icon: '/icon/discover/transaction.png'
    }, {
      name: '雷锋墙',
      icon: '/icon/discover/help.png'
    }, {
      name: '吐槽墙',
      icon: '/icon/discover/complaint.png'
    }, {
      name: '社团墙',
      icon: '/icon/discover/community.png'
    }, {
      name: '黑洞',
      icon: '/icon/discover/hole.png'
    }],
    inform: ['开发版在路上辽！', '米娜桑，静侯佳音~'],
    sleepy: false
  },

  popUp: function () {
    if (!app.globalData.loadeduserinfo) {
      wx.showToast({
        title: '加载用户信息失败，请重新启动',
        icon: 'none'
      })
    } else {
      this.setData({
        isPopUp: this.data.isPopUp ? false : true
      })
    }
  },

  onWall: function (e) {
    if (!app.globalData.loadeduserinfo) {
      wx.showToast({
        title: '加载用户信息失败，请重新启动',
        icon: 'none'
      })
    } else {
      let index = e.currentTarget.dataset.index
      if (index < 6) {
        wx.navigateTo({
          url: '/pages/discover/square/square?index=' + index
        })
      } else {
        wx.navigateTo({
          url: '/pages/hole/hole'
        })
      }
    }
  },

  onExpression: function (e) {
    let that = this
    that.setData({
      sleepy: false
    })
    setTimeout(() => {
      that.setData({
        sleepy: true
      })
    }, 5000)
  },

  intoRelease: function (e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/discover/release/release?index=' + index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    setTimeout(() => {
      that.setData({
        sleepy: true
      })
    }, 5000)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this
    setTimeout(function(){
      that.setData({
        isPopUp: false
      }, 500)
    })
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