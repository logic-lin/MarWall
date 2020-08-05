// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [{
      header: '个人信息',
      detail: [{
        title: '昵称',
        key: 'nickname',
        range: null
      }, {
        title: '姓名',
        key: 'realname',
        range: null
      }, {
        title: '性别',
        key: 'gender',
        range: ['男', '女']
      }, {
        title: '学校',
        key: 'campus',
        range: null
      }, {
        title: '年级',
        key: 'grade',
        range: ['高一', '高二', '高三', '校友']
      }]
    }, {
      header: '联系方式',
      detail: [{
        title: '微信号',
        key: 'wxid',
        range: null
      }, {
        title: 'QQ号',
        key: 'qq',
        range: null
      }, {
        title: '手机号码',
        key: 'tel',
        range: null
      }, {
        title: '验证码',
        key: 'code',
        range: null
      }]
    }],
    modifyIndex: -1,
    tmpInfo: {
      nickname: null,
      realname: null,
      gender: null,
      tel: null,
      wxid: null,
      qq: null,
      campus: null,
      grade: null,
      certificationimg: null,
    },
    userinfo: {},
    code: null,
    timer: '获取',
    balance: ''
  },

  onBalance: function (e) {
    wx.navigateTo({
      url: '/pages/user/balance/balance',
    })
  },

  onChooseImage: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: res => {
        let avatar = res.tempFilePaths[0]
        let suffix = avatar.substr(avatar.lastIndexOf('.'))
        wx.showLoading({
          title: '上传中',
          mask: true
        })
        wx.cloud.uploadFile({
          cloudPath: 'picture/avatar/' + app.globalData.userinfo.openid + suffix,
          filePath: avatar
        }).then(res => {
          console.log('info: 上传头像至云存储成功')
          app.globalData.userinfo.avatar = res.fileID
          that.setData({
            ['userinfo.avatar']: res.fileID
          })
          wx.cloud.callFunction({
            name: 'updateAvatar',
            data: {
              avatar: res.fileID
            }
          }).then(res => {
            console.log('info: 更新头像成功')
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
          }).catch(err => {
            console.log('info: 更新头像失败')
            console.log(err)
            wx.hideLoading()
            wx.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            })
          })
        }).catch(err => {
          console.log('info: 上传头像至云存储失败')
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          })
        })
      }
    })
  },

  modify: function (e) {
    var index = e.currentTarget.dataset['index']
    if (this.data.modifyIndex != index) {
      this.reset()
      this.setData({
        modifyIndex: index
      })
    } else {
      this.reset()
    }
  },

  infoChange: function (e) {
    let value = e.detail.value
    var key = e.target.dataset.key
    if (key == 'gender' || key == 'grade') {
      var detailIndex = e.target.dataset.detailindex
      var itemIndex = e.target.dataset.itemindex
      value = this.data.item[itemIndex].detail[detailIndex]['range'][value]
      key = `tmpInfo.${key}`
    } else if (key == 'code') {
      key = `code`
    } else {
      key = `tmpInfo.${key}`
    }
    this.setData({
      [key]: value
    })
    console.log(this.data.tmpInfo)
  },

  save: function () {
    let tmpInfo = this.data.tmpInfo
    for(let i in tmpInfo) {
      if (!tmpInfo[i] && i != 'certificationimg'){
        wx.showToast({
          title: '不能存在空值',
          icon: 'none'
        });
        return
      }
    }
    if(tmpInfo.tel != this.data.userinfo.tel)
      this.validateCode() //  检验验证码并上传数据
    else
      this.update() //  无手机号修改直接上传数据
  },

  update: function () {
    let that = this
    wx.showLoading({
      title: '保存中',
      mask: true
    })
    wx.cloud.callFunction({
      name: "updateInfo",
      data: {
        tmpInfo: that.data.tmpInfo,
        _id: that.data.userinfo._id
      },
      success: res => {
        console.log('info: 上传个人信息成功')
        that.reset(false)
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

  reset: function (flag=true) {
    let tmpInfo = this.data.tmpInfo
    if (flag) {
      for (var i in tmpInfo)
        tmpInfo[i] = this.data.userinfo[i]
    } else {
      for (var i in tmpInfo)
        this.data.userinfo[i] = tmpInfo[i]
    }
    this.setData({
      userinfo: this.data.userinfo,
      tmpInfo: tmpInfo,
      modifyIndex: -1
    })
  },

  chooseCertify: function () {
    let that = this
    if (!this.data.tmpInfo.certificationimg&&!this.data.userinfo.certification){
      this.setData({
        modifyIndex: 2
      })
      wx.chooseImage({
        count: 1,
        success: function (res) {
          that.setData({
            'tmpInfo.certificationimg': res.tempFilePaths[0]
          })
        },
      })
    }
  },

  cancelCertify: function () {
    this.setData({
      'tmpInfo.certificationimg': null
    })
  },

  updateImg: function () {
    let that = this
    var tmp = this.data.tmpInfo.certificationimg
    wx.showLoading({
      title: '保存中',
      mask: true
    })
    // 上传图片
    if (tmp && tmp != this.data.userinfo.certificationimg){
      //有更换或添加照片情况
      wx.cloud.uploadFile({
        cloudPath: 'certificationimg/' + that.data.userinfo.openid + new Date().getTime()+ tmp.substr(tmp.lastIndexOf('.')),
        filePath: tmp,
        success: res => {
          that.setData({
            'tmpInfo.certificationimg': res.fileID
          });
          //删除原图片
          if (this.data.userinfo.certificationimg)
            wx.cloud.deleteFile({
              fileList: [that.data.userinfo.certificationimg],
              success: res => {
                wx.showToast({
                  title: '照片删除成功',
                  icon: 'none'
                });
              },
              fail: err => {
                console.log(err)
              }
            })
          //上传文本信息
          that.update()
          wx.hideLoading()
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            title: '保存图片失败',
            icon: 'none',
            duration: 2000
          });
          console.log(err)
        }

      })
    }
    else {//无照片或删除图片情况
      if (this.data.userinfo.certificationimg && tmp != this.data.userinfo.certificationimg)
        wx.cloud.deleteFile({
          fileList: [that.data.userinfo.certificationimg],
          success: res => {
            console.log("删除照片成功")
          },
          fail: err => {
            console.log(err)
          }
        })
        that.update()
        wx.hideLoading()
    } 

    //上传文本信息


  },

  sendCode: function (phone) {
    wx.cloud.callFunction({
      name: 'zhenzisms',
      data: {
        $url: 'sendCode',
        apiUrl: 'https://sms_developer.zhenzikj.com',
        message: '您的验证码为:{code}（3分钟内有效）',
        number: phone,
        seconds: 180,
        length: 6
      }
    }).then(res => {
      wx.showToast({
        title: res.result.msg,
        icon: 'none'
      });
    }).catch(err => {
      console.log(err);
    });
  },

  validateCode: function () {
    var that = this
    if (!this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      });
      return
    } else {
      wx.cloud.callFunction({
        name: 'zhenzisms',
        data: {
          $url: 'validateCode',
          apiUrl: 'https://sms_developer.zhenzikj.com',
          number: that.data.tmpInfo.tel,
          code: that.data.code
        }
      }).then(res => {
        console.log('info: zhenzisms 调用成功')
        if (res.result.code == 'success') {
          that.update()
        } else {
          wx.showToast({
            title: res.result.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(err => {
        console.log('info: zhenzisms 调用失败')
        console.log(err);
      })
    }
  },

  getCode: function () {
    if (!this.data.tmpInfo.tel || this.data.tmpInfo.tel.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      });
      return
    }
    if (this.data.timer == '获取') {
      this.sendCode(this.data.tmpInfo.tel)
      this.data.timer = 60
      let that = this
      var interval = setInterval(() => {
        if (that.data.timer == 1) {
          that.setData({
            timer: '获取'
          })
          clearInterval(interval)
        } else
          that.setData({
            timer: that.data.timer - 1
          })
      }, 1000)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo: app.globalData.userinfo,
      balance: app.globalData.userinfo.balance.toFixed(2)
    }, () => {
      this.reset()
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