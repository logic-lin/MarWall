const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})

exports.main = async (event, context) => {
  var post = {}
  await cloud.database().collection('post').limit(1).field({
    postid: true,
    type: true,
    title: true,
    image: true,
    label: true,
    price: true
  }).where({
    postid: event.postid
  }).get().then(res => {
    post = res.data[0]
  })
  return {
    post: post
  }
}