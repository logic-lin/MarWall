// pages/hole/hole.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    experiments: [{
      name: '致习室',
      icon: '/icon/discover/study.png'
    }, {
      name: '话题街',
      icon: '/icon/discover/topic.png'
    }, {
      name: '留言巷',
      icon: '/icon/discover/message.png'
    }, {
      name: '活动站',
      icon: '/icon/discover/activity.png'
    }, {
      name: '砖瓦房',
      icon: '/icon/discover/propose.png'
    }]
  },

  onWall: function (e) {
    let index = e.currentTarget.dataset.index
    let holetype = ''
    switch (index) {
      case 0:
        holetype = 'study'
        break
      case 1:
        holetype = 'topic'
        break
      case 2:
        holetype = 'message'
        break
      case 3:
        holetype = 'activity'
        break
      case 4:
        holetype = 'propose'
        break
    }
    wx.navigateTo({
      url: '/pages/discover/square/square?index=6&holetype=' + holetype
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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