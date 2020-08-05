const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 20

exports.main = async (event, context) => {
  var poster = cloud.getWXContext().OPENID
  var wall_name = event.wall_name
  var label_name = event.label_name
  var order = event.order == 'default' ? 'postedtime': event.order
  var exposure = Boolean(event.exposure && event.order == 'default')
  var order_way = event.order_way ? 'desc' : 'asc'
  
  if (wall_name == 'mine') {  //  我的
    if (label_name == 'any') { // 无类型
      await db.collection('post').where({
        postedby: poster
      }).orderBy(order, order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    } else {  //  有类型
      if (event.label_name == 'hole') { //  黑洞类型
        await db.collection('post').where({
          postedby: poster,
          type : _.in(['study', 'topic', 'message', 'activity', 'propose'])
        }).orderBy(order, order_way)
        .limit(MAX_LIMIT).get().then(res => {
          ret = res
        })
      } else {  //  核心类型
        await db.collection('post').where({
          postedby: poster,
          type : event.label_name
        }).orderBy(order, order_way)
        .limit(MAX_LIMIT).get().then(res => {
          ret = res
        })
      }
    }
  } else if (wall_name == 'any') { //  无类型
    await db.collection("post").where({}).orderBy(order, order_way)
    .limit(MAX_LIMIT).get().then(res => {
      ret = res
    })
  } else if (label_name == '全部') { //  无标签
    if (exposure) { //  有曝光
      await db.collection("post").where({
        type : wall_name
      }).orderBy(order, order_way).orderBy('price', order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    } else {  //  无曝光
      await db.collection("post").where({
        type : wall_name
      }).orderBy(order, order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    }
  } else { //  有标签
    if (exposure) { //  有曝光
      await db.collection("post").where({
        type : wall_name,
        label : label_name
      }).orderBy(order, order_way).orderBy('price', order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    } else {  //  无曝光
      await db.collection("post").where({
        type : wall_name,
        label : label_name
      }).orderBy(order,order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    }
  }
  
  return ret
}