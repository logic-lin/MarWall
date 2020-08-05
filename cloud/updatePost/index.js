const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  if (event.type == 'like') { // 传入 postid, like, liker
    // 更新 post.status.like
    return await db.collection('post').where({
      postid: event.postid
    }).update({
      data: {
        'status.like': event.like ? _.pull(event.liker) : _.push([event.liker])
      }
    }).then(res => {
      // 更新 userinfo.status.like.postlike
      db.collection('userinfo').where({
        openid: event.liker
      }).update({
        data: {
          'status.like.postlike': event.like ? _.pull(event.postid) : _.push([event.postid])
        }
      })
    })
  } else if (event.type == 'view') {  // 传入 postid
    // 更新 post.status.view
    var viewer = cloud.getWXContext().OPENID
    return await db.collection('post').limit(1).where({
      postid: event.postid
    }).update({
      data: {
        'status.view': _.push([viewer])
      }
    }).then(res => {
      // 更新 userinfo.status.view
      db.collection('userinfo').limit(1).where({
        openid: viewer
      }).update({
        data: {
          'status.view': _.push([event.postid])
        }
      })
    })
  } else if (event.type == 'report') {  // 传入 postid, reason
    var current = new Date().getTime()
    var reporter = cloud.getWXContext().OPENID
    var reportedtime = current
    var reportedby = reporter
    var reportid = current + event.postid + reporter
    var report = {
      reportid: reportid,
      reportedtime: reportedtime,
      reportedby: reportedby,
      type: 'post',
      reportobj: event.postid,
      reason: event.reason,
      reply: {},
      done: false
    }
    // 将 report 加入数据库
    await db.collection('report').add({
      data: report
    }).then(res => {
      // 更新 userinfo.status.report
      db.collection('userinfo').where({
        openid: reporter
      }).update({
        data: {
          'status.report': _.push(reportid)
        }
      })
    })
  }
}