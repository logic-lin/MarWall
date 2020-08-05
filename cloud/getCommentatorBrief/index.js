const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})

exports.main = async (event, context) => {
  var commentator = {}
  await cloud.database().collection('userinfo').limit(1).field({
    openid: true,
    avatar: true,
    nickname: true
  }).where({
    openid: event.openid
  }).get().then(res => {
    commentator = res.data[0]
  })
  return {
    commentator: commentator
  }
}