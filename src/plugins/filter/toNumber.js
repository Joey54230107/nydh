const toNumber = function(str = '', autoFill){
  str = str + ''
  if(str && (!isNaN(str))){
    if(autoFill){
      if(!(str.indexOf('.') > -1)){
        return Number(str).toFixed(1)
      }
      return str
    }
    return Number(str).toFixed(2)
  }
  return '—'
}

export default toNumber
