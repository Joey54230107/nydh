<template>
  <normal-layout class="dd-page" :loaded="loaded">
    <goods-header title="我创建的订单" />

    <div class="dd-case">
      <div v-if="goods.length == 0 && nodata" class="p-empty-data-case">
        <span class="icon-case iconfont icon-nodata2"></span>
        <h2>没有查询到任何报价单</h2>
        <h3>您可以试试 <a @tap="createOrder">创建一张报价单</a> 吧 ^_^</h3>
        <div class="other-way-case auto-fill">
          <div class="inner-case">
            <h4><span class="iconfont icon-stars"></span> 或者您也可以从下面的应用中转化成报价单</h4>
            <ul class="auto-fill">
              <li class="way-icon-case iconfont icon-business" @tap="business"><label>生意圈</label></li>
              <li class="way-icon-case iconfont icon-xjd"><label>求购信息</label></li>
              <li class="way-icon-case iconfont icon-bjd"><label>报价信息</label></li>
            </ul>
          </div>
        </div>
      </div>

      <scroller class="goods-inner-case" v-if="goods.length > 0">
        <div class="goods-row-case" v-for="good in goods" @tap="detail(good)">
          <h2>
            {{good.title || '我的发货单'}}
            <time class="auto-fill">{{good.createtime | toDate('/')}}</time>
          </h2>
          <ul class="supplier-list-case">
            <li class="price-case"><span>¥</span>{{good.total | price}}</li>
            <li class="user-photo-case" v-for="user in good.users">
              <span class="iconfont icon-vip"></span>
              <image-loader :src="user.url" class="photo-case" :defaultCls="'photo-' + ((user.sex == '1') ? 'man' : 'woman') + '-case'" />
            </li>
          </ul>
          <h3>此发货单共包含{{good.itemcount}}种品类，指定了{{good.suppcount}}位供应商</h3>
        </div>
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
  import orderInnerList from '@/components/pages/my/order/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import imageLoader from '@/components/comm/ImageLoader'
  
  export default {
    components: {
      scroller,
      normalLayout,
      goodsHeader,
			horiScroller,
			orderInnerList,
      imageLoader
    },

    data(){
      return {
        loaded: true,
        pages: [
          {name: '待发布', chose: true, code: '0'},
          {name: '待报价', chose: false, code: '1'},
          {name: '已完成', chose: false, code: '2'}
        ],
        filterPage: mui.preload({
					id: 'orderFilter',
					url: config.CDN_ADDRESS + '/orderFilter',
					styles: {
						background: 'transparent'
					}
				}),
				nodata: false,
				st: 0,
        curpage: 1,
        goods: [],
				loadStyle: {
					top: 0,
					opacity: 1
				}
      }
    },
    
    mounted(){
      utils.masker()
      plus.webview.show('myGoods', 'pop-in', 200, () => {
      	this.search()
      })
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
				service('getMyGoods', {
				  userid: user.userid,
          st: this.st,
          curpage: this.curpage
        }, rs => {
					let goods = rs.items || []
          goods.forEach(good => {
            good.users = []
            let suppliers = good.suppliers ? good.suppliers.split(',') : []
            if(suppliers.length > 0){
              suppliers.forEach(supplier => {
                let _supplier = supplier.split(';')
                let user = new UserBo({
                  url: _supplier[0],
                  isrealname: _supplier[1],
                  sex: _supplier[3],
                  userid: _supplier[4]
                })
                good.users.push(user)
              })
            }
          })
          this.goods = goods
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
  
  .dd-page{
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
        font-size: 14px;
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

    .dd-case{
      @include box-vert-left-top;
      overflow: hidden;
      padding-top: 50px;
      height: 100%;

      .p-empty-data-case{
        @include box-vert-center-top;
        height: 100%;
        text-align: center;
        color: #343434;
        overflow: hidden;

        .icon-case{
          @include box-vert-center-middle;
          width: 120px;
          margin-top: 50px;
          height: 120px;
          border-radius: 160px;
          font-size: 100px;
          padding-left: 20px;
          //color: rgba(0, 0, 0, .4);
          color: #DF6158;
        }

        h2{
          height: auto;
          margin-top: 36px;
          width: 100%;
          font-size: 18px;
        }

        h3{
          height: auto;
          margin-top: 10px;
          width: 100%;
          color: #787878;
          font-size: 14px;

          a{
            color: #529CD8;
            font-size: 16px;
            text-decoration: underline;
          }
        }

        .other-way-case{
          @include box-vert-center-bottom;
          //padding: 8px 8px 10px;

          .inner-case{
            @include box-vert-center-top;
            height: 110px;
            //border-radius: 15px;
            //background: rgba(116, 186, 243, 1);
            background: rgba(13, 171, 255, .3);
            padding-top: 8px;

            h4{
              @include box-hori-center-top;
              height: 24px;
              font-size: 14px;
              color: #333;

              span{
                color: #e77c6e;
                width: auto;
                height: auto;
                font-size: 14px;
                margin-right: 5px;
              }
            }

            ul{
              @include box-hori-center-top;
              padding: 1px 40px 0;
              justify-content: space-between;

              .way-icon-case{
                width: 50px;
                height: 50px;
                line-height: 50px;
                border-radius: 64px;
                color: #fff;
                position: relative;
                overflow: visible;

                label{
                  position: absolute;
                  top: 56px;
                  height: 15px;
                  line-height: 16px;
                  left: 50%;
                  color: #333;
                  width: 50px;
                  margin-left: -25px;
                  font-size: 10px;
                  border-radius: 20px;
                  //background: rgba(255, 255, 255, .5);
                }

                &.icon-business{
                  background: #fff;
                  font-size: 36px;
                  color: #74baf3;
                }
                &.icon-xjd{
                  background: #fff;
                  font-size: 32px;
                  color: #e77c6e;
                }
                &.icon-bjd{
                  background: #fff;
                  font-size: 36px;
                  color: #ffb000;
                }
              }
            }
          }
        }
      }

      .goods-inner-case{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
        
        .goods-row-case{
          @include box-vert-left-top;
          height: auto;
          background: #fff;
          margin-bottom: 1px;
          padding: 8px 10px 12px 10px;
          
          &:active{
            background: #f7f7f7;
          }
          
          h2{
            @include box-hori-left-middle;
            width: 100%;
            height: 30px;
            font-size: 16px;
            color: #333;
            
            time{
              @include box-vert-right-middle;
              width: auto;
              font-size: 12px;
              color: #999;
              height: 30px;
            }
          }
          
          .supplier-list-case{
            @include box-hori-left-middle;
            width: 100%;
            height: auto;
            
            .price-case{
              @include box-hori-left-middle;
              width: auto;
              height: 36px;
              font-size: 18px;
              padding: 0 10px 0 5px;
              margin-right: 10px;
              margin-top: 6px;
              color: #DF6158;
              border-right: solid 1px #dedede;
              
              span{
                font-size: 14px;
                padding: 1px 2px 0 0;
              }
            }
            
            .user-photo-case{
              @include box-vert-left-top;
              width: 50px;
              height: 50px;
              border-radius: 50px;
              overflow: visible;
              margin-right: 8px;
              position: relative;
              margin-top: 5px;
              
              .icon-vip{
                width: 16px;
                height: 16px;
                border-radius: 16px;
                background: #ffd100;
                color: #333;
                line-height: 18px;
                font-size: 10px;
                text-align: center;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 10;
              }
              
              .photo-case{
                width: 50px;
                height: 50px;
                border-radius: 50px;
                overflow: hidden;
              }
            }
          }
          
          h3{
            margin-top: 10px;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
</style>
