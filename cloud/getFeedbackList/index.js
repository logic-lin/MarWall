// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'marwall-ixou8'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('feedback').where({
    done:event.status
  }).skip(event.skip).limit(event.limit).get() 
}