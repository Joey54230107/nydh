<template>
	<normal-layout class="business-page" :loaded="loaded">
    <normal-header title="生意圈" />
    <div class="position-case">
      <span class="iconfont icon-position3"></span>
      <label class="auto-fill">当前所在：<strong>{{city}}</strong></label>
      <div class="change-case">
        <span class="iconfont icon-down-arr"></span>
        切换
      </div>
    </div>
    
    <span class="go-top iconfont icon-up-arr" v-if="showTop" @tap.stop="goTop"></span>
    <span class="refresh iconfont icon-refresh2" @tap.stop="refresh"><label>刷新</label></span>

    <scroller class="content-inner auto-fill" :status="status" @scrollHandler="scrollHandler" @setScroller="setScroller">
      <div class="adv-case">
        <div class="adv-inner-case">
          <ul class="adv-inner-case2" :style="{'width': ((width - 20)/3*orders.length + 10 * (orders.length - 1)) + 'px'}">
            <li class="adv-item" v-for="order in orders" :style="{'width': (width/3) + 'px'}">
              <div class="user-info">
                <image-loader :src="order.user.url" class="photo-case" :defaultCls="'photo-' + ((order.user.sex == '025001') ? 'man' : 'woman') + '-case'" />
                <h4 class="auto-fill">{{order.user.name}}</h4>
              </div>
              <div class="categorys-case auto-fill">
                <label v-for="(category, idx) in order.categorys" class="category-item">{{category.ctname}}{{(idx == order.categorys.length - 1) ? '' : '、'}}</label>
              </div>
            </li>
          </ul>
        </div>
      </div>
  
      <div id="orderInnerListContainer">
        <div class="order-item-case" v-for="order in orders" @tap="detail(order)">
          <h3>
            <label class="auto-fill">{{order.title}}</label>
            <time>{{order.createtime | toTime('-')}}</time>
          </h3>
          <div class="user-case">
            <image-loader :src="order.user.url" class="photo-case" :defaultCls="'photo-' + ((order.user.sex == '025001') ? 'man' : 'woman') + '-case'" />
            <div class="auto-fill remark-case">
              <label>{{order.user.name}}</label> {{'发布了一条求购单，需求' + order.itemcount + '种品类。'}}
              <span class="order-remark">要求：{{order.remark}}</span>
            </div>
          </div>
          <div class="category-list-case">
            <div class="categroy-item-case">
              <label class="name" v-for="(category, idx) in order.categorys" v-if="idx < 10">{{category.ctname}}</label>
              <span class="more" v-if="order.categorys.length >= 10">...</span>
            </div>
          </div>
        </div>
      </div>
    </scroller>

    <masker-dialog :show="isOpen" :size="screen_height - 80" @closeHandler="closeMasker">
      <div class="select-case" v-if="currOrder">
        <div class="user-photo-case">
          <image-loader :src="currOrder.user.url" class="photo-case" :defaultCls="'photo-' + ((currOrder.user.sex == '025001') ? 'man' : 'woman') + '-case'" />
        </div>
        <h4>{{currOrder.user.name}}<span class="iconfont icon-vip" v-if="currOrder.user.isrealname == 1"></span></h4>
        <button class="trun-order" @tap.stop="trun">接单</button>
        <scroller class="select-scroller auto-fill">
          <div class="category-item-case" v-for="category in categorys" :style="{'width': (screen_width - 40) * .5 + 'px'}" @tap="edit(category)">
            <h3>{{category.ctname}}</h3>
            <h4 class="auto-fill">需求 {{category.amount}} 株</h4>
            <span class="tip">{{category.taked ? '该品类已有' + category.taked + '人报价' : '该品类尚无人报价'}}</span>
          </div>
        </scroller>
      </div>
    </masker-dialog>
	</normal-layout>
</template>

