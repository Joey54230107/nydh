<template>
	<normal-layout class="accept-page" :loaded="loaded">
    <normal-header title="我接到的报价单" />
    <hori-scroller class="pageframe-case" :resource="pages" @handler="searchOrders" :selected="st" />
    <scroller class="accept-scroller auto-fill" id="scroller1" @loadMore="loadMore" @refresh="refresh" :load="true" @setScroller="setScroller" :status="status">
      <div class="orders-case" :style="{'transform':'translateY(' + y + 'px)', 'opacity':opacity}">
        <slider-blocker v-for="(order, idx) in orders" :item="order" class="order-wrap-case" sliderWidth="20" :key="idx">
          <div class="order-wrap-case2" @tap="detail(order)">
            <div class="empty-delete iconfont icon-delete" @tap.stop="remove(idx)"></div>
            <div class="order-info-case auto-fill">
              <h3 class="title">{{order.title}}</h3>
              <span class="date">接单时间：{{order.taktime.replace(/\//g, '-')}}</span>
              <span class="date">单号：{{order.takno}}</span>
              <label class="amount">共{{order.catecount}}种品类、{{order.takcount > 0 ? '您已报价' + order.takcount + '种' : '您尚未开始报价'}}</label>
            </div>
    
            <div class="exp-date-case">
              <span class="title">离过期剩余</span>
              <label class="upper">{{lastDate.str}}</label>
              <label class="unit">{{lastDate.unit}}</label>
            </div>
          </div>
        </slider-blocker>
      </div>
    </scroller>
    
    <masker-dialog :show="isOpen" :size="screen_height - 20" @closeHandler="closeMasker">
      <div class="select-case" :class="'select-case-' + currOrder.published < 1" v-if="currOrder">
        <div class="user-photo-case">
          <image-loader :src="currOrder.user.url" class="photo-case" :defaultCls="'photo-' + ((currOrder.user.sex == '025001') ? 'man' : 'woman') + '-case'" />
        </div>
        <h4>{{currOrder.user.name}}<span class="iconfont icon-vip" v-if="currOrder.user.isrealname == 1"></span></h4>
        <span class="iconfont icon-close" @tap.stop="closeMasker"></span>
        <hori-scroller class="pop-pageframe-case" :resource="options" @handler="choseCategoryHandler" :selected="st2" />
        <scroller class="select-scroller" id="scroller2" :status="status2" :style="{'transform': 'translateY(' + dialogStyle.y + 'px)', 'opacity': dialogStyle.opacity}">
          <div class="scroller-inner">
            <div class="category-item-case" v-show="category.display" v-for="(category, idx) in categorys" :style="{'width': (screen_width - 30) * .5 + 'px'}" :key="category.taking.uuid" @tap="edit(category)">
              <span class="iconfont icon-close" v-if="category.published != '1' && category.itemtype != '1' && category.allotid == '' && (category.taking.uuid) && (category.price == '' && category.total == '')" @tap.stop="deleteCategory(category, idx)" :class="'icon-check-' + category.chose"></span>
              <h3>{{category.ctname}}</h3>
  
              <!--已经报价了的（对方尚未确认）-->
              <div class="hasPrice auto-fill" v-if="category.itemtype != '1' && category.total && category.price && (!category.confirm.confirmid)">
                <h4 class="total-price-plugin" v-if="category.itemtype != '1'">{{category.total | price}}</h4>
                <div class="container-case" v-if="category.itemtype != '1' && (!category.confirm.confirmid)">
                  <h5 class="price-plugin">{{category.price | price}}</h5>
                  <h5 class="amount-plugin">{{category.amount | toInt}}</h5>
                </div>
              </div>
  
              <!--尚未报价 / 单子已提交了-->
              <div class="hasNoPrice auto-fill" v-if="category.itemtype != '1' && st == 2 && (!category.total) && (!category.price) && (!category.confirm.confirmid)">
                <h6>需求 {{category.amount | toInt}} 株</h6>
              </div>
  
              <!--尚未报价 / 单子还未提交、并且是朋友推荐给我的（默认itemtype == 2）-->
              <div class="hasNoPrice auto-fill" v-if="category.itemtype == '2' && st == 0 && (!category.total) && (!category.price) && (!category.confirm.confirmid) && category.taking.uuid">
                <h4 class="iconfont icon-zd"></h4>
                <h5>去报价 <span class="iconfont icon-right-arr"></span></h5>
              </div>
  
              <!--尚未报价 / 单子还未提交、并且不是朋友推荐给我的（默认itemtype == 0）-->
              <div class="hasNoPrice auto-fill" v-if="category.itemtype == '0' && st == 0 && (!category.total) && (!category.price) && (!category.confirm.confirmid) && !category.taking.uuid">
                <!--<h6>需求 {{category.amount | toInt}} 株</h6>-->
                <h4 class="iconfont icon-zd"></h4>
                <h5>去报价 <span class="iconfont icon-right-arr"></span></h5>
              </div>
  
              <!--已报价、工程公司已同意、待自己确定-->
              <div class="confirmed-case auto-fill" v-if="category.itemtype != '1' && category.confirm.confirmid && category.confirm.st == '0'">
                <h4>{{category.total | price}}</h4>
                <h5>{{category.price | price}}</h5>
                <h6>{{category.amount | toInt}}</h6>
              </div>
  
              <!--已报价，工程公司同意，自己也同意了-->
              <div class="confirmed-case auto-fill" v-if="category.itemtype != '1' && category.confirm.st == '1'">
                <h4>{{category.total | price}}</h4>
                <h5>{{category.price | price}}</h5>
                <h6>{{category.amount | toInt}}</h6>
              </div>
  
              <!--放弃报价-->
              <div class="refruse-case auto-fill" v-if="category.itemtype == '1' || category.confirm.st == '2'">
                <h4 class="auto-fill">
                  <span class="remark">理由</span>
                  <label>{{category.abaremark || category.confirm.respremark}}</label>
                </h4>
							</div>
              
              <footer class="blocker-footer">
                <div v-if="(!category.hasPrice) && category.itemtype != 1 && category.taking.uuid" class="blocker-footer-unpublished">状态：尚未报价</div>
                <div v-if="category.hasPrice && (category.taking.published == '0') && category.itemtype != 1" class="blocker-footer-unpublished">状态：已报价，未发布</div>
                <div v-if="category.itemtype == 1" class="blocker-footer-refuse">状态：您已放弃报价</div>
                <div v-if="category.itemtype == 0 && !category.taking.uuid" class="blocker-footer-unpublished">状态：尚未报价</div>
                <div v-if="category.itemtype != 1 && (category.hasPrice) && (category.taking.published == '1') && (!category.confirm.confirmid)" class="blocker-footer-wait-confirm">状态：已报价，待对方确认</div>
                <div v-if="category.itemtype != 1 && category.confirm.confirmid && category.confirm.st == 0" class="blocker-footer-wait-self">
                  <div class="oper-case">
                    <span class="button agree-btn" @tap.stop="agree(category)">同意</span>
                    <span class="button disagree-btn">放弃</span>
                  </div>
                </div>
                <div v-if="category.itemtype != 1 && category.confirm.st == 0 && category.confirm.remark" class="blocker-footer-modify-confirm">状态：对方有修改，待同意</div>
                <div v-if="category.itemtype != 1 && category.confirm.st == 2 && category.confirm.respremark" class="blocker-footer-refuse">状态：您已拒绝</div>
                <div v-if="category.itemtype != 1 && category.confirm.st == 1" class="blocker-footer-confirm">状态：双方确认合作</div>
              </footer>
            </div>
          </div>
        </scroller>
        <footer class="publish-case" v-if="st == 0">
          <span @tap="publish" class="publish-btn auto-fill">发布我的报价信息</span>
        </footer>
      </div>
    </masker-dialog>
	</normal-layout>
</template>

<script>
	import config from '../../../../../config/address.js'
  import normalHeader from '@/components/comm/NormalHeader'
	import scroller from '@/components/comm/Scroller'
	import normalLayout from '@/components/layout/Layout'
  import utils from '@/plugins/utils'
  import service from '@/api/service'
  import OrderBo from '@/model/bo/Order'
  import UserBo from '@/model/bo/User'
  import CategoryBo from '@/model/bo/Category'
  import imageLoader from '@/components/comm/ImageLoader'
  import timeCounter from '@/components/comm/TimeCounter'
  import horiScroller from '@/components/comm/HoriScroller'
  import sliderBlocker from '@/components/comm/SliderBlocker'
	import maskerDialog from '@/components/dialog/MaskerDialog'
  import {price, toInt} from '@/plugins/filter/custom'
  import confirmButton from '@/components/comm/ConfirmButton'

	export default {
	  created(){
			mui.plusReady(() => {
				plus.webview.show('myAccept', 'pop-in', 300)
			})
      /*EditCategory.vue 的回调方法*/
      window.addEventListener('setCategory', (e) => {
        this.setCategory(e.detail.category)
      })
      window.addEventListener('giveupCallback', (e) => {
        this.giveupCallback(e.detail.category, e.detail.reason, e.detail.flag)
      })
    },
    
		components: {
			scroller,
			normalLayout,
      normalHeader,
      imageLoader,
      timeCounter,
      horiScroller,
      sliderBlocker,
			maskerDialog,
      confirmButton
		},
  
		data(){
			return {
        currScroller: null,
				loaded: true,
        curpage: 1,
        totalCategroyNum: '0',
        pageSize: 5,
        orders: [],
				categorys: [],
        pages: [
          {name: '待提交', chose: true, code: '0'},
          {name: '待确认', chose: false, code: '2'}
        ],
        options: [
					{name: '朋友分配给我的', chose: true, code: '1'},
					{name: '其他', chose: false, code: '0'}
        ],
        lastDate: {
					str: '',
          unit: ''
        },
        st: '0',
        st2: '1',
				isOpen: false,
				screen_height: window.screen.availHeight,
				screen_width: window.screen.availWidth,
				currOrder: {user: {}},
        isSelectAll: false,
        status: '1',
        y: 0,
        opacity: 0,
        status2: '1',
        dialogStyle: {
          y: 0,
          opacity: 1
        }
			}
		},

		mounted(){
			mui.plusReady(() => {
				this.search()
				utils.preload('businessEditCategory')
			})
		},

		methods: {
      moveTop(){
        if(this.currScroller){
          this.currScroller.scrollTo(0, 0, 200)
        }
      },
      
      giveupCallback(category, reason, flag){
        this.categorys.forEach(item => {
          if(item.itemid == category.itemid){
            item.itemtype = '1'
            if(flag == '01'){
              //放弃
              item.abaremark = reason
            }else{
              //不同意
              item.confirm && (item.confirm.respremark = reason)
            }
          }
        })
      },
      
      setScroller(scroller){
        this.currScroller = scroller
      },

			loadMore(scroller, callback){
				++ this.curpage
				this.search(this.st, callback)
			},

			refresh(scroller, callback){
				this.curpage = 1
				this.search(this.st, callback)
			},
      
      search(st = 0, callback){
			  this.status = '1'
        this.orders.splice(0, 1000)
        let user = utils.getLocalUser()
        service('getMyAcceptFromList', {
          userid: user.userid,
          st: st,
          curpage: this.curpage,
          pagesize: 15
        }, rs => {
          rs.items && rs.items.forEach((item, idx) => {
            let order = new OrderBo(item), d = parseInt(item.latestime) - (new Date()), day = 3600 * 1000 * 24, hour = 3600 * 1000, min = 60 * 1000, sec = 1000
            if(d >= day){
            	Object.assign(this.lastDate, {
            		str: d % day == 0 ? parseInt(d / day) : parseInt(d / day) + 1,
                unit: '天'
              })
            }else if(d >= hour){
							Object.assign(this.lastDate, {
								str: d % hour == 0 ? parseInt(d / hour) : parseInt(d / hour) + 1,
								unit: '小时'
							})
						}else if(d >= min){
							Object.assign(this.lastDate, {
								str: d % min == 0 ? parseInt(d / min) : parseInt(d / min) + 1,
								unit: '分钟'
							})
						}else if(d >= sec){
							Object.assign(this.lastDate, {
								str: d % sec == 0 ? parseInt(d / sec) : parseInt(d / sec) + 1,
								unit: '秒'
							})
						}
            item.items && item.items.forEach(category => {
              let _category = new CategoryBo(category)
              order.categorys.push(_category)
            })
            order.user = new UserBo(item.owner)
            order.takno = item.takno
            order.published = item.published
            order.takid = item.takid
            rs.items[idx] = order
          })
          this.orders = rs.items
          this.status = rs.items.length > 0 ? '2' : '0'
          this.y = 0
          this.opacity = 1
          callback && callback(true, rs.items.length)
        }, err => {
          callback && callback()
          this.status = '0'
        })
      },

			choseCategoryHandler(item){
        let count = 0
        this.st2 = item.code
        this.dialogStyle = {
          opacity: 0,
          y: 30
        }
        setTimeout(() => {
          if(item.code == 1){
            //朋友分配来的
            this.categorys.forEach(category => {
              category.display = (category.allotid != '')
              if(category.display){
                ++ count
              }
            })
          }else{
            //非朋友分配的
            this.categorys.forEach(category => {
              category.display = (category.allotid == '')
              if(category.display){
                ++ count
              }
            })
          }
          this.status2 = count > 0 ? '2' : '0'
  
          this.dialogStyle = {
            opacity: 1,
            y: 0
          }
        }, 300)
      },
      
      setCategory(category){
			  let user = utils.getLocalUser(), uuid = utils.getUuid()
			  setTimeout(() => {
          service('saveOrderTakes', {
            orderid: this.currOrder.orderid,
            userid: user.userid,
            cityid: user.cityid,
            uuid: this.currOrder.uuid,
            paytype: '013001',
            remark: this.currOrder.remark,
            published: '0',
            items: [{
              itemid: category.itemid,
              amount: category.edit.amount,
              total: category.edit.total,
              price: category.edit.price,
              ptype: '034001',
							abandon: category.allotid ? '0' : '',
              remark: category.remark,
              allotid: category.allotid,
              uuid: category.taking.uuid || uuid
            }]
          }, rs => {
            this.categorys.forEach(item => {
              if(item.itemid == category.itemid){
                item.amount = toInt(category.edit.amount)
                item.price = price(category.edit.price)
                item.total = price(category.edit.total)
                if(!item.taking.uuid){
                  item.taking.uuid = uuid
                }
                item.hasPrice = true
                item.taking && (item.taking.published = '0')
              }
            })
            utils.toast('保存成功')
          })
        }, 300)
      },

			publish(){
        /*现在改成：发布的时候，所有品类要么已经有报价信息， 要么已经拒绝*/
        let all = true
        this.categorys && this.categorys.forEach(category => {
          let takInfo = category.taking
          if(category.itemtype != '1' && takInfo.total == '' && takInfo.price == ''){
            all = false
          }
        })
        if(!all){
          utils.toast('请填写完所有报价信息', 2000, 'FAILED')
          return
        }
        utils.confirm('确定发布我的报价信息', () => {
          setTimeout(() => {
            service('publishTakOrder', {
              orderid: this.currOrder.orderid,
              takid: this.currOrder.takid,
              purchaserid: this.currOrder.user.userid,
              userid: utils.getLocalUser().userid
            }, rs => {
              utils.toast('发布成功')
              this.isOpen = false
              setTimeout(() => {
                this.searchOrders({code: '2'})
              }, 300)
            })
          }, 300)
        }, '暂不发布')
      },

			detail(order){
			  this.st2 = '1'
        service('getAccecptConfirmDetail', {
          takid: order.takid,
          orderid: order.orderid,
          userid: utils.getLocalUser().userid || '0',
          curpage: 1
        }, rs => {
          let categorys = rs.items || [], count = 0
          this.totalCategroyNum = rs.count
          
          categorys.forEach(item => {
            item.chose = false
            item.display = (item.allotid != '')
            item.remark = item.confirm.remark
            item.uuid = item.taking.uuid
            if(item.confirm.confirmid){
              //有报价过并确定了的
              item.price = item.confirm.price
              item.amount = item.confirm.amount
              item.total = item.confirm.total
              item.hasPrice = true
            }else{
              if(item.taking.takitemid){
                //有报价但没有确定的
                item.price = item.taking.price
                item.amount = item.taking.amount
                item.total = item.taking.total
                if(!(utils.ruleNumber(item.price) && utils.ruleNumber(item.total))){
                  item.hasPrice = false
                }else{
                  item.hasPrice = true
                }
                item.takitemid = item.taking.takitemid
              }else{
                //还没报价的
                item.price = item.price || ''
                item.amount = item.amount || ''
                item.total = item.total || ''
                item.hasPrice = false
              }
            }
            if(item.display){
              ++ count
            }
          })
          this.categorys = categorys
          this.status2 = count > 0 ? '2' : '0'
          setTimeout(() => {
            this.currOrder = order
            this.isOpen = true
          }, 300)
        })
      },
      
      deleteCategory(category, idx){
			  utils.confirm('确定不对此品类报价', () => {
			    service('deleteCategory', {
            uuid: category.taking.uuid,
            dt: '1',
            orderid: this.currOrder.orderid,
            purchaserid: this.currOrder.user.userid,
            userid: utils.getLocalUser().userid
          }, rs => {
			      utils.toast('删除成功')
            this.categorys.splice(idx, 1)
          })
        })
			},

			agree(category){
				utils.confirm('确认该品类达成合作意向', () => {
					service('offerAgreeOrNagtive', {
						orderid: this.currOrder.orderid,
						takid: this.currOrder.takid,
						items: [{
							takitemid: category.taking.takitemid,
							st: category.confirm.st,
							resp: '1',
							reason: ''
						}]
					}, rs => {
						utils.toast('操作成功')
						category.confirm.st = '1'
					})
				}, '再考虑下')
			},

			edit(category){
				let win = plus.webview.getWebviewById('businessEditCategory')
        if(category.itemtype == '1'){
					//放弃报价
          utils.error('您已放弃该品类的报价!')
        }else{
        	//报价与未报价
					category.edit = {
						price: category.price,
						total: category.total,
						amount: category.amount
					}

					if(win){
						mui.fire(win, 'init', {
							category,
							openerId: plus.webview.currentWebview().id,
							orderid: this.currOrder.orderid,
              itemid: category.itemid,
              takitemid: category.taking.takitemid,
              takid: this.currOrder.takid,
              st: category.confirm.st,
              readonly: true,
              orderStatus: this.st
						})
            console.log(JSON.stringify(category))
					}
        }
			},
      
      searchOrders(item){
        this.y = 30
        this.opacity = 0
        
        setTimeout(() => {
          this.curpage = 1
          this.orders = []
          this.st = item.code
          this.search(item.code)
          if(this.currScroller){
            this.currScroller.scrollTo(0, 0, 100)
          }
        }, 320)
      },
      
      remove(idx){
        mui.confirm('您确定要删除该报价单么？', '', ['否','是'], e => {
          if(e.index == 1){
            this.orders.splice(idx, 1)
          }
        })
      },

			closeMasker(){
      	this.isOpen = false
      },

      trun(){

      }
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '@/assets/style/main.scss';

	.accept-page{
		@include box-vert-left-top;
		background: $normalBgColor;
    position: relative;
    
    .icon-up-arr{
      @include box-vert-center-middle;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, .5);
      border-radius: 40px;
      color: #eee;
      font-size: 32px;
      position: absolute;
      right: 5px;
      bottom: 100px;
      z-index: 100;
      padding-bottom: 5px;
      //border: solid 3px rgba(255, 255, 255, .8)
    }

		.search-case{
			@include box-hori-center-middle;
			margin-top: 50px;
			height: 50px;
			background: #e1e1e1;
			position: relative;
      padding: 0 8px;
      overflow: visible;

			input{
				overflow: hidden;
				height: 32px;
				background: #fff;
				border-radius: 5px;
				padding: 0 35px;
				line-height: 26px;
				font-size: 16px;
			}

			.icon{
				width: 32px;
				height: 50px;
				position: absolute;
				left: 16px;
				top: 0;
				color: #666;
				font-size: 18px;
				line-height: 52px;
			}
		}
    
    .pageframe-case{
      @include box-hori-left-middle;
      margin-top: 50px;
      position: relative;
      overflow: hidden;
      background: #fff;
    }

    .pop-pageframe-case{
      @include box-hori-left-middle;
      position: relative;
      overflow: hidden;
      background: #fff;
      border-bottom: solid 1px $normalBgColor;
    }

		.accept-scroller{
      @include box-vert-left-top;
      position: relative;
      overflow: hidden;
      margin-top: 1px;
      
      .orders-case{
        @include box-vert-left-top;
        width: 100%;
        padding: 10px 10px 25px;
        transition: transform .3s, opacity .3s;
        
        .order-wrap-case{
          @include box-hori-left-top;
          height: auto;
          background: #ccc;
          margin-bottom: 8px;
          overflow: hidden;
          border-radius: 9px;
          
          .order-wrap-case2{
            @include box-hori-left-middle;
            background: #fff;
            padding: 2px 10px;
            position: relative;
            
            .empty-delete{
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
  
              &.icon-delete{
                font-size: 18px;
                background: #fff;
                color: #f85959;
              }
            }
            
            .user-info{
              @include box-hori-center-middle;
              position: absolute;
              width: 100%;
              height: 100%;
              bottom: 4px;
              left: 0;
              padding: 0;
              margin: 0;
  
              .user-photo{
                width: 26px;
                height: 26px;
                border-radius: 24px;
                overflow: hidden;
                border: solid 1px #e5e5e5;
              }
              
              label{
                font-size: 16px;
                color: #666;
                padding-left: 8px;
              }
            }

            &:active{
              background: #f9f9f9;
            }
          }
          
          .order-info-case{
            height: 100%;
            padding: 10px 10px 8px 5px;
            
            h3.title{
              @include box-hori-left-top;
              font-size: 16px;
              color: #666;
              height: 24px;
              font-weight: bold;
            }
            
            .date{
              @include box-hori-left-top;
              height: 20px;
              color: #666;
  
              time.day{
                color: #DF6158;
              }
            }
            
            .amount{
              @include box-hori-left-bottom;
              height: 24px;
              width: auto;
              color: #999;
            }
          }
          
          .exp-date-case{
            @include box-vert-center-middle;
            width: 80px;
            height: auto;
            border-left: solid 1px #f1f1f1;
            padding-left: 10px;
            color: #666;
            font-size: 12px;
            
            .title{
              height: 16px;
              color: $textLessColor;
              font-size: 12px;
              font-weight: bold;
            }
            
            .upper{
              @include box-vert-center-middle;
              font-size: 36px;
              width: 100%;
              //border-top: solid 1px #f1f1f1;
              margin-top: 4px;
              font-weight: 300;
              padding: 12px 0 8px;
              color: #f85959;
            }
          }
        }
      }
		}

    .select-case{
      @include box-vert-left-top;
      height: 100%;
      width: 100%;
      background: $normalBgColor;
      border-radius: 7px 7px 0 0;
      position: relative;
      
      &.select-case-false{
        padding-bottom: 65px;
      }

      .trun-order{
        width: auto;
        height: 26px;
        background: #f85959;
        border-radius: 3px;
        color: #fff;
        position: absolute;
        right: 48px;
        top: 12px;
        padding: 0 10px;

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
        z-index: 10;

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
        height: 35px;

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
        @include box-vert-left-top;
        overflow: hidden;
        position: relative;
        padding: 10px;
        margin-bottom: 60px;
        background: $normalBgColor;
        transition: transform .3s, opacity .3s;
        
        .scroller-inner{
          @include box-hori-left-top;
          height: auto;
          flex-wrap: wrap;
          position: relative;
          padding-top: 5px;
        }

        .category-item-case{
          @include box-vert-center-top;
          height: 140px;
          background: #fff;
          border-radius: 9px 9px 9px 9px;
          //float: left;
          padding: 0;
          position: relative;
          overflow: hidden;
          margin-bottom: 10px;
          margin-right: 10px;

          &:nth-child(odd){
            //margin-right: 10px;
          }

          &:active{
            background: #efefef;
          }

          .icon-close{
            @include box-hori-center-middle;
            position: absolute;
            width: 32px;
            height: 32px;
            right: 0;
            top: 0;
            border-radius: 0 9px 0 24px;
            //box-shadow: 0 0 5px 2px rgba(0, 0, 0, .3);
            color: #fff;
            font-size: 24px;
            padding: 0 0 2px 2px;
            background: $red;
          }
          
          .hasNoPrice{
            @include box-hori-center-middle;
            
            h4{
              @include box-hori-center-middle;
              width: 42px;
              height: 42px;
              //border: solid .5px #999;
              border-radius: 36px;
              overflow: hidden;
              font-size: 21px;
              text-align: center;
              color: #c5c5c5;
              line-height: 42px;
              margin-top: 12px;
              padding: 0;
              background: rgba(128, 128, 128, .1);
            }
            
            h5{
              height: auto;
              width: 45px;
              font-size: 12px;
              margin-top: 10px;
              margin-left: 10px;
              color: #008de1;
              font-weight: bold;
              position: relative;
              
              .icon-right-arr{
                text-align: right;
                width: 12px;
                position: absolute;
                font-size: 18px;
                right: 0;
                top: -2px;
              }
            }
            
            h6{
              @include box-hori-center-middle;
              height: auto;
              width: 100%;
              padding: 0 10px;
              color: $textLessColor;
            }
          }

          .check{
            width: 70px;
            height: 70px;
            background: #efefef;
            border-radius: 40px;
            position: absolute;
            right: -35px;
            top: -35px;
            color: #fff;
            padding-top: 40px;
            padding-left: 10px;
            font-size: 21px;

            &.check-true{
              background: #f85959;
            }
          }
  
          h3{
            text-align: center;
            color: #666;
            font-size: 18px;
            height: auto;
            font-weight: bold;
            padding: 10px 10px 0;
          }
          
          .hasPrice{
            @include box-vert-center-top;
            padding-top: 15px;
  
            h4{
              @include box-hori-center-bottom;
              width: 100%;
              padding: 0;
              font-weight: 300;
              color: #f85959;
              font-size: 14px;
              height: auto;
            }
  
            h5{
              @include box-hori-center-bottom;
              width: 100%;
              color: #999;
              height: auto;
              padding: 4px 0 0 0;
              font-size: 14px;
    
              label{
                font-size: 11px;
              }
            }
          }

          .container-case{
            @include box-vert-left-top;
            height: auto;

            .icon-check{
              @include box-hori-center-top;
              width: 100%;
              height: auto;
              color: #f85959;
              font-size: 16px;
              margin-top: 25px;
              font-weight: bold;
            }
          }
          
          .confirmed-case{
            @include box-vert-center-top;
            height: auto;
            text-align: center;
            
            h4{
              @include box-hori-center-middle;
              padding: 0;
              margin-top: 12px;
              font-weight: normal;
              font-size: 14px;
              color: #f85959;
              height: auto;
  
              &:before{
                content: '总价';
                padding: 2px 2px 0 0;
                font-size: 12px;
                
              }
              &:after{
                content: '元';
                font-size: 12px;
                padding: 1px 2px 0 0;
              }
            }
  
            h5{
              font-size: 14px;
              color: #999;
              height: auto;
              padding-top: 2px;
    
              &:before{
                content: '单价';
                padding: 2px 2px 0 0;
                font-size: 12px;
      
              }
              &:after{
                content: '元';
                font-size: 12px;
                padding-left: 2px;
              }
            }
  
            h6{
              @include box-hori-center-middle;
              font-size: 14px;
              color: #999;
              height: auto;
              padding-top: 2px;
    
              &:before{
                content: '数量';
                padding: 2px 2px 0 0;
                font-size: 12px;
      
              }
              &:after{
                content: '株';
                font-size: 12px;
                padding: 2px 2px 0 0;
              }
            }
          }

          .tip{
            @include box-hori-center-bottom;
            font-size: 12px;
            color: #999;
          }

          .refruse-case{
            @include box-vert-center-top;
            padding-top: 12px;
            color: #f85959;

            .icon-lock{
              margin-top: 8px;
              height: auto;
              font-size: 21px;
            }

            h3{
              height: 18px;
              font-size: 16px;
              color: #f85959;
              margin-top: 5px;
              font-weight: bold;
            }
            
            h4{
              @include box-hori-center-top;
              width: 100%;
              padding: 10px 0 0 0;
              //@include box-vert-left-middle;
              
              .remark{
                width: auto;
                font-weight: normal;
                height: 14px;
                text-align: center;
                white-space: nowrap;
                line-height: 13px;
                color: #008de1;
                border: solid .5px #008de1;
                font-size: 10px;
                padding: 0 2px;
                border-radius: 2px;
              }
              
              label{
                text-align: left;
                line-height: 14px;
                padding: 0 6px;
                width: auto;
                color: #008de1;
                font-size: 10px;
                font-weight: normal;
              }
            }
          }
          
          .blocker-footer{
            @include box-hori-center-top;
            height: 36px;
            font-size: 12px;
            
            .blocker-footer-unpublished{
              @include box-hori-center-middle;
              height: 100%;
              color: #666;
              background: rgba(0, 0, 0, .15);
            }
            
            .blocker-footer-refuse{
              @include box-hori-center-middle;
              height: 100%;
              font-weight: bold;
              background: #f85959;
              color: #fff;
              font-size: 12px;
            }
            
            .blocker-footer-wait-self{
              @include box-hori-center-middle;
              height: 100%;
              color: #fff;
              font-size: 10px;
  
              .oper-case{
                @include box-hori-center-top;
    
                .button{
                  @include box-hori-center-middle;
                  width: auto;
                  height: 24px;
                  font-size: 12px;
                  border-radius: 3px;
                  line-height: 20px;
                  padding: 0 15px;
      
                  &.agree-btn{
                    border: solid .5px #008de1;
                    color: #008de1;
                    font-weight: bold;
                    margin-right: 10px;
                  }
      
                  &.disagree-btn{
                    background: #f85959;
                    color: #fff;
                    margin-left: 10px;
                  }
                }
              }
            }
            
            .blocker-footer-wait-confirm{
              @include box-hori-center-middle;
              height: 100%;
              background: rgba(0, 0, 0, .15);
              color: $blue;
              font-size: 10px;
              font-weight: bold;
            }
            
            .blocker-footer-modify-confirm{
              @include box-hori-center-middle;
              height: 100%;
              background: rgba(0, 0, 0, .15);
              color: $red;
              font-weight: bold;
              font-size: 10px;
            }
            
            .blocker-footer-confirm{
              @include box-hori-center-middle;
              height: 100%;
              font-weight: bold;
              background: #008de1;
              color: #fff;
              font-size: 10px;
              
              .icon-check{
                font-size: 14px;
                margin-right: 10px;
              }
            }
          }
        }
      }

      .publish-case{
        @include box-hori-center-middle;
        height: 60px;
        padding: 0 10px;
        background: $normalBgColor;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10;
        //box-shadow: 0 -3px 10px rgba(0, 0, 0, .05);
        
        .publish-btn{
          @include box-hori-center-middle;
          text-align: center;
          height: 44px;
          background: $blue;
          color: #fff;
          font-size: 16px;
          border-radius: 5px;
          font-weight: bold;
          
          &:active{
            opacity: .8;
          }
        }
        
        .icon-question{
          width: 24px;
          height: 32px;
          font-size: 24px;
          line-height: 32px;
          margin: 6px 0 0 12px;
          color: #666;
        }
      }
    }
    
    .total-price-plugin{
      &:before{
        content: '总价';
        font-size: 12px;
      }
      &:after{
        content: '元';
        font-size: 12px;
        padding-bottom: 1px;
      }
    }
    
    .price-plugin{
      &:before{
        content: '单价';
        font-size: 12px;
      }
      &:after{
        content: '元';
        font-size: 12px;
        padding-bottom: 1px;
      }
    }
    
    .amount-plugin{
      &:before{
        content: '数量';
        font-size: 12px;
      }
      &:after{
        content: '株';
        font-size: 12px;
        padding-bottom: 1px;
      }
    }
	}
</style>
