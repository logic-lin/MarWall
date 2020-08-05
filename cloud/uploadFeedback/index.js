const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  var feedbacker = cloud.getWXContext().OPENID
  var current = new Date().getTime()
  var feedbackid = current + feedbacker
  event.feedback.feedbackid = feedbackid
  event.feedback.feedbackedtime = current
  // 首先上传至 feedback
  await db.collection('feedback').add({
    data: event.feedback
  }).then(res => {
    // 更新 userinfo.status.feedback
    db.collection('userinfo').limit(1).where({
      openid: feedbacker
    }).update({
      data: {
        'status.feedback': _.push([feedbackid])
      }
    })
  })
  return {
    feedbackid: event.feedback
  }
}