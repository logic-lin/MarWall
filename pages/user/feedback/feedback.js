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
    inputText: '',
    typeSelected: false
  },

  pickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      typeSelected: true
    })
  },

  input: function (e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  onUploadImage: function (e) {
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
  
  onDeleteImage: function (e) {
    let index = e.currentTarget.dataset.index
    this.data.tmpImgList.splice(index, 1)
    this.setData({
      tmpImgList: this.data.tmpImgList
    })
  },

  uploadFeedback: function (tempFilePaths, obj) {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    return new Promise((presolve, preject) => {
      if (tempFilePaths.length <= 1) {
        // 没有图片需要上传，直接上传反馈
        console.log('feedback: 没有图片需要上传')
        obj.image = []
        let promise = new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'uploadFeedback',
            data: {
              feedback: obj
            },
            success: res => {
              //  反馈上传函数调用成功
              console.log('feedback: 反馈上传函数调用成功')
              app.globalData.userinfo.status.feedback.push(res.result.feedbackid)
              resolve(res)
            },
            fail: err => {
              // 反馈上传函数调用失败
              console.log('feedback: 反馈上传函数调用失败')
              console.log(err)
              reject(err)
            }
          })
        })
        Promise.all([promise])
        .then((res) => {
          // 反馈上传完成
          console.log('feedback: 反馈上传完成')
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          })
          presolve(res)
        }).catch(err => {
          // 反馈上传失败
          console.log('release: 反馈上传失败')
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          })
          preject(err)
        })
        presolve([])
        return
      } else {
        // 有图片，先上传图片
        let uploads = []
        for (let i = 0; i < tempFilePaths.length - 1; i++) {
          uploads[i] = new Promise((resolve, reject) => {
            let img = tempFilePaths[i]
            let currentTime = new Date().getTime()
            let suffix = img.substr(img.lastIndexOf('.'))
            wx.cloud.uploadFile({
              cloudPath: 'picture/image/' + currentTime + app.globalData.userinfo.openid + i + suffix,
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
          // 图片上传完成，即将上传反馈
          console.log('feedback: 图片上传完成')
          obj.image = res
          let promise = new Promise((resolve, reject) => {
            wx.cloud.callFunction({
              name: 'uploadFeedback',
              data: {
                feedback: obj
              },
              success: res => {
                // 反馈上传函数调用成功
                console.log('feedback: 反馈上传函数调用成功')
                app.globalData.userinfo.status.feedback.push(res.result.feedbackid)
                resolve(res)
              },
              fail: err => {
                // 反馈上传函数调用失败
                console.log('feedback: 反馈上传函数调用失败')
                console.log(err)
                reject(err)
              }
            })
          })
          Promise.all([promise])
          .then((res) => {
            // 反馈上传完成
            console.log('feedback: 反馈上传完成')
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
            presolve(res)
          }).catch(err => {
            //  反馈上传失败
            console.log('feedback: 反馈上传失败')
            console.log(err)
            wx.hideLoading()
            wx.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            })
            preject(err)
          })
        }).catch(err => {
          // 图片上传失败
          console.log('feedback: 图片上传失败')
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          })
          preject(err)
        })
      }
    })
  },

  onSend: function () {
    var that = this
    let satisfy = that.data.typeSelected && that.data.inputText != ''
    if (!satisfy) {
      wx.showToast({
        title: '请完整填写所有必填项',
        icon: 'none',
      })
    } else {
      // 填写完毕，尝试上传图片或上传反馈
      this.uploadFeedback(this.data.tmpImgList, {
        type: that.data.typeRange[that.data.typeIndex],
        feedbackedby: app.globalData.userinfo.openid,
        content: that.data.inputText,
        done: false
      })
      .then(res => {
          // 上传反馈成功
        console.log('feedback: 上传成功')
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }).catch(err => {
        // 上传反馈失败
        console.log(err)
        console.log('feedback: 上传失败')
        wx.showToast({
          title: '上传失败，请重试',
          icon: 'none'
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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