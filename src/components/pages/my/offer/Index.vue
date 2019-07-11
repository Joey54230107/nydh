<template>
  <normal-layout class="order-page" :loaded="loaded">
    <normal-header title="我的报价单" menuText="新建" @menuHandler="newOrder" />
    <hori-scroller class="pageframe-case" :resource="pages" @handler="searchOrders" @openFilter="openFilter" :selected="searchParam.st" />

    <div class="orders-case auto-fill">
      <scroller class="order-inner-case auto-fill" :status="status" @loadRefresh="loadRefresh" @loadMore="loadMore" @setScroller="setScroller">
        <slider-block :id="'slider-' + idx" v-for="(order, idx) in orders" :item="order" :key="order.uuid" class="item-case" :sliderWidth="searchParam.st == 2 ? '50' : '20'">
          <div class="item-container" @tap="detail(order)">
            <div class="empty-detail icon-more" v-if="searchParam.st == 2">创建发货单</div>
            <span class="empty-delete iconfont icon-delete" @tap.stop="removeDetail(order, idx)"></span>
            <h2>
              {{order.title || '未设置报价单标题'}}
            </h2>
            <ul class="content-case auto-fill">
              <li class="left-case">
                <span>报价单号：{{order.orderno}}</span>
                <span>创建日期：{{order.createtime}}</span>
              </li>
        
              <!--待发布状态-->
              <li class="right-case auto-fill" v-if="searchParam.st == '0'">
                <div class="user-photos-case">
                  <div class="user-photo" v-for="(photo, idx) in order.suppliers.split(',')" v-if="(order.suppcount != 0) && idx < 3" @tap.stop="userInfo(photo.split(';')[2])">
                    <span class="iconfont icon-v" v-if="photo.split(';')[4] == '1'"></span>
                    <image-loader :src="photo.split(';')[0]" class="photo-empty-case" :defaultCls="'photo-' + ((photo.split(';')[3] == '1') ? 'man' : 'woman') + '-case'" />
                  </div>
                  <a class="more iconfont icon-more" v-if="order.suppcount > 3"></a>
                  <label class="cupplier-tip" v-if="order.suppcount > 0">共指定了{{order.suppcount}}位供应商</label>
                  <label class="no-cupplier-tip" v-if="order.suppcount == 0">尚未指定任何供应商</label>
                </div>
              </li>
        
              <!--待报价状态-->
              <li class="right-case auto-fill" v-if="searchParam.st == '1'">
                <div class="user-photos-case user-photo-confirmed-case">
                  <!--这里要改下后台接口，给出已报价的供应商的头像（之前给的是所有供应商前3个，无法判断是否已报价）-->
                  <label class="cupplier-tip" v-if="order.suppcount > 0">{{order.takingcount > 0 ? '已有' + order.takingcount + '人报价' : '尚无供应商报价'}}</label>
                </div>
              </li>
        
              <!--已确认状态-->
              <li class="confirm-case auto-fill" v-if="searchParam.st == '2'">
                <h3>共有{{order.takingcount}}位供应商报价, 您选择了{{order.confirmcount}}人</h3>
                <h2>总金额: <span class="iconfont icon-rmb"></span><label class="price">{{order.confirmtotal | price}}</label></h2>
              </li>
            </ul>
            <div class="editor-case"  v-if="searchParam.st == '0'">
              <span class="iconfont icon-edit3"></span>
            </div>
            <div class="editor-case"  v-if="searchParam.st != '0'">
              <span class="iconfont icon-right-arr"></span>
            </div>
          </div>
        </slider-block>
        
        <div slot="no-data" class="exception-case">
          <h4>暂时没有查到任何数据、快开始创建您的报价单吧</h4>
          <div class="create-btn" @tap="newOrder">创建报价单</div>
        </div>
      </scroller>
    </div>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import normalHeader from '@/components/comm/NormalHeader'
  import scroller from '@/components/comm/Scroller2'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import OrderBo from '@/model/bo/Order'
  import sliderBlock from '@/components/comm/SliderBlocker'
  import imageLoader from '@/components/comm/ImageLoader'
  
  export default {
    created(){
      window.addEventListener('changePage', (e) => {
        let code = e.detail.code
        plus.webview.getWebviewById('orderDetail').close('pop-out', 300)
        setTimeout(() => {
          this.changePage(code)
        }, 500)
      })

			mui.plusReady(() => {
				plus.webview.show('myOffer', 'pop-in', 300)
			})
    },
    
    components: {
      scroller,
      normalLayout,
			horiScroller,
			orderInnerList,
      normalHeader,
      sliderBlock,
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
				scroller: null,
				searchParam: {
					userid: '',
        	st: 0,
					curpage: 1
        },
        orders: [],
        status: '1'
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.searchParam.userid = utils.getLocalUser().userid
				this.search()
			})
    },
    
    methods: {
      newOrder(){
        plus.webview.create(config.CDN_ADDRESS + '/orderDetail', 'orderDetail', {}, {
          state: 0,
          flag: 0
        })
      },
  
      userInfo(userid){
        utils.openUserCard(userid)
      },
  
      removeDetail(order, idx){
        let user = utils.getLocalUser()
        utils.confirm('您确定要删除该报价单么？', () => {
          service('remove', {
            userid: user.userid,
            items: [{
              dt: '0',
              uuids: order.uuid
            }]
          }, rs => {
            utils.toast('删除成功!')
            this.orders.splice(idx, 1)
            this.status = this.orders.length > 0 ? '2' : '0'
          })
        })
      },
  
      detail(order){
        plus.webview.create(config.CDN_ADDRESS + '/orderDetail', 'orderDetail', {}, {
          state: this.searchParam.st,
          flag: 1,
          order
        })
      },
  
      setScroller(scroller){
        this.scroller = scroller
      },
      
      business(){
        mui.fire(plus.webview.getWebviewById(plus.runtime.appid), 'navClick', {
          id: 'business'
        })
        plus.webview.currentWebview().close('pop-out', 200)
      },

			createOrder(){
        this.newOrder()
      },
  
      changePage(code){
			  this.pages.forEach(page => {
			    page.chose = (page.code == code)
        })
        this.searchOrders({
          code
        })
      },

			openFilter(){
      	this.filterPage && this.filterPage.show('slide-in-bottom', 200)
      },

			searchOrders(item){
			  this.searchParam.curpage = 1
        this.scroller && this.scroller.scrollTo(0, 0, 0)
				Object.assign(this.searchParam, {
					st: item.code
        })
        this.status = Math.random() + ''
        this.search(item.code)
      },
  
      loadMore(callback){
			  utils.scrollerLoader(() => {
          ++ this.searchParam.curpage
          this.search(this.searchParam.st, callback)
        })
      },
  
      loadRefresh(callback){
        utils.scrollerLoader(() => {
          this.searchParam.curpage = 1
          this.search(this.searchParam.st, callback)
        })
      },

			search(st, callback){
        let orders = []
        service('searchOrderList', this.searchParam, rs => {
          rs && rs.items && rs.items.forEach(item => {
            let order = new OrderBo(item)
            if(st == 1 || st == 2){
              Object.assign(order, {
                confirmcount: item.confirmcount,
                takingcount: item.takingcount,
                confirmtotal: item.confirmtotal
              })
            }
            orders.push(order)
          })
          if(callback){
            callback(true, orders, this.orders)
          }else{
            this.orders = orders
          }
          this.status = (this.orders.length > 0) ? '2' : '0'
        }, err => {
          this.status = 0
          callback && callback()
        })
			}
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .order-page{
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

    .orders-case{
      @include box-vert-left-top;
      overflow: hidden;
      height: 100%;
      //padding-top: 95px;
      padding: 90px 10px 10px 10px;

      .p-empty-data-case{
        @include box-vert-center-middle;
        margin-top: -80px;
        height: 100%;
        text-align: center;
        color: #343434;
        overflow: hidden;

        .icon-case{
          @include box-vert-center-middle;
          width: 120px;
          height: 120px;
          border-radius: 160px;
          font-size: 100px;
          padding-left: 20px;
          //color: rgba(0, 0, 0, .4);
          color: #bbb;
        }

        h2{
          height: auto;
          margin-top: 36px;
          width: 100%;
          font-size: 18px;
        }

        h3{
          height: auto;
          margin-top: 15px;
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
              color: #e77c6e;

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

      .order-inner-case{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
        margin-top: 8px;
        
        .exception-case{
          @include box-vert-center-top;
          height: auto;
          width: 100%;
          z-index: 100;
  
          .create-btn{
            @include box-hori-center-middle;
            height: 42px;
            background: $blue;
            border-radius: 5px;
            color: #fff;
            padding: 0 20px;
            width: auto;
            font-weight: bold;
            
            &:active{
              opacity: .8;
            }
          }
          
          h4{
            margin-bottom: 20px;
          }
        }
  
        .item-case{
          @include box-vert-left-top;
          width: 100%;
          height: auto;
          position: relative;
          overflow: hidden;
          background: #fff;
          transition: height .3s, transform .3s;
          margin-top: 10px;
          border-radius: 9px;
    
          &:last-child{
            border: none;
          }
  
          .item-container{
            @include box-vert-left-top;
            width: 100%;
            height: auto;
            overflow: visible;
            background: #fff;
            position: relative;
    
            .editor-case{
              @include box-vert-left-middle;
              height: 100%;
              width: 32px;
              position: absolute;
              right: 5px;
              top: 0;
              color: $textLessColor;
      
              .iconfont{
                font-size: 21px;
              }
      
              .icon-right-arr{
                font-size: 28px;
                color: #ccc;
              }
            }
    
            .empty-delete{
              @include box-vert-center-middle;
              height: 100%;
              width: 20%;
              position: absolute;
              top: 0;
              right: -20%;
              color: $red;
              font-weight: bold;
              font-size: 21px;
            }
    
            .empty-detail{
              @include box-vert-center-middle;
              font-size: 16px;
              height: 100%;
              width: 30%;
              position: absolute;
              top: 0;
              right: -30%;
              padding-bottom: 20px;
      
              &:active{
                background: rgba(0, 0, 0, .1);
              }
      
              &.icon-more{
                background: #dedede;
                color: #666;
              }
            }
    
            &:active{
              background: #f8f8f8;
            }
          }
  
          h2{
            height: 26px;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 26px;
            font-size: 16px;
            font-weight: bold;
            color: $textColor;
            padding: 4px 24px 5px 10px;
            position: relative;
    
            .state-case{
              left: 10px;
              top: 5px;
              width: 42px;
              color: #fff;
              text-align: center;
              background: #74baf3;
              line-height: 16px;
              height: 18px;
              border-radius: 3px;
              border: solid 1px #74baf3;
              font-size: 12px;
              display: block;
              position: absolute;
            }
          }
  
          .content-case{
            @include box-vert-left-top;
    
            .left-case{
              @include box-vert-left-top;
              height: auto;
              padding: 5px 10px 0;
      
              span{
                height: auto;
                width: 100%;
                color: #999;
                padding: 0 10px 0 0;
                line-height: 16px;
                font-size: 12px;
              }
            }
            .right-case{
              @include box-hori-left-middle;
              height: auto;
            }
    
            .confirm-case{
              @include box-vert-left-top;
              height: auto;
              padding: 0 10px;
              margin-top: -10px;
              color: #008de1;
      
              h3{
                height: auto;
                font-size: 14px;
                margin: 5px 0;
              }
      
              h2{
                margin: 0;
                height: auto;
                font-size: 14px;
                padding: 0;
                color: #DF6158;
        
                .icon-rmb{
                  font-size: 14px;
                  padding-right: 2px;
                }
                .price{
                  font-size: 21px;
                }
              }
            }
    
            .user-photos-case{
              @include box-hori-left-middle;
              padding: 0 10px 8px 10px;
              height: auto;
              width: auto;
              position: relative;
      
              .remark{
                width: 36px;
                text-align: center;
                height: 36px;
                border: solid 1px #dedede;
                border-radius: 36px;
                background: rgba(0, 0, 0, .04);
                line-height: 34px;
                color: #999;
                white-space: nowrap;
                margin-right: 5px;
              }
      
              .user-photo{
                width: 32px;
                height: 32px;
                border: solid 0 rgba(0, 0, 0, .15);
                border-radius: 32px;
                margin-right: 5px;
                position: relative;
                margin-top: 10px;
        
                .photo-empty-case{
                  width: 32px;
                  height: 32px;
                  border-radius: 36px;
                  background: url("../../../../assets/img/man.png") center center/cover no-repeat;
                  overflow: hidden;
                }
        
                img{
                  width: 50px;
                  height: 50px;
                  border-radius: 50px;
                }
        
                .icon-v{
                  width: 12px;
                  height: 12px;
                  background: #ffb000;
                  border-radius: 16px;
                  position: absolute;
                  top: -3px;
                  right: -2px;
                  font-size: 8px;
                  color: #fff;
                  line-height: 12px;
                  text-align: center;
                  padding-left: 1px;
                  z-index: 10;
                }
                .icon-check{
                  width: 12px;
                  height: 12px;
                  background: #ffb000;
                  border-radius: 16px;
                  position: absolute;
                  top: 0;
                  left: 0;
                  font-size: 10px;
                  color: #fff;
                  line-height: 18px;
                  text-align: center;
                }
              }
      
              .cupplier-tip{
                color: $blue;
                padding-left: 4px;
                margin-top: 10px;
                font-weight: bold;
              }
      
              .no-cupplier-tip{
                text-align: left;
                font-size: 12px;
                width: auto;
                height: auto;
                position: relative;
                color: #f85959;
              }
              
              .icon-more{
                margin: 7px 5px 0 5px;
              }
      
              &.user-photo-confirmed-case{
                @include box-vert-left-middle;
                padding-bottom: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>
