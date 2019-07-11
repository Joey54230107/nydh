<template>
  <normal-layout class="accept-goods-page" :loaded="loaded">
    <error-pop :msg="errMsg" />
    <normal-header title="验收任务所在订单详情" />
    <scroller class="order-detail-case auto-fill">
      <div class="order-slider">
        <div class="ul">
          <!--订单基本信息, 包括订单号, 发货地址, 预付款, 运费-->
          <ul class="border-radius-case">
            <li class="detail-case">
              <span>订单编号: {{order.tradeno}}</span>
              <h3>创建日期：{{order.createtime | toTime('-')}}</h3>
              <h2>{{order.paytotal | price}}</h2>
            </li>
            <li class="addr-case">
              <address class="auto-fill">
                <h4>{{order.address}}</h4>
                <h5>联系单位：{{order.gainer}}&nbsp;&nbsp;{{order.gainertel}}</h5>
              </address>
            </li>
            <li class="money-case">
              <label>预付款：</label>
              <a class="money-text auto-fill">{{order.paytype ? ('预付' + order.firstpay + '元、' + order.paytypestr) : ''}}</a>
            </li>
            <li class="money-case">
              <label>运费(元)：</label>
              <input type="text" v-model="order.carriage" readonly="readonly" class="auto-fill" />
            </li>
          </ul>

          <!--工程公司验收人列表-->
          <ul class="border-radius-case">
            <li class="reciver-case">
              <h3 class="title">验收人信息</h3>
              <div class="examiner-case">
                <div class="examiner-item-case" v-for="examiner in order.examiners">
                  <image-loader :src="examiner.url" class="photoer-case" :defaultCls="'photo-' + ((examiner.sex == '025001') ? 'man' : 'woman') + '-case'" />
                  <label class="name auto-fill">{{examiner.name}}</label>
                  <span class="status-case">{{examiner.status}}</span>
                </div>
              </div>
            </li>
          </ul>

          <!--订单车辆信息-->
          <ul class="border-radius-case">
            <li class="title">车辆信息</li>
            <li class="carno-case">
              <div class="carno-inner-case auto-fill">
                <h4>司机姓名: <label>{{order.drivername || '尚未填写'}}</label></h4>
                <h4>司机电话: <label>{{order.drivertel || '尚未填写'}}</label></h4>
                <div class="plateno-case">
                  <span class="boxer privince-boxer">{{carProvince}}</span>
                  <span class="boxer num-case" v-for="item in carNums">{{item}}</span>
                </div>
              </div>
            </li>
          </ul>
  
          <div class="remark-case">
            <label>备注：</label>
            <div class="remark auto-fill">{{order.remark}}</div>
          </div>

          <!--订单中的品类列表-->
          <div class="items-case" v-if="order.items.length > 0">
            <span class="tipper">有{{order.items.length}}种品类待验收</span>
            <div class="category-item-case" v-for="(item, idx) in order.items">
              <div class="up-case">
                <div class="info-case auto-fill">
                  <h2>
                    {{item.ctname}}
                    <label>装车数：{{item.amount | toInt}}株</label>
                  </h2>
                  <h4>{{item.price | price}}</h4>
                  <h3>{{item.total | price}}</h3>
                </div>
                <button class="examin-btn go-examin" @tap.stop="examin(item)" v-if="order.status == '037004' && (!item.examine.remark)">去验收</button>
                <button class="examin-btn" @tap.stop="examin(item)" v-if="order.status == '037004' && item.examine.remark">修改验收</button>
              </div>
              <div class="down-case status-no" v-if="item.examine.isaccept == '0'">
                <label>验收不通过：</label>
                <span class="auto-fill reason-case">
                  {{item.examine.remark}}
                </span>
              </div>
              <div class="down-case status-pass" v-if="item.examine.isaccept == '1'">
                <label>验收通过：</label>
                <span class="auto-fill reason-case">
                  {{item.examine.remark}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <footer class="btn-case" v-if="tastStatus == '1' && order.status == '037003' && order.checkstatus == ''">
      <span class="comm-btn comm-blue-btn publish" @tap.stop="startTask">开始验收</span>
    </footer>
    <footer class="btn-case" v-if="order.status == '037004' && order.checkstatus == '043001'">
      <span class="comm-btn comm-blue-btn publish" @tap.stop="publish">发布验收结果</span>
    </footer>
  
    <masker-dialog :size="(height - 15)" :show="isOpen" @closeHandler="close" :force="true">
      <div class="list-case">
        <header>验收品类<span class="iconfont icon-close" @tap="close"></span></header>
        <div class="body-case auto-fill">
          <div class="list-item-case" v-for="(item, idx) in order.items">
            123
          </div>
        </div>
        <footer>
          <button>确定拒绝</button>
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
  import {toInt, price} from '@/plugins/filter/custom'
	import errorPop from '@/components/comm/ErrorPop'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('taskOrderDetail', 'pop-in', 300)
			})
  
      window.addEventListener('examHandler', (e) => {
        this.examHandler(e.detail)
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
			errorPop
    },

    data(){
      return {
        loaded: false,
				order: {
					tradeno: '',
          items: []
				},
        isOpen: false,
        currCategory: {},
				errMsg: '',
        height: window.screen.availHeight,
        workkind: '',
        tastStatus: ''
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.workkind = plus.webview.currentWebview().workkind
        this.tastStatus = plus.webview.currentWebview().status
				this.search()
			})
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
    
    methods: {
      examHandler(params){
        console.log(params)
      },
      
      startTask(){
        utils.confirm('确定开始验收', () => {
          let win = plus.webview.currentWebview()
          service('startExam', {
            uuid: this.order.uuid,
            tradeid: this.order.tradeid,
            purchaserid: this.order.purchaserid,
            userid: utils.getLocalUser().userid,
            invoiceid: this.order.invoiceid,
            
          }, rs => {
            utils.toast('操作成功，请开始验收')
            this.order.status = '037004'
          })
        })
      },
  
      publish(){
        let categorys = this.order.items, rs = true
        categorys.forEach(category => {
          if(!category.examine.remark){
            rs = false
          }
        })
        if(!rs){
          utils.toast('所有品类均需验收才能发布结果', 2000, 'FAILED')
          return ;
        }
        utils.confirm('确定发布验收结果', () => {
          service('publishExam', {
            tradeid: this.order.tradeid,
            invoiceid: this.order.invoiceid,
            purchaserid: this.order.purchaserid,
            supplierid: this.order.supplierid,
            userid: utils.getLocalUser().userid
          }, rs => {
            utils.toast('发布成功')
          })
        })
      },
      
      close(){
        this.isOpen = false
      },
  
			search(){
			  let win = plus.webview.currentWebview()
				service('getExamOrderDetail', {
					tradeid: win.tradeid
        }, rs => {
					console.log(JSON.stringify(rs))
					let order = rs, status = ''
          order.carriage = price(order.carriage)
          order.firstpay = price(order.firstpay)
          order.examiners && order.examiners.forEach(examiner => {
            switch(examiner.issnag){
              case 0: {
                examiner.status = '尚未响应'
                break ;
              };
              case 1: {
                examiner.status = '已接受'
                break ;
              };
              case 2: {
                examiner.status = '已放弃'
                break ;
              }
            }
          })
					this.order = order
          this.$nextTick(() => {
            this.loaded = true
          })
				})
			},
  
      examin(category){
        plus.webview.create(config.CDN_ADDRESS + '/categoryExamin', 'categoryExamin', {}, {
          category,
          tradeid: this.order.tradeid
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
    height: 100%;
    background: #f0f0f0;
    padding-top: 50px;
    padding-bottom: 56px;
  
    .order-detail-case{
      @include box-vert-left-top;
      position: relative;
      overflow: hidden;

      .order-slider{
        @include box-vert-left-top;
        height: auto;
      }
    
      .ul{
        @include box-vert-left-top;
        position: relative;
        height: auto;

        .border-radius-case{
          @include box-vert-left-top;
          overflow: hidden;
          height: auto;
          background: #fff;
          margin-bottom: 10px;
        }
      
        .detail-case{
          @include box-vert-left-top;
          padding: 10px 10px 5px;
          height: auto;
          background: #fff;
          color: #666;
          position: relative;
        
          span{
            font-size: 14px;
          }

          h2{
            @include box-hori-left-middle;
            font-size: 24px;
            padding: 0 0 7px;
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
        }
      
        .addr-case{
          @include box-hori-left-middle;
          padding: 10px 0;
          height: auto;
          min-height: 50px;
          background: #fff;
          border-top: solid 1px #f0f0f0;
        
          .icon-position3{
            @include box-vert-right-middle;
            width: 28px;
            height: auto;
            font-size: 21px;
            color: #008de1;
            margin-top: 1px;
          }
        
          address{
            @include box-vert-left-middle;
            color: #999;
            font-style: normal;
            padding: 0 10px;
          
            h4{
              @include box-hori-left-middle;
              height: 25px;
              color: #666;
              font-size: 16px;
            }
            h5{
              @include box-hori-left-middle;
              height: 25px;
              color: #999;
            }
          }
        }

        .money-case{
          @include box-hori-left-middle;
          padding: 0 0 0 10px;
          height: auto;
          min-height: 50px;
          background: #fff;
          border-top: solid 1px #f0f0f0;

          label{
            width: 65px;
            color: #999;
            text-align: right;
          }
          
          input{
            height: 30px;
            color: #666;
            font-size: 16px;
            padding: 0 5px;
          }
          
          .money-text{
            padding: 0 6px;
            color: #666;
          }
        }
      
        .reciver-case{
          @include box-vert-left-middle;
          height: auto;
          background: #fff;
          padding: 0 0 5px 0;

          .examiner-case{
            @include box-vert-left-top;
            height: auto;
            overflow: hidden;
            margin-top: -10px;

            .examiner-item-case{
              @include box-hori-left-middle;
              padding: 10px 15px;
              height: auto;
              
              .status-case{
                color: $textColor;
              }

              .photoer-case{
                width: 36px;
                height: 36px;
                border-radius: 7px;
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
            }
          }
        }
      
        .title{
          @include box-hori-left-middle;
          height: 50px;
          line-height: 50px;
          margin-bottom: 1px;
          background: #fff;
          padding: 0 12px;
          color: #666;
          font-size: 16px;
          font-weight: bold;

          span{
            color: #999;
            font-size: 12px;
            font-weight: normal;
            margin-left: 10px;
          }
        }
      
        .carno-case{
          @include box-hori-left-middle;
          margin: 0 0 10px 0;
          height: auto;
          background: #fff;
        
          .carno-inner-case{
            @include box-vert-left-middle;
            //margin-top: 10px;
            padding: 0 0 10px 10px;
          
            h4{
              height: auto;
              color: #999;
              padding: 8px 5px;
            
              label{
                color: #999;
              }
            }
          
            .plateno-case{
              @include box-hori-left-middle;
              height: auto;
              width: 100%;
              margin-top: 10px;
            }
          
            .boxer{
              @include box-vert-center-middle;
              width: 12%;
              height: 48px;
              border: dashed 1px #74baf3;
              border-radius: 4px;
              margin: 0 3px;
              font-size: 18px;
              color: #666;
              font-weight: bold;

              &.privince-boxer{
                color: #008de1;
                font-weight: bold;
              }
            }
          }
        }
      
        .items-case{
          @include box-vert-left-top;
          height: auto;
          min-height: 80px;
          overflow: hidden;
          padding: 0 8px;
          
          .tipper{
            @include box-hori-center-middle;
            height: auto;
            color: $textColor;
            padding-bottom: 10px;
          }
          
          .category-item-case{
            @include box-vert-left-middle;
            margin-bottom: 10px;
            background: #fff;
            border-radius: 9px;
            overflow: hidden;
            
            .up-case{
              @include box-hori-left-middle;
  
              .info-case{
                @include box-vert-left-top;
                height: auto;
                padding: 10px 10px 8px 14px;
                position: relative;
                background: #fff;
    
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
                  color: $textLessColor;
                  font-size: 18px;
                  margin-top: 5px;
                  font-weight: 300;
      
                  &::before{
                    font-weight: normal;
                    content: '总价(元)';
                    font-size: 12px;
                    padding: 3px 3px 0 0;
                  }
                }
    
                h4{
                  @include box-hori-left-middle;
                  margin-top: 8px;
                  color: $textLessColor;
                  font-size: 18px;
                  font-weight: 300;
      
                  &::before{
                    font-weight: normal;
                    content: '单价(元)';
                    font-size: 12px;
                    padding: 3px 3px 0 0;
                  }
                }
              }
  
              .examin-btn{
                width: auto;
                height: 28px;
                padding: 0 15px;
                border: solid .5px $blue;
                color: $blue;
                font-size: 12px;
                font-weight: bold;
                margin-right: 15px;
    
                &:active{
                  background: $blue;
                }
                
                &.go-examin{
                  background: $blue;
                  color: #fff;
                }
              }
            }
            
            .down-case{
              @include box-hori-left-middle;
              height: 40px;
              border-top: solid 1px $normalBgColor;
              padding: 0 12px;
              font-size: 12px;
              
              &.status-no{
                color: $red;
              }
              &.status-pass{
                color: $blue;
              }
              
              label{
                width: auto;
                font-weight: bold;
              }
              
              .reason-case{
                padding: 0 10px 0 0;
              }
            }
          }
        }
      
        .remark-case{
          @include box-hori-left-middle;
          height: auto;
          padding: 10px 0 10px 10px;
          min-height: 50px;
          background: #fff;
          color: $textColor;
          margin-top: 0;
          margin-bottom: 10px;
        
          label{
            width: 50px;
          }
        
          .remark{
            height: auto;
            color: $textLessColor;
          }
        }
      }
    }

	  .btn-case{
		  @include box-hori-center-middle;
		  color: #fff;
		  position: fixed;
		  height: 56px;
      bottom: 0;
      left: 0;
      z-index: 10;
		  background: #fff;
		  font-size: 18px;
      box-shadow: -10px 0 10px rgba(0, 0, 0, .1);
      padding: 0 10px;

      .publish{
        width: 100%;
      }
	  }
  }

  .list-case{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    border-radius: 7px 7px 0 0;
    overflow: hidden;
  
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
      padding: 10px;
      
      .list-item-case{
        @include box-hori-left-middle;
        background: #fff;
        border-radius: 9px;
        height: 100px;
        padding: 10px 15px;
      }
    }
  
    footer{
      height: 50px;
      padding: 0 20px;
    
      button{
        height: 42px;
        width: 100%;
        background: #008de1;
        border-radius: 3px;
        color: #fff;
        font-size: 16px;
        text-align: center;
      }
    }
  }
</style>
