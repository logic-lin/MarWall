// pages/square/square.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    post: {},
    label: [],
    order: [],
    order_name:[],
    last_order: 0,
    wall_index: '',
    title: '',
    wall_names: ['confession','QA','transaction','help','complaint','community'],
    label_index: 0,
    order_index: 0,
    order_way: true,
    type: null,
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
    let wall_name = String(this.data.type)
    let label_name = String(this.data.label[index])
    let exposure_remark = [0, 5]
    let is_exposure = false
    for (let i of exposure_remark) {
      if (this.data.wall_index == i) {
        is_exposure = true
        break
      }
    }
    this.getPostData(wall_name, label_name, is_exposure, 'default', true)
  },

  onOrder: function (e) {
    let index = e.currentTarget.dataset.index
    let old_index = this.data.order_index
    let wall_name = this.data.type
    let label_name = this.data.label[this.data.label_index]
    let order = this.data.order_name
    let exposure_remark = [0, 5]
    let is_exposure = false
    for (let i of exposure_remark) {
      if (this.data.wall_index == i) {
        is_exposure = true
        break
      }
    }
    this.setData({
      order_index: index,
      post: {},
      loadMoreStatus: '(°ー°〃), 愣住',
      order_way: index == old_index ? !this.data.order_way : true
    }, () => {
      this.getPostData(wall_name, label_name, is_exposure, order[this.data.order_index], this.data.order_way)
    })
  },

  onPullDownRefresh: function () {
    let wall_name = this.data.type
    let label_name = this.data.label[this.data.label_index]
    var order = this.data.order_name[this.data.order_index]
    let exposure_remark = [0, 5]
    let is_exposure = false
    for (let i of exposure_remark) {
      if (this.data.wall_index == i) {
        is_exposure = true
        break
      }
    }
    this.setData({
      post:{}
    })
    this.getPostData(wall_name, label_name, is_exposure, order, this.data.order_way)
  },

  onReachBottom: function () {
    let wall_name = this.data.type
    let label_name = this.data.label[this.data.label_index]
    let is_exposure = false
    let loadMoreTimes = this.data.loadMoreTimes
    let order = this.data.order_name[this.data.order_index]
    let order_way = this.data.order_way
    let last_order = this.data.last_order
    let exposure_remark = [0, 5]
    for (let i of exposure_remark) {
      if (i == this.data.wall_index) {
        is_exposure = true
        break
      }
    }
    this.loadMoreData(wall_name, label_name, is_exposure, loadMoreTimes, order, order_way, last_order)
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
        console.log('square: 排序后获取第一页数据成功')
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
        console.log('square: 排序后获取第一页数据失败')
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
        console.log('square: 加载更多成功')
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
        console.log('square: 加载更多失败')
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
      console.log('square: 没有更多需要加载')
      this.setData({
        loadMoreStatus: '下面没有了 (ÒωÓױ)'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = parseInt(options.index)
    let type = ''
    let title = ''
    let label = []
    let order = []
    let order_name = []
    let wall_index = index
    let exposure = false
    switch (index) {
      case 0:
        type = 'confession'
        title = '表白墙'
        label = ['全部', '高一', '高二', '高三', '班级', '社团', '团队']
        order = ['默认', '时间', '热度', '点赞', '评论']
        order_name = ['default', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
        exposure = true
        break
      case 1:
        type = 'QA'
        title = '问答墙'
        label = ['全部', '找组织', '寻资料']
        order = ['默认', '悬赏', '时间', '热度', '点赞', '评论']
        order_name = ['default', 'price', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
        exposure = false
        break
      case 2:
        type = 'transaction'
        title = '交易墙'
        label = ['全部', '学习类', '生活类', '租赁类', '代劳类']
        order = ['默认', '价格', '时间', '热度', '点赞', '评论']
        order_name = ['default', 'price', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
        exposure = false
        break
      case 3:
        type = 'help'
        title = '雷锋墙',
        label = ['全部', '寻物启事', '失物招领', '爱心募捐']
        order = ['默认', '悬赏', '时间', '热度', '点赞', '评论']
        order_name = ['default', 'price', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
        exposure = false
        break
      case 4:
        type = 'complaint'
        title = '吐槽墙'
        label = ['全部']
        order = ['默认', '时间', '热度', '点赞', '评论']
        order_name = ['default', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
        exposure = false
        break
      case 5:
        type = 'community'
        title = '社团墙'
        label = ['全部']
        order = ['默认', '时间', '热度', '点赞', '评论']
        order_name = ['default', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
        exposure = true
        break
      case 6:
        type = options.holetype
        title = app.globalData.ENG2CN[options.holetype]
        label = ['全部']
        if (options.holetype == 'study') {
          order = ['默认', '价格', '时间', '热度', '点赞', '评论']
          order_name = ['default', 'price', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
          exposure = false
        } else if (options.holetype == 'topic') {
          order = ['默认', '时间', '热度', '点赞', '评论']
          order_name = ['default', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
          exposure = true
        } else if (options.holetype == 'message') {
          order = ['默认', '时间', '热度', '点赞', '评论']
          order_name = ['default', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
          exposure = true
        } else if (options.holetype == 'activity') {
          order = ['默认', '时间', '热度', '点赞', '评论']
          order_name = ['default', 'postedtime', 'status.view.length', 'status.like.length', 'status.comment.length']
          exposure = true
        }
        break
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.getPostData(type, '全部', exposure, 'default', true)
    this.setData({
      wall_index: wall_index,
      type: type,
      title: title,
      label: label,
      order: order,
      order_name: order_name
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})