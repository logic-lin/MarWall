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
  var loadMoreTimes = event.loadMoreTimes
  var order_way = event.order_way ? 'desc' : 'acs'
  var last_order = event.last_order

  if (wall_name == 'mine') { //  我的
    if (label_name == 'any') {  //  无类型
      await db.collection("post").where({
        postedby: poster,
        [order] : order_way ? _.lt(last_order) : _.gt(last_order)
      }).orderBy(order, order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    } else {  //  有类型
      if (label_name == 'hole') { //  黑洞类型
        await db.collection("post").where({
          postedby: poster,
          type: _.in(['study', 'topic', 'message', 'activity', 'propose']),
          [order] : order_way ? _.lt(last_order) : _.gt(last_order)
        }).orderBy(order, order_way)
        .limit(MAX_LIMIT).get().then(res => {
          ret = res
        })
      } else {  //核心类型
        await db.collection("post").where({
          postedby: poster,
          type: label_name,
          [order] : order_way ? _.lt(last_order) : _.gt(last_order)
        }).orderBy(order, order_way)
        .limit(MAX_LIMIT).get().then(res => {
          ret = res
        })
      }
    }
  } else if (wall_name == 'any') { //  无类型
    await db.collection("post").where({
      [order] : order_way ? _.lt(last_order) : _.gt(last_order)
    }).orderBy(order, order_way)
    .limit(MAX_LIMIT).get().then(res => {
      ret = res
    })
  } else if (label_name == '全部') { //  无标签
    if (exposure) { //  有曝光
      await db.collection("post").where({
        type : wall_name,
        price: order_way ? _.lt(last_order) :_.gt(last_order)
      }).orderBy(order, order_way).orderBy('price', order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    } else {  //  无曝光
      await db.collection("post").where({
        type : wall_name,
        [order] : order_way ? _.lt(last_order) : _.gt(last_order)
      }).orderBy(order, order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    }
  } else {  //  有标签
    if (exposure) { //  有曝光
      await db.collection("post").where({
        type : wall_name,
        label : label_name,
        [order] : order_way ? _.lt(last_order) : _.gt(last_order)
      }).orderBy(order, order_way).orderBy('price',order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    } else {  //  无曝光
      await db.collection("post").where({
        type : wall_name,
        label : label_name,
        [order] : order_way ? _.lt(last_order) : _.gt(last_order)
      }).orderBy(order, order_way)
      .limit(MAX_LIMIT).get().then(res => {
        ret = res
      })
    }
  }

  return ret
}