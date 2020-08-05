// pages/user/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav:[
      {title:'学生认证',child:['全部','已认证','待认证','未认证']},
      {title:'用户数据',child:['列表','搜索']},
      {title:'权限管理',child:['管理员','封禁列表']},
      {title:'帖子管理',child:['列表','搜索']},
      {title:'社团认证',child:['待认证','已认证']},
      {title:'用户反馈',child:['待处理','已处理']},
      {title:'举报处理',child:['待处理','已处理']}
    ],
    modifyItem:[
      {key:'realname',title:'姓名'},
      {key:'gender',title:'性别'},
      {key:'campus',title:'学校'},
      {key:'grade',title:'年级'},
      {key:'tel',title:'手机号'},
      {key:'nickname',title:'昵称'},
      {key:'wxid',title:'微信号'},
      {key:'qq',title:'qq号'},
    ],
    postItem:[
      {key:'title',title:'标题',placeholder:'请输入关键字'},
      {key:'content',title:'内容',placeholder:'请输入关键字'},
      {key:'price',title:'金额',placeholder:'格式如：1-10'},
      {key:'postedtime',title:'时间',placeholder:'格式如：2020.2.2-2020.12.25'},
      {key:'anonymous',title:'匿名',placeholder:'请输入是或否'}

    ],
    wallList:{
      confession:"表白墙", 
      QA:"问答墙", 
      transaction:"交易墙", 
      help:"雷锋墙", 
      complaint:"吐槽墙", 
      community:"社团墙", 
      study:"致习室", 
      topic:"话题街", 
      message:"留言巷", 
      activity:"活动站", 
      propose:"添砖瓦"
    },
    selectNav:{first:6,second:0},
    userinfo:[],
    postinfo:[],
    feedbackinfo:[],
    reportinfo:[],
    communityinfo:[],
    checkIndex:-1,
    reply:'',
    animationData:{},
    timer:true,
    searchValue:'',
    pickerIndex:0,
    limit:20,
    isEnd:false
    
  },
  changeNav(e){
    let kind = e.target.dataset.kind
    let index = parseInt(e.target.dataset.index)
 
    this.setData({
      [`selectNav.${kind}`]:index,
      userinfo:[],
      postinfo:[],
      feedbackinfo:[],
      reportinfo:[],
      communityinfo:[],
      isEnd:false,
      searchValue:null,
      checkIndex:-1
    })
    
    if(kind == 'first'){//点击一级导航
      this.setData({
        'selectNav.second':0,
      })

      switch(index){
        case 0 : this.getCertificationList();break;
        case 1 : this.getUserList();break;
        case 2 : this.getAdminList();break;
        case 3 : this.searchPost(true);break;
        case 4 : this.getCommunityList(false);break;
        case 5 : this.getFeedbackList(false);break;
        case 6 : this.getReportList(false);break;
      }
    }else{
      switch(this.data.selectNav.first){
        case 0:
          this.getCertificationList(index)
          break
        case 1:
          if(!index)
            this.getUserList()
          else
            this.setData({userinfo:[],pickerIndex:0})
          break
        case 2:
          if(!index)
            this.getAdminList()
          else
            this.getBanList()
          break
        case 3:
          if(!index)
            this.searchPost(true)
          else
            this.setData({postinfo:[],pickerIndex:0})
          break
        case 4:
          this.getCommunityList(index?true:false)
          break
        case 5:
          this.getFeedbackList(index?true:false)
          break
        case 6:
          this.getReportList(index?true:false)
          break
      }
    }  
  },
  getCertificationList(sortKey=0){
    console.log('cer')

    let that = this
    wx.showLoading({
      title: '获取列表中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'getCertificationList',
      data:{
        skip:that.data.userinfo.length,
        limit:that.data.limit,
        sortKey:sortKey
      }
    }).then(res=>{
      let tmp = res.result.data
      //1:已认证，2：待认证，3：未认证
      if(tmp.length){
        for(var i in tmp){
          tmp[i].status = tmp[i].certification?1:tmp[i].certificationimg?2:3
        }
        that.setData({
          userinfo:that.data.userinfo.concat(tmp)
        })
      }else{
        that.setData({
          isEnd:true
        })
     }
      wx.hideLoading()

    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  getUserList(){
    let that = this
    wx.showLoading({
      title: '获取列表中',
      mask:true
    })
    console.log(123)
    wx.cloud.callFunction({
      name:'getUserList',
      data:{
        skip:that.data.userinfo.length,
        limit:that.data.limit
      }
    }).then(res=>{
      if(res.result.data.length)
        that.setData({
          userinfo:that.data.userinfo.concat(res.result.data)
        })
      else
        that.setData({
          isEnd:true
        })
      console.log(that.data.userinfo)
      wx.hideLoading()
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  getAdminList(){
    let that = this
    wx.showLoading({
      title: '获取列表中',
      mask:true
    })

    wx.cloud.callFunction({
      name:'getRightList',
      data:{
        key:'admin'
      }
    }).then(res=>{
      that.setData({
        userinfo:res.result.data
      })
  
      wx.hideLoading()
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  getBanList(){
    let that = this
    wx.showLoading({
      title: '获取列表中',
      mask:true
    })

    wx.cloud.callFunction({
      name:'getRightList',
      data:{
        key:'ban'
      }
    }).then(res=>{
      that.setData({
        userinfo:res.result.data
      })
  
      wx.hideLoading()
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  getReportList(status){
    let that = this
    wx.showLoading({
      title: '获取列表中',
      mask:true
    })
  
    wx.cloud.callFunction({
      name:'getReportList',
      data:{
        status:status,
        skip:that.data.reportinfo.length,
        limit:that.data.limit
      }
    }).then(res=>{
      if(res.result.data.length)
        that.setData({
          reportinfo:that.data.reportinfo.concat(res.result.data)
        })
      else
        that.setData({
          isEnd:true
        })
  
      wx.hideLoading()
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  getFeedbackList(status){
    let that = this
    wx.showLoading({
      title: '获取列表中',
      mask:true
    })

    wx.cloud.callFunction({
      name:'getFeedbackList',
      data:{
        status:status,
        skip:that.data.feedbackinfo.length,
        limit:that.data.limit
      }
    }).then(res=>{
      console.log(res)
      if(res.result.data.length)
        that.setData({
          feedbackinfo:that.data.feedbackinfo.concat(res.result.data)
        })
      else
        that.setData({
          isEnd:true
        })
  
      wx.hideLoading()
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  getCommunityList(done){
    let that = this
    wx.showLoading({
      title: '获取列表中',
      mask:true
    })

    wx.cloud.callFunction({
      name:'getCommunityList',
      data:{
        done:done
      }
    }).then(res=>{
      console.log(res)
      that.setData({
        communityinfo:res.result.data
      })

      wx.hideLoading()
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  searchPost(allFlag=false){
    let that = this
    wx.showLoading({
      title: '获取列表中',
      mask:true
    })
    console.log(allFlag,that.data.searchValue,allFlag?'all':that.data.postItem[that.data.pickerIndex].key)
    wx.cloud.callFunction({
      name:'searchPost',
      data:{
        searchValue:that.data.searchValue,
        searchAttribute:allFlag?'all':that.data.postItem[that.data.pickerIndex].key,
        skip:that.data.postinfo.length,
        limit:that.data.limit
      }
    }).then(res=>{
      if(res.result.data.length)
        that.setData({
          postinfo:that.data.postinfo.concat(res.result.data)
        })
      else
        that.setData({
          isEnd:true
        })
      wx.hideLoading()

    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  getSearchList(){
    let that = this
    wx.showLoading({
      title: '搜索中',
      mask:true
    })
    
    wx.cloud.callFunction({
      name:'searchUserinfo',
      data:{
        searchValue:that.data.searchValue,
        searchAttribute:that.data.pickerIndex==-1?'openid':that.data.modifyItem[that.data.pickerIndex].key,
        skip:that.data.userinfo.length,
        limit:that.data.limit
      }
    }).then(res=>{
      console.log(res)
      if(res.result.data.length)
        that.setData({
          userinfo:that.data.userinfo.concat(res.result.data)
        })
      else
        that.setData({
          isEnd:true
        })
      wx.hideLoading()

    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  search(e){
    if(this.data.searchValue){
      if(e.currentTarget.dataset.kind == 'userinfo'){
      this.setData({
        userinfo:[]
      })
      this.getSearchList()
      }
      else{
        this.setData({
          userinfo:[]
        })
        this.searchPost()
      }
    }
      
  },
  changeAdmin(e){
    let index = e.currentTarget.dataset.index
    let that = this
    let organization = this.data.userinfo[index].organization
    console.log(organization)
    let indexof = organization.indexOf('admin')
    var flag = indexof==-1?1:0//1代表授予权限，0代表取消权限
    
    wx.showModal({
      title: '修改权限',
      content: '是否'+(flag?'授予':'删除')+that.data.userinfo[index].realname+'管理员权限',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          if(flag)
            organization.push('admin')
          else
            organization.splice(indexof,1);
          that.update(index)
      }
    }
    })
      
  },
  changeBan(e){
    let index = e.currentTarget.dataset.index
    let that = this
    let organization = this.data.userinfo[index].organization
    console.log(organization)
    let indexof = organization.indexOf('ban')
    var flag = indexof==-1?1:0//1代表封禁用户，0代表取消封禁
    wx.showModal({
      title: '封禁账号',
      content: '是否'+(flag?'封禁':'取消封禁')+that.data.userinfo[index].realname+'账号',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          if(flag)
            organization.push('ban')
          else
            organization.splice(indexof,1);
          that.update(index)
      }
    }
    })
  },
  changeInfo(e){
    let index = e.currentTarget.dataset.index
    let key = e.currentTarget.dataset.key
    this.setData({
      [`userinfo[${index}].${key}`]:e.detail.value
    })
  },
  changeSearch(e){
    this.setData({
      searchValue:e.detail.value
    })
  },
  changePicker(e){
    this.setData({
      pickerIndex:e.detail.value,
      searchValue:'',
    })
  },
  changeReply(e){
    console.log(e)
    this.setData({
      reply:e.detail.value
    })
  },
  update(index) {
    let that = this
    let data = this.data.userinfo[index]
    wx.showLoading({
      title: '保存中',
      mask: true
    })
    var tmpInfo={}
    for (var i in data)
      if(i!='_id')
        tmpInfo[i]=data[i]
    wx.cloud.callFunction({
      name: "updateInfo",
      data: {
        _id: data._id,
        tmpInfo: tmpInfo
      },
      success: res => {
        console.log('info: 上传个人信息成功')
        that.setData({
          [`userinfo[${index}]`] : data
        })
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
      },
      fail: err => {
        console.log('info: 上传个人信息失败')
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        })
      }
    })
  },
  updateText(e){
    let index = e.currentTarget.dataset.index
    this.update(index)
  },
  onPreviewImage(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },
  checkCertificationimg(e){
    let index = e.currentTarget.dataset.index
    let that =this
    let checkIndex = this.data.checkIndex
    let timer = this.data.timer
    if(timer){ 
      var animation_down  = wx.createAnimation({
        duration:200,
        timingFunction:'linear'
      })
      var animation_up  = wx.createAnimation({
        duration:100,
        timingFunction:'linear'
      })
      animation_down.height('500rpx').step()
      animation_up.height(0).step()
      this.data.timer = false
      if(checkIndex!=-1){
        this.setData({
          animationData: animation_up.export()
        })
        setTimeout(() => {
          if(index == checkIndex)
            this.setData({
              checkIndex:-1,
              timer:true
            })
          else{
            this.setData({
              checkIndex:index
            })
            this.setData({
              animationData: animation_down.export()
            })
            setTimeout(() => {
              that.data.timer = true
          }, 200)
          }
          
        }, 100)
      }
      else{
        this.setData({
          checkIndex:index
        })
        this.setData({
          animationData: animation_down.export()
        })
        setTimeout(() => {
            that.data.timer = true
        }, 200)
      }
    }
      
  },
  changeCertification(e){
    let that = this
    let key = e.currentTarget.dataset.key
    let index = e.currentTarget.dataset.index
    let _id = this.data.userinfo[index]._id
    let certification,certificationimg = this.data.userinfo[index].certificationimg
    switch(key){
      case '1':  certification = true//通过认证
                    break                 
      case '3':  certificationimg = null//认证失败
                    certification = false
                    break
      case '2':certification = false//取消认证
                    break
                                    
    }
    console.log('here')
    wx.showLoading({
      title: '修改中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'changeCertification',
      data:{
        _id:_id,
        certificationimg:certificationimg,
        certification:certification
      }
    }).then(res=>{
      that.setData({
        [`userinfo[${index}].certificationimg`]:certificationimg,
        [`userinfo[${index}].certification`]:certification,
        [`userinfo[${index}].status`]:key
      })
      wx.hideLoading()
      wx.showToast({
        title: '修改成功',
        icon: 'none'
      })
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '修改失败',
        icon: 'none'
      })
    })
  },
  uploadFeedbackReply(e){
    let index = e.currentTarget.dataset.index
    let that = this
    console.log(this.data.reply)
    if(this.data.reply){
      wx.showLoading({
      title: '保存中',
      mask: true
    })
    wx.cloud.callFunction({
      name: "uploadReply",
      data: {
        _id: that.data.feedbackinfo[index]._id,
        kind:'feedback',
        done:true,
        reply:{content:that.data.reply}
      },
      success: res => {
        if(!that.data.selectNav.second)
          that.data.feedbackinfo.splice(index,1)
        else
          that.data.feedbackinfo[index].reply = that.data.reply
        that.setData({
          reply: '',
          feedbackinfo:that.data.feedbackinfo,
          checkIndex:-1
        })
        wx.hideLoading()
        wx.showToast({
          title: '回复成功',
          icon: 'none'
        })
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '回复失败，请重试',
          icon: 'none'
        })
      }
    })
  }
  },
  uploadReportReply(e){
    let index = e.currentTarget.dataset.index
    let that = this
    
    if(this.data.reply){
      wx.showLoading({
      title: '保存中',
      mask: true
    })
    wx.cloud.callFunction({
      name: "uploadReply",
      data: {
        _id: that.data.reportinfo[index]._id,
        kind:'report',
        done:true,
        reply:{content:that.data.reply}
      },
      success: res => {
        if(!that.data.selectNav.second)
          that.data.reportinfo.splice(index,1)
        else
          that.data.reportinfo[index].reply = that.data.reply
        that.setData({
          reply: '',
          reportinfo:that.data.reportinfo,
          checkIndex:-1
        })
        wx.hideLoading()
        wx.showToast({
          title: '回复成功',
          icon: 'none'
        })
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '回复失败，请重试',
          icon: 'none'
        })
      }
    })
  }
  },
  jumpDeatil(e){
    let postid = this.data.postinfo[e.currentTarget.dataset.index].postid

    wx.navigateTo({
      url: '/pages/discover/square/details/details?postid=' + postid
    })
  },
  jumpUser(e){
    let openid = e.currentTarget.dataset.openid
    this.setData({
      isEnd:false,
      searchValue:openid,
      pickerIndex:-1,
      'selectNav.first':1,
      'selectNav.second':1,
      reportinfo:[],
      checkIndex:-1,    
    })
    this.getSearchList()
  },
  jumpReport(e){
    let index = e.currentTarget.dataset.index
    let report = this.data.reportinfo[index]
    
    let o_length = report.reportedby.length
    let t_length = report.reportedtime.toString().length
    var postid = report.reportobj
    
    if(report.type == 'comment'){
      postid=postid.slice(t_length,postid.length-o_length)
      wx.navigateTo({
        url: '/pages/discover/square/details/details?postid=' +postid+'&checkid='+report.reportobj
      })
    }
    else
      wx.navigateTo({
        url: '/pages/discover/square/details/details?postid=' +postid
      })
   
      
    
  },
  uploadCommunity(e){
    let index = e.currentTarget.dataset.index
    let that = this
    let pass = e.currentTarget.dataset.status == '0'?false:true
    let structure = this.data.communityinfo[index].data.structure
    this.data.communityinfo[index].data.structure = structure.replace(/\s*/g,"").split(',')
    wx.showLoading({
      title: '上传中',
      mask: true
    })

    wx.cloud.callFunction({
      name: "setCommunity",
      data: {
        _id: that.data.communityinfo[index]._id,
        pass:pass,
        data:that.data.communityinfo[index].data
      },
      success: res => {
        that.data.communityinfo.splice(index,1)
        that.setData({
          communityinfo:that.data.communityinfo,
          checkIndex:-1
        })
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
          icon: 'none'
        })
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '上传失败，请重试',
          icon: 'none'
        })
      }
    
    })
  },
  
  //触底刷新函数
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    // this.getCertificationList()
    this.getReportList(false)
  },

  onReachBottom: function () {
    if(!this.data.isEnd){
      if(this.data.selectNav.first == 0){
        this.getCertificationList(this.data.selectNav.second)
      }
      else if(this.data.selectNav.first==1){
        switch(this.data.selectNav.second){
          case 0 : this.getUserList();break;
          case 1 : this.getSearchList();break;
        }
      }
    }else{
      wx.showToast({
        title: '已无更多结果',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})