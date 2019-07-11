<template>
  <normal-layout class="order-invoice-order-page" :loaded="loaded">
    <order-invoice-header title="创建发货单" @removeHandler="removeCategory" />
    <div class="detail-container auto-fill">
      <scroller class="detail-inner-container">
        <ul class="order-case" v-if="order.uuid">
          <li class="order-info-row">
            <label>发货单标题：</label>
            <span class="order-title">{{order.title}}</span>
          </li>
          <li class="order-total-price">
            <h2>支出总金额</h2>
            <h1><span class="iconfont icon-rmb"></span>12312312.00</h1>
          </li>
          <li class="description-case" v-if="order.categorys.length > 0">
            <label>当前报价单中共有 {{order.categorys.length}} 个品类</a></label>
          </li>
          <li class="order-list-case" v-if="order.categorys.length > 0">
            <div class="order-inner-case" v-for="item in order.categorys" @tap="categoryDetail(item)">
              <div class="info-case">
                <label class="auto-fill"><span class="iconfont icon-tag"></span>&nbsp;{{item.ctname}}</label>
                <span class="cateyory-num">需求数量: {{item.amount || 0}}株</span>
              </div>
              <ul class="supplier-case auto-fill" v-if="item.suppliers.length > 0">
                <slider-blocker v-for="(supplier, idx) in item.suppliers" :item="supplier" class="supplier-photo-case" @tap.stop="openUserInfo(supplier.user)" :key="idx">
                  <div class="slider-inner-case">
                    <flag class="flag slider-flag" size="30" :active="supplier.chose" @handler="removeInvoice()" v-if="supplier.chose">
                      <span class="iconfont icon-check"></span>
                    </flag>
                    <div class="icon-goods" :class="'icon-goods-' + supplier.chose" @tap.stop="goods(supplier, item)">{{supplier.chose ? '取消发货' : '邀请他发货'}}</div>
                    <image-loader :src="supplier.user.url" class="photo-case" :defaultCls="'photo-' + ((supplier.user.sex == '025001') ? 'man' : 'woman') + '-case'">
                      <span class="iconfont icon-vip" v-if="supplier.user.isrealname"></span>
                    </image-loader>
                    <div class="price-info-case auto-fill">
                      <h3>{{supplier.user.name}}</h3>
                      <h4><label class="iconfont icon-rmb"></label>{{supplier.price | price}} x {{supplier.amount | toInt}}株</h4>
                    </div>
                    <div class="price-total-case">
                      <h4><label class="iconfont icon-rmb"></label>{{supplier.total | price}}</h4>
                    </div>
                  </div>
                </slider-blocker>
              </ul>
              <div class="no-supplier-case" v-if="item.suppliers.length === 0">
                <span class="iconfont icon-nodata3"></span> 尚无人报价
              </div>
            </div>
          </li>
          <li class="order-remark-row" style="margin-top: 8px; height: auto;">
            <label>备注：</label>
            <span class="auto-fill order-remark">{{order.remark || '无'}}</span>
          </li>
        </ul>
      </scroller>
    </div>
    <footer class="footer-cargo-case" @tap="sendInvoice">
      <span class="iconfont icon-cargo-cend"></span>
      确定提交发货单
    </footer>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import OrderInvoiceHeader from '@/components/comm/header/OrderInvoiceHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import OrderBo from '@/model/bo/Order'
  import CategoryBo from '@/model/bo/Category'
  import SupplierBo from '@/model/bo/Supplier'
  import comboxMenu from "@/components/comm/ComboxMenu"
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import radioBtn from '@/components/comm/Radio'
  import imageLoader from '@/components/comm/ImageLoader'
  import sliderBlocker from '@/components/comm/SliderBlocker'
  import flag from '@/components/comm/Flag'
	import confirmPrice from '@/components/comm/ConfirmPrice'
  import InvoiceBo from '@/model/bo/Invoice'
  
  export default {
    components: {
      scroller,
      normalLayout,
      OrderInvoiceHeader,
      comboxMenu,
      radioBtn,
      imageLoader,
			sliderBlocker,
	    flag,
			confirmPrice
    },
    
    mounted(){
			mui.plusReady(() => {
				let order = plus.webview.currentWebview().order
				this.detail(order)
        this.user = utils.getLocalUser()
			})
    },
    
    data(){
      return {
        loaded: true,
        order: {
        	categorys: []
        },
        orderState: null,
        currentCategory: null,
        title: '',
        user: {},
				category: {}, //当前选中的需要发货的品类
				supplier: {} //当前选中的需要发货的供应商
      }
    },
    
    methods: {
    	detail(order){
        /*service('orderDetail', {
          orderid: order.orderid,
          st: state
        }, rs => {
          let order = new OrderBo(rs)
          rs.items && rs.items.forEach(category => {
            let _category = new CategoryBo(category)
						category.takings && category.takings.forEach(taking => {
							let supplier = new SupplierBo(taking.supplier || {})
              supplier.price = taking.confirm.price
							supplier.total = taking.confirm.total
							supplier.amount = taking.confirm.amount
							supplier.remark = taking.confirm.remark
              supplier.chose = false
							_category.suppliers.push(supplier)
            })
            OrderBo.addCategory.call(order, _category, true)
          })
          this.order = order
					utils.masker()
					plus.webview.show('confirmedOrder', 'pop-in', 200)
        })*/
        this.order = order
        utils.masker()
        plus.webview.show('orderInvoice', 'pop-in', 200)
      },

			closeMasker(){
    		this.maskerShow = false
      },

			goods(supplier, category){
			  if(supplier.chose){
			    mui.confirm('确定不需' + supplier.user.name + '发货了么？', '取消发货邀请', ['是','否'], e => {
			      if(e.index == 0){
			        this.supplier.chose = false
            }
          })
        }else {
          let _category = JSON.parse(JSON.stringify(category))
          Object.assign(_category, {
            amount2: supplier.amount,
            price: supplier.price,
            total: supplier.total
          })
          this.category = _category
          this.supplier = supplier
          this.maskerShow = true
        }
      },
  
      openUserInfo(user){
    	  utils.openUserCard(user.userid, 0)
      },

			savePrice(){
        let slider = this.supplier.slider
        let total = parseInt(slider.offsetWidth * .4)
				InvoiceBo.addSupplier.call(this.invoice, this.supplier, this.category)
        utils.animationLine(slider, 10, 8, total, true)
        this.supplier.chose = true
      },

			calTotal(category){

      },
  
      categoryDetail(category){
        utils.masker(true)
      	this.currentCategory = category
        plus.webview.create(config.CDN_ADDRESS + '/reportedCategory', 'reportedCategory', {
          'background': 'transparent'
        }, {
          category,
          flag: 1
        })
      },
  
      removeCategory(){
      	this.order = new OrderBo()
      },
  
      removeInvoice(){
        mui.confirm('确定不需' + this.supplier.user.name + '发货了么？', '取消发货邀请', ['是','否'], e => {
          if(e.index == 0){
            this.supplier.chose = false
          }
        })
      },
  
      sendInvoice(){
        let invoice = this.invoice, params = {
          userid: invoice.userid,
          cityid: invoice.cityid,
          remark: invoice.remark,
          expdays: invoice.expdays,
          invoices: []
        }
        this.order && this.order.categorys && this.order.categorys.forEach(category => {
        
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .order-invoice-order-page{
    @include box-vert-left-top;
    height: 100%;
    background: #e7e7e7;
    position: relative;

    .detail-container{
      padding: 50px 0 0 0;
      height: 100%;
      position: relative;

      .detail-inner-container{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
      }

      .order-case{
        @include box-vert-left-top;
        height: auto;
        overflow: visible;
        
        .guide-case{
          @include box-hori-left-middle;
          height: 80px;
          background: #74baf3;
          color: #fff;
          font-size: 16px;
          padding: 0 15px;
          
          .icon-order{
            width: 48px;
            line-height: 46px;
            height: 48px;
            border: solid 1px #fff;
            text-align: center;
            font-size: 28px;
            margin: 0 16px 0 0;
            border-radius: 48px;
          }

          .order-info-case{
            @include box-vert-left-middle;

            label{
              height: 20px;
              font-size: 14px;
            }
          }
        }
        
        .description-case{
          @include box-hori-center-middle;
          padding: 8px 10px 0 10px;
          height: auto;

          label{
            width: auto;
            padding: 0 20px;
            height: 20px;
            background: url("../../../../assets/img/yellow.png") top left repeat-y;
            border-radius: 20px;
            line-height: 20px;
            color: #644f1b;
          }
        }

        .order-remark-row{
          @include box-hori-left-top;
          height: 50px;
          background: rgba(255, 255, 255, 1);
          padding: 10px;
          margin-bottom: 30px;

          .order-remark{
            padding-left: 5px;
            color: #666;
            font-size: 12px;
          }
        }
        
        .order-info-row{
          @include box-hori-left-middle;
          height: 50px;
          background: rgba(255, 255, 255, 1);
          padding: 0 10px 0 10px;
          margin-bottom: 1px;

          .order-title{
            margin-top: 1px;
            font-size: 16px;
          }
          
          label{
            width: auto;
            color: #565656;
          }
          
          .iconfont{
            width: 24px;
            text-align: left;
            font-size: 21px;
            color: #999;
            margin-top: 3px;
          }
          
          input{
            @include box-hori-left-middle;
            height: 30px;
            marign: 0 16px 0 10px;
            padding: 0 8px;
            font-size: 16px;
            background: transparent;
          }
          
          .radio-case{
            @include box-hori-right-middle;
            height: 100%;
          }
        }

        .order-total-price{
          @include box-vert-center-middle;
          height: 100px;
          background: #f7f7f7;

          h2{
            width: auto;
            height: auto;
            font-size: 16px;
            color: #333;
            padding-bottom: 8px;
          }
          h1{
            width: auto;
            height: auto;
            font-size: 30px;
            color: #DF6158;
            padding-top: 6px;

            .icon-rmb{
              font-size: 16px;
            }
          }
        }
        
        .order-list-case{
          @include box-vert-left-top;
          height: auto;
          margin-top: 8px;
          position: relative;
          overflow: visible;

          .order-inner-case{
            @include box-vert-left-middle;
            height: auto;
            background: #fff;
            padding: 0 0 0 10px;
            color: #666;
            position: relative;
            margin-bottom: 10px;

            &:active{
              //background: rgba(255, 255, 255, .7);
            }

            .no-supplier-case{
              @include box-hori-left-middle;
              height: auto;
              padding: 10px 10px 8px;
              color: #74baf3;
              font-size: 16px;

              .icon-nodata3{
                color: #008de1;
                font-size: 24px;
                margin-right: 5px;
              }
            }

            .info-case{
              @include box-hori-left-middle;
              padding: 10px 0 0 0;
              color: #333;
              
              .cateyory-num{
                width: auto;
                padding: 0 10px 0 0;
                color: #999;
                margin-top: -3px;
              }

	            .icon-tag{
		            color: #caad5f;
		            font-size: 16px;
	            }
            }

            .supplier-case{
              @include box-vert-left-middle;

              .supplier-photo-case{
                @include box-hori-left-middle;
                border-top: solid 1px #eee;
                width: 100%;
                height: auto;
                margin: 8px 5px 0 0px;
                overflow: visible;
                position: relative;
                border-bottom: solid 1px #eee;

                &:last-child{
                  border-bottom: none;
                }

                .slider-inner-case{
                  @include box-hori-left-middle;
	                padding: 6px 0;
                  height: auto;
                  position: relative;
	                overflow: visible;
                  
                  .slider-flag{
                    z-index: 100;
                  }

	                .flag{
		                transform: translateY(-6px);
		                z-index: 10;
		                right: 0;

		                .icon-check{
			                position: absolute;
			                color: #fff;
			                width: 100%;
			                font-size: 12px;
			                padding-left: 15px;
		                }
	                }

                  .icon-goods{
                    @include box-hori-center-middle;
                    height: 100%;
                    width: 40%;
                    position: absolute;
                    top: 0;
	                  font-size: 16px;
	                  color: #fff;
                    right: -40%;

	                  &:active{
		                  background: #909090;
	                  }
  
                    &.icon-goods-true{
                      background: #666;
                    }
                    &.icon-goods-false{
                      background: #DF6158;
                    }
                  }
                }

                .photo-case{
                  width: 50px;
                  height: 50px;
                  border-radius: 36px;

                  .icon-vip{
                    width: 14px;
                    height: 14px;
                    background: #ffd100;
                    color: #333;
                    border-radius: 20px;
                    position: absolute;
                    top: 0;
                    right: 2px;
                    font-size: 10px;
                    line-height: 16px;
                    text-align: center;
                  }
                }

                .price-info-case{
                  @include box-vert-left-middle;
                  padding: 4px 0 4px 8px;

                  h3{
                    @include box-hori-left-top;
                    height: auto;
                    padding: 4px 0 2px 2px;
                    color: #333;
                  }

                  h4{
                    @include box-hori-left-top;
                    height: auto;
                    padding: 4px 0 0;
                    color: #999;

                    .icon-rmb{
                      font-size: 14px;
                    }
                  }
                }

                .price-total-case{
                  @include box-hori-left-middle;
                  height: 36px;
                  width: 160px;
                  border-left: solid 1px #dedede;
                  color: #ffa600;
                  font-size: 20px;
                  padding-left: 6px;

                  h4{
                    height: auto;
                  }

                  .icon-rmb{
                    font-size: 14px;
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

    .masker-case{
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .5);
      z-index: 5000;
    }
  
    .footer-cargo-case{
      @include box-hori-center-middle;
      height: 50px;
      position: fixed;
      bottom: 0;
      z-index: 500;
      background: #008de1;
      left: 0;
      transition: background .3s;
      color: #fff;
      font-size: 18px;
      
      .icon-cargo-cend{
        font-size: 24px;
        margin-top: 2px;
        margin-right: 5px;
      }
    }
  }
</style>
