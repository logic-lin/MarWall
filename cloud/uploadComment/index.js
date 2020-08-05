const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let current = new Date().getTime()
  let commentator = event.comment.commentedby
  let commentid = current + event.postid + commentator
  let commentedtime = current
  event.comment.commentid = commentid
  event.comment.commentedtime = commentedtime
  // 上传评论
  await db.collection('comment').add({
    data: event.comment
  }).then(res => {
    // 更新 post 的 comment 数组
    db.collection('post').limit(1).where({
      postid: event.postid
    }).update({
      data: {
        ['status.comment']: _.push([commentid])
      }
    })
  }).then(res => {
    // 更新 userinfo 的 comment 数组
    db.collection('userinfo').limit(1).where({
      openid: commentator
    }).update({
      data: {
        'status.comment': _.push([commentid])
      }
    })
  })
  return {
    comment: event.comment
  }
}