<template>
  <normal-layout class="accept-goods-page" :loaded="loaded">
    <error-pop :msg="errMsg" />
    <normal-header title="订单详情" menuText="添加品类" @menuHandler="createCategory" />
    <div class="purchaser-case">
      <image-loader :src="purchaser.url" class="purchaser-user-case" :defaultCls="'photo-' + ((purchaser.sex == '025001') ? 'man' : 'woman') + '-case'" />
      <h3>求购方: {{purchaser.name}}</h3>
    </div>
    <scroller class="order-detail-case auto-fill">
      <div class="order-slider">
        <div class="ul">

          <!--订单基本信息, 包括订单号, 发货地址, 预付款, 运费-->
          <ul class="border-radius-case">
            <li class="detail-case">
              <span>订单编号: {{order.tradeno}}</span>
              <h3>创建日期：{{order.createtime | toTime('-')}}</h3>
              <h2>{{order.paytotal | price}}</h2>
              <label class="state">{{order.statusname}}</label>
            </li>
            <li class="addr-case" @tap.stop="openAddrPage">
              <address class="auto-fill">
                <label class="tip-text">目的地：</label>
                <div class="add-info auto-fill" v-if="order.addrid">
                  <h4>{{order.address}}</h4>
                  <h5>联系单位：{{order.gainer}}&nbsp;&nbsp;{{order.gainertel}}</h5>
                </div>
              </address>
              <span class="iconfont icon-right-arr"></span>
            </li>
            <li class="money-case" @tap="openMoneySelectPage">
              <label class="tip-text">预付款：</label>
              <a class="money-text auto-fill">{{order.paytype ? ('预付' + order.firstpay + '元、' + order.paytypestr) : ''}}</a>
              <span class="iconfont icon-right-arr" v-if="order.status == '037001' || order.status == '037002'"></span>
            </li>
            <li class="money-case">
              <label class="tip-text">运费(元)：</label>
              <input type="text" v-model="order.carriage" class="auto-fill" v-if="order.status == '037001' || order.status == '037002'" />
              <input type="text" v-model="order.carriage" readonly="readonly" class="auto-fill" v-if="!(order.status == '037001' || order.status == '037002')" />
              
            </li>
          </ul>

          <!--工程公司验收人列表-->
          <ul class="border-radius-case" v-if="order.status != '037001'">
            <li class="reciver-case">
              <h3 class="title">验收人信息 <span>(此项由求购方填写)</span></h3>
              <div class="examiner-case">
                <template v-if="order.status < '037004'">
                  <div class="examiner-item-case" v-for="examiner in order.examiners">
                    <image-loader :src="examiner.url" class="photoer-case" :defaultCls="'photo-' + ((examiner.sex == '025001') ? 'man' : 'woman') + '-case'" />
                    <label class="name auto-fill">{{examiner.name}}</label>
                    <span></span>
                  </div>
                </template>
                
                <template v-if="order.status >= '037004'">
                  <div class="examiner-item-case" v-if="examiner.issnag == '1'" v-for="examiner in order.examiners">
                    <image-loader :src="examiner.url" class="photoer-case" :defaultCls="'photo-' + ((examiner.sex == '025001') ? 'man' : 'woman') + '-case'" />
                    <label class="name auto-fill">{{examiner.name}}</label>
                    <span></span>
                  </div>
                </template>
              </div>
            </li>
          </ul>

          <!--订单车辆信息-->
          <ul class="border-radius-case">
            <li class="title">车辆信息</li>
            <li class="carno-case">
              <div class="carno-inner-case auto-fill" @tap.stop="openDriverPage">
                <h4 v-if="order.drivername">司机姓名: <label>{{order.drivername || '尚未填写'}}</label></h4>
                <h4 v-if="order.drivername">司机电话: <label>{{order.drivertel || '尚未填写'}}</label></h4>
                <div class="plateno-case">
                  <span class="boxer privince-boxer">{{carProvince}}</span>
                  <span class="boxer num-case" v-for="item in carNums">{{item}}</span>
                </div>
              </div>
              <span class="iconfont icon-right-arr" v-if="order.status == '037001' || order.status == '037002'"></span>
            </li>
          </ul>
  
          <div class="remark-case">
            <label>备注：</label>
            <div class="remark auto-fill">
              <input-area v-model="order.remark" />
            </div>
          </div>

          <!--订单中的品类列表-->
          <div class="items-case" v-if="order.items.length > 0">
            <header class="category-header-case">该订单下共有{{order.items.length}}个品类</header>
            <slider-blocker class="category-item-case" :key="idx" :item="item" :sliderWidth="(order.status == '037001' || order.status == '037002') ? '50' : '0'" v-for="(item, idx) in order.items" :id="item.uuid">
              <div class="info-case auto-fill">
                <template v-if="order.status < '037004'">
                  <span class="modify-case" @tap.stop="modify(item)" v-if="order.status == '037001' || order.status == '037002'">修改</span>
                  <div class="remove-case" @tap.stop="giveup(item)" v-if="order.status == '037001' || order.status == '037002'">
                    {{order.status == '037001' ? '删除' : '放弃'}}
                    <label v-if="order.status == '037001'" class="confirmRemove" @tap="confirmGiveup2(idx)" :style="{'transform':'translateX(' + (item.confirm ? '0' : '100%') + ')'}">确定删除<a class="iconfont icon-close" @tap.stop="cancelGiveup(item)"></a></label>
                  </div>
                  <h2>
                    {{item.ctname}}
                    <label>装车数：{{item.amount | toInt}} <a class="old" v-if="item.oamount">({{item.oamount | toInt}})</a> 株</label>
                  </h2>
                  <h4>{{item.price | price}} <a class="old" v-if="(item.oprice && parseFloat(item.oprice) != 0) && (parseFloat(item.oprice) != parseFloat(item.price))">({{item.oprice | price}})</a></h4>
                  <h3>{{item.total | price}} <a class="old" v-if="(item.ototal && parseFloat(item.total) != 0) && (parseFloat(item.ototal) != parseFloat(item.total))">({{item.ototal | price}})</a></h3>
  
                  <div class="oper-case" v-if="order.status == '037002' || order.status == '037003'">
                    <label v-if="item.st == 0">等待确认</label>
                    <label v-if="item.st == 1 || item.st == 9">修改待确认</label>
                    <label v-if="item.st == 2">删除待确认</label>
                    <label class="iconfont icon-check" v-if="item.st == 3 || item.st == 4 || item.st == 5 || item.st == 10">&nbsp;可发货</label>
                    <div class="dis-agree" v-if="item.st == 6 || item.st == 7 || item.st == 8 || item.st == 11" @tap="reason(item)">
                      <label v-if="item.st == 6">对方拒绝</label>
                      <label v-if="item.st == 7 || item.st == 11">对方拒绝修改</label>
                      <label v-if="item.st == 8">对方拒绝删除</label>
                      <label class="see">查看拒绝原因</label>
                    </div>
                  </div>
                </template>
                
                <template v-if="order.status >= '037004'">
                  <h2>{{item.ctname}}</h2>
                  <div class="examin-case">
                    <div class="examin-left-case auto-fill">
                      <h5>装车数：{{item.amount | toInt}} 株</h5>
                      <h4>{{item.price | price}}</h4>
                      <h3>{{item.total | price}}</h3>
                    </div>
                    <div class="examin-right-case auto-fill">
                      <h5>验收数：{{item.examine.amount | toInt}} 株</h5>
                      <h4>{{item.examine.price | price}}</h4>
                      <h3>{{item.examine.total | price}}</h3>
                    </div>
                  </div>
                  <div class="examin-result">
                    <label class="examin-title">验收结论</label>
                    <span class="examin-content auto-fill">123123</span>
                    <span class="comm-btn comm-blue-btn agree-btn" @tap.stop="responseExamine(item)" v-if="item.examine.respst == '0'">同意</span>
                    <span class="iconfont icon-check" v-if="item.examine.respst == '1'">您已同意</span>
                  </div>
                </template>
              </div>
            </slider-blocker>
          </div>
        </div>
      </div>
    </scroller>
	  <footer class="btn-case" v-if="order.status == '037001' || order.status == '037002'">
      <button class="auto-fill publish" @tap="saveMyOrder">保存</button>
      <button class="auto-fill sendCar" @tap="publishOrder" v-if="order.status == '037001'">发布</button>
      <button class="auto-fill sendCar" @tap="sendCar" v-if="order.status == '037002'">发货</button>
    </footer>
  
    <masker-dialog :size="(openType == 0) ? 200 : ((openType == 1) ? 310 : ((openType == 2) ? 465 : 360 ) )" :show="isOpen" @closeHandler="close" :force="true">
      <div class="reason-case" v-if="openType != 3">
        <header>{{openType == 0 ? '查看拒绝理由' : (openType == 1 ? '填写放弃理由' : '修改报价信息')}}<span class="iconfont icon-close" @tap="close"></span></header>
        <div class="body-case auto-fill">
          <div class="category-info-case">
            <div class="left">{{currCategory.ctname}}</div>
            <div class="right auto-fill">
              <label>装车数量：{{currCategory.amount | toInt}} 株</label>
              <label>单价：{{currCategory.price | price}} 元</label>
              <label>总价：{{currCategory.total | price}} 元</label>
            </div>
          </div>
          <div class="textarea-case" v-if="openType == 1">
            <input-area v-model="currCategory.reason" maxlength="50" placeholder="请填写您放弃的原因" />
          </div>
          <div class="dis-reason-case" v-if="openType == 0">
            <span class="left">原因</span>
            <span class="right">{{currCategory.respreason}}</span>
          </div>
          <ul v-if="openType == 2">
            <li class="row">
              <input-text type="tel" placeholder="请填写修改后的数量" v-model="currCategory.amount2">装车数量：</input-text>
            </li>
            <li class="row">
              <input-text placeholder="请填写修改后的单价" v-model="currCategory.price2">单价：</input-text>
            </li>
            <li class="row">
              <input-text placeholder="请填写修改后的总价" v-model="currCategory.total2">总价：</input-text>
            </li>
          </ul>
          <div class="textarea-case textarea-case2" v-if="openType == 2">
            <input-area v-model="currCategory.reason" maxlength="50" placeholder="请填写您修改报价信息的原因" />
          </div>
        </div>
        <footer v-if="openType == 1 || openType == 2">
          <button @tap="confirmGiveup" v-if="openType == 1">确定拒绝</button>
          <button @tap="confirmMidify" class="modify-btn" v-if="openType == 2">确定修改</button>
        </footer>
      </div>
      
      <div class="agreement-case" v-if="openType == 3">
        <header>同意验收结果<span class="iconfont icon-close" @tap="close"></span></header>
        <div class="agree-case auto-fill">
          <div class="category-info-case">
            <div class="category-left-case">
              {{currCategory.ctname}}
            </div>
            <div class="category-right-case auto-fill">
              <label class="label">验收数量：{{currCategory.examine.amount | toInt}} 株</label>
              <label class="label">验收单价：{{currCategory.examine.price | price}} 元</label>
              <label class="label">验收总价：{{currCategory.examine.total | price}} 元</label>
            </div>
          </div>
          <div class="category-remark-case">
            <input-area v-model="currCategory.examine.respdescript" />
          </div>
          <div class="category-btn-case auto-fill">
            <span class="comm-btn comm-blue-btn agree-btn" @tap.stop="responseAgree">确定</span>
          </div>
        </div>
      </div>
    </masker-dialog>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
	import normalHeader from '@/components/comm/NormalHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import AddressBo from '@/model/bo/Address'
  import DriverBo from '@/model/bo/Driver'
  import imageLoader from '@/components/comm/ImageLoader'
	import sliderBlocker from '@/components/comm/SliderBlocker'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  import {toInt, price} from '@/plugins/filter/custom'
	import errorPop from '@/components/comm/ErrorPop'
  import inputArea from '@/components/comm/InputArea'
  import inputText from '@/components/comm/Input'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('myOrderDetail', 'pop-in', 300, () => {
					this.search()
				})
			})

			window.addEventListener('setAddress', (addr) => {
				this.order.address = addr.detail.prov + addr.detail.city + addr.detail.addr
				this.order.gainer = addr.detail.gainer
				this.order.gainertel = addr.detail.gainertel
				this.order.addrid = addr.detail.addrid
				this.order.tocityid = addr.detail.cityid
				this.order.addrid = addr.detail.addrid
			})

			window.addEventListener('setDriver', (driver) => {
				this.order.verouteid = driver.detail.verouteid
				this.order.plateno = driver.detail.plateno
				this.order.drivername = driver.detail.drivername
				this.order.drivertel = driver.detail.drivertel
        this.order.trucktype = driver.detail.trucktype
			})
      
      window.addEventListener('setMoney', (money) => {
        console.log(JSON.stringify(money))
        this.order.paytype = money.detail.paytype
        this.order.firstpay = price(money.detail.firstpay)
        this.order.paytypestr = money.detail.paytypestr
      })

			window.addEventListener('addCategory', (category) => {
				this.addCategory(category)
			})
    },
    
    components: {
      maskerDialog,
      scroller,
      normalLayout,
			normalHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			sliderBlocker,
			errorPop,
      inputArea,
      inputText
    },

    data(){
      return {
        loaded: false,
				order: {
					tradeno: '',
          items: []
				},
        isOpen: false,
        currCategory: {},
        openType: 0, //0=查看理由， 1=填写删除理由， 2=修改信息， 3=发车异常协议
				purchaser: {},
        exceptions: [],  //有异常的品类列表（允许发货，但必须供应商确定）
        agree: false,
				errMsg: ''
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				let searchWin = plus.webview.getWebviewById('searchCateory')
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
			carNums(){
				if(this.order.plateno && this.order.plateno.length == 7){
					return this.order.plateno.substring(1).split('')
        }
        return Array(6)
      },

      carProvince(){
				if(this.order.plateno && this.order.plateno.length == 7){
					return this.order.plateno.substring(0, 1)
				}
				return '浙'
      }
    },
    
    methods: {
      responseExamine(category){
        this.currCategory = category
        this.openType = '3'
        this.isOpen = true
      },
  
      responseAgree(){
        utils.confirm('确定同意该品类的验收结果', () => {
          service('responseExamine', {
            userid: utils.getLocalUser().userid,
            purchaserid: this.order.purchaserid,
            tradeid: this.order.tradeid,
            items: [{
              itemid: this.currCategory.examine.itemid,
              st: this.currCategory.examine.respst,
              resp: '1',
              reason: this.currCategory.examine.respdescript
            }]
          }, rs => {
            utils.toast('操作成功')
            this.isOpen = false
          })
        })
      },
      
      close(){
        this.isOpen = false
      },
  
      deliveryOrder(){
        if(this.agree){
          service('deliveryOrder', {
            userid: utils.getLocalUser().userid,
            tradeid: this.order.tradeid,
            invoiceid: this.order.invoiceid,
            purchaserid: this.order.purchaserid
          }, rs => {
            utils.toast('成功发货')
          })
        }
      },
  
      agrees(){
        this.agree = !this.agree
      },
  
      /*发车走人*/
      sendCar(){
        let cargos = [], ok = true, categorys = this.order.items
        for(let i=0; i<categorys.length; i++){
        	let category = categorys[i]
          if(category.st == 3 || category.st == 4 || category.st == 5 || category.st == 10){
						cargos.push(category)
          }else{
          	ok = false
            break ;
          }
        }
        if(!ok){
          utils.toast('该订单尚有等待确定状态的品类', 2000, 'FAILED')
          return ;
        }
        if(!utils.ruleMust(this.order.addrid)){
          utils.toast('请选择送货地址', 2000, 'FAILED')
          return ;
        }
        if(!utils.ruleMust(this.order.paytype)){
          utils.toast('请选择预付款付款方式', 2000, 'FAILED')
          return ;
        }
        if(!utils.ruleMust(this.order.drivername)){
          utils.toast('请选择车辆信息', 2000, 'FAILED')
          return ;
        }
        
        utils.confirm('确定装车发货', () => {
          service('deliveryOrder', {
            userid: utils.getLocalUser().userid,
            tradeid: this.order.tradeid,
            invoiceid: this.order.invoiceid,
            purchaserid: this.order.purchaserid
          }, rs => {
            utils.toast('成功发货')
            plus.webview.currentWebview().close('pop-out', 300)
          })
        })
      },

      /*发布订单, 订单发布后工程公司就能看到了*/
			publishOrder(){
				let orderListPage = plus.webview.getWebviewById('myOrders')
				if(!this.order.addrid){
					utils.setError.call(this, 'errMsg', '请先设置发货地址!')
				}
				if(!this.order.verouteid){
					utils.setError.call(this, 'errMsg', '请先设置车辆信息!')
				}

				service('publishOrder2', {
					userid: utils.getLocalUser().userid,
					tradeid: this.order.tradeid,
					invoiceid: this.order.invoiceid,
					purchaserid: this.order.purchaserid
        }, rs => {
					mui.fire(orderListPage, 'changeState', {code: '1'})
					plus.webview.currentWebview().close('pop-out', 300)
        })
      },
  
      /*供应商保存自己的订单基本信息*/
      saveMyOrder(){
        service('saveMyOrder', {
          uuid: this.order.uuid,
          tradeid: this.order.tradeid,
          invoiceid: this.order.invoiceid,
          userid: utils.getLocalUser().userid,
          purchaserid: this.order.purchaserid,
          status: this.order.status,
          earnest: this.order.firstpay,
          sender: '陈麒麟',
          sendertel: '13012345678',
          trucktype: this.order.trucktype,
          verouteid: this.order.verouteid,
          addrid: this.order.addrid,
          drivername: this.order.drivername,
          drivertel: this.order.drivertel,
          plateno: this.order.plateno,
          carriage: this.order.carriage,
          gainer: this.order.gainer,
          gainertel: this.order.gainertel,
          address: this.order.address,
          paytype: this.order.paytype,
          remark: this.order.remark
        }, rs => {
          utils.toast('保存成功');
        })
      },

      /*添加品类*/
			createCategory(){
				this.searchPage && this.searchPage.show('pop-in', 300, () => {
					mui.fire(this.searchPage, 'setType', {type: 1})
					mui.fire(this.searchPage, 'setOpenerId', {openerId: 'myOrderDetail'})
				})
      },

			addCategory(category){
        category = category.detail.category
				let params = {
					invoiceid: this.order.invoiceid,
					tradeid: this.order.tradeid,
					status: this.order.status,
					uuid: this.order.uuid,
					userid: utils.getLocalUser().userid,
					purchaserid: this.order.purchaserid,
					items: [{
						dt: 1,
						uuid: utils.getUuid(),
						ctid: category.ctid,
						ctname: category.ctname,
						cname: category.cname,
						price: category.price,
						amount: category.amount,
						total: category.total,
						ptype: '034001',
						remark: category.remark,
						specs: category.specs
					}]
				}

				service('saveCategorys2Order', params, rs => {
					utils.toast('操作成功')
					category.st = 0
					category.oprice = category.ototal = category.oamount = ''
          category.confirm = false
          this.order.items.unshift(category)
				})
      },
  
      confirmGiveup(){
			  if(!utils.ruleMust(this.currCategory.reason)){
			    utils.toast('请填写放弃理由', 2000, 'FAILED')
          return ;
        }
        utils.confirm('确定放弃该品类', () => {
          service('deleteCategoryFromOrder', {
            uuid: this.currCategory.uuid,
            dt: 1,
            invoiceid: this.order.invoiceid,
            tradeid: this.order.tradeid,
            userid: utils.getLocalUser().userid,
            reason: this.currCategory.reason,
            purchaserid: this.order.purchaserid
          }, rs => {
            this.isOpen = false
            this.currCategory.st = '2'
            utils.toast('操作成功')
          })
        })
      },
  
      confirmMidify(){
        if(!utils.ruleMust(this.currCategory.total2)){
          utils.toast('请输入修改后总价', 2000, 'FAILED')
          return ;
        }
        if(!utils.ruleMust(this.currCategory.amount2)){
          utils.toast('请输入修改后数量', 2000, 'FAILED')
          return ;
        }
        if(!utils.ruleMust(this.currCategory.price2)){
          utils.toast('请输入修改后单价', 2000, 'FAILED')
          return ;
        }
        if(!utils.ruleMust(this.currCategory.reason)){
          utils.toast('请输入修改原因', 2000, 'FAILED')
          return ;
        }
        utils.confirm('确定修改', () => {
          service('saveCategorys2Order', {
            invoiceid: this.order.invoiceid,
            tradeid: this.order.tradeid,
            status: this.order.status,
            uuid: this.order.uuid,
            userid: utils.getLocalUser().userid,
            purchaserid: this.order.purchaserid,
            items: [{
              dt: 2,
              uuid: this.currCategory.uuid,
              price: this.currCategory.price2,
              amount: this.currCategory.amount2,
              total: this.currCategory.total2,
              reason: this.currCategory.reason
            }]
          }, rs => {
            utils.toast('操作成功')
            this.isOpen = false
            this.currCategory.price = this.currCategory.price2
            this.currCategory.total = this.currCategory.total2
            this.currCategory.amount = this.currCategory.amount2
            this.currCategory.st = '1'
          })
        })
      },
  
      modify(category){
        let st = category.st
        if((!(st == 0 || st == 1 || st == 2)) || this.order.status == '037001'){
          this.openType = 2
          this.currCategory = category
          this.currCategory.price2 = price(this.currCategory.price)
          this.currCategory.total2 = price(this.currCategory.total)
          this.currCategory.amount2 = toInt(this.currCategory.amount)
          this.currCategory.reason = ''
          this.isOpen = true
        }else{
          utils.error('请等待对方确认完后再进行其他操作！')
        }
      },
  
      giveup(category){
        let st = category.st
        if((!(st == 0 || st == 1 || st == 2)) || this.order.status == '037001'){
          if(this.order.status == '037001'){
            //未发布状态的品类删除不需要写理由，直接删
            category.confirm = true
          }else{
            if(st == '6'){
              utils.confirm('确定放弃此品类', () => {
                //被工程公司拒绝后直接同意
                service('agreeOrNagtive', {
                  invoiceid: this.order.invoiceid,
                  tradeid: this.order.tradeid,
                  userid: utils.getLocalUser().userid,
                  purchaserid: this.order.purchaserid,
                  items: [{
                    itemid: category.itemid,
                    st,
                    resp: '1',
                    reason: ''
                  }]
                }, rs => {
                  utils.toast('操作成功')
                })
              })
            }else{
              this.openType = 1
              this.currCategory = category
              this.isOpen = true
            }
          }
        }else{
          utils.error('请等待对方确认完后再进行其他操作！')
        }
      },
      
      cancelGiveup(category){
        category.confirm = false
      },
      
      //删除未发布状态下的订单品类
      confirmGiveup2(idx){
        service('deleteCategoryFromOrder', {
          uuid: this.currCategory.uuid,
          dt: 1,
          invoiceid: this.order.invoiceid,
          tradeid: this.order.tradeid,
          userid: utils.getLocalUser().userid,
          reason: this.currCategory.reason
        }, rs => {
          utils.toast('操作成功')
          this.order.items.splice(idx, 1)
        })
      },
  
      reason(category){
        this.openType = 0
        this.currCategory = category
        this.isOpen = true
      },

			search(){
			  let order = plus.webview.getWebviewById('myOrderDetail').order
        this.purchaser = order.purchaser
        if(order.status < '037004'){
          service('getOrderDetail', {
            tradeid: order.tradeid,
            invoiceid: order.invoiceid
          }, rs => {
            _fill(rs)
          })
        }else{
          service('getExamOrderDetail', {
            tradeid: order.tradeid
          }, rs => {
            _fill(rs)
          })
        }
        
        var _fill = (rs) => {
          let order = rs
          rs.items.forEach(category => {
            let st = category.st
            if(st == 0 || st == 1 || st == 2){
              category.stname = '等待确认'
            }else if(st == 3 || st == 4 || st == 5){
              category.stname = '可发货'
            }else{
              category.stname = '对方拒绝'
            }
            category.confirm = false
          })
          order.carriage = price(order.carriage)
          order.firstpay = price(order.firstpay)
          if(order.status == '037001'){
            order.statusname = '待发布'
          }else if(order.status == '037002'){
            order.statusname = '待发货'
          }else if(order.status == '037003'){
            order.statusname = '在途'
          }else if(order.status == '037004'){
            order.statusname = '验收中'
          }else{
            order.statusname = '已验收'
          }
          this.order = order
  
          this.$nextTick(() => {
            this.loaded = true
          })
        }
			},
  
      openAddrPage(){
        plus.webview.create(config.CDN_ADDRESS + '/addresses', 'addresses', {}, {
					addrid: this.order.addrid,
          openerId: 'myOrderDetail'
        })
      },
  
      openDriverPage(){
        let st = this.order.status
        if(st == '037001' || st == '037002'){
          plus.webview.create(config.CDN_ADDRESS + '/drivers', 'drivers', {}, {
            verouteid: this.order.verouteid,
            openerId: 'myOrderDetail'
          })
        }
      },

      openMoneySelectPage(){
        let st = this.order.status
        if(st == '037001' || st == '037002'){
          plus.webview.create(config.CDN_ADDRESS + '/moneySelect', 'moneySelect', {}, {
            firstpay: this.order.firstpay,
            paytype: this.order.paytype
          })
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .accept-goods-page{
    @include box-vert-left-top;
    position: relative;
    height: 100%;
    background: $normalBgColor;
    padding-top: 60px;

    .purchaser-case{
      @include box-hori-left-middle;
      height: 50px;
      position: fixed;
      top: 50px;
      left: 0;
      z-index: 10;
      padding: 0 10px;
      background: #fff;

      .purchaser-user-case{
        width: 36px;
        height: 36px;
        border-radius: 7px;
      }

      h3{
        height: auto;
        color: #333;
        margin-left: 10px;

        .icon-phone{
          color: #787878;
        }
      }
    }
  
    .order-detail-case{
      @include box-vert-left-top;
      position: relative;
      overflow: hidden;
      margin-top: 50px;
      margin-bottom: 60px;

      .order-slider{
        @include box-vert-left-top;
        height: auto;
      }
    
      .ul{
        @include box-vert-left-top;
        position: relative;
        height: auto;

        .border-radius-case{
          @include box-vert-left-top;
          overflow: hidden;
          height: auto;
          background: #fff;
          margin-bottom: 10px;
          padding-left: 3px;
        }
      
        .detail-case{
          @include box-vert-left-top;
          padding: 10px 10px 5px;
          height: auto;
          background: #fff;
          color: #666;
          position: relative;
        
          span{
            font-size: 14px;
          }

          h2{
            @include box-hori-left-middle;
            font-size: 24px;
            padding: 0 0 7px;
            font-weight: 300;
            color: #f85959;

            &::before{
              content: '总金额';
              font-size: 14px;
              padding: 6px 5px 0 0;
            }

            &::after{
              content: '元';
              font-size: 14px;
              padding: 6px 0 0 3px;
            }
          }

          address{
            color: #999;
            font-style: normal;
            font-size: 12px;
          }

          h3{
            font-size: 12px;
            color: #999;
            padding: 6px 0;
          }
        
          .state{
            @include box-vert-left-middle;
            width: 80px;
            height: 50px;
            border-left: solid 1px #f1f1f1;
            padding-left: 10px;
            color: #008de1;
            font-weight: bold;
            position: absolute;
            top: 15px;
            right: 0;
          
            &::before{
              content: '状态:';
              font-size: 10px;
              color: #74baf3;
            }
          }
        }
      
        .addr-case{
          @include box-hori-left-middle;
          padding: 10px 0;
          height: auto;
          min-height: 50px;
          background: #fff;
          border-top: solid 1px #f0f0f0;
        
          .icon-position3{
            @include box-vert-right-middle;
            width: 28px;
            height: auto;
            font-size: 21px;
            color: #008de1;
            margin-top: 1px;
          }
        
          address{
            @include box-hori-left-middle;
            color: #999;
            font-style: normal;
            padding: 0 10px;
          
            h4{
              @include box-hori-left-middle;
              height: 25px;
              color: #666;
              font-size: 16px;
            }
            h5{
              @include box-hori-left-middle;
              height: 25px;
              color: #999;
            }
            
            .add-info{
              @include box-vert-left-top;
            }
          }
        }
  
        .tip-text{
          width: 65px;
          color: $textColor;
          text-align: right;
        }

        .money-case{
          @include box-hori-left-middle;
          padding: 0 0 0 10px;
          height: auto;
          min-height: 50px;
          background: #fff;
          border-top: solid 1px #f0f0f0;
          
          input{
            height: 30px;
            color: #666;
            font-size: 16px;
            padding: 0 5px;
          }
          
          .money-text{
            padding: 0 6px;
            color: #666;
          }
        }
      
        .reciver-case{
          @include box-vert-left-middle;
          height: auto;
          background: #fff;
          padding: 0 0 5px 0;
          margin-top: -4px;

          .examiner-case{
            @include box-vert-left-top;
            height: auto;
            overflow: hidden;
            margin-top: -10px;

            .examiner-item-case{
              @include box-hori-left-middle;
              padding: 10px 15px;
              height: auto;

              .photoer-case{
                width: 36px;
                height: 36px;
                border-radius: 7px;
              }

              .name{
                padding-left: 10px;
                color: #666;
                font-size: 16px;
                font-weight: bold;
              }

              .icon-phone{
                font-size: 21px;
                color: #999;
              }
            }
          }
        }
      
        .title{
          @include box-hori-left-middle;
          height: 50px;
          line-height: 50px;
          margin-bottom: 1px;
          background: #fff;
          padding: 0 12px;
          color: #666;
          font-size: 16px;
          font-weight: bold;

          span{
            color: #999;
            font-size: 12px;
            font-weight: normal;
            margin-left: 10px;
          }
        }
      
        .carno-case{
          @include box-hori-left-middle;
          margin: 0 0 10px 0;
          height: auto;
          background: #fff;
        
          .carno-inner-case{
            @include box-vert-left-middle;
            margin-top: -5px;
            padding: 0 0 10px 10px;
          
            h4{
              height: auto;
              color: #999;
              padding: 8px 5px;
            
              label{
                color: #999;
              }
            }
          
            .plateno-case{
              @include box-hori-left-middle;
              height: auto;
              width: 100%;
              margin-top: 10px;
            }
          
            .boxer{
              @include box-vert-center-middle;
              width: 12%;
              height: 48px;
              border: dashed 1px #74baf3;
              border-radius: 4px;
              margin: 0 3px;
              font-size: 18px;
              color: #666;
              font-weight: bold;

              &.privince-boxer{
                color: #008de1;
                font-weight: bold;
              }
            }
          }
        }
      
        .items-case{
          @include box-vert-left-top;
          height: auto;
          min-height: 80px;
          padding: 0 8px;

          .category-header-case{
            @include box-hori-center-top;
            height: 32px;
            color: $textColor;
            font-size: 12px;
          }
        
          .category-item-case{
            @include box-hori-left-top;
            margin-bottom: 10px;
            background: #ccc;
            border-radius: 9px;
          
            .info-case{
              @include box-vert-left-top;
              height: auto;
              padding: 10px 10px 8px 14px;
              position: relative;
              background: #fff;
              
              .modify-case{
                @include box-vert-center-middle;
                width: 20%;
                height: 100%;
                position: absolute;
                right: -20%;
                top: 0;
                background: #fff;
                color: $blue;
                font-weight: bold;
                font-size: 16px;
              }
              
              .remove-case{
                @include box-vert-center-middle;
                width: 30%;
                font-weight: bold;
                height: 100%;
                position: absolute;
                right: -50%;
                top: 0;
                color: $red;
                border-left: solid 1px #f0f0f0;
                font-size: 16px;
                background: #fff;
                overflow: hidden;
                
                &:active{
                  opacity: .8;
                }
                
                .confirmRemove{
                  @include box-vert-center-middle;
                  width: 100%;
                  height: 100%;
                  background: #d32c2c;
                  position: absolute;
                  top: 0;
                  left: 0;
                  transition: transform .3s;
                  color: #fff;
                  padding-right: 35px;
  
                  .icon-close{
                    @include box-vert-center-middle;
                    width: 35px;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                    font-size: 24px;
                    border-left: solid 1px #f85959;
                    background: #d32c2c;
                    color: #fff;
                  }
                }
              }
              
              .examin-case{
                @include box-hori-left-top;
                width: 100%;
  
                .examin-left-case{
                  @include box-vert-left-top;
                }
                
                .examin-right-case{
                  @include box-vert-left-top;
                  border-left: solid 1px #eee;
                  padding-left: 10px;
                }
              }
              
              .examin-result{
                @include box-hori-left-top;
                height: auto;
                margin-top: 10px;
                border-top: solid 1px #eee;
                padding: 10px 0 0;
                font-size: 12px;
                color: $textLessColor;
                
                .examin-title{
                  @include box-hori-left-middle;
                  padding: 0 6px;
                  height: auto;
                  width: auto;
                  font-size: 10px;
                  border-radius: 5px;
                  border: solid .5px #ccc;
                }
                
                .examin-content{
                  padding: 0 0 0 8px;
                  height: auto;
                }
                
                .agree-btn{
                  height: 26px;
                  width: auto;
                  font-size: 12px;
                  padding: 0 12px;
                  border-radius: 3px;
                }
                
                .icon-check{
                  width: auto;
                  color: $blue;
                  font-weight: bold;
                }
              }
            
              h2{
                font-size: 16px;
                color: #666;
                font-weight: bold;
                
                label{
                  color: #999;
                  font-size: 12px;
                  padding-left: 10px;
                  font-weight: normal;
                }
              }

              h3{
                @include box-hori-left-middle;
                color: $red;
                font-size: 20px;
                margin-top: 5px;
                font-weight: 300;

                &::before{
                  font-weight: normal;
                  content: '总价(元)';
                  font-size: 12px;
                  padding: 3px 3px 0 0;
                }
              }

              h4{
                @include box-hori-left-middle;
                margin-top: 8px;
                color: $red;
                font-size: 18px;
                font-weight: 300;

                &::before{
                  font-weight: normal;
                  content: '单价(元)';
                  font-size: 12px;
                  padding: 3px 3px 0 0;
                }
              }
              
              h5{
                @include box-hori-left-middle;
                margin-top: 10px;
                font-size: 12px;
                color: $textLessColor;
                margin-bottom: -2px;
              }

              .old{
                font-size: 14px;
                color: #aaa;
                text-decoration: line-through #aaa;
                margin-left: 5px;
              }
              
              .oper-case{
                @include box-vert-right-middle;
                width: 90px;
                height: 100%;
                position: absolute;
                top: 0;
                right: 10px;
                font-size: 14px;
                font-weight: bold;
                color: #008de1;
                
                .dis-agree{
                  @include box-vert-right-middle;
                  color: #f85959;
                }
                
                .see{
                  height: 20px;
                  color: #999;
                  font-size: 10px;
                  font-weight: normal;
                }
              }
            }
            
            
          
            .category-img{
              width: 50px;
              height: 50px;
            }
          }
        }
      
        .remark-case{
          @include box-hori-left-middle;
          height: auto;
          padding: 10px;
          min-height: 50px;
          background: #fff;
          margin-bottom: 10px;
        
          label{
            width: 50px;
          }
        
          .remark{
            height: 80px;
          }
        }
      
        .icon-right-arr{
          @include box-vert-center-middle;
          color: #ccc;
          height: 100%;
          width: 24px;
          font-size: 24px;
        }
      }
    }

	  .btn-case{
		  @include box-hori-center-middle;
		  color: #fff;
		  position: fixed;
		  height: 56px;
      bottom: 0;
      left: 0;
      z-index: 10;
		  background: #fff;
		  font-size: 18px;
      box-shadow: -10px 0 10px rgba(0, 0, 0, .1);
      padding: 0 5px;

      button{
        text-align: center;
        height: 40px;
        font-weight: bold;
        border-radius: 5px;
        color: #fff;
        font-size: 16px;
        margin: 0 5px;

        &.publish{
          border: solid .5px #008de1;
          background: transparent;
          color: #008de1;
          
          &:active{
            background: $blue;
            color: #fff;
          }
        }

        &.sendCar{
          background: #008de1;
        }
      }
	  }
  }
  
  .agreement-case{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    background: #f7f7f7;
    border-radius: 7px 7px 0 0;
    overflow: hidden;
    
    header{
      @include box-hori-center-middle;
      height: 50px;
      background: #fff;
      border-bottom: solid 1px #f1f1f1;
      position: relative;
      color: #666;
      font-size: 16px;
      font-weight: bold;
  
      .icon-close{
        @include box-vert-center-middle;
        font-size: 32px;
        color: #999;
        font-weight: normal;
        position: absolute;
        right: 0;
        top: 0;
        width: 36px;
        height: 50px;
      }
    }
    
    .tip-case{
      padding: 8px 12px 8px 50px;
      color: #666;
      font-size: 12px;
      height: auto;
      line-height: 16px;
      background: #fff;
      position: relative;
      
      .icon-attention3{
        @include box-vert-center-middle;
        height: 100%;
        width: 50px;
        font-size: 18px;
        color: #f85959;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    
    .exp-scroller-case{
      @include box-vert-left-top;
      margin-top: 10px;
      height: auto;
      
      .exp-item{
        @include box-hori-left-middle;
        height: 50px;
        padding: 0 15px;
        background: #fff;
        margin-bottom: 1px;
        
        label{
          height: auto;
          font-size: 14px;
          font-weight: bold;
          color: #666;
        }
        
        .state-case{
          height: auto;
          color: #f85959;
          font-size: 12px;
        }
      }
    }
    
    .agree-case{
      @include box-vert-left-top;
      padding: 0 10px;
      background: #fff;
      
      .category-info-case{
        @include box-hori-left-middle;
        height: auto;
        padding: 10px 0;
        
        .category-left-case{
          @include box-hori-center-middle;
          width: 120px;
          height: auto;
          font-size: 18px;
          color: $textColor;
          font-weight: bold;
        }
        
        .category-right-case{
          @include box-vert-left-top;
          border-left: solid 1px #eee;
          padding-left: 10px;
          
          .label{
            @include box-hori-left-middle;
            height: 20px;
            font-size: 12px;
            color: $textLessColor;
          }
        }
        
        .agree-btn{
          width: 100%;
        }
      }
      
      .category-remark-case{
        @include box-vert-center-top;
        height: 100px;
        border-top: solid 1px #eee;
        padding-top: 10px;
      }
      
      .category-btn-case{
        @include box-vert-center-bottom;
        
        .agree-btn{
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
    
    footer{
      @include box-vert-center-top;
      height: 90px;
      padding: 0 20px;
      
      .agree-case{
        @include box-hori-center-top;
        height: 32px;
        width: 100%;
        
        .check-border{
          width: 18px;
          height: 18px;
          border: solid 1px #dedede;
          border-radius: 3px;
          white-space: nowrap;
          line-height: 16px;
          text-align: center;
          font-weight: bold;
          color: #008de1;
          background: #fff;
          
          &.icon-check{
          
          }
        }
  
        .icon-check-false{
          color: transparent;
        }
        .icon-check-true{
          color: #008de1;
        }
        
        label{
          height: auto;
          margin-top: -2px;
          font-size: 12px;
          margin-left: 8px;
          color: #008de1;
        }
      }
      
      button{
        height: 42px;
        width: 100%;
        text-align: center;
        border-radius: 3px;
        font-size: 16px;
  
        &.btn-true{
          background: #008de1;
          color: #fff;
        }
        &.btn-false{
          background: #ccc;
          color: #aaa;
        }
      }
    }
  }

  .reason-case{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 7px 7px 0 0;
    overflow: hidden;
  
    header{
      @include box-hori-center-middle;
      height: 50px;
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      color: $textColor;
      background: #fff;
      border-bottom: solid 1px $normalBgColor;
    
      .icon-close{
        @include box-vert-center-middle;
        font-size: 32px;
        color: #999;
        font-weight: normal;
        position: absolute;
        right: 0;
        top: 0;
        width: 36px;
        height: 50px;
      }
    }
  
    .body-case{
      @include box-vert-left-top;
    
      .category-info-case{
        @include box-hori-left-middle;
        height: auto;
        padding: 10px 20px;
      
        .left{
          text-align: center;
          height: auto;
          width: 100px;
          font-size: 16px;
          color: #666;
          font-weight: bold;
        }
      
        .right{
          @include box-vert-left-middle;
          height: auto;
          border-left: solid 1px #eee;
          padding-left: 10px;
        
          label{
            height: auto;
            padding: 1px 0;
            color: #999;
          }
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
          width: 100%;
          padding: 0 15px;
          
          label{
            width: 80px;
            height: auto;
            color: #999;
          }
          
          input{
            height: 30px;
            padding: 0 8px;
            font-size: 16px;
          }
        }
      }
      
      .dis-reason-case{
        @include box-hori-left-top;
        margin-top: 5px;
        padding: 0 20px;
        
        .left{
          text-align: center;
          width: auto;
          height: 16px;
          border: solid .5px #008de1;
          border-radius: 3px;
          padding: 0 3px;
          line-height: 15px;
          color: #008de1;
          font-size: 12px;
          margin-right: 10px;
        }
        
        .right{
          height: auto;
          color: #008de1;
          margin-top: -3px;
          padding: 0;
        }
      }
    
      .textarea-case{
        @include box-vert-center-top;
        padding: 0 20px;
        height: 110px;
        
        &.textarea-case2{
          padding: 10px 20px 0;
        }
      }
    }
    
    .row{
      border-top: solid 1px $normalBgColor;
      
      &:last-child{
        border-bottom: solid 1px $normalBgColor;
      }
    }
  
    footer{
      @include box-hori-center-top;
      height: 52px;
      padding: 0 20px;
    
      button{
        height: 42px;
        width: 100%;
        background: $red;
        border-radius: 5px;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        
        &.modify-btn{
          background: $blue;
        }
      }
    }
  }
</style>
