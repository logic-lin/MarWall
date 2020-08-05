// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "marwall-ixou8"
})

// 云函数入口函数
exports.main = async (event, context) => {
return cloud.database().collection('userinfo').where({organization:event.key}).field({
      _id: true,
      realname: true,
      campus: true,
      gender: true,
      grade: true,
      organization:true
    }).get()
    
}
