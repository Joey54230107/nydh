<template>
  <normal-layout class="accept-goods-page" :loaded="loaded">
    <normal-header title="我接收到的发货单" />
    <hori-scroller class="pageframe-case" :resource="pages" @handler="searchGoods" />

    <div class="orders-case auto-fill">
      <scroller class="goods-inner-case auto-fill" :status="status" :indicators="false">
        <slider-blocker v-for="(good, idx) in goods" :id="'sup_' + idx" :item="good" sliderWidth="40" class="goods-slider-case" :key="idx">
          <div class="good-row-case" @tap.stop="detail(good)">
            <h2>
              {{good.title || '我的发货单'}}
              <time class="auto-fill">{{good.createtime | toDate('-')}}</time>
            </h2>
            <h4>发货单号: {{good.invoiceno}}</h4>
            <h3>此发货单共包含{{good.itemcount}}种品类</h3>
            <ul class="supplier-list-case">
              <li class="price-case">{{good.total | price}}</li>
              <li class="supplier-info-case auto-fill">
                <div class="user-photo-case" v-for="user in good.users">
                  <image-loader :src="user.url" class="photo-case" :defaultCls="'photo-' + ((user.sex == '1') ? 'man' : 'woman') + '-case'" />
                  <label>{{user.name || '供应商姓名'}}</label>
                  <span class="price auto-fill">{{user.total | price}}</span>
                </div>
              </li>
            </ul>
            <div class="remark-case" v-if="good.remark">
              <span class="remark-border">备注</span>
              {{good.remark}}
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
  
  export default {
  	created(){
			mui.plusReady(() => {
				plus.webview.show('myAcceptGoods', 'pop-in', 300)
			})
    },

    components: {
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
        goods: [],
				loadStyle: {
					top: 0,
					opacity: 1
				},
				pages: [
					{name: '一周内', chose: true, code: '0'},
					{name: '一月内', chose: false, code: '1'},
					{name: '半年内', chose: false, code: '2'},
					{name: '一年内', chose: false, code: '3'},
					{name: '一年外', chose: false, code: '4'}
				],
        owner: {},
        status: '1'
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.search()
			})
    },
    
    methods: {
			searchGoods(item){
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
			  this.status = '1'
			  let user = utils.getLocalUser()
				service('getAcceptInvoices', {
				  userid: user.userid,
          st: this.st,
          curpage: this.curpage
        }, rs => {
					let goods = rs.items || []
          this.goods = goods
          this.status = this.goods.length > 0 ? '2' : '0'
				}, err => {
				  this.status = '0'
        })
			},
      
      detail(good){
				good.owner.createtime = good.createtime
        plus.webview.create(config.CDN_ADDRESS + '/myAcceptGoodCategorys', 'myAcceptGoodCategorys', {}, {good})
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
      margin-top: 1px;
      padding: 10px;

      .goods-inner-case{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
        
        .goods-slider-case{
          @include box-vert-left-top;
          height: auto;
          background: #ccc;
          margin-bottom: 8px;
          border-radius: 9px;
          overflow: hidden;

          .good-row-case{
            @include box-vert-left-top;
            height: auto;
            width: 100%;
            background: #fff;
            padding: 5px 15px 10px;

            h2{
              @include box-hori-left-middle;
              width: 100%;
              height: 30px;
              font-size: 16px;
              color: #666;
              font-weight: bold;

              time{
                @include box-vert-right-middle;
                width: auto;
                font-weight: normal;
                font-size: 14px;
                color: #999;
                height: 30px;
                padding-bottom: 2px;
              }
            }

            h4{
              color: #999;
              margin: 2px 0 5px;
            }

            .supplier-list-case{
              @include box-hori-left-middle;
              width: 100%;
              margin-top: 1px;
              height: auto;

              .price-case{
                @include box-hori-left-middle;
                width: auto;
                height: auto;
                font-size: 18px;
                font-weight: 300;
                padding: 0 3px 0 26px;
                margin-right: 10px;
                color: #f85959;
                position: relative;

                &::before{
                  content: '总价';
                  font-size: 12px;
                  position: absolute;
                  left: 0;
                  top: 1px;
                }
                &::after{
                  content: '元';
                  font-size: 12px;
                  position: absolute;
                  top: 1px;
                  left: 100%;
                }
              }

              .supplier-info-case{
                @include box-vert-left-middle;
                height: auto;
                border-left: solid 1px #f0f0f0;
                padding-left: 10px;

                .user-photo-case{
                  @include box-hori-left-middle;
                  width: 100%;
                  height: 26px;
                  overflow: visible;
                  margin-right: 8px;
                  position: relative;

                  .photo-case{
                    width: 24px;
                    height: 24px;
                    border-radius: 50px;
                    overflow: hidden;
                  }

                  label{
                    color: #666;
                    padding-left: 6px;
                  }

                  .price{
                    padding-left: 10px;
                    color: #f85959;
                    font-size: 16px;
                    font-weight: 300;
                  }
                }
              }
            }

            h3{
              margin: 3px 0 5px;
              font-size: 12px;
              color: #999;
            }

            .remark-case{
              height: auto;
              color: #74baf3;
              padding-top: 5px;
              text-indent: 30px;
              position: relative;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              margin-bottom: -3px;
              font-size: 12px;

              .remark-border{
                text-align: center;
                text-indent: 0;
                position: absolute;
                width: 24px;
                font-size: 9px;
                margin: 0;
                display: block;
                height: 13px;
                color: #008de1;
                top: 10px;
                line-height: 12px;
                border-radius: 3px;
                border: solid .5px #008de1;
              }
            }

            &:active{
              background: #f3f3f3;
            }
          }
        }
      }
    }
  }
</style>
