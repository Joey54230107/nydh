<template>
  <normal-layout class="accept-goods-page" :loaded="loaded">
    <normal-header title="订单详情" />
    <scroller class="order-detail-case auto-fill">
      <div class="supplier-case">
        <image-loader :src="supplier.url" class="supplier-user-case" :defaultCls="'photo-' + ((supplier.sex == '025001') ? 'man' : 'woman') + '-case'" />
        <h3>发货人：{{supplier.name}}</h3>
      </div>
      <ul>
        <li class="detail-case">
          <span>订单编号: {{order.tradeno}}</span>
          <h2>{{order.paytotal | price}}</h2>
          <h3>创建日期：{{order.createtime | toTime('-')}}</h3>
          <address>收货地址：{{order.addrid ? order.address : '对方尚未填写'}}</address>
          <h3>车辆信息：{{order.drivername ? '车牌' + order.plateno : '对方尚未填写'}}</h3>
          <div class="state">
            <h3>订单状态</h3>
            <h4 v-for="flow in flows" :class="'chose-' + flow.chose">
              <i :class="'chose2-' + flow.chose"></i>
              {{flow.name}}&nbsp;
            </h4>
          </div>
        </li>
        <li class="reciver-case">
          <h3 class="title">验收人信息 <div class="modify-txt" @tap="modifyExaminers">设置验收人<span class="iconfont icon-right-arr"></span></div></h3>
          <div class="examiner-case">
            <label class="tip">默认将列出好友分组中“验收组”下的人员</label>
            <div class="examiner-item-case" v-for="examiner in order.examiners" @tap.stop="choseExaminer(examiner)">
              <image-loader :src="examiner.url" class="photoer-case" :defaultCls="'photo-' + ((examiner.sex == '025001') ? 'man' : 'woman') + '-case'" />
              <label class="name auto-fill">{{examiner.name}}</label>
              <a class="iconfont icon-phone" v-if="examiner.telephone" :href="'tel:' + examiner.telephone"></a>
            </div>
          </div>
        </li>
        <li class="remark-case">
          <label>备注：</label>
          <div class="remark auto-fill">{{order.remark || '无'}}</div>
        </li>
        <ul class="items-case">
          <li class="category-tip-case">该订单下共有{{order.items.length}}个品类</li>
          <li class="category-item-case" v-for="item in order.items">
            <div class="info-case auto-fill">
              <h2>
                {{item.ctname}}
                <label>装车数：{{item.amount | toInt}} <a class="old" v-if="item.oamount">({{item.oamount | toInt}})</a> 株</label>
              </h2>
              <h4>{{item.price | price}} <a class="old" v-if="(item.oprice && parseFloat(item.oprice) != 0) && (parseFloat(item.oprice) != parseFloat(item.price))">({{item.oprice | price}})</a></h4>
              <h3>{{item.total | price}} <a class="old" v-if="(item.ototal && parseFloat(item.total) != 0) && (parseFloat(item.ototal) != parseFloat(item.total))">({{item.ototal | price}})</a></h3>
              <div class="oper-case">
                <div class="oper-inner-case" v-if="item.st == 0 || item.st == 1 || item.st == 2 || item.st == 9">
                  <label class="state-modify" v-if="item.st == 0 || item.st == 9">供应商请求修改</label>
                  <label class="state-modify" v-if="item.st == 1">供应商请求修改</label>
                  <label class="state-remove" v-if="item.st == 2">供应商请求删除</label>
                  <div class="oper-btn-case">
                    <span class="agree-btn" @tap="agree(item)">同意</span>
                    <span class="disagree-btn" @tap="disagree(item)">拒绝</span>
                  </div>
                </div>
                <label v-if="item.st == 3 || item.st == 4 || item.st == 5 || item.st == 10">您已确定</label>
                <label class="dis-agree" v-if="item.st == 6 || item.st == 7 || item.st == 8 || item.st == 11">您已拒绝</label>
              </div>
            </div>
          </li>
        </ul>
      </ul>
    </scroller>
	  <!--<footer class="btn-case" @tap="save">确定发货</footer>-->
  
    <masker-dialog size="310" :show="isOpen" @closeHandler="close" :force="true">
      <div class="reason-case">
        <header>拒绝理由<span class="iconfont icon-close" @tap="close"></span></header>
        <div class="body-case auto-fill">
          <div class="category-info-case">
            <div class="left">{{currCategory.ctname}}</div>
            <div class="right auto-fill">
              <label>装车数量：{{currCategory.amount | toInt}} 株</label>
              <label>单价：{{currCategory.price | price}} 元</label>
              <label>总价：{{currCategory.total | price}} 元</label>
            </div>
          </div>
          <div class="reason">
            <input-area v-model="currCategory.reason" maxlength="50" placeholder="请填写您拒绝的原因" />
          </div>
        </div>
        <footer>
          <button @tap="noagree">确定拒绝</button>
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
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import AddressBo from '@/model/bo/Address'
  import DriverBo from '@/model/bo/Driver'
  import imageLoader from '@/components/comm/ImageLoader'
	import sliderBlocker from '@/components/comm/SliderBlocker'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  import inputArea from '@/components/comm/InputArea'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('myAcceptOrderDetail', 'pop-in', 300, () => {
					this.search()
				})
			})

			window.addEventListener('setAddress', (addr) => {
				this.order.address = addr.detail.prov + addr.detail.city + addr.detail.addr
				this.order.gainer = addr.detail.gainer
				this.order.gainertel = addr.detail.gainertel
				this.order.addrid = addr.detail.addrid
				this.order.tocityid = addr.detail.cityid
				this.order.addrid = addr.detail.addrid
			})
  
      window.addEventListener('setDriver', (driver) => {
        this.order.verouteid = driver.detail.verouteid
        this.order.plateno = driver.detail.plateno
        this.order.drivername = driver.detail.drivername
        this.order.drivertel = driver.detail.drivertel
      })
  
      window.addEventListener('setExaminers', (params) => {
        this.setExaminers(params.detail.users)
      })
    },
    
    components: {
      maskerDialog,
      scroller,
      normalLayout,
			normalHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			sliderBlocker,
      inputArea
    },

    data(){
      return {
        loaded: false,
				order: {
					tradeno: '',
          items: []
				},
        currCategory: {},
        isOpen: false,
        flows: [
          {name: '待发货', code: '037002', chose: false},
          {name: '待验收', code: '037003', chose: false},
          {name: '待结款', code: '037004', chose: false},
          {name: '结束', code: '037005', chose: false}
        ],
				supplier: {}
      }
    },
    
    computed: {
			carNums(){
				if(this.order.plateno && this.order.plateno.length == 7){
					return this.order.plateno.substring(1).split('')
        }
        return Array(6)
      },

      carProvince(){
				if(this.order.plateno && this.order.plateno.length == 7){
					return this.order.plateno.substring(0, 1)
				}
				return '浙'
      }
    },
    
    mounted(){},
    
    methods: {
      close(){
        this.isOpen = false
      },
  
      setExaminers(users){
        this.order.examiners = users
      },
  
      choseExaminer(examiner){
        examiner.issnag = (examiner.issnag == 0) ? '1' : '0'
      },
  
      modifyExaminers(){
        plus.webview.create(config.CDN_ADDRESS + '/examiners', 'examiners', {}, {
          tradeid: this.order.tradeid
        })
      },
  
      disagree(category){
        this.isOpen = true
        this.currCategory = category
      },
      
      noagree(){
        if(!utils.ruleMust(this.currCategory.reason)){
          utils.toast('请填写拒绝理由', 2000, 'FAILED')
          return ;
        }
        utils.confirm('确定拒绝该品类', () => {
          service('agreeOrNagtive', {
            tradeid: this.order.tradeid,
            invoiceid: this.order.invoiceid,
            purchaserid: this.order.purchaserid,
            userid: utils.getLocalUser().userid,
            items: [{
              itemid: this.currCategory.itemid,
              st: this.currCategory.st,
              resp: 0,
              reason: this.currCategory.reason
            }]
          }, rs => {
            this.isOpen = false
            utils.toast('操作成功')
            rs.forEach(item => {
              if(item.itemid == this.currCategory.itemid){
                this.currCategory.st = item.st
              }
            })
          })
        })
      },
      
      agree(category){
        mui.confirm('确定该品类的装车信息么？', '确认同意', ['否','是'], e => {
          if(e.index = 1){
            service('agreeOrNagtive', {
              tradeid: this.order.tradeid,
              invoiceid: this.order.invoiceid,
              purchaserid: this.order.purchaserid,
              userid: utils.getLocalUser().userid,
              items: [{
                itemid: category.itemid,
                st: category.st,
                resp: 1,
                reason: ''
              }]
            }, rs => {
              utils.toast('操作成功')
              rs.forEach(item => {
                if(item.itemid == category.itemid){
                  category.st = item.st
                }
              })
            })
          }
        })
      },
      
    	save(){
    		let order = this.order
    		service('saveTradeOrder', {
					tradeid: order.tradeid,
					invoiceid: order.invoiceid,
					fromcityid: order.fromcityid,
					tocityid: order.tocityid,
					verouteid: order.verouteid,
					addrid: order.addrid,
					drivername: order.drivername,
					drivertel: order.drivertel,
					trucktype: order.trucktype,
					plateno: order.plateno,
					sender: order.sender,
					sendertel: order.sendertel,
					gainer: order.gainer,
					gainertel: order.gainertel,
					address: order.address,
					carriage: order.carriage,
					paytime: order.paytime,
					remark: order.remark
		    }, rs => {

		    })
	    },

			search(){
			  let order = plus.webview.currentWebview().order
        this.supplier = order.supplier
				service('getOrderDetail', {
					tradeid: order.tradeid,
					invoiceid: order.invoiceid
        }, rs => {
					let order = rs
          rs.items.forEach(category => {
            let st = category.st
            if(st == 0 || st == 1 || st == 2){
              category.stname = '等待确认'
            }else if(st == 3 || st == 4 || st == 5){
              category.stname = '可发货'
            }else{
              category.stname = '对方拒绝'
            }
          })
          this.flows.forEach(item => {
            item.chose = (item.code <= order.status)
          })
          if(order.examiners && order.examiners.length > 0){
					  order.examiners.forEach(examiner => {
              examiner.chose = true
            })
          }
					this.order = order
          this.$nextTick(() => {
					  this.loaded = true
          })
				})
			},
  
      openAddrPage(){
        plus.webview.create(config.CDN_ADDRESS + '/addresses', 'addresses', {}, {
					addrid: this.order.addrid,
          openerId: 'myOrderDetail'
        })
      },
  
      openDriverPage(){
        plus.webview.create(config.CDN_ADDRESS + '/drivers', 'drivers', {}, {
					verouteid: this.order.verouteid
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .accept-goods-page{
    @include box-vert-left-top;
    position: relative;
  
    .order-detail-case{
      @include box-vert-left-top;
      position: relative;
      overflow: hidden;
      height: 100%;
      margin-top: 50px;
      background: $normalBgColor;

      .supplier-case{
        @include box-hori-left-middle;
        height: 55px;
        background: #fff;
        margin-bottom: 1px;
        padding: 0 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, .06);

        .supplier-user-case{
          width: 40px;
          height: 40px;
          border-radius: 25px;
        }

        h3{
          height: auto;
          color: #333;
          margin-left: 10px;

          .icon-phone{
            color: #787878;
          }
        }
      }
    
      ul{
        @include box-vert-left-top;
        position: relative;
        height: auto;
      
        .detail-case{
          @include box-vert-left-top;
          padding: 10px;
          height: auto;
          background: #fff;
          color: #666;
        
          span{
            font-size: 14px;
          }
  
          h2{
            @include box-hori-left-middle;
            font-size: 24px;
            padding: 5px 0 7px;
            font-weight: 300;
            color: #f85959;
    
            &::before{
              content: '总金额';
              font-size: 14px;
              padding: 6px 5px 0 0;
            }
    
            &::after{
              content: '元';
              font-size: 14px;
              padding: 6px 0 0 3px;
            }
          }
          
          address{
            color: #999;
            font-style: normal;
            font-size: 12px;
          }
          
          h3{
            font-size: 12px;
            color: #999;
            padding: 6px 0;
          }
  
          .state{
            @include box-vert-left-middle;
            width: 70px;
            margin-top: 20px;
            height: 50px;
            font-weight: bold;
            position: absolute;
            top: 25px;
            right: 0;
            
            h3{
              height: 16px;
              color: #666;
              margin-bottom: 10px;
              margin-left: -5px;
              font-weight: bold;
            }
    
            h4{
              @include box-hori-left-middle;
              padding-left: 10px;
              height: 25px;
              position: relative;
              
              i{
                width: 9px;
                height: 9px;
                border-radius: 6px;
                background: #fff;
                border: solid 1px #e1e1e1;
                position: absolute;
                left: -5px;
                top: 8px;
  
                &.chose2-true{
                  border-color: #008de1;
                }
              }
              
              &.chose-true{
                color: #008de1;
                font-weight: bold;
                font-size: 12px;
                border-left: solid 1px #008de1;
              }
              &.chose-false{
                color: #aaa;
                font-size: 10px;
                border-left: solid 1px #dedede;
              }
            }
          }
        }
      
        .reciver-case{
          @include box-vert-left-middle;
          height: auto;
          background: #fff;
          margin: 1px 0 0 0;
          overflow: hidden;
          padding-bottom: 5px;
          
          .examiner-case{
            @include box-vert-left-top;
            height: auto;
            overflow: hidden;
            
            .tip{
              @include box-hori-left-top;
              height: 20px;
              margin-top: -5px;
              padding: 0 12px;
              font-size: 12px;
              color: $textColor;
            }
            
            .examiner-item-case{
              @include box-hori-left-middle;
              padding: 10px 15px;
              height: auto;
    
              .photoer-case{
                width: 36px;
                height: 36px;
                border-radius: 9px;
              }
              
              .name{
                padding-left: 10px;
                color: #666;
                font-size: 16px;
                font-weight: bold;
              }
              
              .icon-phone{
                font-size: 21px;
                color: #999;
              }
              
              .icon-check{
                @include box-hori-center-middle;
                width: 24px;
                padding-top: 2px;
                height: 24px;
                font-size: 16px;
                border-radius: 24px;
  
                &.icon-check-true{
                  background: #008de1;
                  color: #fff;
                }
                &.icon-check-false{
                  background: #dedede;
                  color: transparent;
                }
              }
            }
          }
        }
      
        .title{
          height: 50px;
          line-height: 50px;
          margin-bottom: 1px;
          background: #fff;
          padding: 0 12px;
          color: #666;
          font-size: 16px;
          font-weight: bold;
          position: relative;
          width: 100%;
          
          .modify-txt{
            @include box-hori-center-middle;
            width: auto;
            position: absolute;
            height: 50px;
            font-size: 12px;
            color: #a0a0a0;
            right: 10px;
            top: 0;
            padding-right: 14px;
            
            .icon-right-arr{
              font-size: 18px;
              height: 50px;
              width: 16px;
              right: 0;
              top: 0;
              color: #999;
              position: absolute;
            }
          }
        }
      
        .items-case{
          @include box-vert-left-top;
          height: auto;
          min-height: 80px;
          margin-top: 10px;
          padding: 0 8px 15px;

          .category-tip-case{
            @include box-hori-center-top;
            height: 32px;
            color: $textColor;
            font-size: 12px;
          }
  
          .category-item-case{
            @include box-hori-left-top;
            margin-bottom: 8px;
            padding: 8px;
            background: #fff;
            border-radius: 9px;
    
            .info-case{
              @include box-vert-left-top;
              height: auto;
              padding: 2px 2px 0 6px;
              position: relative;
      
              h2{
                font-size: 16px;
                color: #666;
                font-weight: bold;
        
                label{
                  color: #999;
                  font-size: 12px;
                  padding-left: 10px;
                  font-weight: normal;
                }
              }
      
              h3{
                @include box-hori-left-middle;
                color: $red;
                font-size: 20px;
                margin-top: 5px;
                font-weight: 300;
        
                &::before{
                  font-weight: normal;
                  content: '总价(元)';
                  font-size: 12px;
                  padding: 4px 3px 0 0;
                }
              }
              
              h4{
                @include box-hori-left-middle;
                margin-top: 8px;
                color: $red;
                font-size: 18px;
                font-weight: 300;
  
                &::before{
                  font-weight: normal;
                  content: '单价(元)';
                  font-size: 12px;
                  padding: 3px 3px 0 0;
                }
              }
  
              .old{
                font-size: 14px;
                color: #aaa;
                text-decoration: line-through #aaa;
                margin-left: 5px;
              }
      
              .oper-case{
                @include box-vert-right-middle;
                width: auto;
                height: 100%;
                position: absolute;
                top: 0;
                right: 5px;
                font-size: 14px;
                font-weight: bold;
                color: #008de1;
                text-align: center;
                
                .dis-agree{
                  color: #f85959;
                }
                
                .oper-inner-case{
                  @include box-vert-right-middle;
                  height: auto;
  
                  .state-remove{
                    color: #f85959;
                  }
  
                  .state-modify{
                    color: #008de1;
                  }
                  
                  .oper-btn-case{
                    @include box-hori-right-middle;
                    margin-top: 8px;
                    font-size: 12px;
  
                    .agree-btn{
                      @include box-hori-center-middle;
                      width: auto;
                      padding: 0 15px;
                      border: solid .5px #008de1;
                      border-radius: 2px;
                      color: #008de1;
                      height: 24px;
                      
                      &:active{
                        background: #008de1;
                      }
                    }
  
                    .disagree-btn{
                      @include box-hori-center-middle;
                      width: auto;
                      padding: 0 15px;
                      background: #f85959;
                      border-radius: 2px;
                      color: #fff;
                      height: 24px;
                      margin-left: 5px;
    
                      &:active{
                        opacity: .8;
                      }
                    }
                  }
                }
              }
            }
    
            .category-img{
              width: 50px;
              height: 50px;
            }
          }
        }
      
        .remark-case{
          @include box-hori-left-middle;
          height: auto;
          padding: 10px 10px 10px 15px;
          min-height: 50px;
          background: #fff;
          margin-top: 1px;
          color: #666;
        
          label{
            width: 48px;
          }
        
          .remark{
            height: auto;
            color: #999;
          }
        }
      
        .icon-right-arr{
          @include box-vert-center-middle;
          color: #ccc;
          height: 100%;
          width: 24px;
          font-size: 24px;
        }
      }
    }

	  .btn-case{
		  @include box-hori-center-middle;
		  color: #fff;
		  height: 50px;
		  background: #008de1;
		  font-size: 18px;
	  }
  }
  
  .reason-case{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    background: #fff;
    
    header{
      @include box-hori-center-middle;
      height: 50px;
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      color: #666;
      background: #fff;
      border-bottom: solid 1px #f1f1f1;
      
      .icon-close{
        @include box-vert-center-middle;
        font-size: 32px;
        color: #999;
        font-weight: normal;
        position: absolute;
        right: 0;
        top: 0;
        width: 36px;
        height: 50px;
      }
    }
    
    .body-case{
      @include box-vert-left-top;
      padding: 0 10px;
      
      .category-info-case{
        @include box-hori-left-middle;
        height: auto;
        padding: 10px 0;
        
        .left{
          text-align: center;
          height: auto;
          width: 100px;
          font-size: 16px;
          color: #666;
          font-weight: bold;
        }
        
        .right{
          @include box-vert-left-middle;
          height: auto;
          border-left: solid 1px #f1f1f1;
          padding-left: 10px;
          
          label{
            height: auto;
            padding: 1px 0;
            color: $textColor;
          }
        }
      }
      
      .reason{
        height: 110px;
      }
    }
    
    footer{
      @include box-hori-center-top;
      height: 52px;
      padding: 0 10px;
      
      button{
        height: 42px;
        width: 100%;
        background: $red;
        border-radius: 5px;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        text-align: center;
      }
    }
  }
</style>
