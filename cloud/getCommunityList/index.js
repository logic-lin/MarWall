// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'marwall-ixou8'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('check').where({
    done:event.done,
    type:'setCommunity'
  }).get() 
}