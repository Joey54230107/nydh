<template>
  <normal-layout class="goods-page" :loaded="loaded">
    <normal-header title="我的发货单"/>
    <hori-scroller class="pageframe-case" :resource="pages" @handler="searchGoods" />
    <div class="orders-case auto-fill">
      <scroller class="goods-inner-case" :status="status">
        <div class="slider-container-case" :style="loadStyle">
          <slider-blocker :item="good" class="goods-row-case" v-for="(good, idx) in goods" sliderWidth="25" :key="good.uuid" :id="good.uuid">
            <div class="goods-row-inner-case" @tap="detail(good)">
              <slider-btn class="remove-good" confirmStr="确定删除" @handler="removeAddr(addr, idx)">删除</slider-btn>
              <h2>
                {{good.title || '我的发货单'}}
                <time class="auto-fill">{{good.createtime | toDate('-')}}</time>
              </h2>
              <h4>发货单号: {{good.items[0].invoiceno}}</h4>
              <h3>此发货单共包含{{good.itemcount}}种品类，指定了{{good.suppcount}}位供应商</h3>
              <ul class="supplier-list-case">
                <li class="price-case">
                  <h3>总金额（元）</h3>
                  {{good.total | price}}
                </li>
                <li class="supplier-info-case auto-fill">
                  <div class="user-photo-case" v-for="user in good.users">
                    <image-loader :src="user.url" class="photo-case" :defaultCls="'photo-' + ((user.sex == '1') ? 'man' : 'woman') + '-case'" />
                    <label>{{user.name || '供应商姓名'}}</label>
                    <span class="price">{{user.total | price}}</span>
                    <span class="unit">元</span>
                  </div>
                </li>
              </ul>
              <div class="remark-case" v-if="good.remark">
                <span class="remark-border">备注</span>
                {{good.remark}}
              </div>
            </div>
          </slider-blocker>
        </div>
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
  import sliderBtn from '@/components/comm/SliderButton'
  
  export default {
  	created(){
			mui.plusReady(() => {
				plus.webview.show('myGoods', 'pop-in', 300, () => {
					this.search()
				})
			})
    },

    components: {
      scroller,
      normalLayout,
      normalHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			sliderBlocker,
      sliderBtn
    },

    data(){
      return {
        loaded: false,
        pages: [
          {name: '一周内', chose: true, code: '0'},
          {name: '一月内', chose: false, code: '1'},
					{name: '半年内', chose: false, code: '2'},
					{name: '一年内', chose: false, code: '3'},
					{name: '一年外', chose: false, code: '4'}
        ],
				nodata: false,
				st: 0,
        curpage: 1,
        goods: [],
				loadStyle: {
					transform: 'translateY(0)',
					opacity: 1
				},
        status: ''
      }
    },
    
    methods: {
			searchGoods(item){
			  this.st = item.code
        this.curpage = 1
        Object.assign(this.loadStyle, {
					transform: 'translateY(30px)',
          opacity: 0
        })
        setTimeout(() => {
          this.search()
        }, 300)
      },

			search(){
			  this.status = '1'
			  let user = utils.getLocalUser()
				service('getMyGoods', {
				  userid: user.userid,
          st: this.st,
          curpage: this.curpage
        }, rs => {
					let goods = rs.items || []
          goods.forEach(good => {
            good.users = []
            let suppliers = good.items
            if(suppliers.length > 0){
              suppliers.forEach(supplier => {
                let user = new UserBo(supplier.supplier)
                user.total = supplier.total
                good.users.push(user)
              })
            }
          })
          this.goods = goods
          this.status = goods.length > 0 ? '2' : '0'
          this.$nextTick(() => {
						utils.masker()
						this.loaded = true

						Object.assign(this.loadStyle, {
							transform: 'translateY(0)',
							opacity: 1
						})
          })
				}, err => {
				  this.status = '0'
        })
			},
      
      detail(good){
        plus.webview.create(config.CDN_ADDRESS + '/myGoodSuppliers', 'myGoodSuppliers', {}, {good})
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .goods-page{
    @include box-vert-left-top;
    background: $normalBgColor;
    height: 100%;

    .pageframe-case{
      height: 50px;
      margin-top: 50px;
      background: #fff;
      font-size: 16px;
      overflow: hidden;
      margin-bottom: 1px;
    }

    .orders-case{
      @include box-vert-left-top;
      padding: 0 10px;
      margin-top: 10px;

      .goods-inner-case{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
        height: 100%;
        transition: transform .3s, opacity .3s;
        
        .goods-row-case{
          @include box-vert-left-top;
          height: auto;
          background: #ccc;
          margin-bottom: 8px;
          border-radius: 9px;

          .goods-row-inner-case{
            @include box-vert-left-top;
            height: auto;
            background: #fff;
            padding: 5px 12px 10px;
            position: relative;
  
            .remove-good{
              @include box-vert-center-middle;
              width: 25%;
              height: 100%;
              background: #fff;
              color: #f85959;
              font-weight: bold;
              position: absolute;
              right: -25%;
              top: 0;
              font-size: 16px;
    
              &:active{
                opacity: .8;
              }
            }

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
              margin-top: 5px;
              height: auto;

              .price-case{
                @include box-vert-left-middle;
                width: 110px;
                height: auto;
                font-size: 18px;
                font-weight: 300;
                padding: 0 10px 0 0;
                margin-right: 10px;
                color: #f85959;
                
                h3{
                  color: $red;
                  font-weight: bold;
                }

                span{
                  font-size: 14px;
                  padding: 1px 2px 0 0;
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
                    font-size: 14px;
                    font-weight: 300;
                    width: auto;
                  }
                  
                  .unit{
                    color: $red;
                    margin-left: 4px;
                    font-size: 12px;
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
              color: $blue;
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
