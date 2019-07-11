<template>
  <normal-layout class="order-detail-page" :loaded="loaded">
    <reported-order-header title="查看供应商报价信息" @removeHandler="removeCategory" />
    <div class="detail-container auto-fill">
      <scroller class="detail-inner-container">
        <ul class="order-case" v-if="order.uuid">
          <li class="guide-case">
            <span class="iconfont icon-order"></span>
            <div class="order-info-case auto-fill">
              <label>报价单编号: {{order.orderno}}</label>
              <label>创建时间: {{order.createtime}}</label>
            </div>
          </li>
	        <li class="order-info-row">
		        <label>报价单标题：</label>
		        <span class="order-title">{{order.title}}</span>
	        </li>
          <li class="description-case" v-if="order.categorys.length > 0">
            <label>当前报价单中共有 {{order.categorys.length}} 个品类</a></label>
          </li>
          <li class="order-list-case" v-if="order.categorys.length > 0">
            <div class="order-inner-case" v-for="item in order.categorys" @tap="categoryDetail(item)">
              <div class="info-case">
                <label class="auto-fill">{{item.ctname}}</label>
                <span class="cateyory-num">数量: {{item.amount || 0}}</span>
              </div>
              <ul class="supplier-case auto-fill">
                <li v-for="supplier in item.suppliers" class="supplier-photo-case" @tap.stop="openUserInfo(supplier.user)">
                  <span class="report-point iconfont icon-vip" v-if="supplier.user.isrealname == '1'"></span>
                  <image-loader :src="supplier.user.url" class="photo-case" :defaultCls="'photo-' + ((supplier.user.sex == '1') ? 'man' : 'woman') + '-case'" />
                </li>
                <li class="ellipsis-case">{{item.reportnum > 0 ? '有' + item.reportnum + '位供应商已报价' : '尚无供应商报价'}}</li>
              </ul>
            </div>
          </li>
          <li class="order-remark-row" style="margin-top:8px; margin-bottom:30px; height: auto;">
            <label>备注：</label>
            <span class="auto-fill order-remark">{{order.remark || '无'}}</span>
          </li>
        </ul>
      </scroller>
    </div>
    <footer class="footer-cargo-case iconfont icon-send" @tap="publish">&nbsp;&nbsp;确认报价请求</footer>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import reportedOrderHeader from '@/components/comm/header/ReportedOrderHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import OrderBo from '@/model/bo/Order'
  import CategoryBo from '@/model/bo/Category'
  import SupplierBo from '@/model/bo/Supplier'
  import comboxMenu from "@/components/comm/ComboxMenu"
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import radioBtn from '@/components/comm/Radio'
  import imageLoader from '@/components/comm/ImageLoader'
  
  export default {
    components: {
      scroller,
      normalLayout,
			reportedOrderHeader,
      comboxMenu,
      radioBtn,
      imageLoader
    },
    
    mounted(){
			mui.plusReady(() => {
				let state = plus.webview.currentWebview().state, order = plus.webview.currentWebview().order
				this.detail(order, state)
        this.user = utils.getLocalUser()
			})
    },
    
    data(){
      return {
        loaded: true,
        order: {
        	categorys: []
        },
        orderState: null,
        currentCategory: null,
        title: '',
        user: {}
      }
    },
    
    methods: {
    	detail(order, state){
        service('orderDetail', {
          orderid: order.orderid,
          st: state
        }, rs => {
          let order = new OrderBo(rs)
          rs.items && rs.items.forEach(category => {
            let _category = new CategoryBo(category)
            CategoryBo.setSimpleSuppliers.call(_category)
            OrderBo.addCategory.call(order, _category)
          })
          this.order = order
					utils.masker()
					plus.webview.show('reportedOrder', 'pop-in', 200)
        })
      },
  
      openUserInfo(user){
    	  console.log(user.userid)
    	  utils.openUserCard(user.userid, 0)
      },
  
      publish(){
    	  mui.confirm('您确定要向该报价单中所有您选择的供应商发送需求确定请求么？', '发送请求', ['否','是'], e => {
    	    if(e.index == 1){
    	    	console.log(JSON.stringify({
							userid: this.user.userid,
							orderid: this.order.orderid
						}))
    	      service('publishReportedCategorySuppliers', {
              userid: this.user.userid,
              orderid: this.order.orderid
            }, rs => {
    	      	console.log(JSON.stringify(rs))
            })
          }
        })
      },
  
      categoryDetail(category){
        utils.masker(true)
      	this.currentCategory = category
        plus.webview.create(config.CDN_ADDRESS + '/reportedCategory', 'reportedCategory', {
          'background': 'transparent'
        }, {
          category,
          flag: 1
        })
      },
  
      removeCategory(){
      	this.order = new OrderBo()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .order-detail-page{
    @include box-vert-left-top;
    height: 100%;
    background: #f1f1f1;

    .detail-container{
      padding: 50px 0;
      height: 100%;
      position: relative;

      .detail-inner-container{
        @include box-vert-left-top;
        position: relative;
        overflow: hidden;
      }

      .order-case{
        @include box-vert-left-top;
        height: auto;
        overflow: visible;
  
        .guide-case{
          @include box-hori-left-middle;
          height: auto;
          background: rgba(255, 255, 255, 1);
          color: #999;
          font-size: 16px;
          padding: 10px 15px 10px 5px;
          margin-bottom: 1px;
    
          .icon-order{
            width: 48px;
            line-height: 46px;
            height: 48px;
            //border: solid 1px #fff;
            text-align: center;
            font-size: 28px;
            margin: 0 5px 0 0;
            border-radius: 48px;
          }
    
          .order-info-case{
            @include box-vert-left-middle;
      
            label{
              height: 20px;
              font-size: 14px;
            }
          }
        }
        
        .description-case{
          @include box-hori-center-middle;
          padding: 8px 10px 0 10px;
          height: auto;

          label{
            width: auto;
            padding: 0 20px;
            height: 20px;
            background: url("../../../../assets/img/yellow.png") top left repeat-y;
            border-radius: 20px;
            line-height: 20px;
            color: #644f1b;
          }
        }

        .order-remark-row{
          @include box-hori-left-top;
          height: 50px;
          background: rgba(255, 255, 255, 1);
          padding: 10px;
          margin-bottom: 1px;

          .order-remark{
            padding-left: 5px;
            color: #666;
            font-size: 12px;
          }
        }
        
        .order-info-row{
          @include box-hori-left-middle;
          height: 50px;
          background: rgba(255, 255, 255, 1);
          padding: 0 10px 0 10px;
          margin-bottom: 1px;

          .order-title{
            font-size: 16px;
          }
          
          label{
            width: auto;
            color: #565656;
          }
          
          .iconfont{
            width: 24px;
            text-align: left;
            font-size: 21px;
            color: #999;
            margin-top: 3px;
          }
          
          input{
            @include box-hori-left-middle;
            height: 30px;
            marign: 0 16px 0 10px;
            padding: 0 8px;
            font-size: 16px;
            background: transparent;
          }
          
          .radio-case{
            @include box-hori-right-middle;
            height: 100%;
          }
        }
        
        .order-list-case{
          @include box-vert-left-top;
          height: auto;
          margin-top: 10px;
          position: relative;
          overflow: visible;

          .order-inner-case{
            @include box-vert-left-middle;
            height: auto;
            background: #fff;
            padding: 0 2px 5px 10px;
            color: #666;
            position: relative;
            //margin-bottom: 1px;
            border-bottom: solid 1px #f1f1f1;

            &:last-child{
              border: none;
            }

            &:active{
              background: rgba(255, 255, 255, .7);
            }
  
            .info-case{
              @include box-hori-left-middle;
              height: 25px;
              padding: 12px 0 0 0;
              color: #333;
    
              .cateyory-num{
                width: auto;
                padding: 0 10px 0 0;
                color: #999;
                margin-top: -3px;
              }
    
              .icon-tag{
                color: #caad5f;
                font-size: 16px;
              }
            }
  
            .supplier-case{
              @include box-hori-left-middle;
              padding-top: 5px;
    
              .supplier-photo-case{
                width: 42px;
                height: 42px;
                border-radius: 40px;
                margin: 8px 5px 5px 0;
                overflow: visible;
                position: relative;
      
                .photo-empty-case{
                  background: url("../../../../assets/img/man.png") center center/cover no-repeat;
                }
      
                .photo-man-case{
                  border-radius: 100px;
                  background: url("../../../../assets/img/man.png") center center/cover no-repeat;
                }
                .photo-woman-case{
                  border-radius: 100px;
                  background: url("../../../../assets/img/woman.png") center center/cover no-repeat;
                }
      
                .photo-case{
                  width: 40px;
                  height: 40px;
                  border-radius: 36px;
                  overflow: hidden;
                }
      
                .report-point{
                  width: 16px;
                  height: 16px;
                  background: #ffb000;
                  border-radius: 16px;
                  position: absolute;
                  top: -3px;
                  right: 0;
                  font-size: 10px;
                  color: #fff;
                  line-height: 18px;
                  text-align: center;
                  z-index: 10;
                }
              }
    
              .more{
                line-height: 56px;
                height: 36px;
                color: #999;
                font-size: 18px;
              }
    
              .ellipsis-case{
                line-height: 45px;
                height: 36px;
                width: auto;
                margin-left: 5px;
                font-size: 14px;
              }
            }
            
            label{
              font-size: 18px;
            }
            
            .icon-right-arr{
              line-height: 144px;
              height: 80px;
              font-size: 30px;
              color: #aaa;
              text-align: right;
              position: absolute;
              right: 0;
              top: 0;
            }

            &:last-child{
              //border-bottom: solid 1px #d8d8d8;
            }
          }
        }
      }
    }

    .order-btn-case{
      @include box-hori-center-middle;
      height: 50px;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 500;

      .save-order{
        @include box-hori-center-middle;
        border-radius: 0;
        height: 50px;
        background: #74baf3;
        color: #fff;
        font-size: 16px;
      }
      .submit-order{
        @include box-hori-center-middle;
        border-radius: 0;
        height: 50px;
        //background: #E26660;
        background: #008de1;
        color: #fff;
        font-size: 16px;
      }
    }
  
    .footer-cargo-case{
      @include box-hori-center-middle;
      height: 50px;
      position: fixed;
      bottom: 0;
      z-index: 500;
      background: #008de1;
      left: 0;
      transition: background .3s;
      color: #fff;
      font-size: 18px;
    }
  }
</style>
