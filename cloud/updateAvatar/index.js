const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})

exports.main = async (event, context) => {
  return await cloud.database().collection('userinfo').limit(1).where({
    'openid': event.userInfo.openId
  }).update({
    data: {
      'avatar': event.avatar
    }
  })
}