// pages/register/register.js
const app = getApp()
Page({
  data: {
    regItem: [{
        title: '昵称',
        key: 'nickname',
        holder: "点击头像获取昵称",
        kind: 0
      }, {
        title: '姓名',
        key: 'realname',
        holder: "请输入真实姓名",
        kind: 0
      }, {
        title: '性别',
        key: 'gender',
        holder: "请选择性别",
        kind: 1,
      }, {
        title: '微信号',
        key: 'wxid',
        holder: "请输入微信号",
        kind: 0
      }, {
        title: 'QQ号',
        key: 'qq',
        holder: "请输入QQ号",
        kind: 0
      }, {
        title: '学校',
        key: 'campus',
        holder: "请输入所在学校",
        kind: 0
      }, {
        title: '年级',
        key: 'grade',
        holder: "请选择所处年级",
        kind: 1,
      }, {
        title: '手机号',
        key: 'tel',
        holder: "请输入手机号",
        kind: 0
      }, {
        title: '验证码',
        key: 'code',
        holder: "请输入验证码",
        kind: 0
      }],
    picker: {
      gender: ['男', '女'],
      grade: ['高一', '高二', '高三', '校友']
    },
    code: "",
    timer: '点击获取',
    userinfo: {},
    certificationimguploaded: false
  },

  onGotUserInfo: function(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo)
      this.setData({
        'userinfo.avatar': e.detail.userInfo.avatarUrl,
        'userinfo.nickname': e.detail.userInfo.nickName,
        'userinfo.gender': e.detail.userInfo.gender == 1 ? '男' : '女'
      })
    console.log(this.data.userinfo)
  },

  pickerChange: function (e) {
    var key = e.currentTarget.dataset.key
    var value = this.data.picker[key][e.detail.value]
    const tmp = `userinfo.${key}`
    this.setData({
      [tmp]: value
    })
    console.log(this.data.userinfo)
  },

  inputChange: function (e) {
    var key = null
    if (e.currentTarget.dataset.key == 'code')
      key = `${e.currentTarget.dataset.key}`
    else
      key = `userinfo.${e.currentTarget.dataset.key}`
    this.setData({
      [key]: e.detail.value
    })

    console.log(this.data.userinfo, this.data.code)
  },

  getCode: function () {
    if (!this.data.userinfo.tel || this.data.userinfo.tel.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      });
      return
    }
    if (this.data.timer == '点击获取') {
      this.sendCode(this.data.userinfo.tel)
      this.data.timer = 60
      let that = this
      var interval = setInterval(function() {
        if (that.data.timer == 1) {
          that.setData({
            timer: '点击获取'
          })
          clearInterval(interval)
        } else
          that.setData({
            timer: that.data.timer - 1
          })
      }, 1000)
    }
  },

  chooseCertify: function () {
    let that = this
    if (!this.data.userinfo.certificationimg)
      wx.chooseImage({
        count: 1,
        success: function(res) {
          that.setData({
            'userinfo.certificationimg': res.tempFilePaths[0]
          })
        },
      })
  },

  cancelCertify: function () {
    this.setData({
      'userinfo.certificationimg': null
    })
  },

  uploadInfo: function () {
    let that = this
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    // 上传认证图片（如果有）
    let certificationimg = this.data.userinfo.certificationimg
    if (certificationimg && !certificationimguploaded) {
      let suffix = certificationimg.substr(certificationimg.lastIndexOf("."))
      wx.cloud.uploadFile({
        cloudPath: 'certificationimg/' + that.data.userinfo.openid + suffix,
        filePath: certificationimg,
        success: res => {
          that.data.certificationimg = res.fileID
          that.setData({
            certificationimg: that.data.certificationimg,
            certificationimguploaded: true
          }, () => {
            // 上传个人信息，先下载头像
            wx.downloadFile({
              url: that.data.userinfo.avatar,
              success: res => {
                // 响应
                console.log('register: 下载用户头像网站响应')
                if (res.statusCode == 200) {
                  // 响应且正常响应
                  console.log('register: 下载用户头像网站正常响应')
                  let img = res.tempFilePath
                  let suffix = img.substr(img.lastIndexOf('.'))
                  // 上传至云存储
                  wx.cloud.uploadFile({
                    cloudPath: 'picture/avatar/' + that.data.userinfo.openid + suffix,
                    filePath: img
                  }).then(res => {
                    // 头像上传至云存储成功
                    console.log('register: 上传头像成功')
                    that.data.userinfo.avatar = res.fileID
                    wx.cloud.callFunction({
                      name: "register",
                      data: {
                        userinfo: that.data.userinfo
                      }
                    }).then(res => {
                      // 上传个人信息成功
                      console.log('register: 上传个人信息成功')
                      wx.hideLoading()
                      wx.showToast({
                        title: '上传个人信息成功',
                        icon: 'none'
                      })
                      that.data.userinfo.register = true
                      app.globalData.userinfo = that.data.userinfo
                      setTimeout(() => {
                        wx.switchTab({
                          url: '/pages/user/user',
                        })
                      }, 2000)
                    }).catch(err => {
                      // 上传个人信息失败
                      console.log('register: 上传个人信息失败')
                      console.log(err)
                      wx.hideLoading()
                      wx.showToast({
                        title: '上传个人信息失败，请重试',
                        icon: 'none'
                      })
                    })
                  }).catch(err => {
                    // 头像上传至云存储失败
                    console.log('register: 上传头像失败')
                    console.log(err)
                    wx.hideLoading()
                    wx.showToast({
                      title: '上传个人信息失败，请重试',
                      icon: 'none'
                    })
                  })
                } else {
                  // 响应但未正常响应
                  console.log('register: 用户头像下载失败')
                  console.log(res)
                  wx.hideLoading()
                  wx.showToast({
                    title: '上传个人信息失败，请重试',
                    icon: 'none'
                  })
                }
              },
              fail: err => {
                // 未响应
                console.log('register: 下载用户头像网站未响应')
                console.log(err)
                wx.hideLoading()
                wx.showToast({
                  title: '上传个人信息失败，请重试',
                  icon: 'none'
                })
              }
            })
          })
        },
        fail: err => {
          console.log('register: 上传认证图片失败')
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '上传图片失败请重试',
            icon: 'none'
          })
        }
      })
    } else {
      // 上传个人信息，先下载头像
      wx.downloadFile({
        url: that.data.userinfo.avatar,
        success: res => {
          // 响应
          console.log('register: 下载用户头像网站响应')
          if (res.statusCode == 200) {
            // 响应且正常响应
            console.log('register: 下载用户头像网站正常响应')
            let img = res.tempFilePath
            let suffix = img.substr(img.lastIndexOf('.'))
            // 上传至云存储
            wx.cloud.uploadFile({
              cloudPath: 'picture/avatar/' + that.data.userinfo.openid + suffix,
              filePath: img
            }).then(res => {
              // 头像上传至云存储成功
              console.log('register: 上传头像成功')
              that.data.userinfo.avatar = res.fileID
              wx.cloud.callFunction({
                name: "register",
                data: {
                  userinfo: that.data.userinfo
                }
              }).then(res => {
                // 上传个人信息成功
                console.log('register: 上传个人信息成功')
                wx.hideLoading()
                wx.showToast({
                  title: '上传个人信息成功',
                  icon: 'none'
                })
                that.data.userinfo.register = true
                app.globalData.userinfo = that.data.userinfo
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/user/user',
                  })
                }, 2000)
              }).catch(err => {
                // 上传个人信息失败
                console.log('register: 上传个人信息失败')
                console.log(err)
                wx.hideLoading()
                wx.showToast({
                  title: '上传个人信息失败，请重试',
                  icon: 'none'
                })
              })
            }).catch(err => {
              // 头像上传至云存储失败
              console.log('register: 上传头像失败')
              console.log(err)
              wx.hideLoading()
              wx.showToast({
                title: '上传个人信息失败，请重试',
                icon: 'none'
              })
            })
          } else {
            // 响应但未正常响应
            console.log('register: 用户头像下载失败')
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '上传个人信息失败，请重试',
              icon: 'none'
            })
          }
        },
        fail: err => {
          // 未响应
          console.log('register: 下载用户头像网站未响应')
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '上传个人信息失败，请重试',
            icon: 'none'
          })
        }
      })
    }
  },

  checkFinish: function () {
    let info = this.data.userinfo
    let finished = true
    let checkkey = ['avatar', 'nickname', 'realname', 'gender', 'wxid', 'qq', 'campus', 'grade', 'tel']
    for (let k of checkkey)
      if (!info[k]) {
        finished = false
        wx.showToast({
          title: '请完整填写信息',
          icon: 'none',
          duration: 2000
        });
        break
      }
    return finished

  },

  commit: function () {
    if (this.checkFinish()) //判断是否填满
      this.validateCode() //判断验证码并上传
  },

  sendCode: function(phone) {
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
    }).then((res) => {
      wx.showToast({
        title: res.result.msg,
        icon: 'none',
        duration: 2000
      });
    }).catch((e) => {
      //console.log(e);
    });
  },

  validateCode: function () {
    let that = this
    if (!this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      });
      return
    }
    wx.cloud.callFunction({
      name: 'zhenzisms',
      data: {
        $url: 'validateCode',
        apiUrl: 'https://sms_developer.zhenzikj.com',
        number: that.data.userinfo.tel,
        code: that.data.code
      }
    }).then((res) => {
      if (res.result.code == 'success')
        that.uploadInfo()
      else
        wx.showToast({
          title: res.result.msg,
          icon: 'none',
          duration: 2000
        });
    }).catch((e) => {
      console.log(e);
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userinfo: app.globalData.userinfo
    }, () => {
      console.log(this.data.userinfo)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})