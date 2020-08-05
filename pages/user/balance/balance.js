// pages/user/balance/balance.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: {
      title: '余额',
      value: 0.00,
      content: '￥ ---',
    },
    balanceVal: 0.00,
    balanceStr: ''
  },

  input: function(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    if (key == 'balance') {
      let re_int = /^\d{1,4}$/
      let re_float = /^\d{1,4}\.\d{1,2}$/
      if (value.match(re_int) || value.match(re_float)) {
        console.log('balance: 更新金额')
        console.log(parseFloat(value))
        this.setData({
          balanceVal: parseFloat(value),
          balanceStr: value
        })
      }
    } else {
      this.setData({
        balanceStr: value
      }) 
    }
  },

  withdraw: function (e) {
    let balanceStr = this.data.balanceStr
    let balanceVal = this.data.balanceVal
    let re_int = /^\d{1,4}$/
    let re_float = /^\d{1,4}\.\d{1,2}$/
    if (!(balanceStr.match(re_int) || balanceStr.match(re_float))) {
      console.log(balanceStr)
      console.log(balanceVal)
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none'
      })
      return
    } else if (balanceVal > this.data.balance.value) {
      wx.showToast({
        title: '超过最大提现金额',
        icon: 'none'
      })
      setTimeout(() => {
        wx.showModal({
          title: '提现',
          content: '是否提现全部金额',
          showCancel: true,
          success: res => {
            if (res.confirm) {
              wx.showToast({
                title: '提现功能还未上线，敬请期待吧~',
                icon: 'none'
              })
            }
          }
        })
      }, 2000)
    } else if (balanceVal <= 0) {
      wx.showToast({
        title: '请输入大于零的提现金额',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '提现功能还未上线，敬请期待吧~',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      balance: {
        title: '余额',
        value: app.globalData.userinfo.balance,
        content: '￥ ' + app.globalData.userinfo.balance.toFixed(2)
      }
    })
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