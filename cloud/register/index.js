const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})

exports.main = async (event, context) => {
  event.userinfo.openid = cloud.getWXContext().OPENID
  event.userinfo.register = true
  return await cloud.database().collection("userinfo").add({
    data: event.userinfo
  })
}