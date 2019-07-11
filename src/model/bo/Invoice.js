import utils from '@/plugins/utils'

function Invoice(data = {}){
  this.expdays = data.expdays || '5' //过期天数
  this.remark = data.remark || '' //备注
  this.cityid = data.cityid || '' //金主的cityid
  this.title = data.title || '' //发货单标题
  this.userid = data.userid || '' //金主的userid
  this.invoices = [] //发货单下的发货人数组
  this.uuid = data.uuid || utils.getUuid() + ''
}

Invoice.totalPrice = function(){
  let total = 0
  this.invoices && this.invoices.forEach(supplier => {
		supplier.categorys && supplier.categorys.forEach(category => {
			category && category.total && (total = total + category.total)
    })
  })
  return total
}

Invoice.addSupplier = function(supplier, category){
  let supplierExited = false, categoryExited = false, _supplier = {
    supplierid: supplier.user.userid,
    uuid: utils.getUuid(),
    items: []
  }
  for(let i=0; i<this.invoices.length; i++){
    let __supplier = this.invoices[i]
    if(__supplier.supplierid == supplier.user.userid){
      supplierExited = true
      _supplier = __supplier
      break;
    }
  }
  for(let i=0; i<_supplier.items.length; i++){
    let _category = _supplier.items[i]
    if(_category.scid == category.id){
      categoryExited = true
      Object.assign(_category, {
        amount: category.amount2,
        total: category.total,
        price: category.price
      })
      break ;
    }
  }
  console.log('category', JSON.stringify(category))
  categoryExited || _supplier.items.push({
    amount: category.amount2,
    total: category.total,
    price: category.price,
    ptype: '034001',
    sctype: '020005',
    scid: category.id
  })
  supplierExited || this.invoices.push(_supplier)
}

export default Invoice
