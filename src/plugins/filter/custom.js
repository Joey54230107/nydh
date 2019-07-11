const toDate = function(str, spliter){
	if(str){
		let d = new Date(parseInt(str))
		return d.getFullYear() + spliter + (d.getMonth() + 1) + spliter + d.getDate()
	}
	return ''
}

const toTime = function(str, spliter){
  if(str){
    let d = new Date(parseInt(str))
    return d.getFullYear() + spliter + (d.getMonth() + 1) + spliter + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }
  return ''
}

const price = function(str, repStr = ''){
	return (str != undefined) ? Number(str + '').toFixed(2) : repStr
}

const toInt = function(str, repStr = ''){
	if(str){
		return Number(str) === Math.floor(str) ? parseInt(str) : Number(str).toFixed(2)
	}
	return repStr
}

const toDateStr = function(str){
	if(str){
    let now = (new Date()).getTime()
		let year = 3600*1000*24*365, month = 3600*1000*24*30, day = 3600*1000*24, hour = 3600*1000, min = 60*1000
    str = Math.abs((new Date(str)).getTime() - now)
    console.log(str, year, str - year)
		if(str >= year){
			return '1年前'
		}else{
			if(str >= month){
				return parseInt(str / month) + '月前'
			}else{
				if(str >= day){
					return parseInt(str / day) + '天前'
				}else{
					if(str >= hour){
						return parseInt(str / hour) + '小时前'
					}else{
						if(str >= min){
							return parseInt(str / min) + '分钟前'
						}else{
							return '刚刚'
						}
					}
				}
			}
		}
	}
	return ''
}

export {toDate, price, toInt, toTime, toDateStr}
