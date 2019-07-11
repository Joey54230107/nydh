const toTime = function(str, spliter){
  if(str){
    let d = new Date(parseInt(str))
    return d.getFullYear() + spliter + (d.getMonth() + 1) + spliter + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }
  return ''
}

export default toTime
