const util = require('utils/util.js')
App({
  onLaunch: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 云开发初始化
    wx.cloud.init({
      env: "marwall-ixou8"
    })
    // 检测是否注册并获取用户信息
    wx.cloud.callFunction({
      name: "getUserInfo"
    }).then(res => {
      console.log('app: 获取 userinfo 成功')
      let userinfoList = res.result.userinfoList
      if (userinfoList.length > 0) {
        that.globalData.userinfo = userinfoList[0]
        that.globalData.loadeduserinfo = true
        console.log('app: userinfo 存在该用户')
        wx.hideLoading()
      } else {
        console.log('app: userinfo 不存在该用户')
        that.globalData.userinfo.openid = res.result.openid
        that.globalData.loadeduserinfo = true
        wx.hideLoading()
        wx.showToast({
          title: '您还未注册，部分功能将无法使用',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(err => {
      console.log('app: 获取 userinfo 失败')
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '加载用户信息失败，请重新启动',
        icon: 'none'
      })
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        var px2rpx = 750 * res.windowWidth
        that.globalData.statusBarHeight = res.statusBarHeight * px2rpx
        that.globalData.screenHeight = res.screenHeight * px2rpx
        that.globalData.windowHeight = res.windowHeight * px2rpx
        that.globalData.navigationHeight = 44 * px2rpx
        that.globalData.tabbarHeight = that.globalData.screenHeight - that.globalData.statusBarHeight - that.globalData.navigationHeight - that.globalData.windowHeight
      },
    })
  },
  globalData: {
    userinfo: {
      openid: 'will_be_an_openid',
      avatar: null,
      nickname: null,
      realname: null,
      gender: null,
      tel: null,
      wxid: null,
      qq: null,
      campus: null,
      grade: null,
      balance: 0.00,
      register: false,
      certification: false,
      certificationimg: null,
      organization: [],
      status: {
        view: [],
        post: [],
        comment: [],
        report: [],
        feedback: [],
        like: {
          postlike: [],
          commentlike: []
        }
      }
    },
    loadeduserinfo: false,
    holetype: ['study', 'topic', 'message', 'activity', 'propose'],
    ENG2CN: {
      'confession': '表白墙',
      'QA': '问答墙',
      'transaction': '交易墙',
      'help': '雷锋墙',
      'complaint': '吐槽墙',
      'community': '社团墙',
      'study': '致习室',
      'topic': '话题街',
      'message': '留言巷',
      'activity': '活动站',
      'propose': '砖瓦房',
      'hole': '黑洞'
    },
    ENG2COLOR: {
      'confession': '#e64f80',
      'QA': '#4fb2e6',
      'transaction': '#e5e64f',
      'help': '#e6504f',
      'complaint': '#4fe650',
      'community': '#834fe6',
      'study': '#504fe6',
      'topic': '#ee6363',
      'message': '#eead0e',
      'activity': '#4fd8e6',
      'propose': '#8b8682'
    },
    ENG2LABEL: {
      'confession': ['高一', '高二', '高三', '班级', '社团', '团队'],
      'QA': ['找组织', '寻资料'],
      'transaction': ['学习类', '生活类', '租赁类', '代劳类'],
      'help': ['寻物启事', '失物招领', '爱心募捐'],
      'complaint': [],
      'community': [],
      'study': [],
      'topic': [],
      'message': [],
      'activity': [],
      'propose': [],
      'hole': []
    }
  }
})