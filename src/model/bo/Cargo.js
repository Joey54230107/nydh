import utils from '@/plugins/utils'

function Cargo(){
  this.id = Math.random() + ''
  this.total = 0
  this.amount = 0
  this.items = []
}

Cargo.add = function(item){
  this.items.push(item)
  if(item.amount){
    this.amount = parseInt(item.amount) + this.amount
    this.total = (parseFloat(item.total || 0) + parseFloat(this.total)).toFixed(2)
  }
}

Cargo.remove = function(item){
  this.items.forEach((_item, idx) => {
    if(_item.id == item.id){
      this.amount = parseInt(this.amount) - item.amount
      this.total = (parseFloat(this.total) - parseFloat(item.total || 0)).toFixed(2)
      this.items.splice(idx, 1)
    }
  })
}

Cargo.clear = function(){
  this.total = 0
  this.amount = 0
  this.items.splice(0, this.items.length)
}

export default Cargo
