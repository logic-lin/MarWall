const cloud = require('wx-server-sdk')
cloud.init({
  env: 'marwall-ixou8'
})
const db = cloud.database()
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  const countResult = await db.collection('post').count()
  const total = countResult.total
  console.log(total)
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('post').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg
    }
  })
}