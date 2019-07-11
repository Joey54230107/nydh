import addr from '../../../config/address'
import CategoryBo from '@/model/bo/Category'
import utils from '@/plugins/utils'

function Order(data = {}){
  this.orderid = data.orderid || Math.random() + ''
	this.title = data.title || '未命名的报价单'
  this.name = data.name || ''
  this.orderno = data.orderno || ''
  this.itemcount = data.itemcount || '0'
  this.categorys = []
  this.cityid = data.cityid || '1'
  this.createtime = utils.formatTime(data.createtime || '', '-')
	this.createdate = utils.formatDate(data.createdate || '', '-')
  this.taktime = utils.formatTime(data.taktime || '')
  this.latestime = data.latestime || ''
  this.userid = ''
  this.visib = data.visib || '1'
  this.categorynum = data.categorynum || 0
  this.chose = false
  this.uuid = data.uuid || utils.getUuid()
  this.suppliers = data.suppliers || '' //这里是简易的供应商列表
  this.suppcount = data.suppcount || 0
  this.takcount = data.takcount || 0
  this.catecount = data.catecount || 0
	this.takid = data.takid || ''
  this.remark = data.remark || ''
  this.expdays = data.expdays || '5'

  this.getTotalNum = function(){
    let num = 0;
    this.categorys && this.categorys.forEach(category => {
      num =+ (category.supplierNum || 0)
    })
    return num
  }
}

Order.addCategory = function(data, sort){
  //let category = (data instanceof CategoryBo) ? data : new CategoryBo(data)
  sort ? this.categorys.push(data) : this.categorys.unshift(data)
}

Order.save = function(category){
  let params = {
    uuid: this.uuid,
    title: this.title,
    remark: this.remark || '',
    items: [],
		expdays: 5,
    orderid: this.orderid
  }
  let tmp = {
    uuid: category.uuid,
    ctid: category.ctid,
    cname: category.cname,
    visib: category.visib,
    ctname: category.ctname,
    remark: category.remark,
    amount: category.amount,
    limit: category.limit,
    specs: [],
    allots: [],
    imgs: [],
    sctype: '020001',
    scid: '0'
  }
  category.specs && category.specs.forEach(spec => {
    if((spec.min != '') || (spec.max != '')){
      tmp.specs.push(spec)
    }
  })
  category.suppliers && category.suppliers.forEach(supplier => {
    tmp.allots.push({
      userid: supplier.user.userid,
      amount: supplier.amount,
      uuid: supplier.uuid
    })
  })
  category.imgs && category.imgs.forEach(img => {
    img && tmp.imgs.push(img)
  })
  tmp.imgs.length > 0 ? (tmp.imgs = tmp.imgs.join(',')) : (tmp.imgs = '')
  params.items.push(tmp)
  return params
}

export default Order
