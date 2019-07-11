<template>
  <normal-layout class="order-detail-page" :loaded="loaded">
    <error-pop :msg="errMsg" />
    <normal-header :title="title" menuText="添加品类" @menuHandler="searchCategory" @backHandler="backHandler" />
    
    <div class="detail-container auto-fill">
      <scroller class="detail-inner-container" :load="false">
        <ul class="order-case" v-if="order.uuid">
          <li class="guide-case">
            <span class="iconfont icon-order"></span>
            <div class="order-info-case auto-fill">
              <label>报价单编号: {{order.orderno}}</label>
              <label>创建时间: {{order.createtime}}</label>
            </div>
          </li>
          
          <!--如果是未提交状态、则允许修改、已提交后就只能展示只读了-->
          <li class="order-info-row" v-if="orderState == 0">
            <input-text placeholder="请填写报价单标题" iptId="firstIpt" v-model="order.title">标题：</input-text>
          </li>
          <li class="order-info-row" v-if="orderState != 0">
            <label class="label-txt">标题：</label>
            <h3 class="auto-fill">{{order.title}}</h3>
          </li>
  
          <li class="order-info-row" v-if="orderState == 0">
            <input-text placeholder="请填写报价单备注" v-model="order.remark">备注：</input-text>
          </li>
          <remark class="remark-tip" v-if="orderState == 0">备注信息越精准，别的供应商越能快速在生意圈中发现您的报价单哦 ^_^</remark>
          <li class="order-info-row" v-if="orderState != 0" style="height:auto;">
            <label class="label-txt">备注：</label>
            <h4 class="auto-fill">{{order.remark}}</h4>
          </li>
  
          <!--<li class="description-case" v-if="order.categorys.length > 0">
            <label>当前报价单中共有 <a>{{order.categorys.length}} 个品类</a></label>
          </li>-->
          <li class="order-list-case">
            <slider-blocker :item="item" class="order-inner-case" v-for="(item, idx) in order.categorys" sliderWidth="25" :key="item.id" :id="item.id">
              <div class="item-container" @tap.stop="categoryDetail(item)">
                <span class="empty-delete" @tap.stop="removeCategory(item, idx)">删除</span>
                <div class="info-case">
                  <label class="auto-fill">{{item.ctname}}{{item.itemid}}</label>
                  <span class="cateyory-num">数量: {{item.amount || 0}} 株</span>
                </div>
                <ul class="supplier-case auto-fill">
                  <li v-for="(supplier, idx) in item.suppliers" v-if="idx < 5" class="supplier-photo-case">
                    <image-loader :src="supplier.user.url" class="photo-case" :defaultCls="'photo-' + ((supplier.user.sex == '1') ? 'man' : 'woman') + '-case'">
                      <div class="masker iconfont icon-check" v-if="supplier.published == '1'"></div>
                    </image-loader>
                  </li>
                  <li class="ellipsis-case auto-fill">
                    <label v-if="orderState == '0'">{{item.suppcount == 0 ? '未指定任何供应商' : '共' + item.suppcount + '位供应商'}}</label>
                    <label v-if="orderState != '0'">{{item.suppcount == 0 ? '未指定任何供应商' : '共' + item.suppcount + '位供应商'}}{{item.taked > 0 ? '、' + item.taked + '位已报价' : '、尚无人报价'}}</label>
                    <div class="button" v-if="item.taked > 0">查看供应商 <span class="iconfont icon-right-arr"></span></div>
                  </li>
                </ul>
              </div>
            </slider-blocker>
          </li>
        </ul>
      </scroller>
    </div>
    <div class="order-btn-case">
      <span class="submit-order save-order auto-fill" @click="save" v-if="orderState == 0">保存</span>
      <span class="submit-order auto-fill" @tap="submitOrder" v-if="orderState == 0 && flag == 1">提交</span>
      <confirm-button class="submit-order auto-fill" @handler="createInvoice" v-if="orderState == 1">创建发货单</confirm-button>
    </div>
  
    <masker-dialog :show="isOpen" :size="screen_height - 20" @closeHandler="closeMasker" :force="true">
      <div class="invoice-case">
        <header>创建发货单<span class="closer iconfont icon-close" @tap.stop="close"></span></header>
        <div class="row" style="margin-top: 50px;">
          <label>发货单标题：</label>
          <input type="text" v-model="invoice.title" class="auto-fill" />
          <span class="iconfont icon-edit1"></span>
        </div>
        <scroller class="invoice-scroller">
          <div class="invoice-warpper">
            <ul class="category-list">
              <li class="category-item" v-for="category in confirmedCategorys">
                <div class="category-name">
                  <span>{{category.ctname}}</span>
                  <label>供应商{{category.suppliers.length}}人</label>
                </div>
                <ul class="supplier-list auto-fill">
                  <li class="total">{{category.total | price}}</li>
                  <li class="supplier-item" v-for="supplier in category.suppliers" @tap="selectSupplier(supplier)">
                    <image-loader :src="supplier.supplier.url" class="photo-case" :defaultCls="'photo-' + ((supplier.supplier.sex == '1') ? 'man' : 'woman') + '-case'" />
                    <label class="auto-fill">{{supplier.supplier.name}}</label>
                    <span class="price">{{supplier.total | price}}</span>
                    <span class="iconfont icon-check" :class="'check-' + supplier.chose"></span>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="row2">
              <input-area class="reason-case" maxLength="50" placeholder="发货备注" v-model="invoice.remark"></input-area>
            </div>
          </div>
        </scroller>
        <footer class="footer-btn">
          <button @tap="send">发送发货单</button>
        </footer>
      </div>
    </masker-dialog>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import normalHeader from '@/components/comm/NormalHeader'
  import errorPop from '@/components/comm/ErrorPop'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import OrderBo from '@/model/bo/Order'
  import CategoryBo from '@/model/bo/Category'
  import SupplierBo from '@/model/bo/Supplier'
  import InvoiceBo from '@/model/bo/Invoice'
  import comboxMenu from "@/components/comm/ComboxMenu"
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import radioBtn from '@/components/comm/Radio'
  import imageLoader from '@/components/comm/ImageLoader'
  import sliderBlocker from '@/components/comm/SliderBlocker'
  import sliderBtn from '@/components/comm/SliderButton'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  import confirmButton from '@/components/comm/ConfirmButton'
  import remark from '@/components/comm/Remark'
  import inputArea from '@/components/comm/InputArea'
  import inputText from '@/components/comm/Input'
  
  export default {
    components: {
      scroller,
      normalLayout,
      normalHeader,
      comboxMenu,
      radioBtn,
      imageLoader,
      sliderBlocker,
      maskerDialog,
			confirmButton,
      errorPop,
      sliderBtn,
      remark,
      inputArea,
      inputText
    },
    
    created(){
			window.addEventListener('addCategory', (e) => {
        OrderBo.addCategory.call(this.order, e.detail.category)
        this.saveOrder(e.detail.category)
			})
			window.addEventListener('updateCategory', (e) => {
        this.saveOrder(e.detail.category)
			})
      window.addEventListener('init', (e) => {
        this.init(e.detail.state)
      })
      window.addEventListener('detail', (e) => {
        this.detail(e.detail.order, e.detail.state)
      })

			mui.plusReady(() => {
				plus.webview.show('orderDetail', 'pop-in', 300)
			})
    },
    
    mounted(){
			mui.plusReady(() => {
				let state = plus.webview.currentWebview().state, order = plus.webview.currentWebview().order, flag = plus.webview.currentWebview().flag, searchWin = plus.webview.getWebviewById('searchCateory')
				this.orderState = state
				this.flag = flag
				if(flag == 0){
					this.init(flag, state)
				}else{
					this.detail(order, flag, state)
				}
				//查找searchPage窗口，如果存在，直接调用，不存在则预加载
				if(searchWin){
					this.searchPage = searchWin
				}else{
					this.searchPage = mui.preload({
						id: 'searchCateory',
						url: config.CDN_ADDRESS + '/searchCateory'
					})
				}
				setTimeout(() => {
					if(state == '0'){
						utils.openSoftKeyborad('firstIpt')
					}
				}, 300)
			})
    },
    
    data(){
      return {
        loaded: false,
        order: {
        	categorys: []
        },
        errMsg: '',
        orderState: null,
        currentCategory: null,
        isOpen: false,
        screen_height: window.screen.availHeight,
        screen_width: window.screen.availWidth,
        invoice: new InvoiceBo(),
        confirmedCategorys: [],
        flag: ''
      }
    },
    
    computed: {
      title(){
        let state = this.orderState, _title = '', flag = this.flag
        if(state == 0){
          _title = flag == '0' ? '创建报价单' : '修改报价单'
        }else if(state == 1){
          _title = '查看供应商报价信息'
        }
        return _title
      }
    },
    
    methods: {
      cancels(flag){
        if(flag == 0){
          this.order.title = ''
        }else{
          this.order.remark = ''
        }
      },
  
      backHandler(){
        mui.fire(plus.webview.getWebviewById('myOffer'), 'changePage', {code: this.orderState})
      },
      
      send(){
        if(!this.invoice.title){
					utils.toast('请填写发货单标题', 3000, 'FAILED')
          return ;
        }
        utils.confirm('确定给这些供应商发送发货单', () => {
					let invoice = JSON.parse(JSON.stringify(this.invoice)), users = []
					this.confirmedCategorys.forEach(category => {
						let suppliers = category.suppliers
						suppliers && suppliers.forEach(supplier => {
							if(supplier.chose){
								let existed = false
								for(let i=0; i<users.length; i++){
									if(supplier.supplier.userid == users[i].userid){
										existed = true
										break ;
									}
								}
								if(!existed){
									users.push({
										userid: supplier.supplier.userid,
										name: supplier.supplier.name,
										amount: supplier.amount,
										total: supplier.total,
										price: supplier.price,
										sctype: supplier.sctype,
										categorys: []
									})
								}
							}
						})
					})
					users.forEach(user => {
						this.confirmedCategorys.forEach(category => {
							let suppliers = category.suppliers, existed = false
							suppliers && suppliers.forEach(supplier => {
								if(supplier.chose && supplier.supplier.userid == user.userid){
									existed = true
									Object.assign(category, {
										amount: supplier.amount,
										price: supplier.price,
										total: supplier.total,
										scid: supplier.scid
									})
								}
							})
							if(existed){
								user.categorys.push(category)
							}
						})
					})
					users.forEach(user => {
						let _invoice = {
							supplierid: user.userid,
							remark: invoice.remark,
							title: invoice.title,
							uuid: utils.getUuid(),
							items: []
						}
						user.categorys.forEach(category => {
							_invoice.items.push({
								amount: category.amount,
								total: category.total,
								price: category.price,
								ptype: '034001',
								sctype: user.sctype,
								scid: category.scid
							})
						})
						invoice.invoices.push(_invoice)
					})
					service('saveInvoice', invoice, rs => {
						utils.toast('发货单创建成功')
            this.isOpen = false
            setTimeout(() => {
              plus.webview.create(config.CDN_ADDRESS + '/myGoods', 'myGoods')
            }, 300)
					})
        })
      },

      selectSupplier(supplier){
        supplier.chose = !supplier.chose
      },

    	init(flag, state){
    		let user = JSON.parse(utils.getLocalItem('user'))
				service('newOrder', {
          cityid: user.cityid,
          userid: user.userid,
          uuid: utils.getUuid()
        }, order => {
					this.order = new OrderBo(order)
          this.loaded = true
        })
      },
  
      createInvoice(){
    	  let user = utils.getLocalUser()
    	  this.invoice = new InvoiceBo({
          expdays: '',
          cityid: user.cityid,
          userid: user.userid
        })
  
        service('getConfirmedOffer', {
          orderid: this.order.orderid
        }, items => {
          if(items && items.length > 0){
            items.forEach(item => {
              item.suppliers && item.suppliers.forEach(supplier => {
                supplier.chose = true
              })
            })
            this.isOpen = true
            this.confirmedCategorys = items
          }else{
            utils.toast('请先选择确认供应商！', 2000, 'FAILED')
          }
        })
      },
  
      closeMasker(){
        this.isOpen = false
      },
      
      detail(order, flag, state){
    		let user = utils.getLocalUser(), orderState = plus.webview.currentWebview().state
        
        service('orderDetail', {
          orderid: order.orderid,
					userid: user.userid,
          st: orderState
        }, rs => {
          let order = new OrderBo(rs)
          rs.items && rs.items.forEach(category => {
            let _category = new CategoryBo(category), takings = category.takings || []
            CategoryBo.setSimpleSuppliers.call(_category);
            (takings.length > 0) && _category.suppliers.forEach(supplier => {
              let userid = supplier.user.userid
              takings.forEach(tak => {
                if(tak.supplier.userid == userid){
                  supplier.published = tak.published
                }
              })
            })
            OrderBo.addCategory.call(order, _category)
          })
          this.order = order
          this.loaded = true
        })
      },

			updateCategory(category){
        this.order.categorys.forEach((_category, idx) => {
        	if(_category.id === category.id){
            //Object.assign(this.order.categorys[idx], category)
            this.order.categorys[idx] = category
          }
        })
      },

      searchCategory(item){
        this.searchPage && this.searchPage.show('pop-in', 300)
        setTimeout(() => {
					mui.fire(this.searchPage, 'init')
        }, 110)
      },
  
      categoryDetail(category){
        if(this.orderState == '0'){
          utils.masker(true)
          this.currentCategory = category
          plus.webview.create(config.CDN_ADDRESS + '/categoryDetail', 'categoryDetail', {
            'background': 'transparent'
          }, {
            category,
            flag: 1,
            type: 0,
            orderid: this.order.orderid
          })
        }else if(this.orderState == '1'){
					this.currentCategory = category
					plus.webview.create(config.CDN_ADDRESS + '/reportedCategory', 'reportedCategory', {
						'background': 'transparent'
					}, {
						category,
						flag: 1,
            orderid: this.order.orderid
					})
        }
      },

      /*保存报价单(草稿状态)*/
      save(){
      	let user = utils.getLocalUser()
      	let params = {
					expdays: '5',
					userid: user.userid,
					orderid: this.order.orderid,
					remark: this.order.remark,
					title: this.order.title || '未命名的报价单',
					uuid: this.order.uuid,
          items: []
        }

      	service('saveOrder', params, rs => {
      		utils.toast('保存成功')
          this.flag = '1'
        })
      },
  
      saveOrder(category){
				//let params = OrderBo.save.call(this.order, category)
        let user = utils.getLocalUser()
        let param = {
					expdays: 5,
					userid: user.userid,
					orderid: this.order.orderid,
					remark: this.order.remark,
					title: this.order.title,
          uuid: this.order.uuid,
          items: []
        }, item = {
        	imgs: [],
					ctid: category.ctid,
					amount: category.amount,
					allots: [],
					cname: category.cname,
					visib: category.visib,
					remark: category.remark,
					sctype: '020001',
          uuid: category.uuid,
					specs: [],
					limit: category.limit,
					scid: category.scid,
					ctname: category.ctname
        }

				if(category.imgs && category.imgs.length > 0){
					category.imgs.forEach(img => {
						item.imgs.push(img.path)
					})
        }
        (item.imgs.length > 0) && (item.imgs = item.imgs.join(','))
				if(category.specs && category.specs.length > 0){
					category.specs.forEach(spec => {
						spec.chose && item.specs.push({
							unit: spec.unit,
							min: spec.min,
							max: spec.max,
							name: spec.name,
							id: spec.id,
							stand: spec.stand,
							uuid: spec.uuid
            })
          })
				}
				if(category.suppliers && category.suppliers.length > 0){
					category.suppliers.forEach(supplier => {
						supplier.chose && item.allots.push({
							amount: supplier.amount,
							uuid: supplier.uuid,
              userid: supplier.user.userid
            })
          })
				}
				param.items.push(item)

        service('saveOrder', param, rs => {
          utils.toast('保存成功')
          let state = plus.webview.currentWebview().state, order = plus.webview.currentWebview().order
          this.detail(this.order, state)
				})
      },
      
      close(){
        this.isOpen = false
      },
      
      submitOrder(){
        if(!(this.order.categorys && this.order.categorys.length > 0)){
          utils.toast('报价单中至少需要添加一个品类', 3000, 'FAILED')
          return ;
        }
        utils.confirm('确定提交此报价单', () => {
          let user = utils.getLocalUser()
          service('publishOffer', {
            orderid: this.order.orderid,
            uuid: this.order.uuid,
            title: this.order.title,
            remark: this.order.remark,
            expdays: this.order.expdays,
            userid: user.userid
          }, rs => {
            utils.toast('提交成功')
            mui.fire(plus.webview.getWebviewById('order'), 'changePage', {code: '1'})
            plus.webview.currentWebview().close('pop-out', 300)
          })
        })
      },
  
      removeCategory(item, idx){
        utils.confirm('您确定要删除该品类么？', () => {
          service('removeCategoryFromBjd', {
            orderid: this.order.orderid,
            uuid:  item.uuid,
            dt: '1',
            userid: utils.getLocalUser().userid
          }, rs => {
            utils.toast('删除成功')
            this.order.categorys.splice(idx, 1)
          })
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .order-detail-page{
    @include box-vert-left-top;
    height: 100%;
    background: $normalBgColor;

    .detail-container{
      @include box-vert-left-top;
      padding: 50px 0;
      position: relative;

      .detail-inner-container{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
        padding-bottom: 25px;
      }

      .order-case{
        @include box-vert-left-top;
        height: auto;
        overflow: visible;
        
        .guide-case{
          @include box-hori-left-middle;
          height: auto;
          background: #fff;
          color: $textStrongColor;
          font-size: 16px;
          padding: 15px 15px 15px 10px;
          margin-bottom: 1px;
          
          .icon-order{
            width: 42px;
            line-height: 40px;
            height: 42px;
            background: rgba(0, 0, 0, .08);
            text-align: center;
            font-size: 24px;
            margin: 0 15px 0 0;
            border-radius: 48px;
          }

          .order-info-case{
            @include box-vert-left-middle;

            label{
              height: 20px;
              font-size: 14px;
              color: #666;
            }
          }
        }
        
        .description-case{
          @include box-hori-center-middle;
          //padding: 8px 10px 0 10px;
          height: auto;
          margin-top: 50px;

          label{
            width: 100%;
            //padding: 0 20px;
            height: 36px;
            text-align: center;
            background: url("../../../../assets/img/yellow.png") top left/100% 100% repeat-y;
            //border-radius: 20px;
            line-height: 36px;
            color: #644f1b;
          }
        }
        
        .order-info-row{
          @include box-hori-left-middle;
          min-height: 50px;
          height: auto;
          background: rgba(255, 255, 255, 1);
          padding: 0 10px 0 10px;
          margin-bottom: 1px;
          position: relative;
          
          label{
            padding-top: 1px;
            width: 55px;
            padding-left: 6px;
            color: $textColor;
          }
  
          h3{
            height: auto;
            font-size: 16px;
            color: #666;
          }
  
          h4{
            height: auto;
            font-size: 14px;
            color: #666;
            padding: 15px 0;
            line-height: 18px;
          }
          
          .iconfont{
            width: 24px;
            text-align: left;
            font-size: 18px;
            color: #dedede;
            margin-top: 3px;
          }
          
          input{
            height: 30px;
            line-height: 20px;
            margin: 0 12px 0 0px;
            color: #666;
            padding: 0;
            font-size: 16px;
            background: transparent;
            
            &::-webkit-input-placeholder{
              font-size: 14px;
              color: $textLessColor;
            }
          }
          
          .radio-case{
            @include box-hori-right-middle;
            height: 100%;
          }
        }
  
        .remark-tip{
          @include box-hori-left-middle;
          height: auto;
          width: 100%;
          background: #fff6cd;
          padding: 6px 12px;
          font-size: 12px;
          color: rgba(115, 91, 39, .8);
    
          .icon-lighter2{
            margin-top: -2px;
            color: #735b27;
            font-size: 24px;
            margin-right: 10px;
          }
        }

        .order-add-new-category{
          @include box-hori-center-middle;
          height: 50px;
          background: #fff;
          font-size: 16px;
          color: #74baf3;

          .icon-plus{
            font-size: 18px;
            margin-right: 10px;
          }
        }
        
        .order-list-case{
          @include box-vert-left-top;
          //padding: 0 8px 8px 8px;
          width: 100%;
          height: auto;
          margin-top: 10px;
          //margin-top: 8px;
          position: relative;
          overflow: visible;
          padding: 0 10px 20px;

          i.up-arrow{
            width: 0;
            height: 0;
            border: solid 10px transparent;
            border-bottom-color: #fff;
            position: absolute;
            top: -18px;
            left: 50%;
            margin-left: -5px;
          }

          .order-inner-case{
            @include box-vert-left-middle;
            width: 100%;
            height: auto;
            background: rgba(0, 0, 0, .3);
            color: #666;
            border-radius: 9px;
            position: relative;
            margin-bottom: 8px;

            .item-container {
              @include box-vert-left-top;
              padding: 2px 8px 4px 15px;
              width: 100%;
              height: auto;
              overflow: visible;
              background: #fff;
              position: relative;
  
              .empty-delete{
                @include box-vert-center-middle;
                font-size: 16px;
                height: 100%;
                width: 25%;
                position: absolute;
                top: 0;
                right: -25%;
                background: #fff;
                color: $red;
                font-weight: bold;
    
                &:active{
                  background: $red;
                  color: #fff;
                }
    
              }
  
              .empty-detail{
                @include box-vert-center-middle;
                font-size: 16px;
                height: 100%;
                width: 20%;
                position: absolute;
                top: 0;
                right: -20%;
                padding-bottom: 18px;
    
                &:active{
                  background: rgba(0, 0, 0, .1);
                }
    
                &.icon-more{
                  background: #c7c7cc;
                  color: #666;
                }
              }
            }

            .info-case{
              @include box-hori-left-middle;
              height: 25px;
              padding: 12px 0 0 0;
              color: #666;
              font-weight: bold;

	            label{
		            font-size: 16px;
	            }
              
              .cateyory-num{
                width: auto;
                padding: 0 10px 0 0;
                color: #999;
                font-weight: normal;
                margin-top: -3px;
              }

	            .icon-tag{
		            color: #caad5f;
		            font-size: 16px;
	            }
            }

            .supplier-case{
              @include box-hori-left-middle;
              padding-top: 8px;
              padding-bottom: 8px;
              padding-right: 10px;

              .supplier-photo-case{
                width: 42px;
                height: 42px;
                border-radius: 40px;
                margin: 8px 2px 0 -10px;
                overflow: visible;
                position: relative;
                border: solid 2px #fff;

                .photo-empty-case{
                  background: url("../../../../assets/img/man.png") center center/cover no-repeat;
                }
                
                .photo-case{
                  width: 42px;
                  height: 42px;
                  border-radius: 36px;
                  overflow: hidden;
                  border: solid 1px #fff;
                  position: relative;
                  
                  .masker{
                    @include box-hori-center-middle;
                    height: 12px;
                    width: 36px;
                    background: rgba(0, 0, 0, .5);
                    margin-top: 24px;
                    
                    &.icon-check{
                      font-size: 12px;
                      color: #fff;
                      font-weight: bold;
                    }
                  }
                }
                
                .report-point{
                  width: 12px;
                  height: 12px;
                  padding-left: 1px;
                  background: #ffb000;
                  border-radius: 16px;
                  position: absolute;
                  top: -3px;
                  right: 0;
                  font-size: 8px;
                  color: #fff;
                  line-height: 12px;
                  text-align: center;
                  z-index: 10;
                }
                
                &:first-child{
                  margin-left: -5px;
                }
              }
  
              .more{
                line-height: 56px;
                height: 36px;
                color: #999;
                font-size: 14px;
              }
              
              .ellipsis-case{
                @include box-vert-right-middle;
                height: auto;
                color: #aaa;
                width: auto;
                margin-left: 15px;
                font-size: 14px;
                
                label{
                  padding-top: 3px;
                  font-size: 12px;
                  height: auto;
                }
  
                .button{
                  @include box-hori-left-middle;
                  width: auto;
                  text-align: center;
                  height: 18px;
                  font-size: 14px;
                  color: $blue;
                  margin-top: 12px;
                  position: relative;
                  padding-right: 14px;
                  
                  .icon-right-arr{
                    line-height: 14px;
                    width: 24px;
                    height: 16px;
                    z-index: 10;
                    text-align: right;
                    font-size: 20px;
                    color: $blue;
                    position: absolute;
                    top: 3px;
                    right: -5px;
                  }
    
                  &:active{
                    background: #fff;
                    color: #74baf3;
                  }
                }
              }
            }
            
            label{
              font-size: 18px;
            }
            
            .icon-right-arr{
              line-height: 144px;
              height: 80px;
              font-size: 30px;
              color: #aaa;
              text-align: right;
              position: absolute;
              right: 0;
              top: 0;
            }

            &:last-child{
              //border-bottom: solid 1px #d8d8d8;
            }
          }
        }
      }
    }

    .order-btn-case{
      @include box-hori-center-middle;
      height: 55px;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 500;
	    background: rgba(255, 255, 255, .9);
	    box-shadow: 0 -1px 8px rgba(0, 0, 0, .06);
	    padding: 8px 4px;

      .submit-order{
        @include box-hori-center-middle;
        text-align: center;
	      border-radius: 3px;
        height: 100%;
        //background: #E26660;
        background: #008de1;
        color: #fff;
        font-size: 16px;
        margin: 0 4px;
        font-weight: bold;
        
        &.save-order{
          background: #fff;
          border: solid .5px $blue;
          color: $blue;
        }
        
        &:active{
          opacity: .8;
        }
        
        .icon-check{
          font-size: 18px;
          margin-right: 6px;
          padding-top: 1px;
        }

        .icon-edit1{
          font-size: 16px;
          margin-right: 6px;
          padding-top: 1px;
        }
      }
    }
  }
  
  .invoice-case{
    @include box-vert-left-top;
    background: $normalBgColor;
    border-radius: 7px 7px 0 0;
    overflow: hidden;
    position: relative;
    
    header{
      @include box-hori-center-middle;
      height: 50px;
      background: #fff;
      color: $textColor;
      font-size: 18px;
      position: absolute;
      top: 0;
      z-index: 10;
      border-radius: 7px 7px 0 0;
      left: 0;
      font-weight: bold;
      border-bottom: solid 1px #f1f1f1;
      
      .closer{
        @include box-vert-center-middle;
        width: 50px;
        height: 50px;
        position: absolute;
        color: #999;
        font-size: 32px;
        right: 0;
        top: 0;
      }
    }
  
    .invoice-scroller{
      @include box-vert-left-top;
      position: relative;
      overflow: hidden;
  
      .invoice-warpper{
        padding: 0 10px 100px;
  
        .category-list{
          @include box-vert-left-middle;
          margin: 10px 0;
          height: auto;
    
          .category-item{
            @include box-hori-left-middle;
            background: #fff;
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 7px;
      
            .category-name{
              @include box-vert-center-middle;
              width: 100px;
              height: auto;
              color: #666;
              font-size: 18px;
              font-weight: bold;
        
              span{
                height: auto;
              }
        
              label{
                height: auto;
                font-size: 10px;
                color: #aaa;
                font-weight: normal;
              }
            }
      
            .supplier-list{
              @include box-vert-left-middle;
              border-left: solid 1px #f1f1f1;
              padding: 0 10px;
              height: auto;
        
              .total{
                @include box-hori-left-middle;
                margin-top: -3px;
                font-size: 18px;
                color: #f85959;
                padding-bottom: 5px;
                font-weight: 300;
                border-bottom: solid 1px #f1f1f1;
          
                &:before{
                  content: '总计：';
                  font-size: 12px;
                  font-weight: normal;
                }
                &:after{
                  content: '元';
                  font-size: 12px;
                  font-weight: normal;
                  padding-left: 2px;
                }
          
                label{
                  font-size: 12px;
                  padding-right: 3px;
                  padding-top: 2px;
                }
              }
        
              .supplier-item{
                @include box-hori-left-middle;
                height: auto;
                padding: 8px 0;
                border-bottom: solid 1px #f1f1f1;
          
                &:last-child{
                  border: none;
                }
          
                .photo-case{
                  width: 24px;
                  height: 24px;
                  border-radius: 24px;
                  overflow: hidden;
                }
          
                label{
                  padding-left: 6px;
                  color: #454545;
                  font-size: 16px;
                }
          
                .price{
                  @include box-hori-left-bottom;
                  color: #999;
                  font-size: 16px;
                  width: auto;
                  padding-right: 2px;
            
                  &:after{
                    content: '元';
                    font-size: 12px;
                    font-weight: normal;
                    padding-left: 2px;
                  }
                }
          
                .icon-check{
                  @include box-vert-center-top;
                  width: 18px;
                  height: 18px;
                  border-radius: 24px;
                  margin-left: 10px;
                  line-height: 18px;
            
                  &.check-true{
                    background: #008de1;
                    color: #fff;
                    border: solid 1px #008de1;
                  }
            
                  &.check-false{
                    background: #fff;
                    color: #fff;
                    border: solid 1px #dedede;
                  }
                }
              }
            }
          }
        }
      }
    }
  
    .row2{
      //padding: 10px;
      height: auto;
      background: transparent;
      position: relative;
      padding: 0;
  
      .reason-case{
        height: 100px;
        color: #454545;
        font-size: 14px;
      }
    }
  
    .row{
      @include box-hori-left-middle;
      height: 50px;
      margin-bottom: 1px;
      background: #fff;
      padding: 0 5px 0 15px;
    
      label{
        width: 90px;
        color: #999;
      }
    
      input{
        height: 20px;
        padding: 0;
        margin: 0;
        font-size: 16px;
        color: #333;
      }
    
      .icon-edit1{
        @include box-vert-center-middle;
        width: 32px;
        height: 50px;
        font-size: 16px;
        color: #666;
      }
    }
    
    .footer-btn{
      @include box-vert-center-middle;
      height: 60px;
      padding: 0 10px;
      position: fixed;
      bottom: 0;
      background: #fff;
      left: 0;
      z-index: 10;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, .05);
      
      button{
        text-align: center;
        width: 100%;
        height: 42px;
        background: #008de1;
        border-radius: 5px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;

        &:active{
          opacity: .8;
        }
      }
    }
  }
  
  .label-txt{
    font-size: 14px;
  }
</style>
