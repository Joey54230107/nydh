import utils from '@/plugins/utils'

function Group(data = {}){
  this.uuid = data.uuid || utils.getUuid()
  this.userid = data.userid || utils.getLocalUser().userid
  this.farmid = data.farmid || ''
  this.title = data.title || ''
  this.addr = data.addr || ''
  this.linker = data.linker || ''
  this.linkertel = data.linkertel || ''
  this.remark = data.remark || ''
}

export default Group
