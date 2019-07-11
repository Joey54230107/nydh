/*用户对象*/
import addr from '../../../config/address'

function User(data = {}){
  this.userid = data.userid || ''
  this.type = 'self'  //用户类别，地址簿里也是该对象
  this.name = data.name || ''  //真实姓名
  this.nickname = data.nickname || '' //昵称
  this.mobile = data.mobile || ''  //*手机号码（也是登录名）
  this.username = data.username || 'test' //用户登录名(仅在登录时用)
  this.url = data.url || '' //addr.SERVER_ADDRESS + '/cdn/img/photo@' + window.devicePixelRatio + '.jpg',
  this.isrealname = data.isrealname || '0'
  this.messages = data.messages || 0 //用户消息数（这里不放数组，只取消息数， 下同）
  this.orders = data.orders || 0 //用户订单数
  this.supports = data.supports || 0 //用户供应数
  this.sells = data.sells || 0  //用户求购数
  this.inquirys = data.inquirys || 0 //用户询价单数
  this.accounts = data.accounts || 0 //用户账单数
  this.sex = data.sex || '025001' //男
  this.level = data.level || '3'
  this.cityid = data.cityid || ''
  this.token = ''
  this.concern = data.concern || 0  //关注好友数
  this.concerned = data.concerned || 0  //被关注数
  this.relation = data.relation || '' //和当前登录用户关系

  this.adminUrl = data.adminUrl || ''
}

export default User
