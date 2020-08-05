const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})

exports.main = async (event, context) => {
  const db = cloud.database()
  db.collection('check').doc(event._id).update({
    data: {
      pass:event.pass,
      done:true
    } 
  })
  if(event.pass)
    db.collection('community').add({
      data:{
        president:event.data.president,
        admin:[event.data.president],
        clubname:event.data.clubname,
        structure:event.data.structure,
        member:[{openid:event.data.president,jointime:new Date().getTime()}]
      }
    })
}