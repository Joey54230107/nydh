import utils from '@/plugins/utils'

function Spec(data = {}){
  this.id = data.id || ''
  this.name = data.name || ''
  this.unit = data.unit || ''
  this.unitstr = data.unitstr || ''
  this.max = (data.max == undefined || data.max == null) ? '' : data.max
  this.min = (data.min == undefined || data.min == null) ? '' : data.min
  this.uuid = data.uuid || utils.getUuid()
  this.stand = data.stand || '1' //默认是系统品类
}

export default Spec
