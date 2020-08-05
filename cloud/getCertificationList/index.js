// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "marwall-ixou8"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  switch(parseInt(event.sortKey)){
    case 0: return db.collection('userinfo').skip(event.skip).limit(event.limit).field({
              _id: true,
              realname: true,
              campus: true,
              certification: true,
              certificationimg: true,
              openid: true,
              gender: true,
              grade: true
            }).get()
            
    case 1: return db.collection('userinfo').where({
                certification:true
              }).skip(event.skip).limit(event.limit).field({
              _id: true,
              realname: true,
              campus: true,
              certification: true,
              certificationimg: true,
              openid: true,
              gender: true,
              grade: true
            }).get()
            
    case 2: return db.collection('userinfo').where({
                certification:false,
                certificationimg:_.neq(null)
              }).skip(event.skip).limit(event.limit).field({
              _id: true,
              realname: true,
              campus: true,
              certification: true,
              certificationimg: true,
              openid: true,
              gender: true,
              grade: true
            }).get()
            
    default:return db.collection('userinfo').where({
              certification:false,
              certificationimg:null
            }).skip(event.skip).limit(event.limit).field({
              _id: true,
              realname: true,
              campus: true,
              certification: true,
              certificationimg: true,
              openid: true,
              gender: true,
              grade: true
            }).get()
           
  }
}