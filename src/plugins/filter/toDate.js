const toDate = function(str, spliter){
  if(str){
    let d = new Date(parseInt(str))
    return d.getFullYear() + spliter + (d.getMonth() + 1) + spliter + d.getDate()
  }
  return ''
}

export default toDate
