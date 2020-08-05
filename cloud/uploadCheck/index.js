const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  var applicant = cloud.getWXContext().OPENID
  var current = new Date().getTime()
  var checkid = current + applicant
  event.check.checkedtime = current
  event.check.checkid = checkid
  if (event.check.type == 'userinfo') {
    // 将 reviewer 改为数组
    event.check.data.reviewer = [event.check.data.reviewer]
    // 申请联系方式，加入 check
    await db.collection('check').add({
      data: event.check
    }).then(res => {
      // 加入 ckeck 完成，更新 userinfo.status.check
      db.collection('userinfo').where({
        openid: applicant
      }).update({
        data: {
          'status.check': _.push(checkid)
        }
      })
    })
  } else if (event.check.type == 'joinCommunity') {
    // 首先找到社团所有能够接收到该申请的人
    await db.collection('community').where({
      president: event.check.data.reviewer
    }).get().then(res => {
      // 重新设置 reviewer 为 admin 数组，然后上传至 check
      var admin = res.data[0].admin
      event.check.data.reviewer = admin
      db.collection('check').add({
        data: event.check
      }).then(res => {
        // 加入 ckeck 完成，更新 userinfo.status.check
        db.collection('userinfo').where({
          openid: applicant
        }).update({
          data: {
            'status.check': _.push(checkid)
          }
        })
      })
    })
  }
  return {
    checkid: checkid
  }
}