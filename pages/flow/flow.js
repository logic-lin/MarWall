// pages/flow/flow.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: [],
    order: ['默认', '价格', '时间', '热度', '点赞', '评论'],
    order_name: ['default', 'price', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length'],
    order_index: 0,
    loadMoreStatus: '(°ー°〃), 愣住',
    loadMoreTimes: 1,
    order_way: true
  },

  onPost: function (e) {
    let postid = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: '/pages/discover/square/details/details?postid=' + postid
    })
  },

  // 新增

  onOrder: function (e) {
    let index = e.currentTarget.dataset.index
    let old_index = this.data.order_index
    let order = this.data.order_name
    this.setData({
      order_index: index,
      post: {},
      loadMoreStatus: '(°ー°〃), 愣住',
      order_way: index == old_index ? !this.data.order_way : true
    }, () => {
      this.getPostData('any', '全部', false, order[this.data.order_index], this.data.order_way)
    })
  },

  onPullDownRefresh: function () {
    var order = this.data.order_name[this.data.order_index]
    this.setData({
      post:{}
    })
    this.getPostData('any', '全部', false, order, this.data.order_way)
  },

  onReachBottom: function () {
    let loadMoreTimes = this.data.loadMoreTimes
    let order = this.data.order_name[this.data.order_index]
    let order_way = this.data.order_way
    let last_order = this.data.last_order
    this.loadMoreData('any', '全部', false, loadMoreTimes, order, order_way, last_order)
  },

  getPostData: function (wall_name, label_name, exposure, order, order_way) {
    var that = this
    let last_order_name = null
    let last_order = null
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name:"getPostData",
      data:{
        wall_name: wall_name,
        label_name: label_name,
        exposure: exposure,
        order: order,
        order_way: order_way,
      },
      success: res => {
        // 排序后获取第一页数据成功
        console.log('flow: 排序后获取第一页数据成功')
        that.setData({
          post: res.result.data,
          loadMoreStatus: '上拉加载更多 _(:з」∠)_ '
        })
        wx.hideLoading()
        if (order == 'default' && exposure == true) {
          // 默认排序且需要排序曝光
          last_order_name = 'price'
        } else if (order == 'default') {
          // 默认排序
          last_order_name = 'postedtime'
        } else if (order == 'status.view.length' || order == 'status.like.length' || order == 'status.comment.length') {
          // 热度/点赞排序
          last_order_name = 'status' + order.substring(7, order.search(/.length/i))
        } else {
          // 其余类型排序
          last_order_name = order
        }
        that.setLastOrder([res.result.data, last_order_name])
      },
      fail: err => { 
        // 排序后获取第一页数据失败
        console.log('flow: 排序后获取第一页数据失败')
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title:'加载失败，请重试',
          icon: 'none'
        })
      }
    })
  },

  loadMoreData: function (wall_name, label_name, exposure, loadMoreTimes, order, order_way, last_order) {
    var that = this
    var last_order_name
    this.setData({
      loadMoreStatus:'加载中...'
    })
    wx.cloud.callFunction({
      name: "loadMoreData",
      data: {
        wall_name: wall_name,
        label_name: label_name,
        exposure: exposure,
        loadMoreTimes: loadMoreTimes,
        order: order,
        order_way: order_way, 
        last_order: last_order,
      },
      success: res => {
        // 加载更多成功
        console.log('flow: 加载更多成功')
        if(order =='default' && exposure == true) {
          last_order_name = 'price'
          that.setLastOrder([res.result.data, last_order_name])
        } else if (order == 'default') {
          last_order_name = 'postedtime'
          that.setLastOrder([res.result.data, last_order_name])
        } else if (order == 'status.view.length' || order == 'status.like.length' || order == 'status.comment.length') {
          last_order_name = order.substring(7, order.search(/.length/i))
          if (res.result.data.length != 0) {
            that.setData({
              last_order: res.result.data[res.result.data.length - 1]["status"][last_order_name]
            })
          } else {
            that.setData({
              loadMoreStatus: '下面没有了 (ÒωÓױ)'
            })
          }
        } else {
          last_order_name = order
          that.setLastOrder([res.result.data, last_order_name])
        }
        that.setData({
          post: that.data.post.concat(res.result.data)
          // loadMoreTimes: loadMoreTimes+1//暂时没用了
        })
      },
      fail: err => {
        // 加载更多失败
        console.log('flow: 加载更多失败')
        console.log(err)
        that.setData({
          loadMoreStatus: '加载失败，请重试'
        })
      }
    })
  },

  setLastOrder: function (e) {
    if(e[0].length != 0){
      this.setData({
        last_order: e[0][e[0].length - 1][e[1]],
      })
    } else {
      console.log('flow: 没有更多需要加载')
      this.setData({
        loadMoreStatus: '下面没有了 (ÒωÓױ)'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.loadeduserinfo) {
      wx.showToast({
        title: '加载用户信息失败，请重新启动',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/discover/discover',
        })
      }, 1500)
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.getPostData('any', '全部', false, 'default', true)
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})