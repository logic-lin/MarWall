const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})

exports.main = async (event, context) => {
  var post = {}
  await cloud.database().collection('post').limit(1).where({
    postid: event.postid
  }).get().then(res => {
    post = res.data[0]
  })
  return {
    post: post
  }
}