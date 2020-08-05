// pages/details/details.js
const util = require('../../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    poster: {},
    postedtime: null,
    price: null,
    comment: [],
    loaded: false,
    inputText: '',
    applyReason: '',
    tmpImgList: [],
    like: false,
    isPopUp: false,
    isPopUpJoinCommunity: false,
    isPopUpReport: false,
    canDelete: false,
    canReport: true,
    lockLike: false
  },

  onReport: function () {
    this.setData({
      isPopUpReport: true
    })
  },

  onDelete: function () {
    var that = this
    wx.showModal({
      title: '警告',
      content: '是否删除改帖子，该操作不可撤回',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteData',
            data: {
              type: 'post',
              postid: that.data.post.postid,
              postedby: that.data.post.postedby,
              comment: that.data.post.status.comment,
              report: that.data.post.status.report
            }
          }).then(res => {
            // 删除帖子成功
            console.log('details: 删除帖子成功')
            setTimeout(() => {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
            }, 500)
            wx.navigateBack()
          }).catch(err => {
            // 删除帖子失败
            console.log('details: 删除帖子失败，请重试')
            console.log(err)
            wx.showToast({
              title: '删除失败，请重试',
              icon: 'none'
            })
          })
        }
      }
    })
  },

  onAvatar: function () {
    var that = this
    if (this.data.poster.openid == app.globalData.userinfo.openid) {
      wx.showToast({
        title: '不能向自己申请联系方式噢',
        icon: 'none'
      })
    } else {
      if (this.data.post.type == 'community') {
        // 可能会有申请加入社团
        wx.showActionSheet({
          itemList: ['申请联系方式', '申请加入社团'],
          success: res => {
            // 选择申请类型成功
            console.log('details: 选择申请类型成功')
            if (res.tapIndex == 0) {
              // 已选择申请联系方式
              console.log('details: 已选择申请联系方式')
              that.setData({
                isPopUp: true
              })
            } else {
              // 已选择申请加入社团
              console.log('details: 已选择申请加入社团')
              that.setData({
                isPopUpJoinCommunity: true
              })
            }
          }
        })
      } else {
        // 询问是否申请联系方式
        wx.showModal({
          title: '申请',
          content: '是否向该用户申请获取联系方式',
          showCancel: true,
          success: res => {
            if (res.confirm) {
              // 确认发出申请取联系方式
              that.setData({
                isPopUp: true
              })
            }
          }
        }) 
      }
    }
  },

  onCancelApply: function () {
    this.setData({
      applyReason: '',
      isPopUp: false,
      isPopUpJoinCommunity: false,
      isPopUpReport: false,
    })
  },

  onSetApplyReason: function (e) {
    this.setData({
      applyReason: e.detail.value
    })
  },

  onUploadCheck: function (e) {
    var that = this
    // 检查是否填写申请理由
    if (this.data.applyReason == '') {
      wx.showToast({
        title: '申请理由不能为空',
        icon: 'none'
      })
    } else {
      // 上传申请
      wx.cloud.callFunction({
        name: 'uploadCheck',
        data: {
          check: {
            type: e.currentTarget.dataset.type,
            data: {
              applicant: app.globalData.userinfo.openid,
              reviewer: that.data.poster.openid,
              reason: that.data.applyReason
            },
            reply: {},
            pass: false,
            done: false
          }
        }
      }).then(res => {
        // 上传成功
        console.log('details: 申请上传成功')
        wx.showToast({
          title: '申请成功，请等待回应',
          icon: 'none'
        })
        that.setData({
          isPopUp: false,
          isPopUpJoinCommunity: false,
          applyReason: ''
        })
      }).catch(err => {
        // 上传失败
        console.log('details: 申请上传失败')
        console.log(err)
        wx.showToast({
          title: '申请失败，请重试',
          icon: 'none'
        })
      })
    }
  },

  onUploadReport: function (e) {
    var that = this
    // 检查是否填写举报理由
    if (this.data.applyReason == '') {
      wx.showToast({
        title: '举报理由不能为空',
        icon: 'none'
      })
    } else {
      // 上传举报
      wx.cloud.callFunction({
        name: 'updatePost',
        data: {
          type:'report',
          postid: that.data.post.postid,
          reason: that.data.applyReason
        }
      }).then(res => {
        // 上传成功
        console.log('details: 举报上传成功')
        wx.showToast({
          title: '举报成功，请等待回应',
          icon: 'none'
        })
        that.setData({
          isPopUp: false,
          isPopUpJoinCommunity: false,
          isPopUpReport: false,
          applyReason: ''
        })
      }).catch(err => {
        // 上传失败
        console.log('details: 举报上传失败')
        console.log(err)
        wx.showToast({
          title: '举报失败，请重试',
          icon: 'none'
        })
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

  onUploadImage: function(e) {
    let that = this
    let length = that.data.tmpImgList.length
    if (length < 9) {
      wx.chooseImage({
        count: 9 - length,
        sizeType: ['compressed'],
        success: function (res) {
          let tmpImgList = that.data.tmpImgList
          tmpImgList = tmpImgList.concat(res.tempFilePaths)
          that.setData({
            tmpImgList: tmpImgList
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传 9 张图片噢',
        icon: 'none'
      })
    }
  },

  onPreviewImage: function (e) {
    wx.previewImage({
      urls: this.data.post.image,
      current: this.data.post.image[e.currentTarget.dataset.index]
    })
  },

  setPrice: function () {
    let post = this.data.post
    let remarkType = ['QA', 'transaction', 'help']
    let price = null
    for (let type of remarkType) {
      if (post.type == type) {
        price = post.price.toFixed(2)
        break
      }
    }
    this.setData({
      price: price
    })
  },

  uploadComment: function (tempFilePaths, obj, postid, comment) {
    return new Promise((presolve, preject) => {
      if(tempFilePaths.length == 0) {
        // 没有图片，图片置为空数组
        console.log('release: 没有图片需要上传')
        obj.image = []
        // 接着上传评论
        wx.cloud.callFunction({
          name: 'uploadComment',
          data: {
            comment: obj,
            postid: postid
          },
          success: res => {
            // 评论上传成功
            console.log('details: 评论上传成功')
            presolve(res.result.comment.commentid)
          },
          fail: err => {
            // 评论上传失败
            console.log('details: 评论上传失败')
            console.log(err)
            preject(err)
          }
        })
      } else {
        // 有图片，先上传图片
        let uploads = []
        for (let i = 0; i < tempFilePaths.length; i++) {
          uploads[i] = new Promise ((resolve, reject) => {
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
          // 图片上传完成
          console.log('details: 图片上传完成')
          obj.image = res
          // 接着上传评论
          wx.cloud.callFunction({
            name: 'uploadComment',
            data: {
              comment: obj,
              postid: postid
            },
            success: res => {
              // 评论上传成功
              console.log('details: 评论上传成功')
              presolve(res.result.comment.commentid)
            },
            fail: err => {
              // 评论上传失败
              console.log('details: 评论上传失败')
              console.log(err)
              preject(err)
            }
          })
          return
        }).catch(err => {
          console.log('details: 图片上传失败')
          preject(err)
        })
      }
    })
  },

  onPutComment: function () { 
    var that = this
    // 空评论不上传
    if (this.data.inputText == '') {
      wx.showToast({
        title: '不能发送空评论噢',
        icon: 'none'
      })
      return
    }
    // 询问是否匿名
    let selectedAnonymous = false
    let anonymous = true
    wx.showModal({
      cancelColor: '提示',
      content: '是否匿名发送',
      showCancel: true,
      success: res => {
        selectedAnonymous = true
        console.log('details: 已选择是否匿名')
        if (!res.confirm)
          anonymous = false
      },
      fail : err => {
        console.log('details: 未选择是否匿名')
        console.log(err)
      },
      complete: msg => {
        // 若选择了是否匿名，则开始上传
        if (selectedAnonymous) {
          console.log('details: 选择是否匿名后开始上传')
          that.uploadComment(that.data.tmpImgList, {
            commentedby: app.globalData.userinfo.openid,
            content: that.data.inputText,
            anonymous: anonymous,
            status: {
              like: [],
              report: []
            }
          }, that.data.post.postid, that.data.comment)
          .then(res => {
            // uploadComment 调用成功
            console.log('details: uploadComment 调用成功')
            that.data.comment.push(res)
            app.globalData.userinfo.status.comment.push(res)
            that.setData({
              comment: that.data.comment,
              inputText: '',
              tmpImgList: []
            })
            wx.showToast({
              title: '发送成功',
              icon: 'none'
            })
          })
          .catch(err => {
            // uploadComment 调用失败
            console.log('details: uploadComment 调用失败')
            console.log(err)
            wx.showToast({
              title: '发送失败，请重试',
              icon: 'none'
            })
          })
        }
      }
    })
  },

  onSetInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  onLike: function () {
    if (!this.data.loaded || this.data.lockLike)
      return
    this.data.lockLike = true
    var that = this
    var openid = app.globalData.userinfo.openid
    var postid = this.data.post.postid
    var like = this.data.like
    // 为了实时性，先假定能够调用成功
    if (!this.data.like) {
      this.data.post.status.like.push(openid)
      app.globalData.userinfo.status.like.postlike.push(postid)
    } else {
      this.data.post.status.like.splice(this.data.post.status.like.indexOf(openid), 1)
      app.globalData.userinfo.status.like.postlike.splice(app.globalData.userinfo.status.like.postlike.indexOf(postid), 1)
    }
    this.setData({
      'post.status.like': this.data.post.status.like,
      like: !this.data.like,
    })
    // 点赞操作写入数据库
    wx.cloud.callFunction({
      name: 'updatePost',
      data: {
        type: 'like',
        postid: postid,
        liker: openid,
        like: like
      }
    }).then(res => {
      // 更新数据库信息成功
      console.log('details: 点赞操作后，更新数据库信息成功')
      that.data.lockLike = false
    }).catch(err => {
      // 更新数据库信息失败
      console.log('details: 点赞操作后，更新数据库信息失败')
      console.log(err)
      // 重置数据
      if (this.data.like) {
        this.data.post.status.like.pop()
        app.globalData.userinfo.status.like.postlike.pop()
      } else {
        this.data.post.status.like.push(openid)
        app.globalData.userinfo.status.like.postlike.push(postid)
      }
      that.setData({
        'post.status.like': this.data.post.status.like,
        like: !that.data.like,
      })
      wx.showToast({
        title: '点赞失败，请重试',
        icon: 'none'
      })
      that.data.lockLike = false
    })
  },
  
  onLoad: function (options) {
    var that = this
    // 自己发的帖子不显示举报
    if (app.globalData.userinfo.status.post.indexOf(options.postid) >= 0) {
      this.setData({
        canReport: false,
        checkComment:options.checkid
      })
    }
    console.log(this.data.checkComment)
    wx.setNavigationBarTitle({
      title: '详情'
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 获取 post
    wx.cloud.callFunction({
      name: 'getPostItem',
      data: {
        postid: options.postid
      }
    }).then(res => {
      // 获取 post 成功
      console.log('details: 获取 post 成功')
      var post = res.result.post
      // 自己发的帖子或管理员身份显示删除
      if (post.postedby == app.globalData.userinfo.openid || app.globalData.userinfo.organization.indexOf('admin') >= 0) {
        that.setData({
          canDelete: true
        })
      }
      // 检查该用户是否有点赞
      let like = Boolean(post.status.like.indexOf(app.globalData.userinfo.openid) >= 0)
      that.setData({
        post: post,
        postedtime: util.formatTime(new Date(post.postedtime)),
        comment: post.status.comment,
        like: like
      }, () => {
        // 检查 view 是否包含该用户
        let view = Boolean(post.status.view.indexOf(app.globalData.userinfo.openid) >= 0)
        if (!view) {
          // 若 view 不包含，更新数据库
          console.log('details: view 不包含此用户，尝试更新 view')
          wx.cloud.callFunction({
            name: 'updatePost',
            data: {
              type: 'view',
              postid: post.postid
            }
          }).then(res => {
            // 更新 view 成功
            console.log('details: 更新 view 成功')
            post.status.view.push(app.globalData.userinfo.openid)
            that.setData({
              'post.status.view': post.status.view
            })
            app.globalData.userinfo.status.view.push(post.postid)
          }).catch(err => {
            // 更新 view 失败
            console.log('details: 更新 view 失败')
            console.log(err)
          })
        } else {
          // view 包含此用户，不更新数据库
          console.log('details: view 包含此用户，不更新数据库')
        }
        that.setPrice()
        // 获取 poster
        wx.cloud.callFunction({
          name: 'getPosterBrief',
          data: {
            openid: post.postedby
          }
        }).then(res => {
          // 获取 poster 成功
          console.log('details: 获取 poster 成功')
          that.setData({
            poster: res.result.poster,
            loaded: true
          }, () => {
            wx.hideLoading()
          })
        }).catch(err => {
          // 获取 poster 失败
          console.log('details: 获取 poster 失败')
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '加载失败，请重试',
            icon: 'none'
          })
        })
      })
    }).catch(err => {
      // 获取 post 失败
      console.log('details: 获取 post 失败')
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    })
  },
})