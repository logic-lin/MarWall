// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "marwall-ixou8"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  switch(event.searchAttribute){
    case 'all':
      return db.collection('post').skip(event.skip).limit(event.limit).field({
        postid: true,
        type: true,
        title: true,
        content:true,
        price: true,
        anonymous:true,
        postedtime:true
      }).get()

    case 'postedtime':
      let tmp = searchValue.split('-')
      let start = tmp[0].split('.')
      let end = tmp[1].split('.')
      start = new Date(parseInt(start[0]),parseInt(start[1]),parseInt(start[2])).getTime()
      end = new Date(parseInt(end[0]),parseInt(end[1]),parseInt(end[2])).getTime()
      return db.collection('post').where({
        time:_.and(_.gte(start),_.lte(end))
      }).skip(event.skip).limit(event.limit).field({
        postid: true,
        type: true,
        title: true,
        content:true,
        price: true,
        anonymous:true,
        postedtime:true
      }).get()

    case 'price':
      let range = searchValue.split('-')
      return db.collection('post').where({
        time:_.and(_.gte(range[0]),_.lte(range[1]))
      }).skip(event.skip).limit(event.limit).field({
        postid: true,
        type: true,
        title: true,
        content:true,
        price: true,
        anonymous:true,
        postedtime:true
      }).get()
    case 'anonymous':
      return db.collection('post').where({
        anonymous:event.searchValue == '是'?true:false
      }).skip(event.skip).limit(event.limit).field({
        postid: true,
        type: true,
        title: true,
        content:true,
        price: true,
        anonymous:true,
        postedtime:true
      }).get()
    default:
      return db.collection('post').where({
        [`${event.searchAttribute}`]: db.RegExp({
          regexp: event.searchValue,
          options: 'i',
        })
      }).skip(event.skip).limit(event.limit).field({
        postid: true,
        type: true,
        title: true,
        content:true,
        price: true,
        anonymous:true,
        postedtime:true
      }).get()
  }
  
}