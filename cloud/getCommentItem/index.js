const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})

exports.main = async (event, context) => {
  var comment = {}
  await cloud.database().collection('comment').limit(1).where({
    commentid: event.commentid
  }).get().then(res => {
    comment = res.data[0]
  })
  return {
    comment: comment
  }
}