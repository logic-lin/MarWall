// components/flowpost/flowpost.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    post: {
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {
        var that = this
        this.setData({
          post: newVal
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
    typeimg: null,
    typename: null,
    price: null,
    colormaps: {}
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
      that.setPrice()
      that.setData({
        typeimg: '/icon/discover/' + that.properties.post.type + '.png',
        typename: app.globalData.ENG2CN[that.properties.post.type],
        colormaps: app.globalData.ENG2COLOR
      }, () => {
        that.setPrice()
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
