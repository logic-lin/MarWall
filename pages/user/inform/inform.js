// import {
//   fail
// } from "assert"

// pages/square/square.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    userinfoData: [],
    applicantName: [],
    post: [],
    label: [],
    order: [],
    label_index: 0,
    order_index: 0,
    type: null
  },

  convert: function (e) { //组件返回参数触发
    console.log(e.detail) //e.detail._id、e.detail.index
    wx.cloud.callFunction({
      name: 'updateUserinfo',
      data: {
        index: e.detail.index, //0是拒绝，1是接受
        _id: e.detail._id,
        type: e.detail.type,
        clubname: e.detail.clubname,
        applicant: e.detail.applicant,
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log("wrong")
        console.log(res)
      }
    })
  },

  cmp: function (k) {
    if (k === 'postedtime') {
      return function (x, y) {
        let x_postedtime = x.postedtime
        let y_postedtime = y.postedtime
        if (x_postedtime < y_postedtime)
          return 1
        else if (x_postedtime > y_postedtime)
          return -1
        else
          return 0
      }
    } else if (k === 'hot') {
      return function (x, y) {
        let x_hot = x.status.hot
        let y_hot = y.status.hot
        if (x_hot < y_hot)
          return 1
        else if (x_hot > y_hot)
          return -1
        else
          return 0
      }
    } else if (k === 'like') {
      return function (x, y) {
        let x_like = x.status.like
        let y_like = y.status.like
        if (x_like < y_like)
          return 1
        else if (x_like > y_like)
          return -1
        else
          return 0
      }
    } else if (k === 'comment') {
      return function (x, y) {
        let x_comment = x.status.comments.length
        let y_comment = y.status.comments.length
        if (x_comment < y_comment)
          return 1
        else if (x_comment > y_comment)
          return -1
        else
          return 0
      }
    } else if (k === 'price') {
      return function (x, y) {
        let x_price = x.price
        let y_price = y.price
        if (x_price < y_price)
          return 1
        else if (x_price > y_price)
          return -1
        else
          return 0
      }
    }
  },

  onLabel: function (e) {
    let index = e.currentTarget.dataset.index
    console.log("label_index:"+index)
    this.setData({
      userinfoData: {}
    })
    if (index==0) {
      this.setData({
        label_index: index,
        order: ['收到', '发出'],
        order_index: 0
      })
    } else if(index==1){
      this.setData({
        label_index: index,
        order:['反馈', '举报'], 
        order_index: 0
      })
    }
    this.getUserInfoData()


  },

  onOrder: function (e) {
    let index_raw = e.currentTarget.dataset.index
    let order = this.data.order
    let index = index_raw < 0 ? this.data.order_index : index_raw
    if (index_raw < 0 || index != this.data.order_index) {
      if (index_raw >= 0) {
        this.setData({
          order_index: index
        })
      }
    } else {
      post.reverse()
    }
    //上面是cv过来的
    console.log("orderindex"+ this.data.order_index)
    this.setData({
      userinfoData: {}
    })
    this.getUserInfoData()

  },

  /*获取数据库 */
  getUserInfoData() {
    let that = this
    wx.cloud.callFunction({
      name: 'getUserInfoData',
      data: {
        // reviewer: 
        openid: app.globalData.userinfo.openid, //这里要写上面那条，这里直接用是为了测试
        label_index: that.data.label_index,
        order_index: that.data.order_index
      },
      success(res) {
        console.log(res)
        that.setData({
          userinfoData: res.result.data
        })
        console.log(that.data.userinfoData)
      },
      fail(res) {
        console.log("wrong")
        console.log(res)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = 0
    if (!(options.index === undefined))
      index = parseInt(options.index)

    let type = ''
    let title = '我的消息'
    let label = ['我的请求', '反馈和举报']
    let order = ['收到', '发出']

    wx.setNavigationBarTitle({
      title: title
    })
    this.getUserInfoData()

    this.setData({
      // post: post,
      type: type,
      title: title,
      label: label,
      order: order
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})