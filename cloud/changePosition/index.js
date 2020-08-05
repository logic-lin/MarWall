const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})

exports.main = async (event, context) => {
  
  return cloud.database().collection('community').doc(event._id).update({
    data: {
      [`member.${event.memberindex}.position`]:event.position
    }
  })
}