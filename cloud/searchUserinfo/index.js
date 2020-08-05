// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "marwall-ixou8"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()

  return db.collection('userinfo').where({
    [`${event.searchAttribute}`]: db.RegExp({
      regexp: event.searchValue,
      options: 'i',
    })
  }).skip(event.skip).limit(event.limit).get()
}