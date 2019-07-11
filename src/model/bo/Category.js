import addr from '../../../config/address'
import SpecBo from '@/model/bo/Spec'
import SupplierBo from '@/model/bo/Supplier'
import utils from '@/plugins/utils'

function Category(data = {}){
  this.id = data.itemid || '' //业务标识（itemid, 会变）
  this.ctid = data.ctid || Math.random() + '' //标识
  this.ctname = data.ctname || '' //品类名
  this.cname = data.cname || '' //品类类别
  this.specs = data.specs || []
  this.suppcount = data.suppcount || '0'
  this.suppliers = data.suppliers || []
  this.amount = data.amount || '' //数量
  this.visib = data.visib || '009001' //隐私(谁可见)
  this.limit = data.limit || '5' //限制供应商数
  this.remark = data.remark || '' //备注
  this.url = data.url || '' //品类本身的图片
  this.chose = false
  this.taked = data.taked || 0
  this.imgs = data.imgs || ''
	this.uuid = data.uuid || utils.getUuid()
  this.allotid = data.allotid || ''
  this.reportnum = 0  //该品类已报价供应商数
  this.published = data.published

  if(this.specs.length > 0){
    this.specs.forEach((spec, idx) => {
      this.specs[idx] = new SpecBo(spec)
    })
  }

  if(this.imgs == ''){
    this.imgs = [{},{},{}]
  }else{
    let imgs = this.imgs.split(',')
    imgs.forEach((img, idx) => {
      imgs[idx] = {path: (img || '')}
    })
    this.imgs = imgs
  }
}

Category.setSpecs = function(specs){
  let list = []
  specs && Array.isArray(specs) && specs.length > 0 && specs.forEach(item => {
    let spec = new SpecBo(item), hasIn = false
    this.specs.forEach(_spec => {
      if(_spec.id === spec.id){
        hasIn = true
      }
    })
    if(!hasIn){
      //如果标准的已经有了， 就不添加了
      this.specs.push(spec)
    }
  })
}

/*保存category时对规格过滤下，将用户没有填写的规格去掉*/
Category.filterSpecs = function(){
  this.specs && this.specs.forEach(spec => {
		spec.chose = (spec.min != '' || spec.max != '')
  })
}

Category.matching = function(user, currpage){
  let params = {
    userid: user.userid,
		cateid: this.ctid,
		specs: [],
    t: '0',
		curpage: currpage
  }
  this.specs && this.specs.forEach(spec => {
		spec.max || (spec.max = '')
		spec.min || (spec.min = '')
    if(spec.min != '' || spec.max != ''){
      if(spec.min != '' && spec.max != ''){
				params.specs.push(spec.id + '_' + spec.min + '_' + spec.max)
      }else if(spec.min != ''){
				params.specs.push(spec.id + '_' + spec.min + '_' + spec.min)
			}else if(spec.max != ''){
				params.specs.push(spec.id + '_' + spec.max + '_' + spec.max)
			}
    }
  })
  params.specs.length > 0 ? (params.specs = params.specs.join('@')) : (params.specs = '')
  return params
}

/*
* 设置该品类下的供应商，从好友及陌生人列表中抽取选中的
* Attention: 还要算上用户自己自定义的供应商
* */
Category.filterSuppliers = function(){
  let suppcount = 0
  this.suppliers && this.suppliers.forEach(supplier => {
    supplier.chose && (++suppcount)
  })
  this.suppcount = suppcount
}

/*设置简易供应商（只显示头像的那种）*/
Category.setSimpleSuppliers = function(){
  if(this.suppliers != ''){
    let _suppliers = [], suppliers = this.suppliers ? this.suppliers.split(',') : []
    suppliers.forEach(supplier => {
      _suppliers.push(new SupplierBo({
        url: supplier.split(';')[0],
        hasreport: supplier.split(';')[1],
        userid: supplier.split(';')[2],
        sex: supplier.split(';')[3],
        isrealname: supplier.split(';')[4]
      }))
      if(supplier.split(';')[1] == 1){
        this.reportnum = this.reportnum + 1
      }
    })
    this.suppliers = _suppliers
  }else{
    this.suppliers = []
  }
}

export default Category
