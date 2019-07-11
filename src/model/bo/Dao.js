import utils from '@/plugins/utils'

/*
  数据响应对象, 除了真实数据对象以外, 还包含了数据响应的状态
  status: 0=无数据(数据长度=0, 如果服务端返回错误, 也当做长度0处理), 1=等待响应中, 2=返回了数据(数据长度<>0)
* */
function Dao(status = 0, data = []){
  this.status = status
  this.data = data
}

export default Dao
