import utils from '@/plugins/utils'

function Goods(data = {}){
  this.uuid = data.uuid || utils.getUuid()
  this.imgs = data.imgs || ''
  this.specs = data.specs || []
  this.fuuid = data.fuuid || '' //这个是不能自己生成的（group的uuid)
  this.ispublic = data.ispublic
  this.fkeytype = data.fkeytype || '023002'
  this.scname = data.scname || ''
  this.alias = data.alias || ''
  this.keyword = data.keyword || ''
  this.descript = data.descript || ''
  this.stock = data.stock || ''
  this.saled = data.saled || ''
  this.category = data.category || {}
  this.bzst = data.bzst || '003001'

  if(this.ispublic == undefined){
    this.ispublic = true
  }else{
    if(this.ispublic == '0'){
      this.ispublic = false
    }else if(this.ispublic == '1'){
      this.ispublic = true
    }
  }

  if(this.imgs){
    this.imgs = this.imgs.split(',')
  }else{
    this.imgs = ['','','']
  }
}

export default Goods
