const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})

exports.main = async (event, context) => {
  await cloud.database().collection("userinfo").where({
    'openid': event.userInfo.openId
  }).get().then(res => {
    ret = {
      openid: event.userInfo.openId,
      userinfoList: res.data
    }
  })
  return ret
}