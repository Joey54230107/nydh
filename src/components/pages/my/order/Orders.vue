<template>
  <normal-layout class="accept-goods-page" :loaded="loaded">
    <normal-header title="我的订单列表" />
    <hori-scroller class="pageframe-case" :resource="pages" @handler="searchs" :selected="st" />

    <div class="orders-case" :style="{'opacity':loadStyle.opacity, 'transform':'translateY(' + loadStyle.top + 'px)'}">
      <scroller class="order-inner-case" :status="status">
        <slider-blocker v-for="(order, idx) in orders" :id="'sup_' + idx" :item="order" :sliderWidth="(st == 0 || st == 4) ? '25' : '0'" class="order-slider-case" :key="idx">
          <div class="order-row-case" @tap.stop="detail(order)">
            <div class="user-case">
              <span class="photo-case">
                <span class="iconfont icon-v" v-if="order.purchaser.isrealname == 1"></span>
                <image-loader :src="order.purchaser.url" class="photo-innner-case" :defaultCls="'photo-' + ((order.purchaser.sex == '025001') ? 'man' : 'woman') + '-case'" />
              </span>
              <div class="info-case auto-fill">
                <h4>求购方：<a>{{order.purchaser.name}}</a></h4>
                <h4>订单编号：{{order.tradeno}}</h4>
                <h4>创建日期：{{order.createtime | toTime('-')}}</h4>
              </div>
            </div>
            
            <div class="price-info-case">
              <div class="total-case auto-fill">
                <label>总金额（元）</label>
                <span class="price">{{order.paytotal | price}}</span>
              </div>
              <div class="pri-case auto-fill">
                <label>首付款（元）</label>
                <span class="no-first-pay" v-if="order.firstpay == ''">未设置</span>
                <span class="price" v-if="order.firstpay != ''">{{order.firstpay | price}}</span>
              </div>
            </div>
          </div>
        </slider-blocker>
        
      </scroller>
    </div>
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
  import imageLoader from '@/components/comm/ImageLoader'
	import sliderBlocker from '@/components/comm/SliderBlocker'
	import ring from '@/components/comm/Ring'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('myOrders', 'pop-in', 300, () => {
					this.search()
				})
			})
			window.addEventListener('changeState', (e) => {
        this.searchs({code: e.detail.code})
			})
    },
    
    components: {
			ring,
      scroller,
      normalLayout,
			normalHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			sliderBlocker
    },

    data(){
      return {
        loaded: true,
				nodata: false,
				st: '0',
        curpage: 1,
				orders: [],
				loadStyle: {
					top: 0,
					opacity: 1
				},
        pages: [
          {name: '待发布', code: 0},
					{name: '待发货', code: 1},
					{name: '在途', code: 2},
					{name: '验收中', code: 3},
					{name: '已验收', code: 4}
        ],
        status: ''
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.search()
			})
    },
    
    methods: {
      searchs(item){
			  this.st = item.code
        this.$forceUpdate()
        Object.assign(this.loadStyle, {
          top: 30,
          opacity: 0
        })
        setTimeout(() => {
          this.search()
        }, 310)
      },

			search(){
        this.status = '1'
			  service('getOrders', {
          userid: utils.getLocalUser().userid,
          st: this.st,
          curpage: this.curpage
        }, rs => {
          this.orders = rs.items || []
          this.$nextTick(() => {
            Object.assign(this.loadStyle, {
              top: 0,
              opacity: 1
            })
          })
          this.status = this.orders.length > 0 ? '2' : '0'
				}, err => {
			    this.status = '0'
        })
			},
      
      detail(order){
        plus.webview.create(config.CDN_ADDRESS + '/myOrderDetail', 'myOrderDetail', {}, {order})
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .accept-goods-page{
    @include box-vert-left-top;
    background: #f7f7f7;
    position: relative;
    
    .pageframe-case{
      @include box-hori-left-middle;
      //position: absolute;
      //z-index: 500;
      overflow: hidden;
      margin-top: 50px;
      background: #fff;
      //box-shadow: 0 3px 10px rgba(0, 0, 0, .1);
      
      .page-item{
        @include box-vert-center-middle;
        width: 50%;
        height: 32px;
        text-align: center;
        
        .state{
          width: auto;
          padding: 0 8px;
          height: 32px;
          line-height: 30px;
          border-bottom: solid 4px transparent;
          color: #787878;
          transition: border .4s;
          
          &.state-true{
            color: #e77c6e;
            border-bottom: solid 4px rgba(255, 80, 0, .6);
          }
        }
      }
    }

    .orders-case{
      @include box-vert-left-top;
      overflow: hidden;
      padding: 10px;
      height: 100%;
      background: #f0f0f0;
      transition: opacity .3s, transform .3s;

      .order-inner-case{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
        
        .order-slider-case{
          @include box-vert-left-top;
          height: auto;
          background: #ccc;
          margin-bottom: 8px;
          border-radius: 9px;

          .order-row-case{
            @include box-vert-left-top;
            height: auto;
            width: 100%;
            background: #fff;
            padding: 10px;
            
            .user-case{
              @include box-hori-left-top;
              height: auto;
              border-bottom: solid 1px #f5f5f5;
              padding-bottom: 8px;
              
              .photo-case{
                width: 50px;
                height: 50px;
                position: relative;
                
                .photo-innner-case{
                  width: 50px;
                  height: 50px;
                  border-radius: 11px;
                  overflow: hidden;
                }
  
                .icon-v{
                  line-height: 18px;
                  text-align: center;
                  width: 18px;
                  overflow: hidden;
                  padding-left: 2px;
                  font-size: 10px;
                  height: 18px;
                  border-radius: 16px;
                  position: absolute;
                  background: #ffd100;
                  color: #fff;
                  z-index: 5;
                  right: -7px;
                  top: -5px;
                  border: solid 1px #fff;
                }
              }
              
              .info-case{
                @include box-vert-left-top;
                padding-left: 10px;
                
                h4{
                  font-size: 12px;
                  color: #666;
                  height: auto;
                  padding: 2px 0 3px;
                  
                  a{
                    color: #666;
                    font-weight: bold;
                  }
                }
              }
            }
            
            .price-info-case{
              @include box-hori-center-top;
              height: auto;
              padding: 6px 0 0 0;
              //border-bottom: solid 1px #f5f5f5;
              
              .total-case{
                @include box-vert-left-top;
                height: auto;
                font-size: 18px;
                color: #f85959;
              }
  
              .pri-case{
                @include box-vert-center-top;
                height: auto;
                border-left: solid 1px #f0f0f0;
                padding: 0 10px;
                font-size: 18px;
                color: #f85959;

                .no-first-pay{
                  font-size: 14px;
                }
              }
  
              .other-case{
                @include box-vert-center-top;
                height: auto;
                border-left: solid 1px #f0f0f0;
                padding: 0 10px;
                font-size: 18px;
                color: #f85959;
              }
  
              label{
                font-size: 12px;
                color: #666;
              }
  
              .price{
                font-weight: 300;
              }
            }
  
            address{
              font-style: normal;
              font-size: 12px;
              color: #666;
              padding-top: 5px;
            }
            
            &:active{
              background: #fcfcfc;
            }
          }
        }
      }
    }
  }
</style>
