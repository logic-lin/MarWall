const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  if (event.type == 'like') {
    // 更新 comment.status.like
    return await db.collection('comment').where({
      commentid: event.commentid
    }).update({
      data: {
        'status.like': event.like ? _.pull(event.liker) : _.push([event.liker])
      }
    }).then(res => {
      // 更新 userinfo.status.like.commentlike
      db.collection('userinfo').where({
        openid: event.liker
      }).update({
        data: {
          'status.like.commentlike': event.like ? _.pull(event.commentid) : _.push([event.commentid])
        }
      })
    })
  } else if (event.type == 'report') {
    var reporter = cloud.getWXContext().OPENID
    var current = new Date().getTime()
    var reportid = current + event.commentid + reporter
    // 上传 report
    await db.collection('report').add({
      data: {
        reportid: reportid,
        reportedtime: current,
        reportedby: reporter,
        type: 'comment',
        reportobj: event.commentid,
        reason: event.reason,
        reply: {},
        done: false
      }
    }).then(res => {
      // 更新 comment.status.report
      db.collection('comment').limit(1).where({
        commentid: event.commentid
      }).update({
        data: {
          'status.report': _.push([reportid])
        }
      })
    }).then(res => {
      // 更新 userinfo.report
      db.collection('userinfo').limit(1).where({
        openid: reporter
      }).update({
        data: {
          'status.report': _.push([reportid])
        }
      })
    })
    return {
      reportid: reportid
    }
  }
}