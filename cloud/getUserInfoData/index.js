const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()
const MAX_LIMIT = 20

// 云函数入口函数
exports.main = async (event, context) => {
  var openid = event.openid

  switch (event.label_index) {
    case 0:
      if (event.order_index == 0) {
        await db.collection("check").where({
          data: {
            reviewer: [openid]
          },
        }).orderBy('checkedtime', 'desc').get().then(res => {
          ret = res
        })
      } else if (event.order_index == 1) {
        await db.collection("check").where({
          data: {
            applicant: openid
          },
        }).orderBy('checkedtime', 'desc').get().then(res => {
          ret = res
        })
      }
      break
    case 1:
      if (event.order_index == 0) {
        await db.collection("feedback").where({
          feedbackedby: openid,
        }).orderBy('feedbackedtime', 'desc').get().then(res => {
          ret = res
        })
      }else if(event.order_index == 1){
        await db.collection("report").where({
          reportedby: openid,
        }).orderBy('feedbackedtime', 'desc').get().then(res => {
          ret = res
        })
      }
      break
    case 2:
      await db.collection("check").where({
        data: {
          done: Boolean(event.order_index == 0 || event.order_index == 2),
          pass: Boolean(event.order_index == 2),
        },
        done: false
      }).orderBy('checkedtime', 'desc').get().then(res => {
        ret = res
      })
      break
  }


  return ret
}