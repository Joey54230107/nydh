const Mapper = function(){
  this.items = {}

  this.addItem = (name, val = 0) => {
    if(name in this.items){
      let itemVal = (!isNaN(this.items[name])) ? parseFloat(this.items[name]) : 0
      this.items[name] = itemVal + ((!isNaN(val)) ? parseFloat(val) : 0)
    }else{
      this.items[name] = (!isNaN(val)) ? parseFloat(val) : 0
    }
  }

  this.init = (name) => {
    this.items[name] = 0
  }

  this.initAll = () => {
    this.items = {}
  }

  this.refresh = (name, arr = [], field = '') => {
    this.items[name] = 0
    arr && Array.isArray(arr) && arr.forEach(item => {
      field && this.addItem(name, item[field])
    })
  }
}

export default Mapper
