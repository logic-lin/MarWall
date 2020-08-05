// components/post/post.js
const app = getApp()
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    post: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        var that = this
        var post = newVal
        this.setData({
          post: post,
          poster: {
            openid: null,
            avatar: null,
            nickname: '---'
          },
          postedtime: '---',
          price: ''
        }, () => {
          that.init()
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    post: {},
    poster: {
      openid: null,
      avatar: null,
      nickname: '---'
    },
    postedtime: '---',
    price: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setPrice: function () {
      let post = this.data.post
      let remarkType = ['QA', 'transaction', 'help', 'study']
      let price = null
      for (let type of remarkType) {
        if (post.type == type && post.price) {
          price = post.price.toFixed(2)
          break
        }
      }
      this.setData({
        price: price
      })
    },

    init: function () {
      var that = this
      // 设置价格和发布时间格式
      this.setPrice()
      this.setData({
        postedtime: util.formatTime(new Date(this.data.post.postedtime))
      })
      // 获取发布者信息
      wx.cloud.callFunction({
        name: 'getPosterBrief',
        data: {
          openid: that.data.post.postedby
        }
      }).then(res => {
        // 获取发布者信息成功
        console.log('post: 获取发布者信息成功')
        that.setData({
          poster: res.result.poster
        })
      }).catch(err => {
        // 获取发布者信息失败
        console.log('post: 获取发布者信息失败')
        console.log(err)
        wx.showToast({
          title: '获取发布者信息失败，请重试',
          icon: 'none'
        })
      })
    }
  },

  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    attached: function () {
      this.init()
    }
  }
})
