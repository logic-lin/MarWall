const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})

exports.main = async (event, context) => {
  var poster = {}
  await cloud.database().collection('userinfo').limit(1).field({
    openid: true,
    avatar: true,
    nickname: true
  }).where({
    openid: event.openid
  }).get().then(res => {
    poster = res.data[0]
  })
  return {
    poster: poster
  }
}