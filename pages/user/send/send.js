// pages/square/square.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    post: {},
    label: ['全部', '表白', '问答', '交易', '雷锋', '吐槽', '社团', '黑洞'],
    label_name: ['any', 'confession', 'QA', 'transaction', 'help', 'complaint', 'community', 'hole'],
    last_order: 0,
    label_index: 0,
    order_way: true,
    loadMoreTimes: 1,
    loadMoreStatus: '(°ー°〃), 愣住',
  },

  onPost: function (e) {
    let postid = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: '/pages/discover/square/details/details?postid=' + postid
    })
  },

  onLabel: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      label_index: index,
      order_index: 0,
      post: {},
      loadMoreStatus: '(°ー°〃), 愣住'
    })
    let label_name = this.data.label_name[index]
    this.getPostData('mine', label_name, false, 'default', true)
  },

  onPullDownRefresh: function () {
    let label_name = this.data.label_name[this.data.label_index]
    this.setData({
      post:{}
    })
    this.getPostData('mine', label_name, false, 'postedtime', this.data.order_way)
  },

  onReachBottom: function () {
    let label_name = this.data.label[this.data.label_index]
    let loadMoreTimes = this.data.loadMoreTimes
    let order_way = this.data.order_way
    let last_order = this.data.last_order
    this.loadMoreData('mine', label_name, false, loadMoreTimes, 'postedtime', order_way, last_order)
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
        console.log('send: 排序后获取第一页数据成功')
        that.setData({
          post: res.result.data,
          loadMoreStatus: '上拉加载更多 _(:з」∠)_ '
        })
        wx.hideLoading()
        last_order_name = 'postedtime'
        that.setLastOrder([res.result.data, last_order_name])
      },
      fail: err => { 
        // 排序后获取第一页数据失败
        console.log('send: 排序后获取第一页数据失败')
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
        last_order_name = 'postedtime'
        that.setLastOrder([res.result.data, last_order_name])
        that.setData({
          post: that.data.post.concat(res.result.data)
          // loadMoreTimes: loadMoreTimes+1//暂时没用了
        })
      },
      fail: err => {
        // 加载更多失败
        console.log('send: 加载更多失败')
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
      console.log('send: 没有更多需要加载')
      this.setData({
        loadMoreStatus: '下面没有了 (ÒωÓױ)'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的发布'
    })
    this.getPostData('mine', 'any', false, 'default', true)
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