<script>
	import config from '../../../../config/address.js'
	import businessHeader from '@/components/comm/header/BusinessHeader'
  import normalHeader from '@/components/comm/NormalHeader'
	import normalLayout from '@/components/layout/Layout'
  import timeCounter from '@/components/comm/TimeCounter'
  import imageLoader from '@/components/comm/ImageLoader'
  import utils from '@/plugins/utils'
  import service from '@/api/service'
  import OrderBo from '@/model/bo/Order'
  import UserBo from '@/model/bo/User'
  import CategoryBo from '@/model/bo/Category'
	import scroller from '@/components/comm/Scroller'
	import maskerDialog from '@/components/dialog/MaskerDialog'

	export default {
    created(){
			window.addEventListener('init', (e) => {
				this.init()
			})

      /*EditCategory.vue 的回调方法*/
			window.addEventListener('setCategory', (e) => {
				this.setCategory(e.detail.category)
			})
    },
    
		components: {
      normalHeader,
			normalLayout,
      timeCounter,
      imageLoader,
			scroller,
			maskerDialog
		},

		data(){
			return {
        loaded: true,
        curpage: 1,
        pagesize: 10,
        count: 0,
        orders: [],
        city: '',
        width: document.body.clientWidth,
				screen_height: window.screen.availHeight,
        screen_width: window.screen.availWidth,
				isOpen: false,
        currOrder: {user: {}},
				categorys: [],
        isSelectAll: false,
        status: '1',
        showTop: false,
        scroller: null
			}
		},

		mounted(){
			mui.plusReady(() => {
				this.city = this.getCity()
				if(!plus.webview.getWebviewById('businessEditCategory')){
					mui.preload({
						id: 'businessEditCategory',
						url: config.CDN_ADDRESS + '/businessEditCategory'
					})
				}
			})
		},

		methods: {
		  init(){
		    this.search()
      },
      
      setScroller(scroller){
		    this.scroller = scroller
      },
      
      scrollHandler(scroller){
		    if(scroller.y < -1000){
		      this.showTop = true
        }else{
		      this.showTop = false
        }
      },
      
      refresh(){
        this.search()
      },
      
      goTop(){
        console.log(this.scroller)
        this.scroller && this.scroller.scrollTo(0, 0, 200)
      },

			closeMasker(){
		  	this.isOpen = false
      },
      
      getCity(){
        return utils.getLocalItem('local_city')
      },
      
      trun(){
        utils.confirm('接受并转成我接收到的报价单', () => {
          let user = utils.getLocalUser()
          let param = {
            orderid: this.currOrder.orderid,
            userid: user.userid,
            cityid: user.cityid,
            uuid: utils.getUuid(),
            paytype: '013001',
            remark: '',
            items: [],
            published: 0,
          }
          this.categorys.forEach(category => {
            param.items.push({
              itemid: category.itemid,
              amount: category.amount,
              total: category.taking.total,
              price: category.taking.price,
              ptype: '034001',
              allotid: category.allotid,
              uuid: utils.getUuid(),
              remark: '从生意圈接单'
            })
          })
          
          service('saveOrderTakes', param, rs => {
            this.closeMasker()
            setTimeout(() => {
              let _idx = 0
              this.orders.forEach((order, idx) => {
                if(order.orderid == this.currOrder.orderid){
                  _idx = idx
                }
              })
              this.orders.splice(_idx, 1)
              utils.confirm('保存成功！前往我的接单查看', () => {
                plus.webview.create(config.CDN_ADDRESS + '/myAccept', 'myAccept')
              }, '留在此页')
            }, 300)
          })
        })
      },
      
      select(){
        this.isSelectAll = !this.isSelectAll
        this.categorys.forEach(category => {
          category.chose = this.isSelectAll
        })
      },
      
      search(callback){
        this.orders = []
        this.status = '1'
        let user = utils.getLocalUser()
        service('businessList', {
          userid: user.userid || '0',
          cityid: user.cityid
        }, rs => {
          this.count = rs.count
          rs.items && rs.items.forEach((item, idx) => {
            let categorys = [], order = new OrderBo(item)
            order.user = new UserBo(item.owner)
            order.published = item.published
            order.createtime = rs.items[idx].createtime
            //初始化发货单数据(单价,总价,数量)
            item.items && item.items.forEach(category => {
            	let _category = new CategoryBo(category)
							_category.amount2 = 0
							_category.price = 0
							_category.total = 0
							_category.chose = false
              categorys.push(_category)
            })
            order.categorys = categorys
            this.orders.push(order)
          })
          callback && callback()
          this.status = this.orders.length > 0 ? '2' : '0'
        }, err => {
          this.status = '0'
        })
      },
      
      detail(order){
        /*utils.masker(true)
        plus.webview.create(config.CDN_ADDRESS + '/businessOrderCategoryList', 'businessOrderCategoryList', {}, {order})*/

        this.isOpen = true
        this.currOrder = order
        service('businessCategoryList', {
					orderid: order.orderid,
					userid: utils.getLocalUser().userid || '0'
        }, rs => {
        	let categorys = rs.items || []
					categorys.forEach(item => {
						item.chose = false
          })
        	this.categorys = categorys
        })
      },

			check(category){
				category.chose = !category.chose
      },

			edit(category){
				let win = plus.webview.getWebviewById('businessEditCategory')
        category.edit = {
          price: category.taking.price,
          total: category.taking.total,
          amount: category.taking.amount
        }
        if(win){
				  console.log(win)
					mui.fire(win, 'init', {
					  category,
            openerId: plus.webview.currentWebview().id,
            readonly: false
					})
        }
      },
      
      setCategory(category){
        let user = utils.getLocalUser()
        this.categorys.forEach(item => {
          if(item.itemid == category.itemid){
            if(category.taking.price && parseInt(category.taking.price) != 0){
              item.taking.price = category.edit.price
            }
            if(category.taking.total && parseInt(category.taking.total) != 0){
              item.taking.total = category.edit.total
            }
            if(category.taking.amount && parseInt(category.taking.amount) != 0){
              item.taking.amount = category.edit.amount
            }
            utils.toast('保存成功')
          }
        })
        setTimeout(() => {
          service('saveOrderTakes', {
            orderid: this.currOrder.orderid,
            userid: user.userid,
            cityid: user.cityid,
            //uuid: this.currOrder.uuid,
            paytype: '013001',
            remark: this.currOrder.remark,
            published: this.currOrder.published,
            items: [{
              itemid: category.itemid,
              amount: category.edit.amount,
              total: category.edit.total,
              price: category.edit.price,
              ptype: '034001',
              remark: category.remark,
              allotid: category.allotid,
              uuid: category.taking.uuid || utils.getUuid()
            }]
          }, rs => {
            utils.toast('保存成功')
          })
        }, 300)
      }
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '@/assets/style/main.scss';

	.business-page{
		@include box-vert-left-top;
		background: $normalBgColor;
    
    .go-top{
      @include box-vert-center-middle;
      width: 36px;
      height: 36px;
      border-radius: 50px;
      background: rgba(0, 0, 0, .6);
      position: absolute;
      right: 10px;
      bottom: 100px;
      color: #fff;
      font-size: 24px;
      z-index: 100;
    }
    
    .refresh{
      @include box-vert-center-middle;
      width: 36px;
      height: 36px;
      border-radius: 50px;
      background: rgba(0, 141, 225, .6);
      position: absolute;
      right: 10px;
      bottom: 55px;
      color: #fff;
      font-size: 21px;
      z-index: 100;
      
      label{
        position: absolute;
        height: auto;
        width: 100%;
        font-size: 10px;
        color: #000;
        text-align: center;
        top: 100%;
        left: 0;
        margin-top: 0px;
      }
    }
    
    .position-case{
      @include box-hori-left-middle;
      margin-top: 50px;
      height: 50px;
      background: #fff;
      margin-bottom: 1px;
      padding: 0 10px;
      
      .icon-position3{
        padding-top: 2px;
        height: auto;
        color: #008de1;
        font-size: 24px;
      }
      
      label{
        color: #666;
        font-size: 16px;
        padding-left: 3px;
      }
      
      .change-case{
        @include box-hori-left-middle;
        width: auto;
        font-size: 14px;
        height: auto;
        color: #999;
        padding-right: 4px;
        
        .icon-down-arr{
          padding-top: 4px;
          font-size: 21px;
        }
      }
    }

    .content-inner{
      position: relative;
      overflow: hidden;
      
      .scroller-warp{
        @include box-vert-left-top;
        height: auto;
      }
    }
    
    .adv-case{
      @include box-hori-left-middle;
      height: 100px;
      background: #fff;
      
      .adv-inner-case{
        @include box-hori-left-middle;
        width: 100%;
        overflow-y: hidden;
        overflow-x: scroll;
        padding: 10px 0;
        
        .adv-inner-case2{
          @include box-hori-left-top;
          height: 80px;
          flex-shrink: 0;
  
          .adv-item{
            @include box-vert-left-top;
            height: 80px;
            background: #f7f7f7;
            margin-right: 10px;
            border-radius: 3px;
            padding: 6px 10px;
            
            &:last-child{
              margin-right: 0;
            }
    
            .user-info{
              @include box-hori-center-middle;
              height: 28px;
              flex-shrink: 0;
      
              .photo-case{
                width: 28px;
                height: 28px;
                border-radius: 32px;
                overflow: hidden;
              }
      
              h4{
                @include box-hori-left-middle;
                width: auto;
                height: auto;
                padding-left: 8px;
                color: #ed7e1b;
                font-size: 14px;
                font-weight: bold;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
    
            .categorys-case{
              text-align: center;
              padding: 5px 0 5px 0;
      
              .category-item{
                display: block;
                float: left;
                width: auto;
                line-height: 12px;
                height: 12px;
                margin: 2px 1px 0 0;
                color: #666;
                font-size: 10px;
              }
            }
          }
        }
      }
    }
    
    #orderInnerListContainer{
      @include box-vert-left-top;
      position: relative;
      padding: 10px;
      
      .mui-scroll{
        @include box-vert-center-top;
        padding: 10px;
      }
      
      .order-item-case{
        @include box-vert-left-top;
        height: auto;
        background: #fff;
        border-radius: 9px;
        padding: 10px 10px 0;
        margin-bottom: 10px;
        
        h3{
          @include box-hori-left-top;
          line-height: 22px;
          font-size: 16px;
          height: 32px;
          border-bottom: solid 1px #f1f1f1;
          
          label{
            font-weight: bold;
            color: $textStrongColor;
          }
          
          time{
            width: auto;
            font-size: 14px;
            color: #999;
          }
        }
        
        .user-case{
          @include box-hori-left-top;
          border-bottom: solid 1px #f1f1f1;
          padding: 10px 0;
          
          .photo-case{
            width: 64px;
            height: 64px;
            border-radius: 9px;
            overflow: hidden;
          }
          
          .remark-case{
            height: 64px;
            padding-left: 12px;
            color: #666;
            
            label{
              font-size: 16px;
              font-weight: bold;
            }
            
            .order-remark{
              height: auto;
              display: block;
              font-size: 12px;
              color: #999;
            }
          }
        }
        
        .category-list-case{
          @include box-vert-left-top;
          height: auto;
          padding: 10px 0 0;
          
          .categroy-item-case{
            height: auto;
            padding: 0 2px;
            position: relative;
            
            .name{
              font-size: 14px;
              background: #f1f1f1;
              border-radius: 3px;
              display: inline-block;
              height: 24px;
              padding: 0 5px;
              line-height: 24px;
              margin: 0 10px 10px 0;
            }
            
            .more-case{
              position: absolute;
              height: 100%;
              background: #ff0000;
            }
          }
        }
        
        &:active{
          background: #f7f7f7;
        }
      }
    }
    
    .in-case{
      @include box-hori-center-middle;
      width: 100%;
      background: url("../../../assets/img/yellow.png") top left/100% 100% repeat-y;
      height: 30px;
      color: #5d4a1d;
    }

    .select-case{
      @include box-vert-left-top;
      height: 100%;
      width: 100%;
      background: #fff;
      border-radius: 7px 7px 0 0;
      position: relative;
      
      .oper-case{
        text-align: center;
        height: 24px;
        line-height: 35px;
        background: #f7f7f7;
        font-size: 14px;
  
        .chose-true{
          color: #74baf3;
        }
        .chose-false{
          color: #bbb;
        }
      }
      
      .trun-order{
        @include box-hori-center-middle;
        width: auto;
        height: 28px;
        background: #f85959;
        border-radius: 3px;
        color: #fff;
        position: absolute;
        right: 15px;
        top: 12px;
        padding: 0 15px;
        font-weight: bold;
        
        &:active{
          opacity: .8;
        }
      }
      
      .icon-close{
        @include box-vert-center-middle;
        width: 32px;
        height: 50px;
        position: absolute;
        right: 5px;
        top: 0;
        font-size: 28px;
        color: #999;
      }

      .user-photo-case{
        width: 50px;
        height: 50px;
        border-radius: 64px;
        background: #fff;
        top: -10px;
        padding: 2px;
        overflow: hidden;
        left: 15px;
        position: absolute;

        .photo-case{
          width: 46px;
          height: 46px;
          overflow: hidden;
          border-radius: 44px;
        }
      }

      h4{
        @include box-hori-left-top;
        color: #666;
        font-size: 16px;
        padding-left: 72px;
        padding-top: 12px;
        font-weight: bold;
        height: 50px;

        .icon-vip{
          border: solid 1px #ecd79b;
          border-radius: 3px;
          padding: 1px 3px 0;
          font-size: 12px;
          color: #ecd79b;
          margin-left: 5px;
        }
      }

      .select-scroller{
        background: $normalBgColor;
        position: relative;
        overflow: hidden;
        padding: 10px 15px;

        .category-item-case{
          @include box-vert-center-top;
          height: 120px;
          background: #fff;
          border-radius: 7px;
          float: left;
          padding: 10px 10px 5px;
          position: relative;
          overflow: hidden;
          margin-bottom: 10px;

          &:nth-child(odd){
            margin-right: 10px;
          }

          &:active{
            background: #efefef;
          }

          h3{
            text-align: center;
            color: $textColor;
            font-size: 18px;
            height: auto;
            font-weight: bold;
          }

          h4{
            @include box-hori-center-middle;
            width: 100%;
            padding: 8px 0 0 0;
            font-weight: normal;
            color: $textLessColor;
            font-size: 16px;
            height: auto;

            label{
              font-weight: normal;
              font-size: 12px;
              padding-bottom: 2px;
              padding-right: 3px;
            }
          }

          h5{
            @include box-hori-center-bottom;
            width: 100%;
            color: #666;
            height: auto;
            padding: 7px 0 0 0;
            font-size: 16px;
            
            label{
              padding-right: 3px;
              font-size: 11px;
            }
          }

          .tip{
            @include box-hori-center-bottom;
            height: 20px;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
	}
</style>
