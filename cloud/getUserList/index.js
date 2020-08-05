// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "marwall-ixou8"
})
const limit = 2
// 云函数入口函数
exports.main = async (event, context) => {

  return cloud.database().collection('userinfo').skip(event.skip).limit(event.limit).field({
    _id: true,
    realname: true,
    nickname:true,
    campus: true,
    certification: true,
    openid: true,
    gender: true,
    grade: true,
    tel:true,
    wxid:true,
    qq:true,
    organization:true
  }).get()
}