<template>
  <normal-layout class="accept-goods-page" :loaded="loaded">
    <normal-header title="我收到的订单" />
    <hori-scroller class="pageframe-case" :resource="pages" @handler="searchs" />
    <div class="orders-case">
      <scroller class="order-inner-case" v-if="orders.length > 0" :style="{'opacity':loadStyle.opacity, 'transform':'translateY(' + loadStyle.top + 'px)'}">
        <slider-blocker v-for="(order, idx) in orders" :id="'sup_' + idx" :item="order" sliderWidth="40" class="order-slider-case" :key="idx">
          <div class="order-row-case" @tap.stop="detail(order)">
            <div class="user-case">
              <span class="photo-case">
                <span class="iconfont icon-v" v-if="order.supplier.isrealname == 1"></span>
                <image-loader :src="order.supplier.url" class="photo-case" :defaultCls="'photo-' + ((order.supplier.sex == '025001') ? 'man' : 'woman') + '-case'" />
              </span>
              <div class="info-case auto-fill">
                <h4 class="user-name">求购方：{{order.supplier.name}}</h4>
                <h5>订单编号：{{order.tradeno}}</h5>
                <time>{{order.createtime | toDate('-')}}</time>
                <h5>付款方式：预支付部分</h5>
              </div>
            </div>
            
            <div class="price-info-case">
              <div class="total-case auto-fill">
                <label>总金额（元）</label>
                <span class="price">{{order.paytotal | price}}</span>
              </div>
              <div class="pri-case auto-fill">
                <label>首付款（元）</label>
                <span class="price">{{(order.earnest || '0.00') | price}}</span>
              </div>
            </div>
            
            <!--<address>送货地址：{{order.address || '未设置'}}</address>-->
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
				plus.webview.show('myAcceptOrders', 'pop-in', 300, () => {
					this.search()
				})
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
        st: 0,
        curpage: 1,
        orders: [],
        loadStyle: {
          top: 0,
          opacity: 1
        },
        pages: [
          {name: '待发货', code: 0, chose: true},
          {name: '待验收', code: 1, chose: false},
          {name: '待结款', code: 2, chose: false},
          {name: '已完成', code: 3, chose: false}
        ]
      }
    },
    
    methods: {
      searchs(item){
        this.st = item.code
        Object.assign(this.loadStyle, {
          top: 30,
          opacity: 0
        })
        setTimeout(() => {
          this.search()
        }, 300)
      },
      
      search(){
        service('getMyAcceptOrders', {
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
        })
      },
      
      detail(order){
        plus.webview.create(config.CDN_ADDRESS + '/myAcceptOrderDetail', 'myAcceptOrderDetail', {}, {order})
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .accept-goods-page{
    @include box-vert-left-top;
    background: $normalBgColor;
    position: relative;
    
    .pageframe-case{
      @include box-hori-left-middle;
      position: absolute;
      z-index: 500;
      overflow: hidden;
      margin-top: 50px;
      background: #fff;
      //box-shadow: 0 3px 10px rgba(0, 0, 0, .1);
      
      .page-item{
        @include box-vert-center-middle;
        width: 50%;
        height: 32px;
        text-align: center;
      }
    }
    
    .orders-case{
      @include box-vert-left-top;
      overflow: hidden;
      padding: 104px 10px 0;
      height: 100%;
      
      .order-inner-case{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
        transition: opacity .3s, transform .3s;
        
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
                border-radius: 9px;
                position: relative;
                
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
                padding-left: 16px;
                position: relative;
                
                h4{
                  font-size: 16px;
                  color: #666;
                  height: auto;
                  padding: 0 0 4px;
                }

                h5{
                  font-size: 12px;
                  height: auto;
                  margin-top: 3px;
                }

                time{
                  position: absolute;
                  width: auto;
                  right: 2px;
                  top: -5px;
                  color: #999;
                  font-size: 12px;
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
