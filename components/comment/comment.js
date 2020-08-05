// components/comment/comment.js
const app = getApp()
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentid: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        var that = this
        this.setData({
          comment: {
            commentid: '',
            commentedtime: '',
            commentedby: '',
            content: '',
            image: [],
            anonymous: true,
            status: {
              like: [],
              report: []
            }
          },
          commentator: {
            avatar: '',
            nickname: '',
            anonymous: true
          },
          loaded: false,
          reason: '',
          isPopUp: false
        }, () => {
          that.init(newVal)
        })
      }
    },
    poster: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    comment: {
      commentid: '',
      commentedtime: '',
      commentedby: '',
      content: '',
      image: [],
      anonymous: true,
      status: {
        like: [],
        report: []
      }
    },
    commentator: {
      avatar: '',
      nickname: '',
      anonymous: true
    },
    loaded: false,
    reason: '',
    isPopUp: false,
    isPopUpApply: false,
    applyReason: '',
    like: false,
    lockLike: false,
    canDelete: false,
    canReport: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDelete: function () {
      var that = this
      wx.showModal({
        title: '警告',
        content: '是否删除该评论，该操作不可撤回',
        showCancel: true,
        success: res => {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'deleteData',
              data: {
                type: 'comment',
                commentid: that.properties.commentid,
                commentedby: that.data.comment.commentedby,
                report: that.data.comment.status.report
              }
            }).then(res => {
              // 删除评论成功
              console.log('comment: 删除评论成功')
              that.setData({
                comment: {},
                commentator: {}
              })
            }).catch(err => {
              // 删除评论失败
              console.log('comment: 删除评论失败')
              console.log(err)
              wx.showToast({
                title: '删除评论失败，请重试',
                icon: 'none'
              })
            })
          }
        }
      })
    },

    onAvatar: function () {
      var that = this
      if (this.properties.comment.commentedby == app.globalData.userinfo.openid) {
        wx.showToast({
          title: '不能向自己申请联系方式噢',
          icon: 'none'
        })
      } else {
        wx.showModal({
          title: '申请',
          content: '是否向该用户申请获取联系方式',
          showCancel: true,
          success: res => {
            if (res.confirm) {
              // 确认发出申请取联系方式
              that.setData({
                isPopUpApply: true
              })
            }
          }
        })
      }
    },
  
    onCancelApply: function () {
      this.setData({
        isPopUpApply: false
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
              type: 'userinfo',
              data: {
                applicant: app.globalData.userinfo.openid,
                reviewer: that.data.comment.commentedby,
                reason: that.data.applyReason
              },
              reply: {},
              pass: false,
              done: false
            }
          }
        }).then(res => {
          // 上传成功
          console.log('comment: 申请上传成功')
          wx.showToast({
            title: '申请成功，请等待回应',
            icon: 'none'
          })
          that.setData({
            isPopUpApply: false,
            applyReason: ''
          })
        }).catch(err => {
          // 上传失败
          console.log('comment: 申请上传失败')
          console.log(err)
          wx.showToast({
            title: '申请失败，请重试',
            icon: 'none'
          })
        })
      }
    },

    onPreviewImage: function (e) {
      wx.previewImage({
        urls: this.data.comment.image,
        current: this.data.comment.image[e.currentTarget.dataset.index]
      })
    },

    onCancelReport: function () {
      this.setData({
        reason: '',
        isPopUp: false
      })
    },

    onPopUp: function () {
      this.setData({
        isPopUp: true
      })
    },
    
    onReport: function () {
      var that = this
      if (!this.data.reason) {
        wx.showToast({
          title: '举报原因不能为空',
          icon: 'none'
        })
      } else {
        wx.cloud.callFunction({
          name: 'updateComment',
          data: {
            type: 'report',
            commentid: that.properties.commentid,
            reason: that.data.reason
          }
        }).then(res => {
          // 举报上传成功
          console.log('comment: 举报上传成功')
          wx.showToast({
            title: '举报成功',
            icon: 'none'
          })
          that.data.comment.status.report.push(res.result.reportid)
          app.globalData.userinfo.status.report.push(res.result.reportid)
          that.setData({
            reason: '',
            isPopUp: false,
            comment: that.data.comment
          })
        }).catch(err => {
          // 举报上传失败
          console.log('comment: 举报上传失败')
          console.log(err)
          wx.showToast({
            title: '举报失败，请重试',
            icon: 'none'
          })
        })
      }
    },

    onLike: function () {
      if (!this.data.loaded || this.data.lockLike)
        return
      var that = this
      var openid = app.globalData.userinfo.openid
      var commentid = this.data.comment.commentid
      var like = this.data.like
      this.data.lockLike = true
      // 根据是否点赞分类讨论（因为点赞可撤回）
      if (!that.data.like) {
        this.data.comment.status.like.push(commentid)
        app.globalData.userinfo.status.like.commentlike.push(commentid)
      } else {
        this.data.comment.status.like.splice(this.data.comment.status.like.indexOf(openid), 1)
        app.globalData.userinfo.status.like.commentlike.splice(app.globalData.userinfo.status.like.commentlike.indexOf(commentid), 1)
      }
      // 为了视觉效果更实时，假定请求成功
      that.setData({
        'comment.status.like': that.data.comment.status.like,
        like: !that.data.like,
      })
      // 缓存写入数据库
      wx.cloud.callFunction({
        name: 'updateComment',
        data: {
          type: 'like',
          commentid: that.properties.commentid,
          liker: openid,
          like: like
        }
      }).then(res => {
        // 更新数据库信息成功
        console.log('comment: 点赞操作后，更新数据库信息成功')
      }).catch(err => {
        // 更新数据库信息失败
        console.log('comment: 点赞操作后，更新数据库信息失败')
        console.log(err)
        // 将原本修改的数据重置
        if (that.data.like) {
          that.data.comment.status.like.pop()
          app.globalData.userinfo.status.like.commentlike.pop()
        } else {
          that.data.comment.status.like.push(openid)
          app.globalData.userinfo.status.like.commentlike.push(commentid)
        }
        that.setData({
          'comment.status.like': that.data.comment.status.like,
          like: !that.data.like,
        })
        wx.showToast({
          title: '点赞失败，请重试',
          icon: 'none'
        })
      })
    },

    onSetInput: function (e) {
      this.setData({
        reason: e.detail.value
      })
    },

    popup: function () {
      this.setData({
        isPopUp: !this.data.isPopUp
      })
    },

    init: function (commentid, postid) {
      var that = this
      // 判断是否可举报
      if (app.globalData.userinfo.status.comment.indexOf(commentid) >= 0) {
        this.setData({
          canReport: false
        })
      }
      wx.showLoading({
        title: '加载评论中',
        mask: true
      })
      // 获取评论
      wx.cloud.callFunction({
        name: 'getCommentItem',
        data: {
          commentid: commentid
        }
      }).then(res => {
        // 获取评论成功
        console.log('comment: 获取评论成功')
        // 为了不卡，就直接 hideLoading 了
        wx.hideLoading()
        // 判断是否自己的评论
        if (res.result.comment.commentedby == app.globalData.userinfo.openid || app.globalData.userinfo.organization.indexOf('admin') >= 0) {
          this.setData({
            canDelete: true
          })
        }
        // 检查该用户有无点赞
        let like = Boolean(res.result.comment.status.like.indexOf(app.globalData.userinfo.openid) >= 0)
        that.setData({
          comment: res.result.comment,
          commentedtime: util.formatTime(new Date(res.result.comment.commentedtime)),
          like: like
        }, () => {
          // 获取评论者信息
          wx.cloud.callFunction({
            name: 'getCommentatorBrief',
            data: {
              openid: that.data.comment.commentedby
            }
          }).then(res => {
            // 获取评论者信息成功
            console.log('comment: 获取评论者信息成功')
            that.setData({
              commentator: res.result.commentator,
              loaded: true
            })
          }).catch(err => {
            // 获取评论者信息失败
            console.log('comment: 获取评论者信息失败')
            console.log(err)
            wx.showToast({
              title: '获取评论者信息失败，请重试',
              icon: 'none'
            })
          })
        })
      }).catch(err => {
        // 获取评论失败
        console.log('comment: 获取评论失败')
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '获取评论失败，请重试',
          icon: 'none'
        })
      })
    }
  },

  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    attached: function (options) {
      this.init(this.properties.commentid)
    }
  }
})
