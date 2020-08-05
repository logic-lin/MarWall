const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})

exports.main = async (event, context) => {
  
  return cloud.database().collection(event.kind).doc(event._id).update({
    data: {
      done:event.done,
      reply:event.reply
    }
  })
}