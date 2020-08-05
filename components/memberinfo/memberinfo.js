// components/flowpost/flowpost.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    memberinfo: {
      type: Object,
      value: {}
    },
    structure: {
      type: Array,
      value: []
    },
    memberindex: {
      type: Number,
      value: -1
    },
    _id: {
      type: String,
      value: ''
    },
    adminlist: {
      type: Array,
      value: []
    },
    sortKey:{
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    userinfo:[],
    list:[
      {key:'realname',title:'姓名'},
      {key:'gender',title:'性别'},
      {key:'campus',title:'学校'},
      {key:'grade',title:'年级'},
      {key:'tel',title:'手机号'},
      {key:'nickname',title:'昵称'},
      {key:'wxid',title:'微信号'},
      {key:'qq',title:'qq号'},
    ],
    more:false,
    timer:true,
    tmpadminlist:[],

  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    init: function (openid) {
      var that = this
      wx.cloud.callFunction({
        name: 'getMemberInfo',
        data: {
          openid: openid
        }
      }).then(res => {
        // 获取评论者信息成功
        console.log('member: 获取信息成功')
        this.properties.structure.unshift('普通成员')
        that.setData({
          userinfo: res.result.data[0],
          position:that.properties.memberinfo.position||'普通成员',
          jointime:that.properties.memberinfo.jointime,
          structure:that.properties.structure
        })

      }).catch(err => {
        console.log('member:获取信息失败')
        console.log(err)
        wx.showToast({
          title: '获取信息失败，请重试',
          icon: 'none'
        })
      })
    },
    getMore(){
      let that = this
      var animation_down  = wx.createAnimation({
        duration:300,
        timingFunction:'linear'
      })
      var animation_up  = wx.createAnimation({
        duration:100,
        timingFunction:'linear'
      })
      animation_down.height('500rpx').step()
      animation_up.height(0).step()
      
      if(this.data.timer){
        this.data.timer = false
        if(!this.data.more){
          this.setData({
            more:true
          })
          this.setData({
            animationData: animation_down.export()
          })
          setTimeout(() => {
            that.setData({
              timer:true
            })
          }, 300)
        }
        else{
          this.setData({
            animationData: animation_up.export()
          })
          setTimeout(() => {
            that.setData({
              timer:true,
              more:false
            })
          }, 100)
        }
          

      }
    },
    changePosition(e){
      let position = e.detail.value==0?null:this.properties.structure[e.detail.value]
      let openid = this.properties.memberinfo.openid
      let memberindex = this.properties.memberindex
      let _id = this.properties._id
      let adminlist = this.properties.adminlist
      let that = this
      wx.showLoading({
        title: '更改中',
        mask:true
      })
      
      console.log(position)
      wx.cloud.callFunction({
        name:'changePosition',
        data:{
          openid:openid,
          position:position,
          memberindex:memberindex,
          _id:_id,
        }
      }).then(res=>{
        console.log('changPosition:success',res)
        that.setData({
          position:position||'普通成员'
        })
        wx.hideLoading()
        wx.showToast({
          title: '更改成功',
          icon: 'none'
        })
      }).catch(err=>{
        console.log('changPosition:err',err)
        wx.hideLoading()
        wx.showToast({
          title: '更改失败',
          icon: 'none'
        })
      })
    },
    changeAdmin(){
      let that = this
      let adminlist = this.properties.adminlist
      let _id = this.properties._id
      let indexof = adminlist.indexOf(this.properties.memberinfo.openid)
      var flag = indexof==-1?1:0//1代表授予权限，0代表取消权限
      
      wx.showModal({
        title: '修改权限',
        content: '是否'+(flag?'授予':'删除')+that.data.userinfo.realname+'管理员权限',
        showCancel: true,
        success: res => {
          
          if (res.confirm) {
            wx.showLoading({
              title: '更改中',
              mask:true
            })
            if(flag)
              adminlist.push(this.properties.memberinfo.openid)
            else
              adminlist.splice(indexof,1);

            wx.cloud.callFunction({
              name:'changeCommunityAdmin',
              data:{
                adminlist:adminlist,
                _id:_id
              }
            }).then(res=>{
              console.log('changAdmin:success',res)
              that.setData({
                adminlist:adminlist
              })
              wx.hideLoading()
              wx.showToast({
                title: '更改成功',
                icon: 'none'
              })
            }).catch(err=>{
              console.log('changAdmin:err',err)
              wx.hideLoading()
              wx.showToast({
                title: '更改失败',
                icon: 'none'
              })
            })
        }
      }
      })
      }
  },

  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    attached: function () {
      
      this.init(this.properties.memberinfo.openid)
    }
  }
})
