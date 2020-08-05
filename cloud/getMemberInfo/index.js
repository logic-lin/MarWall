// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'marwall-ixou8'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('userinfo').where({
    openid:event.openid
  }).field({
    _id: true,
    realname: true,
    nickname:true,
    campus: true,
    openid: true,
    gender: true,
    grade: true,
    tel:true,
    wxid:true,
    qq:true,
    organization:true
  }).get()
}