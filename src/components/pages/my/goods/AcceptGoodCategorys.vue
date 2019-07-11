<template>
  <normal-layout class="categorys-page" :loaded="loaded">
    <error-pop :msg="errMsg" />
    <good-supplier-categorys-header :supplier="supplier" @newCategory="newCategory" />
    
    <div class="supplier-info-case">
      <h3>{{good.total | price}}</h3>
    </div>
    
    <div class="categorys-case auto-fill">
      <scroller class="categorys-inner-case" v-if="categorys.length > 0">
        <div style="height:auto; width:100%;" v-for="page in pages" v-show="page.chose">
          <slider-blocker v-for="(category, idx) in categorys" :id="'sup_' + idx" :item="category" :sliderWidth="(category.datatype == '1' || category.datatype == '2') ? '50' : '25'" class="category-slider-case" :key="category.ctid">
            <div class="category-inner">
              <div class="category-info-case auto-fill">
                <h3>{{category.ctname}}</h3>
                
                <!--原价格-->
                <h4><span class="price">{{category.total | price}}</span></h4>
                <h5><span class="price">{{category.price | price}}</span></h5>

                <span class="order-tip-case" :class="'order-tip-case-' + (category.amounted > 0)" @tap.stop="categoryInOrder(category)">
                  需求 {{category.amount | toInt}} 株
                </span>
              </div>
              <label v-if="category.datatype == '1'" class="alter-reason">{{category.alterreason}}</label>
            </div>
          </slider-blocker>
        </div>
      </scroller>
    </div>
    <footer class="footer-case">
      <button class="btn-fahuo" @tap="select">创建订单</button>
      <!--<button class="btn-add" :class="'btn-add-' + (categoryLen > 0)" @tap="add" v-if="edit">添加到我的订单中（{{categoryLen}}）</button>-->
    </footer>

    <masker-dialog :size="size[winType]" :show="showDialog" @closeHandler="close" :force="true">
      <!--显示该发货单下所有满足发货条件的品类列表-->
      <div class="order-case" v-if="winType == 'editor'">
        <header class="header">
          <label class="title">将品类添加到订单中</label>
          <span class="iconfont icon-close" @tap="close"></span>
        </header>
        <div class="order-tipper" v-if="orders.length > 0">
          <label class="total-price">{{currOrderAmount | price}}</label>
          <button class="add-order" @tap="newOrder">新订单</button>
          <button class="publish-order" @tap="publishOrder">发布</button>
          <button class="remove-order" @tap="deletes">{{isDelete ? '取消' : '删除'}}</button>
        </div>
        <div class="auto-fill order-list-case">
          <div class="order-hori-case" v-if="orders.length > 0">
            <div class="order-hori-inner-case">
              <div class="order-item-case auto-fill" @tap.stop="editorOrder(order)">
                <span class="iconfont icon-close sharks1" v-if="isDelete" @tap="deleteOrder(order, idx)"></span>
                <h4>订单编号: {{currOrder.tradeno}}</h4>
                <h4>创建日期: {{currOrder.createtime | toTime('-')}}</h4>
                <h4>包含品类种类数: {{currOrder.items.length}}</h4>
              </div>
              <div class="change-order" @tap.stop="changeOrders">
                切换订单
                <span class="iconfont icon-right-arr"></span>
              </div>
            </div>
          </div>
          <div class="order-detail-case auto-fill" v-if="currOrder && orders.length > 0">
            <scroller class="order-cates-scroller auto-fill" :style="style">
              <div class="no-orders" v-if="currOrder.items.length == 0">
                <span class="iconfont"></span>
                <h2>该订单下尚未分配品类</h2>
              </div>
              <slider-blocker v-for="(category, idx) in currOrder.items" :id="idx" class="category-exist-case" :item="category" :sliderWidth="35" :key="idx" v-if="currOrder.items.length > 0">
                <div class="category-exist-inner-case">
                  <slider-btn class="empty-delete" confirmStr="确定删除" @handler="remove(category, idx)" :style="{'right': '-35%'}">删除</slider-btn>
                  <h3>{{category.ctname}}</h3>
                  <div class="category-info-case auto-fill" @tap="backRemove(category)">
                    <h4>分配数量：{{category.amount | toInt}}株</h4>
                    <h5>{{category.price | price}}</h5>
                    <h3>{{category.total | price}}</h3>
                    <h6>所有订单中总分配数：{{mapper.items[category.ctname] | toInt}}株</h6>
                    <div class="option-case"></div>
                  </div>
                  <span class="edit-btn" @tap.stop="openModifyWin(category, idx)">修改</span>
                </div>
              </slider-blocker>
            </scroller>
            <div class="order-info-case">
              <button class="send-btn auto-fill" @tap="filterCategorys">从发货单中挑选品类</button>
            </div>
          </div>
          
          <div v-if="orders.length == 0 && init" class="order-empty-body-case">
            <img :src="require('@/assets/img/none.png')" class="none" />
            <h3>请先创建订单，然后从发货单中挑选品类放入订单中</h3>
            <button class="create-btn" @tap.stop="createOrder(void 0)">立即创建一张订单</button>
          </div>
        </div>

        <!--发货单品类选择下拉窗口-->
        <main class="chosed-categorys-case" :style="{'transform': 'translateY(' + y + ')'}">
          <div class="chose-masker" v-show="y == 0" @tap="closeInner(1)"></div>
          <scroller class="category-scoller">
            <label class="tip">请勾选要添加到订单中的品类，并输入分配数量</label>
            <slider-blocker v-for="(category, idx) in orderCategorys" :item="category" sliderWidth="0" :key="idx" class="category-item-case">
              <div class="category-item-inner-case">
                <a class="check iconfont icon-check" :class="'check-' + category.chose" @tap="select2(category)"></a>
                <label class="auto-fill" @tap="select2(category)">{{category.ctname}}</label>
                <div class="dispatch">
                  分配数量：
                  <span class="option-btn option-min" @tap.stop="numOption(category, false)">—</span>
                  <input type="tel" class="dis-num" v-model="category.loadNum" :class="'dis-num-' + category.err" />
                  <span class="option-btn option-plus" @tap.stop="numOption(category, true)">＋</span>
                </div>
                <button class="agree-btn" v-if="category.st == 4 || category.st == 19">对方修改后您已同意</button>
              </div>
            </slider-blocker>
          </scroller>
          <footer>
            <button @tap="addToOrder">添加到此订单中</button>
          </footer>
        </main>

        <!--修改已发布订单中品类的窗口, 包括分配数量, 单价, 总价, 理由-->
        <main class="chosed-categorys-case" :style="{'transform': 'translateY(' + y2 + ')'}">
          <div class="chose-masker" v-show="y2 == 0" @tap="closeInner(2)"></div>
          <div class="editor-category-scoller">
            <h3 class="tip-case">修改品类分配数量</h3>
            <ul class="auto-fill">
              <li>
                <input-text type="tel" @changeHandler="autoCal" :placeholder="copyCategory.amount" v-model="copyCategory.amount">数量 /株：</input-text>
              </li>
              <li>
                <input-text :placeholder="copyCategory.price" @changeHandler="autoCal" v-model="copyCategory.price">单价 /元：</input-text>
              </li>
              <li>
                <input-text :placeholder="copyCategory.total" v-model="copyCategory.total">总价 /元：</input-text>
              </li>
              <li class="li2 auto-fill">
                <button @tap="confirmModify">确定修改</button>
              </li>
            </ul>
          </div>
        </main>
        
        <main class="select-orders-case" :style="{'transform': 'translateY(' + y3 + ')'}">
          <div class="chose-masker" v-show="y3 == 0" @tap="closeInner(3)"></div>
          <span class="tipper">只显示未发布状态下的订单，已发布的请在我的订单中查看。当前发货单下共有{{orders.length}}张订单</span>
          <scroller class="order-list-case auto-fill">
            <div v-for="order in orders" class="order-item-case" @tap.stop="choseOrder(order)">
              <span class="iconfont icon-order"></span>
              <h4>订单编号: {{order.tradeno}}</h4>
              <h4>创建日期: {{order.createtime | toDate('-')}}</h4>
              <h4>包含品类种类数: {{order.items.length}}</h4>
              <span class="iconfont icon-check" v-show="order.tradeno == currOrder.tradeno"></span>
            </div>
          </scroller>
        </main>
      </div>

      <!--显示填写放弃理由-->
      <div class="reason-case" v-if="winType == 'reason'">
        <header class="header">填写放弃理由<span class="iconfont icon-close" @tap="close"></span></header>
        <div class="reason-case auto-fill">
          <div class="tiper">30个字</div>
          <textarea v-model="category.reason" maxlength="30" placeholder="为啥放弃呢" />
          <button @tap="agreeOrNagtive(0)">确定放弃</button>
        </div>
      </div>
    </masker-dialog>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import goodSupplierCategorysHeader from '@/components/comm/header/GoodSupplierCategorysHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import imageLoader from '@/components/comm/ImageLoader'
  import photos from '@/components/comm/Photos'
  import sliderBlocker from '@/components/comm/SliderBlocker'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  import license from '@/components/comm/License'
  import errorPop from '@/components/comm/ErrorPop'
  import {toInt, price} from '@/plugins/filter/custom'
  import MapperVo from '@/model/event/Mapper'
  import sliderBtn from '@/components/comm/SliderButton'
  import inputText from '@/components/comm/Input'
  
  export default {
    created(){
      window.addEventListener('addCategory', (e) => {
        this.addCategory(e.detail.category)
      })
    },
    
    components: {
      errorPop,
      scroller,
      normalLayout,
      goodSupplierCategorysHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			photos,
      sliderBlocker,
      maskerDialog,
      license,
      sliderBtn,
      inputText
    },

    data(){
      return {
        showError: false,
        errMsg: '',
        loaded: true,
        init: false,
        pages: [
          {name: '未发布的订单', chose: true, code: '037001', st: 0},
          {name: '已发布的订单', chose: false, code: '037002', st: 1}
        ],
        pageCode: '037001',
        edit: false,
        filterPage: mui.preload({
					id: 'orderFilter',
					url: config.CDN_ADDRESS + '/orderFilter',
					styles: {
						background: 'transparent'
					}
				}),
        size: {
        	'editor': window.screen.availHeight - 15,
          'orders': 400,
          'reason': 225
        },
        y: '100%',
        y2: '100%',
        y3: '100%',
				nodata: false,
				st: 0,
        winType: '',
        curpage: 1,
        orderCurPage: 1,
        categorys: [],
        orders: [],
        currOrder: null,
        category: {},
        copyCategory: {},
				loadStyle: {
					top: 0,
					opacity: 1
				},
        isDelete: false,
        showDialog: false,
        good: {},
        supplier: {
          supplier: {},
        },
        orderCategorys: [],
        mapper: new MapperVo(),
        style: {
          transform: 'translateY(0)',
          opacity: 1
        }
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				let searchWin = plus.webview.getWebviewById('searchCateory')
				plus.webview.show('myAcceptGoodCategorys', 'pop-in', 300, () => {
					this.search()
				})
        this.good = plus.webview.currentWebview().good
        this.supplier.supplier = plus.webview.currentWebview().good.owner
				if(searchWin){
					this.searchPage = searchWin
				}else{
					this.searchPage = mui.preload({
						id: 'searchCateory',
						url: config.CDN_ADDRESS + '/searchCateory'
					})
				}
			})
    },
  
    computed: {
      categoryLen(){
        let counter = 0
        this.categorys.forEach(cate => {
          cate.chose && (++counter)
        })
        return counter
      },
      
      totalOrderAmount(){
        let total = 0
        this.orders && this.orders.forEach(order => {
          let _total = 0, categorys = order.items
          categorys && categorys.forEach(category => {
            _total = _total + parseFloat(category.amount) * parseFloat(category.price)
          })
          total = total + parseInt(_total)
        })
        return total
      },
      
      currOrderAmount(){
        let total = 0
        this.currOrder && this.currOrder.items && this.currOrder.items.forEach(category => {
          total = price((total * 100 + parseFloat(category.total) * 100) / 100)
        })
        return total
      }
    },
    
    methods: {
      numOption(category, flag){
        let num = category.loadNum
        if(num > 0 && (!isNaN(num))){
          if(flag){
            category.loadNum = parseInt(num) + 1
          }else{
            category.loadNum = parseInt(num) - 1
          }
        }
      },
      
      autoCal(){
        let _price = this.copyCategory.price, amount = this.copyCategory.amount
        if(_price && amount && (!isNaN(_price)) && (!isNaN(amount))){
          this.copyCategory.total = price(_price * amount)
        }
      },
      
      choseOrder(order){
        if(order.tradeno != this.currOrder.tradeno){
          this.currOrder = order
        }
        this.closeInner(3)
      },
      
      changeOrders(){
        this.y3 = '0'
      },
      
			editorOrder(){
        plus.webview.create(config.CDN_ADDRESS + '/myOrderDetail', 'myOrderDetail', {}, {order: {
          invoiceid: this.currOrder.invoiceid,
          tradeid: this.currOrder.tradeid,
          purchaser: this.currOrder.purchaser
        }})
      },
      
			openModifyWin(category, idx){
			  console.log(JSON.stringify(category))
				this.y2 = '0'
        let cate = JSON.parse(JSON.stringify(category))
				cate.price = price(cate.price)
				cate.total = price(cate.total)
				cate.amount = toInt(cate.amount)
        this.category = category
        this.copyCategory = cate
        console.log(JSON.stringify(this.copyCategory))
      },
  
      openNum(category, idx){
			  if(!category.slider){
			    category.slider = document.getElementById('slider-inner-' + idx)
        }
			  let total = window.screen.availWidth * .45
        utils.animationLine(category.slider, 10, 8, total, false)
      },
      
      confirmDel(category){
			  category.confirm = true
      },

      /*订单中删除品类*/
      deleteCategoryFromOrder(category){
        service('deleteCategoryFromOrder', {
          uuid: category.uuid,
          dt: 1,
          reason: '',
          userid: utils.getLocalUser().userid,
          tradeid: this.currOrder.tradeid,
          invoiceid: this.currOrder.invoiceid
        }, rs => {
          utils.toast('操作成功')
          category.confirm = false
        })
      },
  
      backRemove(category){
        category.confirm = false
      },
      
      closeInner(flag){
        switch(flag) {
          case 1:
            this.y = '100%'
            break;
          case 2:
            this.y2 = '100%'
            break;
          case 3:
            this.y3 = '100%'
            break;
        }
      },

			openReason(category){
				category.reason = ''
      	this.category = category
        this.winType = 'reason'
        setTimeout(() => {
					this.showDialog = true
        }, 100)
      },
      
      /*创建一个新的订单*/
      newOrder(){
        utils.confirm('创建一张新订单', () => {
          this.createOrder.call(this, (order) => {
            utils.toast('创建成功')
            order.items = []
            order.status = '037001'
            this.orders.forEach(item => {
              item.chose = false
            })
            order.chose = true
            this.isDelete = false
            this.currOrder = order
            this.orders.unshift(order)
          })
        }, '从已有订单中挑选', () => {
          this.changeOrders()
        })
      },
      
      deletes(){
        utils.confirm('确定删除当前订单', () => {
          service('deleteOrder', {
            uuid: this.currOrder.uuid,
            dt: 0,
            userid: utils.getLocalUser().userid,
            tradeid: this.currOrder.tradeid,
            invoiceid: this.currOrder.invoiceid,
            remark: '未发布前删除订单'
          }, rs => {
            utils.toast('删除成功')
            this.orders.forEach(order => {
              order.chose = false
            })
            let len = this.orders.length
            for(let i=0; i < len; i++){
              if(this.orders[i].tradeid == this.currOrder.tradeid){
                this.orders.splice(i, 1)
                if(len > 1){
                  if(i == 0){
                    this.currOrder = this.orders[0]
                  }else{
                    this.currOrder = this.orders[i - 1]
                  }
                }
                this.currOrder.chose = true
                break ;
              }
            }
          })
        })
      },
  
      deleteOrder(order, idx){
        mui.confirm('确定要删除当前订单么？', '删除订单', ['否','是'], e => {
          if(e.index == 1){
            service('deleteOrder', {
              uuid: order.uuid,
              dt: 0,
              
              userid: utils.getLocalUser().userid,
              tradeid: order.tradeid,
              invoiceid: order.invoiceid,
              remark: '未发布前删除订单'
            }, rs => {
              utils.toast('删除成功')
              this.orders.splice(idx, 1)
              this.orders.forEach(order => {
                order.chose = false
              })
              if(this.orders.length > 0){
                this.orders[0].chose = true
                this.currOrder = this.orders[0]
              }
            })
          }
        })
      },
      
      /*修改未发布的订单中的某品类分配个数*/
      modifySingleLoadNum(category){
        let params = {
          invoiceid: this.currOrder.invoiceid,
          userid: utils.getLocalUser().userid,
          uuid: this.currOrder.uuid,
          tradeid: this.currOrder.tradeid,
          items: [{
            amount: category.reload,
            total: category.total,
            remark: '',
            price: category.price,
            uuid: category.uuid,
            dt: '2',
            ptype: '034001',
            itemid: category.itemid
          }],
          status: this.currOrder.status
        }
        service('saveCategorys2Order', params, rs => {
          utils.toast('操作成功')
          category.amount = category.reload
          utils.animationLine(category.slider, 10, 8, 0, false)
        })
      },

      /*将选中的品类加入到当前订单中*/
      addToOrder(){
        let errs = [], arr = [], chosed = false
        this.orderCategorys.forEach(category => {
          if(category.chose){
            chosed = true
            if(category.loadNum != 0 && category.loadNum != ''){
              arr.push(category)
            }else{
              errs.push('')
            }
          }
        })
        if(!chosed){
          utils.setError.call(this, 'errMsg', '请至少选择一个品类!')
          return ;
        }
        if(errs.length > 0){
          utils.setError.call(this, 'errMsg', '每个选中的品类都必须填写分配数量!')
          return ;
        }else{
          //塞入当前订单中，并更新品类元数据的可分配数
          let params = {
            invoiceid: this.currOrder.invoiceid,
            userid: utils.getLocalUser().userid,
            uuid: this.currOrder.uuid,
            tradeid: this.currOrder.tradeid,
            items: [],
            status: this.currOrder.status
          }
          arr.forEach(category => {
            let existed = false, uuid = utils.getUuid()
            this.currOrder.items.forEach(item => {
              if(item.scid == category.itemid){
                existed = true
                uuid = item.uuid  //如果已经存在在订单中， 则要用订单中的品类的uuid
              }
            })
            if(!existed){
              category.uuid = uuid
            }
            params.items.push({
              amount: category.loadNum,
              total: category.total,
              remark: '',
              price: category.price,
              uuid: uuid,
              dt: existed ? '2' : '0',
              ptype: '034001',
              itemid: category.itemid
            })
          })
          
          service('saveCategorys2Order', params, rs => {
            utils.toast('操作成功')
            let existed = false
            arr.forEach(category => {
              this.currOrder.items.forEach(item => {
                if(item.scid == category.itemid){
                  existed = true
                  item.amount = parseInt(category.loadNum)
                }
              })
              if(!existed){
								category.amount = category.loadNum
                this.currOrder.items.push(category)
              }
              this.mapper.init(category.ctname)
              this.orders.forEach(order => {
                order.items.forEach(item => {
                  this.mapper.addItem(item.ctname, item.amount)
                })
              })
            })
            this.y = '100%'
          })
        }
      },
      
      /*从当前的发货单中过滤出能被选中进入订单的品类*/
      filterCategorys(){
        this.orderCategorys.splice(1000)
        let categorys = []
        this.categorys.forEach(category => {
          let _category = JSON.parse(JSON.stringify(category))  //建立一个副本
          Object.assign(_category, {chose:false})
          categorys.push(_category)
        })
        this.orderCategorys = categorys
        this.y = 0
      },

      /*发布订单*/
			publishOrder(){
			  if(this.currOrder.items.length == 0){
			    utils.error('该订单下无任何品类，请分配至少一种品类！')
          return ;
        }
        utils.confirm('确定发布当前订单', () => {
          service('publishOrder2', {
            userid: utils.getLocalUser().userid,
            tradeid: this.currOrder.tradeid,
            invoiceid: this.currOrder.invoiceid,
            purchaserid: plus.webview.currentWebview().good.owner.userid
          }, rs => {
            utils.toast('发布成功')
            let cate
            for(let i=0; i<this.orders.length; i++){
              cate = this.orders[i]
              if(cate.tradeid == this.currOrder.tradeid){
                this.orders.splice(i, 1)
                break ;
              }
            }
          })
        })
      },
  
      categoryInOrder(category){
        plus.webview.create(config.CDN_ADDRESS + '/categoryInOrders', 'categoryInOrders', {}, {
          category,
          good: this.good
        })
      },
  
      slider(category){
        let slider = category.slider, total = parseInt(slider.offsetWidth * .5)
        if(!slider.slidered){
          utils.animationLine(slider, 10, 8, total, false)
          slider.slidered = true
        }
      },
  
      changePage(page){
        this.pageCode = page.code

				service('getMyOrders', {
					invoiceid: this.good.invoiceid,
					groupid: this.good.groupid,
					st: page.st,
					curpage: this.orderCurPage,
					pagesize: 100
				}, rs => {
					rs.items.forEach((item, idx) => {
						item.chose = (idx == 0)
						if(idx == 0){
							this.getOrderDetail(item)
						}
					})
					this.orders = rs.items
				})
      },

			saveOrder(order){
        let user = utils.getLocalUser()
      	mui.confirm('您确定要将这些品类添加至此订单中么?', '', ['是','否'], e => {
      		if(e.index == 0){
      			let items = []
            this.categorys.forEach(cate => {
              cate.chose && items.push({
								uuid: cate.uuid,
								amount: cate.amount,
                remark: ''
              })
            })
            
      			service('saveCategorys2Order', {
							userid: user.userid,
							uuid: order.uuid,
							items: items
            }, rs => {
            })
          }
        })
      },

			createOrder(callback){
        let user = utils.getLocalUser()
        service('createMyOrder', {
          uuid: utils.getUuid(),
          invoiceid: this.good.invoiceid,
          userid: user.userid,
          cityid: user.cityid,
          items: []
        }, order => {
          if(callback){
            callback(order)
          }else{
            this.select()
          }
        })
      },
      
      /*梳理当前品类列表，将满足可以创建为订单的品类列出来*/
      select(){
        service('getMyOrders', {
          invoiceid: this.good.invoiceid,
          groupid: this.good.groupid,
          st: 0,
          curpage: this.orderCurPage,
          pagesize: 100
        }, rs => {
          this.mapper.initAll()
          
          if(rs.items.length != 0){
            rs.items.forEach((item, idx) => {
              item.chose = (idx == 0)
              if(idx == 0){
                this.getOrderDetail(item)
              }
            })
            this.orders = rs.items
            this.orders.forEach(order => {
              order.items && order.items.forEach(category => {
                this.mapper.addItem(category.ctname, category.amount)
              })
            })
            if(this.orders.length > 0 && (!this.currOrder)){
              this.currOrder = this.orders[0]
            }
          }
          
          this.init = 1
        })
        
        this.winType = 'editor'
        setTimeout(() => {
          this.showDialog = true
        }, 100)
      },

			select2(category){
      	category.chose = !category.chose
      },
  
      select3(order){
        this.orders.forEach(item => {
          item.chose = (item.uuid == order.uuid)
        })
			  this.style = Object.assign({}, this.style, {
			    transform: 'translateY(30px)',
          opacity: 0
        })
        setTimeout(() => {
          this.getOrderDetail(order)
  
          this.style = Object.assign({}, this.style, {
            transform: 'translateY(0)',
            opacity: 1
          })
        }, 500)
      },

			voidAction(){},
      
      getOrderDetail(order){
			  order.items.forEach(category => {
			    //设置 删除/确认删除 的效果开关
          category.reload = toInt(category.amount)
			    category.confirm = false
        })
        this.currOrder = order
      },
      
      addCategory(category){
        let user = utils.getLocalUser()
        service('submitInvoice', {
          expdays: this.good.expdays || '5',
          supplierid: this.supplier.supplierid,
          remark: this.good.remark,
          cityid: user.cityid,
          title: this.good.title,
          userid: user.userid,
          uuid: this.supplier.uuid,
          groupid: this.good.groupid,
          items: [{
            imgs: '',
            ctid: category.ctid,
            amount: category.amount,
            cname: category.cname,
            ctname: category.ctname,
            ptype: '034001',
            remark: '',
            sctype: '020001',
            uuid: utils.getUuid(),
            specs: category.specs,
            total: category.total,
            price: category.price,
            scid: '0'
          }]
        }, rs => {
        })
      },
      
      close(){
        this.showDialog = false
      },
  
      removeCate(category){
        let user = utils.getLocalUser()
        service('removeInvoice', {
          userid: user.userid,
          items: [
            {dt: '2', uuids: category.uuid}
          ]
        }, rs => {
        
        })
      },
  
      confirmModify(){
				let params = {
					invoiceid: this.currOrder.invoiceid,
					userid: utils.getLocalUser().userid,
					uuid: this.currOrder.uuid,
					tradeid: this.currOrder.tradeid,
					items: [{
						amount: this.copyCategory.amount,
						total: this.copyCategory.total,
						remark: this.copyCategory.remark,
						price: this.copyCategory.price,
						uuid: this.copyCategory.uuid,
						dt: '2',
						ptype: '034001',
						itemid: this.copyCategory.itemid
					}],
					status: this.currOrder.status
				}
				service('saveCategorys2Order', params, rs => {
					utils.toast('修改成功')
					this.y2 = '100%'
          Object.assign(this.category, {
          	amount: this.copyCategory.amount,
						total: this.copyCategory.total,
						price: this.copyCategory.price
          })
				})
      },
      
      modify(category){
        this.category = category
        this.showDialog = true
      },

      /*供应商临时添加新品类*/
      newCategory(){
			  this.searchPage && this.searchPage.show('pop-in', 300, () => {
          mui.fire(this.searchPage, 'setType', {type: 1})
          mui.fire(this.searchPage, 'setOpenerId', {openerId: 'myAcceptGoodCategorys'})
        })
      },

			search(){
        service('getAccpetInvoiceCategorys', {
          invoiceid: this.good.invoiceid,
					groupid: this.good.groupid,
          curpage: this.curpage
        }, rs => {
        	this.categorys.splice(0, 10000)
          let categorys = rs.items || [], counter = [0, 0, 0]
          categorys.forEach(category => {
          	let st = category.st
            category.chose = true
            category.uploaded = [0]
          })
					this.categorys = categorys
				})
			},
  
      /*供应商同意还是拒绝，注意如果拒绝必须填写理由*/
      agreeOrNagtive(flag, category){
			  mui.confirm(flag == '1' ? '您确定同意对方对此品类的更改信息么？ 请谨慎核对数量及总价！' : '您确定不同意对方对此品类的更改信息么？', '', ['是','否'], e => {
			    if(e.index == 0){
			      if(flag == '1' && category){
              this.category = category
            }
            service('agreeOrNagtive', {
              invoiceid: this.good.invoiceid,
              items: [{
                itemid: this.category.itemid,
								st: this.category.st,
                resp: flag,
								reason: flag == '1' ? '' : this.category.reason //同意的话不需要理由
              }]
            }, rs => {
              utils.toast('操作成功')
              this.search()
            })
          }
        })
      },
  
      detail(category){
        plus.webview.create(config.CDN_ADDRESS + '/myGoodCategoryDetail', 'myGoodCategoryDetail', {}, {
          ctid: category.ctid,
          itemid: category.itemid,
          url: category.cf3,
          ctname: category.ctname,
          amount: category.amount,
          total: category.total
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .categorys-page{
    @include box-vert-left-top;
    background: #f0f0f0;
    position: relative;
    
    .order-case{
      @include box-vert-left-top;
      height: 100%;
      background: #fff;
      position: relative;
      border-radius: 7px 7px 0 0;
      
      .order-tipper{
        @include box-hori-left-middle;
        height: 50px;
        border-top: solid 1px #f0f0f0;
        color: #666;
        font-size: 12px;
        padding: 0 12px;
        position: relative;
        
        .total-price{
          @include box-hori-left-middle;
          font-size: 21px;
          color: $red;
  
          &:before{
            content: '订单总金额：';
            font-size: 12px;
            padding-right: 2px;
            margin-top: 2px;
            padding-left: 3px;
          }
          &:after{
            content: '元';
            font-size: 12px;
            padding-left: 2px;
            margin-top: 2px;
          }
        }
        
        label{
          height: auto;
          width: auto;
          line-height: 14px;
          font-size: 10px;
          color: #333;
        }
  
        .add-order{
          @include box-hori-left-middle;
          height: 100%;
          width: auto;
          color: #008de1;
          position: absolute;
          right: 95px;
          top: 0;
          font-size: 14px;
          background: transparent;
        }
        
        .publish-order{
          @include box-hori-left-middle;
          height: 100%;
          width: auto;
          color: #008de1;
          position: absolute;
          right: 55px;
          top: 0;
          font-size: 14px;
          background: transparent;
        }
  
        .remove-order{
          @include box-hori-left-middle;
          height: 100%;
          width: auto;
          color: #f85959;
          position: absolute;
          right: 15px;
          top: 0;
          font-size: 14px;
          background: transparent;
        }
      }
      
      .order-list-case{
        @include box-vert-left-top;
        
        .order-hori-case{
          @include box-hori-center-top;
          height: 90px;
          padding: 10px;
          width: 100%;
          overflow: hidden;
          background: #fff;
          border-bottom: solid 1px #f5f5f5;
          border-top: solid 1px #f5f5f5;
          position: relative;
          
          .order-empty-case{
            @include box-vert-center-middle;
            color: #f85959;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, .04);
    
            h3{
              font-weight: bold;
              font-size: 16px;
              height: 21px;
            }
    
            .iconfont{
              @include box-hori-center-middle;
              width: 30px;
              height: 35px;
              border: dashed 2px #ccc;
              border-radius: 7px;
              color: #999;
              margin-top: 8px;
              font-size: 18px;
              margin-bottom: 4px;
            }
          }
          
          .order-hori-inner-case{
            @include box-hori-left-middle;
            height: 100%;
            width: 100%;
  
            .order-item-case{
              @include box-vert-center-top;
              width: 150px;
              height: 100%;
              margin-right: 15px;
              position: relative;
              padding: 7px 10px 7px 5px;
              border-radius: 3px;
              overflow: hidden;
    
              &:last-child{
                margin-right: 0;
              }
    
              &.order-remove-true{
                animation: sharks1 .3s infinite;
              }
    
              .icon-close{
                position: absolute;
                right: -1px;
                padding-left: 4px;
                top: -1px;
                width: 24px;
                height: 24px;
                border-radius: 0 0 0 24px;
                background: #f85959;
                line-height: 20px;
                font-size: 24px;
                color: #fff;
                font-weight: bold;
              }
    
              .order-true{
                padding-left: 8px;
                position: absolute;
                width: 24px;
                height: 24px;
                text-align: left;
                border-radius: 0 0 0 24px;
                background: rgba(116, 186, 243, .4);
                right: -1px;
                font-size: 12px;
                top: -1px;
                font-weight: bold;
                line-height: 21px;
                color: #008de1;
              }
    
              .order-editor{
                position: absolute;
                bottom: 6px;
                right: 6px;
                font-size: 10px;
                border: solid .5px #008de1;
                border-radius: 2px;
                height: 18px;
                line-height: 18px;
                width: auto;
                padding: 0 6px;
                color: #fff;
              }
    
              h4{
                @include box-hori-left-middle;
                font-size: 12px;
                padding-bottom: 8px;
                height: auto;
                width: 100%;
                color: $textColor;
      
                &.h4-true{
                  color: #008de1;
                  border-color: #74baf3;
                }
              }
    
              h5{
                font-size: 9px;
                height: auto;
                width: auto;
                padding: 14px 2px 3px;
                border-bottom: solid 1px #e5e5e5;
      
                &.h5-true{
                  border-color: #74baf3;
                }
              }
    
              &.order-item-case-true{
                background: #008de1;
                color: #fff;
                border: solid .5px #008de1;
      
                .order-editor{
                  border-color: #fff;
                }
              }
              &.order-item-case-false{
                border: solid .5px #dedede;
      
                .order-editor{
                  color: #008de1;
                }
              }
            }
            
            .change-order{
              @include box-hori-center-middle;
              width: auto;
              height: 24px;
              border-radius: 3px;
              border: solid .5px $blue;
              padding: 0 2px 0 6px;
              color: $blue;
              margin-right: 5px;
              font-size: 12px;
              
              .iconfont{
                font-size: 16px;
              }
            }
          }
        }
        
        .order-detail-case{
          @include box-vert-left-top;
          background: #f0f0f0;
          padding: 10px 10px 10px;
          overflow: hidden;
          
          .order-info-case{
            @include box-hori-center-top;
            height: 42px;
            position: relative;
            
            .send-btn{
              text-align: center;
              width: 100%;
              height: 42px;
              background: #008de1;
              padding: 0 10px;
              color: #fff;
              border-radius: 5px;
              font-size: 16px;
            }
          }
          
          .order-cates-scroller{
            @include box-vert-left-top;
            position: relative;
            overflow: hidden;
            transition: transform .3s, opacity .3s;
            margin-bottom: 10px;
            
            .category-exist-case{
              @include box-hori-left-middle;
              background: #ccc;
              height: auto;
              width: 100%;
              border-radius: 9px;
              margin-bottom: 8px;
              
              .category-exist-inner-case{
                @include box-hori-left-middle;
                padding: 10px;
                height: auto;
                background: #fff;
                width: 100%;
                position: relative;
                
                h3{
                  @include box-vert-center-middle;
                  text-align: center;
                  width: 90px;
                  font-size: 16px;
                  font-weight: bold;
                  color: #666;
                  height: auto;
                }
                
                .category-info-case{
                  @include box-vert-left-middle;
                  border-left: solid 1px #f1f1f1;
                  padding: 0 8px;
                  height: auto;
                  position: relative;
                  
                  h3{
                    @include box-hori-left-middle;
                    padding: 3px 0 0;
                    color: #f85959;
                    font-size: 16px;
                    font-weight: 300;
                    
                    &::before{
                      content: '总价:';
                      font-size: 12px;
                      padding-right: 2px;
                      font-weight: normal;
                    }
  
                    &::after{
                      content: '元';
                      font-size: 12px;
                      padding-left: 2px;
                      font-weight: normal;
                    }
                  }
                  
                  h4{
                    color: $textLessColor;
                    font-size: 12px;
                    padding-bottom: 3px;
                  }
                  
                  h5{
                    @include box-hori-left-middle;
                    padding: 3px 0 0;
                    color: #f85959;
                    font-size: 16px;
                    font-weight: 300;
                    
                    &::before{
                      content: '单价:';
                      font-size: 12px;
                      padding-right: 2px;
                      font-weight: normal;
                    }
                    
                    &::after{
                      content: '元';
                      font-size: 12px;
                      padding-left: 2px;
                      font-weight: normal;
                    }
                  }
                  
                  h6{
                    font-size: 10px;
                    color: $textColor;
                    margin-top: 6px;
                  }

                  strong{
                    font-weight: 300;
                    font-size: 12px;
                    text-decoration: line-through #f85959;
                  }
                  
                  .option-case{
                    @include box-vert-right-middle;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                    
                    button{
                      height: 24px;
                      width: auto;
                      font-size: 12px;
                      border: solid .5px #008de1;
                      padding: 0 5px;
                      background: #fff;
                      color: #008de1;
                      border-radius: 3px;
                    }

                    .response-case{
                      @include box-vert-right-middle;
                      height: auto;
                      width: 60px;
                      color: #008de1;
                      line-height: 15px;

                      label{
                        font-weight: bold;
                        font-size: 14px;
                      }
                    }
                  }
                }
  
                .empty-delete{
                  @include box-vert-center-middle;
                  height: 100%;
                  width: 35%;
                  position: absolute;
                  top: 0;
                  font-size: 16px;
                  color: #f85959;
                  font-weight: bold;
                  background: #fff;
                }
                
                .edit-btn{
                  @include box-hori-center-middle;
                  width: 50px;
                  height: 25px;
                  border: solid .5px $blue;
                  border-radius: 3px;
                  font-size: 12px;
                  color: $blue;
                  font-weight: bold;
                  
                  &:active{
                    background: $blue;
                    color: #fff;
                  }
                }
              }
            }
            
            .no-orders{
              @include box-vert-center-top;
              padding-top: 75px;
              height: auto;
              
              .iconfont{
                font-size: 64px;
                width: 100%;
                height: 64px;
                color: #ccc;
                background: url("~@/assets/img/cargo5.png") center top/64px 64px no-repeat;
                opacity: .5;
              }
              
              h2{
                height: auto;
                width: 100%;
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 16px;
              }
            }
          }
        }
        
        .order-empty-body-case{
          @include box-vert-center-top;
          background: $normalBgColor;
          width: 100%;
          height: 100%;
          padding: 100px 50px 0;
          
          .none{
            width: 115px;
            height: 110px;
          }
          
          h3{
            height: auto;
            color: #666;
            margin-top: 20px;
            text-align: center;
            line-height: 32px;
            font-size: 16px;
          }
          
          .create-btn{
            @include box-hori-center-middle;
            width: auto;
            height: 40px;
            background: $blue;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            padding: 0 25px;
            margin-top: 50px;
            
            &:active{
              opacity: .8;
            }
          }
        }
      }

      footer{
        height: auto;
        padding: 0 10px 10px;

        .btn-confirm-order{
          text-align: center;
          color: #fff;
          font-size: 16px;
          border-radius: 5px;
          height: 42px;
          background: #008de1;
        }
      }
  
      .chose-masker{
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: -100%;
        left: 0;
      }
      
      .select-orders-case{
        @include box-vert-left-top;
        position: absolute;
        height: 90%;
        top: 10%;
        left: 0;
        z-index: 2;
        background: $normalBgColor;
        transition: transform .3s;
        //box-shadow: 0 -3px 10px rgba(0, 0, 0, .2);
        padding: 10px;
        
        .tipper{
          height: auto;
          padding: 0 5px 10px 10px;
          color: $textStrongColor;
          font-size: 12px;
        }
        
        .order-list-case{
          position: relative;
          overflow: hidden;
          
          .order-item-case{
            @include box-vert-left-top;
            background: #fff;
            height: auto;
            border-radius: 9px;
            margin-bottom: 8px;
            padding: 10px 10px 2px 50px;
            position: relative;
            
            .icon-order{
              @include box-vert-left-middle;
              width: 50px;
              height: 100%;
              position: absolute;
              top: 0;
              left: 15px;
              font-size: 24px;
              color: $textLessColor;
            }
            
            h4{
              @include box-hori-left-top;
              font-size: 12px;
              color: $textColor;
              margin-bottom: 8px;
              height: auto;
            }
            
            .icon-check{
              @include box-vert-center-middle;
              width: 50px;
              height: 100%;
              position: absolute;
              right: 0;
              font-size: 24px;
              color: $blue;
              top: 0;
            }
            
            &:active{
              background: rgba(0, 0, 0, .05);
            }
          }
        }
      }
      
      .chosed-categorys-case{
        @include box-vert-left-top;
        position: absolute;
        height: 60%;
        top: 40%;
        left: 0;
        z-index: 2;
        background: #fff;
        transition: transform .3s;
        //box-shadow: 0 -3px 10px rgba(0, 0, 0, .2);

        .editor-category-scoller{
          @include box-vert-left-top;
          position: relative;
          height: 100%;
          background: #f7f7f7;

          .tip-case{
            @include box-hori-left-middle;
            height: 50px;
            background: #fff6cd;
            padding: 0 15px;
            color: rgba(115, 91, 39, 1);
            position: relative;
            line-height: 18px;

            .icon-attention3{
              position: absolute;
              width: 32px;
              text-align: right;
              line-height: 50px;
              font-size: 18px;
              height: 50px;
              top: 0;
              left: 0;
            }
          }

          ul{
            @include box-vert-left-top;
            height: auto;

            li{
              @include box-hori-left-middle;
              height: 50px;
              background: #fff;
              margin-bottom: 1px;
              padding: 0 12px;
              position: relative;

              &.li2{
                @include box-hori-center-bottom;
                background: transparent;
                padding-bottom: 10px;
              }
              
              button{
                width: 100%;
                height: 42px;
                background: #008de1;
                color: #fff;
                font-weight: bold;
                text-align: center;
                font-size: 16px;
                margin-top: 10px;
                border-radius: 5px;
              }
            }
          }
        }
        
        .category-scoller{
          @include box-vert-left-top;
          position: relative;
          height: 100%;
  
          .tip{
            @include box-hori-left-middle;
            height: auto;
            padding: 10px;
            border-bottom: solid 1px #f0f0f0;
            width: 100%;
            font-size: 12px;
            color: $blue;
          }
          
          .category-item-case{
            @include box-vert-left-middle;
            height: 50px;
            background: transparent;
            position: relative;
            border-bottom: solid 1px #f0f0f0;
            overflow: hidden;
            
            .option-btn{
              @include box-hori-center-middle;
              width: 24px;
              height: 24px;
              border-radius: 24px;
              border: solid .5px $blue;
              color: $blue;
              font-size: 18px;
              
              &.option-min{
                padding-bottom: 3px;
              }
              
              &.option-plus{
                font-size: 21px;
              }
            }

            .category-item-inner-case{
              @include box-hori-left-middle;
              height: 50px;
              background: #fff;
              padding: 0 0 0 10px;
              color: #666;
              position: relative;

              .remove-case{
                @include box-vert-center-middle;
                height: 50px;
                width: 35%;
                position: absolute;
                color: #fff;
                background: #f85959;
                right: -35%;
                top: 0;
              }
            }
            
            .check{
              text-align: center;
              width: 18px;
              height: 18px;
              line-height: 18px;
              border: solid 1px #dedede;
              border-radius: 24px;
              margin-right: 6px;

              &.check-true{
                background: #008de1;
                border-color: #008de1;
                color: #fff;
              }
              &.check-false{
                background: transparent;
                border-color: #dedede;
                color: transparent;
              }
            }
            
            label{
              font-size: 16px;
              font-weight: bold;
              margin-left: 5px;
            }

            .dispatch{
              @include box-hori-right-middle;
              height: 100%;
              color: #999;
              padding: 0 15px 0 0;
              width: auto;

              input{
                width: 70px;
                height: 32px;
                background: #f0f0f0;
                border-radius: 5px;
                margin: 0 6px 0 6px;
                text-align: center;
                color: #333;
                font-size: 16px;
                
                &.dis-num-true{
                  background: rgba(248, 89, 89, .15);
                  color: #f85959;
                }
              }
            }

            .num{
              color: #999;
              margin-left: 10px;
            }
            
            .agree-btn{
              line-height: 50px;
              color: #008de1;
              font-size: 14px;
              height: 50px;
              width: auto;
              position: absolute;
              top: 0;
              right: 10px;
            }
          }
        }

        footer{
          height: 50px;
          padding: 0 10px;

          button{
            height: 42px;
            width: 100%;
            background: #008de1;
            color: #fff;
            font-size: 16px;
            text-align: center;
            line-height: 42px;
            border-radius: 5px;
          }
        }
      }
    }
  
    .header{
      @include box-hori-center-middle;
      height: 50px;
      color: $textStrongColor;
      font-weight: bold;
      font-size: 16px;
      position: relative;
      
      .icon-close{
        @include box-vert-center-middle;
        width: 42px;
        height: 50px;
        font-size: 24px;
        color: $textLessColor;
        right: 0;
        top: 0;
        position: absolute;
      }
    }

    .reason-case{
      @include box-vert-left-top;
      background: #fff;
      position: relative;
      height: 100%;

      .reason-case{
        padding: 12px 15px;
        position: relative;

        .tiper{
          width: auto;
          height: 15px;
          font-size: 12px;
          color: #999;
          position: absolute;
          right: 30px;
          bottom: 75px;
          z-index: 15;
          display: inline-block;
        }

        textarea{
          width: 100%;
          height: 100px;
          border: none;
          background: #f1f1f1;
          border-radius: 5px;
          padding: 8px 10px;

          &::-webkit-input-placeholder{
            color: #999;
          }
        }

        button{
          height: 42px;
          background: #008de1;
          width: 100%;
          line-height: 42px;
          color: #fff;
          text-align: center;
          font-size: 16px;
          margin-top: 10px;
        }
      }
    }
  
    .closer{
      background: #f1f1f1;
      position: absolute;
      top: 0;
      right: 0;
      line-height: 50px;
      height: 50px;
      padding-left: 6px;
      padding-right: 10px;
      width: 100%;
      font-size: 32px;
      color: #787878;
    
      button{
        width: auto;
        height: 32px;
        background: #008de1;
        border-radius: 3px;
        color: #fff;
        line-height: 32px;
        padding: 0 12px;
        font-size: 14px;
        margin-top: 9px;
        float: right;
      }
    
      h3{
        @include box-hori-center-middle;
        height: 50px;
        width: 100%;
        font-size: 16px;
        color: #333;
        position: absolute;
        top: 0;
        left: 0;
        
        strong{
          width: auto;
          height: auto;
          margin: 0 4px;
          color: #DF6158;
        }
      }
    }
    
    .supplier-info-case{
      @include box-vert-center-top;
      margin-top: 51px;
      height: auto;
      padding: 10px 0 12px;
      text-align: center;
      background: #fff;
      border-bottom: solid 1px $normalBgColor;
      
      h3{
        @include box-vert-center-bottom;
        font-size: 32px;
        color: $red;
        font-weight: 300;
        position: relative;
        padding: 10px 0 8px;

        &::before{
          content: '参考总价 (元)';
          font-size: 14px;
          height: auto;
          padding-right: 5px;
          padding-bottom: 3px;
        }
      }
      
      h4{
        margin-top: 10px;
        font-size: 16px;
        color: #fff;
      }
    }

    .categorys-case{
      @include box-vert-left-top;
      overflow: hidden;
      height: 100%;
      padding: 10px 10px 70px;
      //margin-top: 57px;

      .categorys-inner-case{
        width: 100%;
        position: relative;
        overflow: hidden;

        .category-slider-case{
          height: auto;
          width: 100%;
          background: #ccc;
          border-radius: 9px;
          margin-bottom: 8px;
          
          &:last-child{
            //margin-bottom: 0;
            border: none;
          }
          
          .category-inner{
            @include box-hori-left-middle;
            width: 100%;
            height: auto;
            padding: 10px 15px;
            background: #fff;
            position: relative;
  
            .icon-negative{
              @include box-vert-center-middle;
              font-size: 18px;
              height: 100%;
              width: 25%;
              position: absolute;
              top: 0;
              color: #fff;
              background: #E25C59;
            }
            .icon-agree{
              @include box-vert-center-middle;
              font-size: 18px;
              height: 100%;
              width: 25%;
              position: absolute;
              top: 0;
              right: -25%;
              color: #fff;
              background: #74baf3;
            }
            
            .category-photo-case{
              width: 50px;
              height: 50px;
            }
            
            .category-info-case{
              @include box-vert-left-top;
              height: auto;
              min-height: 50px;
              position: relative;
              //padding-left: 10px;

              .flag{
                width: 25px;
                height: 25px;
                position: absolute;
                overflow: hidden;
                top: -10px;
                left: -15px;

                .flag-inner{
                  width: 50px;
                  height: 50px;
                  border-radius: 40px;
                  margin: -25px 0 0 -25px;
                  text-align: right;
                  font-size: 16px;
                  padding-top: 26px;
                  padding-right: 7px;

                  &.no-chose{
                    background: #eee;
                    color: #eee;
                  }

                  &.icon-check-true{
                    background: #f85959;
                    color: #fff;
                  }

                  &.icon-check-false{
                    background: #eee;
                    color: #dedede;
                  }
                }
              }
              
              h3{
                font-size: 18px;
                color: #666;
                font-weight: bold;
              }
  
              h4{
                @include box-hori-left-bottom;
                padding-top: 10px;
                color: #f85959;
    
                &.change-case{
                  @include box-vert-left-top;
                  height: auto;
      
                  .old-price{
                    @include box-hori-left-bottom;
                    height: auto;
                    font-size: 14px;
                    color: #999;
        
                    &::before{
                      content: '改前总价';
                      padding-right: 3px;
                    }
        
                    &::after{
                      content: '元';
                      padding-left: 3px;
                    }
                  }
      
                  .new-price{
                    @include box-hori-left-bottom;
                    height: auto;
                    color: #f85959;
                    margin-top: 5px;
                    font-size: 16px;
                    font-weight: 300;
                    padding-bottom: 21px;
        
                    &::before{
                      content: '改后总价';
                      padding-right: 3px;
                      font-size: 14px;
                    }
        
                    &::after{
                      content: '元';
                      padding-left: 3px;
                      font-size: 14px;
                    }
                  }
                }
    
                .price{
                  position: relative;
                  font-size: 18px;
                  font-weight: 300;
                  padding-left: 50px;
                  padding-right: 3px;
      
                  &::before{
                    content: '参考总价';
                    font-size: 12px;
                    position: absolute;
                    left: 0;
                    top: 5px;
                  }
      
                  &::after{
                    content: '元';
                    font-size: 12px;
                    position: absolute;
                    top: 5px;
                    left: 100%;
                  }
                }
              }
  
              h5{
                @include box-hori-left-bottom;
                padding-top: 5px;
                color: #f85959;
    
                &.change-case{
                  @include box-vert-left-top;
                  height: auto;
      
                  .old-price{
                    @include box-hori-left-bottom;
                    height: auto;
                    font-size: 14px;
                    color: #999;
        
                    &::before{
                      content: '改前总价';
                      padding-right: 3px;
                    }
        
                    &::after{
                      content: '元';
                      padding-left: 3px;
                    }
                  }
      
                  .new-price{
                    @include box-hori-left-bottom;
                    height: auto;
                    color: #f85959;
                    margin-top: 5px;
                    font-size: 16px;
                    font-weight: 300;
                    padding-bottom: 21px;
        
                    &::before{
                      content: '改后总价';
                      padding-right: 3px;
                      font-size: 14px;
                    }
        
                    &::after{
                      content: '元';
                      padding-left: 3px;
                      font-size: 14px;
                    }
                  }
                }
    
                .price{
                  position: relative;
                  font-size: 14px;
                  font-weight: 300;
                  padding-left: 42px;
                  padding-right: 3px;
      
                  &::before{
                    content: '参考单价';
                    font-size: 10px;
                    position: absolute;
                    left: 0;
                    top: 3px;
                  }
      
                  &::after{
                    content: '元';
                    font-size: 10px;
                    position: absolute;
                    top: 3px;
                    left: 100%;
                  }
                }
              }
              
              .order-tip-case{
                @include box-hori-left-middle;
                height: 100%;
                width: auto;
                padding: 0 0 0;
                color: #666;
                background: transparent;
                position: absolute;
                right: 0;
                top: 0;
              }
            }

            .upload-case{
              @include box-hori-right-middle;
              height: auto;
              width: 100px;
              padding-right: 4px;

              .refuse-btn{
                @include box-hori-center-middle;
                width: auto;
                background: #f85959;
                height: 28px;
                color: #fff;
                padding: 0 10px;
                font-size: 14px;
                border-radius: 3px;
                
                &:active{
                  opacity: .8;
                }
              }

              .agree-btn{
                @include box-hori-center-middle;
                width: auto;
                background: transparent;
                height: 28px;
                color: #74baf3;
                padding: 0 10px;
                border: solid 1px #74baf3;
                font-size: 14px;
                line-height: 12px;
                border-radius: 3px;
                margin-right: 10px;
  
                &:active{
                  border: solid 1px #74baf3;
                  background: #74baf3;
                  color: #fff;
                }
              }

              .refused-btn{
                @include box-hori-center-middle;
                width: auto;
                height: 28px;
                color: #f85959;
                font-size: 16px;
                font-weight: bold;
  
                &:active{
                  opacity: .8;
                }
              }
              
              .confirmed-btn{
                color: #008de1;
                font-size: 16px;
                font-weight: bold;
              }
            }
            
            .normal-btn{
              width: 70px;
              height: 24px;
              position: absolute;
              background: transparent;
              top: 50%;
              margin-top: -12px;
              border: solid 1px #aaa;
              border-radius: 3px;
              line-height: 22px;
              text-align: center;
              color: #999;
              right: 10px;
            }

            .alter-reason{
              @include box-hori-left-top;
              position: absolute;
              width: 100%;
              bottom: 4px;
              left: 0;
              font-size: 12px;
              height: 24px;
              padding: 0 15px 0 45px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #74baf3;

              &::before{
                content: '原因';
                border: solid .5px #008de1;
                border-radius: 2px;
                padding: 0 2px;
                height: 13px;
                font-size: 10px;
                margin: 0;
                color: #008de1;
                line-height: 13px;
                position: absolute;
                left: 15px;
                top: 4px;
              }
            }
          }
        }
      }
    }
    
    .footer-case{
      @include box-hori-center-middle;
      height: 60px;
      text-align: center;
      position: fixed;
      bottom: 0;
      left: 0;
      background: #fff;
      border-top: solid 1px $normalBgColor;
      padding: 0 10px;
  
      .btn-fahuo{
        height: 45px;
        width: 100%;
        line-height: 42px;
        background: $blue;
        color: #fff;
        font-size: 16px;
        border-radius: 5px;
    
        &:active{
          opacity: .8;
        }
      }
  
      .btn-add{
        height: 42px;
        width: 100%;
        line-height: 42px;
        font-size: 16px;
        border-radius: 5px;
  
        &.btn-add-true{
          background: #008de1;
          color: #fff;
        }
        &.btn-add-false{
          background: #ccc;
          color: #999;
        }
    
        &:active{
          opacity: .8;
        }
      }
    }
    
    @keyframes sharks {
      0%{
        transform: rotate(0);
      }
      33%{
        transform: rotate(1.5deg);
      }
      66%{
        transform: rotate(0);
      }
      99%{
        transform: rotate(-1.5deg);
      }
    }
  }
</style>
