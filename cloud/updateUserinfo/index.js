const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()

exports.main = async (event, context) => {
  var jointime = new Date().getTime()
  if (event.type != 'joinCommunity') {
    return db.collection('check').doc(event._id).update({
      data: {
        done: true,
        pass: Boolean(event.index)
      }
    })
  } else {
    db.collection('community').where({
      clubname: event.clubname
    }).add({
      data: {
        member: {
          jointime: jointime,
          openid : event.applicant//申请者的openid
        }
      }
    })
    return db.collection('check').doc(event._id).update({
      data: {
        done: true,
        pass: Boolean(event.index)
      }
    })
  }
}