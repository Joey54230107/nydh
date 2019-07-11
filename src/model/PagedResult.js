export default function PagedResult(){
  this.pages = 0  //总共几页数据
  this.count = 0  //总共几条数据
  this.items = [] //记录数组
  this.pagesize = 10 //每页几条数据
  this.currPage = 1 //当前第几页
  this.more = true

  this.setDatas = (rs, append, currPage) => {
    this.pages = rs.pages || 0
    this.count = rs.count || 0
    if(rs.items){
      (!append) && this.clear()
      rs.items.forEach(item => {
        this.items.push(item)
      })
      //this.items = this.items.concat(rs.items)
    }
    if(currPage != undefined){
      this.currPage = currPage
    }
    this.more = (this.pages != this.currPage)
  }

  this.clear = () => {
    this.items.splice(0, this.items.length)
  }
}
