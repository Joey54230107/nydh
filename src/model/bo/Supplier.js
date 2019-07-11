import UserBo from '@/model/bo/User'
import utils from '@/plugins/utils'

function Supplier(data = {}){
  this.user = new UserBo(data) || {}
  this.amount = data.amount || ''
  this.price = data.price || ''
  this.total = data.total || ''
  this.type = data.type || '0'
  this.uuid = data.uuid || utils.getUuid()
  this.chose = true
  this.hasreport = data.hasreport || 0  //是否已报价（计算得出）

  this.categorys = [] //该属性仅对确定要发货的供应商有效, 标识该供应商名下提供的品类列表

  if(this.amount && this.price && this.total){
    this.hasreport = 1
  }
}

export default Supplier
