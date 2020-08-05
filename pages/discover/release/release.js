// pages/release/release.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    colors: '',
    anonymousSelected: false,
    typeSelected: false,
    tmpImgList: ['/icon/release/uploadImage.png'],
    anonymousRange: ['是', '否'],
    typeRange: ['致习室', '话题街', '留言巷', '活动站', '砖瓦房'],
    name: '',
    wechatNumber: '',
    qqNumber: '',
    phoneNumber: '',
    releaseType: '',
    anonymousIndex: null,
    typeIndex: null,
    labelIndex: null,
    title: null,
    content: null,
    price: 0,
    labels: [],
    label: [],
    maps: {
      price: 'required',
      anonymous: 'required'
    },
    intro: {
      confession: '表白墙：表白对象仅允许校内人员哦',
      QA: '问答墙：请不要发布引战问题哦',
      transaction: '交易墙：谨防诈骗，辨别交易的真实性',
      help: '雷锋墙：互帮互助！',
      complaint: '吐槽墙：警告！请不要提及具体到某个人或某个班，吐槽墙设立的初心仅仅是希望同学们能够对事不对人，同时能够使得同学们说出内心对某些行为规定等的想法',
      community: '社团墙：仅允许社团管理者发布消息',
      hole: '黑洞：存在多种发布类型；致习室提供给同学们一个能够积极参与学习上的互帮互助的平台，话题街提供给同学们一些话题讨论的平台，留言巷提供给同学们为自己或他人留言（立flag）的机会，活动站提供给同学们发起活动的机会从而能够召集更多小伙伴一起参与活动，砖瓦房提供给同学们对该小程序提供意见与建议的平台从而为小程序添砖加瓦',
      common: '温馨提示：请勿发布广告以及各类涉及违法的信息，否则可能永久取消使用该小程序的权利，甚至可能根据实际情况的恶劣性质作进一步处理'
    },
    additional: {
      confession: '曝光：在进行帖子排名排序时，更高曝光度能够为你即将发布的帖子带来更靠前的排名位置，同时这也是对程序员小哥哥的一种小小激励(●\'◡\'●)',
      QA: '悬赏：如果提问问题的时候加上一定的悬赏能够激励更多人看到你的问题并积极回答哦',
      transaction: '价格：需要小于 10000 元且大于 0 元',
      help: '',
      complaint: '',
      community: '曝光：在进行帖子排名排序时，更高曝光度能够为你即将发布的帖子带来更靠前的排名位置，同时这也是对程序员小哥哥的一种小小激励(●\'◡\'●)',
      hole: '曝光：在进行帖子排名排序时，更高曝光度能够为你即将发布的帖子带来更靠前的排名位置，同时这也是对程序员小哥哥的一种小小激励(●\'◡\'●)'
    }
  },

  onLoad: function(options) {
    var index = 0
    if (!(options.index === undefined))
      index = parseInt(options.index)
    let maps = this.data.maps
    let releaseType = ''
    switch (index) {
      case 0:
        // confession
        releaseType = 'confession'
        maps.price = 'optional'
        break
      case 1:
        // QA
        releaseType = 'QA'
        maps.price = 'optional'
        break
      case 2:
        // transaction
        releaseType = 'transaction'
        break
      case 3:
        // help
        releaseType = 'help'
        maps.price = 'optional'
        break
      case 4:
        // complaint
        releaseType = 'complaint'
        maps.price = 'useless'
        break
      case 5:
        // community
        releaseType = 'community'
        maps.price = 'optional'
        maps.anonymous = 'useless'
        this.setData({
          anonymousIndex: 1
        })
        break
      case 6:
        // 黑洞
        releaseType = 'hole'
        maps.price = 'optional'
        break
    }
    wx.setNavigationBarTitle({
      title: app.globalData.ENG2CN[releaseType]
    })
    this.setData({
      releaseType: releaseType,
      maps: maps,
      labels: app.globalData.ENG2LABEL[releaseType]
    }, () => {
      this.setData({
        loaded: true
      })
    })
  },

  onDeleteImage: function (e) {
    let index = e.currentTarget.dataset.index
    this.data.tmpImgList.splice(index, 1)
    this.setData({
      tmpImgList: this.data.tmpImgList
    })
  },

  onChooseLabel: function (e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.labelIndex) {
      this.setData({
        labelIndex: null
      })
    } else {
      this.setData({
        labelIndex: index
      })
    }
  },

  onUploadImage: function(e) {
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

  pickerChange: function(e) {
    let type = e.currentTarget.dataset.type
    let index = e.detail.value
    if (index != this.data[type + 'Index']) {
      this.setData({
        [type + 'Index']: index
      })
    }
    this.setData({
      [type + 'Selected']: true
    })
  },

  input: function(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    if (key === 'price') {
      let re_int = /^\d{1,4}$/
      let re_float = /^\d{1,4}\.\d{1,2}$/
      if (value.match(re_int) || value.match(re_float)) {
        this.setData({
          [key]: parseFloat(value)
        })
      }
    } else {
      this.setData({
        [key]: value
      }) 
    }
  },

  uploadImage: (tempFilePaths, obj) => {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    return new Promise((presolve, preject) => {
      if(tempFilePaths.length <= 1) {
        // 没有图片需要上传，直接上传帖子
        console.log('release: 没有图片需要上传')
        obj.image = []
        let promise = new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'uploadPost',
            data: {
              post: obj
            },
            success: res => {
              console.log('release: 帖子上传函数调用成功')
              app.globalData.userinfo.status.post.push(res.result.postid)
              resolve(res)
            },
            fail: err => {
              console.log('release: 帖子上传函数调用失败')
              console.log(err)
              reject(err)
            }
          })
        })
        Promise.all([promise])
        .then(res => {
          // 帖子上传完成
          console.log('release: 帖子上传完成')
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          })
          presolve(res)
        }).catch(err => {
          //  帖子上传失败
          console.log('release: 帖子上传失败')
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
        let uploads = []
        for (let i = 0; i < tempFilePaths.length - 1; i++) {
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
          // 图片上传完成，即将上传帖子
          console.log('release: 图片上传完成')
          obj.image = res
          let promise = new Promise((resolve, reject) => {
            wx.cloud.callFunction({
              name: 'uploadPost',
              data: {
                post: obj
              },
              success: res => {
                // 帖子上传函数调用成功
                console.log('release: 帖子上传函数调用成功')
                app.globalData.userinfo.status.post.push(res.result.post)
                resolve(res)
              },
              fail: err => {
                // 帖子上传函数调用失败
                console.log('release: 帖子上传函数调用失败')
                console.log(err)
                reject(err)
              }
            })
          })
          Promise.all([promise])
          .then((res) => {
            // 帖子上传完成
            console.log('release: 帖子上传完成')
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            })
            presolve(res)
          }).catch(err => {
            // 帖子上传失败
            console.log('release: 帖子上传失败')
            console.log(err)
            wx.hideLoading()
            wx.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            })
            preject(err)
          })
        }).catch(err => {
          //  图片上传失败
          console.log('release: 图片上传失败')
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title:'上传失败，请重试',
            icon:'none'
          })
          preject(err)
        })
      }
    })
  },

  release: function() {
    var that = this
    let satisfy = true
    let maps = this.data.maps
    /* 判断是否满足条件 */
    satisfy = satisfy && !!(this.data.title) && (!!this.data.content)
    if (maps.price == 'required')
      satisfy = satisfy && !!(this.data.price)
    if (maps.anonymous == 'required')
      satisfy = satisfy && this.data.anonymousSelected
    if (this.data.releaseType == 'hole') {
      satisfy = satisfy && this.data.typeSelected
      if (satisfy) {
        for (let k in app.globalData.ENG2CN) {
          if (app.globalData.ENG2CN[k] == this.data.typeRange[this.data.typeIndex]) {
            this.data.releaseType = k
            break
          }
        }
      }
    }
    if (!satisfy) {
      wx.showToast({
        title: '请完整填写所有必填项',
        icon: 'none',
      })
    } else {
      // 填写完毕，尝试上传图片或上传帖子
      this.uploadImage(this.data.tmpImgList, {
        type: that.data.releaseType,
        postedby: app.globalData.userinfo.openid,
        title: that.data.title,
        content: that.data.content,
        price: that.data.price,
        label: that.data.labelIndex === null ? [] : [that.data.labels[that.data.labelIndex]],
        anonymous: that.data.anonymousRange[that.data.anonymousIndex] === '是' ? true : false
      })
      .then(res => {
        // 上传帖子成功
        console.log('release: 上传成功')
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }).catch(err => {
        // 上传帖子失败
        console.log(err)
        console.log('release: 上传失败')
      })
    }
  }
})