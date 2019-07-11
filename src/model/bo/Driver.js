import utils from '@/plugins/utils'

function Driver(data = {}){
  this.verouteid = data.verouteid || ''
  this.plateno = data.plateno || ''
  this.drivername = data.drivername || ''
	this.drivertel = data.drivertel || ''
	this.trucktype = data.trucktype || ''
  this.biz = data.biz || ''
  this.remark = data.remark || ''
  this.tag = data.tag || '1'  //默认用户自己维护
	this.uuid = data.uuid || utils.getUuid()
}

export default Driver
