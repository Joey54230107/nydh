<template>
  <normal-layout class="accept-goods-page" :loaded="loaded">
    <goods-header title="我接收到的发货单" />

    <hori-scroller class="pageframe-case" :resource="pages" @handler="searchGoods" />

    <div class="orders-case">
      <scroller class="goods-inner-case" v-if="goods.length > 0">
        <slider-blocker v-for="(good, idx) in goods" :id="'sup_' + idx" :item="good" sliderWidth="40" class="goods-slider-case" :key="idx">
          <ul class="good-row-case" @tap.stop="detail(good)">
            <li class="up-case">
              <div class="user-photo-case">
                <image-loader :src="good.owner.url" class="photo-case" :defaultCls="'photo-' + ((good.owner.sex == '025001') ? 'man' : 'woman') + '-case'"></image-loader>
              </div>
              <h2>需求方：{{good.owner.name}}</h2>
              <time class="auto-fill">{{good.createtime | toTime('-')}}</time>
            </li>
            <li class="row-case">
              <div class="half-case" style="width: 120px;">
                <h4>总金额(元)</h4>
                <span class="price">{{good.total | price}}</span>
              </div>
              <div class="half-case auto-fill">
                <h3>单号：{{good.invoiceno}}</h3>
                <h3>标题：{{good.title}}</h3>
                <h3>包含品类总数：<span>{{good.itemcount}}</span></h3>
              </div>
            </li>
            <li class="remark-case" v-if="good.remark">
              <span class="remark"><i></i>备注：{{good.remark}}</span>
            </li>
          </ul>
        </slider-blocker>
        
      </scroller>
    </div>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import goodsHeader from '@/components/comm/header/GoodsHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import imageLoader from '@/components/comm/ImageLoader'
	import sliderBlocker from '@/components/comm/SliderBlocker'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('myOrder', 'pop-in', 200, () => {
					this.search()
				})
			})
    },
    
    components: {
      scroller,
      normalLayout,
      goodsHeader,
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
        goods: [],
				loadStyle: {
					top: 0,
					opacity: 1
				},
        pages: [
					{name: '待发布', code: 1, chose: true},
					{name: '已经发布', code: 3, chose: false}
        ]
      }
    },
    
    methods: {
			searchGoods(item){
			  this.st = item.code
        this.search()
        Object.assign(this.loadStyle, {
          top: 30,
          opacity: 0
        })
        setTimeout(() => {
          this.search()
        }, 300)
      },

			search(){
			  let user = utils.getLocalUser()
				service('getAcceptInvoices', {
				  userid: user.userid,
          st: this.st,
          curpage: this.curpage
        }, rs => {
					let goods = rs.items || []
          this.goods = goods
				})
			},
      
      detail(good){
        plus.webview.create(config.CDN_ADDRESS + '/myOrders', 'myOrders', {}, {good})
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .accept-goods-page{
    @include box-vert-left-top;
    background: #e1e1e1;
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
      padding-top: 94px;
      height: 100%;
      background: #f7f7f7;

      .goods-inner-case{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
        
        .goods-slider-case{
          @include box-vert-left-top;
          height: auto;
          background: #ccc;
          //margin-bottom: 1px;
          border-top: solid 1px #f1f1f1;
          border-bottom: solid 1px #f1f1f1;

          .good-row-case{
            @include box-vert-left-top;
            height: auto;
            width: 100%;
            background: #fff;
            padding: 10px 0;

            .up-case{
              @include box-hori-left-top;
              height: auto;
              width: 100%;
              border-bottom: solid 1px #f7f7f7;
              padding: 0 10px 6px 10px;

              .user-photo-case{
                @include box-hori-left-middle;
                width: 32px;
                height: 32px;
                position: relative;

                .photo-case{
                  width: 32px;
                  height: 32px;
                  overflow: hidden;
                  border-radius: 24px;
                }
              }
  
              h2{
                width: auto;
                height: 32px;
                line-height: 32px;
                color: #333;
                padding-left: 10px;
              }
              
              time{
                text-align: right;
                height: 32px;
                line-height: 32px;
                color: #999;
              }
            }
            
            .row-case{
              @include box-hori-left-top;
              height: auto;
              padding: 10px 10px 0;
              
              .half-case{
                @include box-vert-left-middle;
                border-left: solid 1px #f1f1f1;
                height: auto;
                padding-left: 10px;
                
                &:first-child{
                  border: none;
                }
  
                h3{
                  font-size: 12px;
                  color: #999;
                  margin-bottom: 6px;
                  height: auto;
    
                  &:last-child{
                    margin-bottom: 0;
                  }
    
                  span{
                    color: #333;
                  }
                }
                
                h4{
                  height: auto;
                  color: #333;
                  padding: 3px 0 7px;
                  font-size: 12px;
                }
  
                .price{
                  font-size: 20px;
                  color: #DF6158;
                }
              }
            }

            .remark-case{
              height: auto;
              margin-top: 10px;
              
              .remark{
                display: inline-block;
                width: auto;
                height: auto;
                padding: 3px 8px;
                background: #dedede;
                border-radius: 32px;
                position: relative;
                font-size: 12px;
                color: #333;
                
                i{
                  width: 0;
                  height: 0;
                  border: solid 10px transparent;
                  border-bottom-color: #dedede;
                  position: absolute;
                  top: -16px;
                  left: 12px;
                }
              }
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
