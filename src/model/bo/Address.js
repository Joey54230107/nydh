import utils from '@/plugins/utils'

function Address(data = {}){
  this.addrid = data.addrid || ''
  this.gainer = data.gainer || ''
  this.gainertel = data.gainertel || ''
	this.provid = data.provid || ''
	this.prov = data.prov || ''
	this.cityid = data.cityid || ''
	this.city = data.city || ''
	this.address = data.address || ''	//地址全拼
	this.uuid = data.uuid || utils.getUuid()
}

export default Address
