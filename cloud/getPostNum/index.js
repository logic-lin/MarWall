const cloud = require('wx-server-sdk')
cloud.init({
  env: "marwall-ixou8"
})
const db = cloud.database()

exports.main = async (event, context) => {
  var countResult = await db.collection('post').count()
  const total = countResult.total
  return {
    total: total
  }
}