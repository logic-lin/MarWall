// pages/user/feedback/feedback.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeRange: ['意见建议', 'BUG反馈'],
    typeIndex: null,
    tmpImgList: ['/icon/release/uploadImage.png'],
    community:{},
    nav:['成员列表','管理员'],
    selectNav:0,
    certificationForm:{
      president:null,
      // certificationimg:[],
      certificationtext:'',
      clubname:'',
      structure:'',
    }
  },

  pickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      typeSelected: true
    })
  },

  input: function (e) {
    this.setData({
      [`certificationForm.${e.currentTarget.dataset.key}`]: e.detail.value
    })
  },

  onChooseImage: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let length = that.data.tmpImgList.length
    if (index == length - 1 && length <= 9) {
      wx.chooseImage({
        count: 10 - length,
        sizeType: ['compressed'],
        success: function (res) {
          let tmpImgList = that.data.tmpImgList
          let uploadImageIconUrl = tmpImgList.pop()
          tmpImgList = tmpImgList.concat(res.tempFilePaths)
          tmpImgList.push(uploadImageIconUrl)
          that.setData({
            tmpImgList: tmpImgList
          })
        }
      })
    }
  },
  onDeleteImage: function (e){
    let index = e.currentTarget.dataset.index
    let imgList = this.data.tmpImgList
    imgList.splice(index,1)
    this.setData({
      tmpImgList:imgList
    })
  },
  uploadForm: function (tempFilePaths, obj){

    let that = this
    wx.showLoading({
      title: '提交中',
      mask:true
    })
    
    let uploads = []
    for (let i = 0; i < tempFilePaths.length - 1; i++) {
      uploads[i] = new Promise((resolve, reject) => {
        let img = tempFilePaths[i]
        let currentTime = new Date().getTime()
        let suffix = img.substr(img.lastIndexOf('.'))
        wx.cloud.uploadFile({
          cloudPath: 'picture/community/' + currentTime + app.globalData.userinfo.openid + i + suffix,
          filePath: img,
          success: res => {
            resolve(res.fileID)
          },
          fail: err => {
            reject(err.errMsg)
          }
        })
      })
    }


    Promise.all(uploads)
    .then(res => {
      // 图片上传完成，即将上传社团申请表单
      console.log('feedback: 图片上传完成')
      obj.certificationimg = res
      wx.cloud.database().collection('check').add({
        data:{
          type:'setCommunity',
          data:obj,
          pass:false,
          done:false
        }
      }).then(res=>{
        console.log(res)
        that.setData({
          certificationForm:{
              president:app.globalData.userinfo.openid,
              certificationtext:'',
              clubname:'',
              structure:''
          },
          tmpImgList: ['/icon/release/uploadImage.png']
        })
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon: 'none',
        })
      }).catch(err=>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '提交失败',
          icon: 'none',
        })
      })
    }).catch(err => {
      // 图片上传失败
      console.log('feedback: 图片上传失败')
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '上传图片失败，请重试',
        icon: 'none'
      })
      preject(err)
    })


    
  },
  onupload: function () {
    let form = this.data.certificationForm
    console.log(form)
    for(var i in form){
      if(!form[i]){
        wx.showToast({
          title: '请完整填写所有选项',
          icon: 'none',
        })
      return
      }
    }
    if(this.data.tmpImgList.length == 1){
      wx.showToast({
        title: '请选择证明身份的图片',
        icon: 'none',
      })
      return
    }

    // 填写完毕，尝试上传
    this.uploadForm(this.data.tmpImgList, this.data.certificationForm)
    
  },
  getCommunity: function (){
    let that = this
    wx.cloud.callFunction({
      name:'getCommunity',
      data:{
        openid:app.globalData.userinfo.openid
      }
    }).then(res=>{
       console.log(res)
      if(res.result.data.length)
        that.setData({
          community:res.result.data[0]
        })
      else
        wx.showToast({
          title: '您任何社团管理权限，可以自己申请创建社团或让社长授予权限',
          icon: 'none',
        })
    })
  },
  changeNav: function (e){
    this.setData({
      selectNav:e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.certificationForm.president = app.globalData.userinfo.openid
    this.getCommunity()
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