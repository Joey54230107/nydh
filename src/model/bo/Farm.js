import utils from '@/plugins/utils'

const Farm = function(data = {}){
  this.linker = data.linker || ''
  this.imgs = data.imgs || []
  this.name = data.name || ''
  this.cityid = data.cityid || ''
  this.addr = data.addr || ''
  this.descript = data.descript || ''
  this.uuid = data.uuid || utils.getUuid()
  this.coords = data.coords || ''
  this.linktel = data.linktel || ''
}

export default Farm
