const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  if (event.type == 'post') { //  删除帖子(传入 postid, postedby, comment, report)
    // 先删除帖子
    db.collection('post').limit(1).where({
        postid: event.postid
    }).remove().then(res => {
      // 遍历评论
      for (let commentid of event.comment) {
        // 获取评论的举报
        db.collection('comment').where({
            commentid: commentid
        }).get().then(res => {
          // 删除评论的举报
          let report = res.data[0].status.report
          db.collection('report').where({
            reportid: _.in(report)
          }).remove()
        })
        db.collection('comment').where({
          commentid: commentid
        }).remove()
      }
      // 删除帖子的举报
      db.collection('report').where({
        reportid: _.in(event.report)
      }).remove()
      // 删除帖子发布者的帖子记录
      db.collection('userinfo').where({
        openid: event.postedby
      }).update({
        data: {
          'status.post': _.pull(event.postid)
        }
      })
    })
  } else if (event.type == 'comment') { // 删除评论(传入 commentid, commentedby, report)
    // 通过 commentid 计算 postid
    let start_index = String(new Date().getTime()).length
    let length = String(new Date().getTime()).length + cloud.getWXContext().OPENID.length
    let postid = event.commentid.substr(start_index, length)
    // 先删除帖子的评论记录
    db.collection('post').where({
      postid: postid
    }).update({
      data: ({
        'status.comment': _.pull(event.commentid)
      })
    }).then(res => {
      // 删除评论
      db.collection('comment').where({
        commentid: event.commentid
      }).remove().then(res => {
        // 删除评论的举报
        db.collection('report').where({
          reportid: _.in(event.report)
        }).remove()
      })
      // 删除评论发布者的评论记录
      db.collection('userinfo').where({
        openid: event.commentedby
      }).update({
        data: {
          'status.comment': _.pull(event.commentid)
        }
      })
    })
  }
}