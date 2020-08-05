// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  var poster = cloud.getWXContext().OPENID
  var post = event.post
  var currentTime = new Date().getTime()
  post.postid = currentTime + poster
  post.postedtime = currentTime
  post.status = {
    view: [],
    like: [],
    comment: [],
    report: []
  }
  // 上传 post
  await db.collection('post').add({
    data: post
  }).then(res => {
    // 更新 userinfo.status.post
    db.collection('userinfo').where({
      openid: poster
    }).update({
      data: {
        'status.post': _.push([post.postid])
      }
    })
  })
  return {
    postid: post.postid
  }
}