// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "marwall-ixou8"
})


// 云函数入口函数
exports.main = async (event, context) => {

  var list = await cloud.database().collection('codeList').get()
  list = list.data[0].list
  var time = event.time.toString()
  time = time.substring(time.length - 5, time.length)
  var code = "" + list[parseInt(time.substring(0, 2))] + list[parseInt(time.substring(2, 3))] + list[parseInt(time.substring(3, 4))] + list[parseInt(time.substring(4, 5))]
  var checkMsg = false
  if(code == event.code)
    checkMsg = true
  return {checkMsg:checkMsg,code:event.code}
}