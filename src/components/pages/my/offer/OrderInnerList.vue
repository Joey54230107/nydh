<template>
  <div class="c-order-inner-page">
    <div v-if="orders.length > 0">
      <div class="p-order-inner-case">
        <ul class="list-case" :style="{'transform': transform}">
          <div class="tip-case"><span class="iconfont icon-lighter2"></span>未发布的报价单求购方和生意圈中是看不到的, 请尽快发布哦</div>
          <slider-block :id="'slider-' + idx" v-for="(order, idx) in orders" :item="order" :key="order.uuid" class="item-case" :sliderWidth="orderState == 2 ? '50' : '20'">
            <div class="item-container" @tap="detail(order)">
              <div class="empty-detail icon-more" @tap.stop="detail(order)" v-if="orderState == 2">创建发货单</div>
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
                <li class="right-case auto-fill" v-if="orderState == '0'">
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
                <li class="right-case auto-fill" v-if="orderState == '1'">
                  <div class="user-photos-case user-photo-confirmed-case">
                    <!--这里要改下后台接口，给出已报价的供应商的头像（之前给的是所有供应商前3个，无法判断是否已报价）-->
                    <label class="cupplier-tip" v-if="order.suppcount > 0">{{order.takingcount > 0 ? '已有' + order.takingcount + '人报价' : '尚无供应商报价'}}</label>
                  </div>
                </li>

                <!--已确认状态-->
                <li class="confirm-case auto-fill" v-if="orderState == '2'">
                  <h3>共有{{order.takingcount}}位供应商报价, 您选择了{{order.confirmcount}}人</h3>
                  <h2>总金额: <span class="iconfont icon-rmb"></span><label class="price">{{order.confirmtotal | price}}</label></h2>
                </li>
              </ul>
              <div class="editor-case"  v-if="orderState == '0'">
                <span class="iconfont icon-edit3"></span>
              </div>
              <div class="editor-case"  v-if="orderState != '0'">
                <span class="iconfont icon-right-arr"></span>
              </div>
            </div>
          </slider-block>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
	import config from '../../../../../config/address.js'
  import imageLoader from '@/components/comm/ImageLoader'
  import timeCounter from '@/components/comm/TimeCounter'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import OrderBo from '@/model/bo/Order'
  import sliderBlock from '@/components/comm/SliderBlocker'
  import sliderBtn from '@/components/comm/SliderButton'

	export default {
		components: {
      imageLoader,
      timeCounter,
			sliderBtn,
			sliderBlock
		},

    props: {
			orders: {
				type: Array
      },
			orderState: {
				type: [String, Number],
        default: 0
      }
    },
    
    data(){
			return {
				transform: 'translateX(0)',
        slidedRow: null
			}
		},

		methods: {
			userInfo(userid){
				utils.openUserCard(userid)
			},
      
      removeDetail(order, idx){
				let user = utils.getLocalUser()
        utils.confirm('您确定要删除该订单么？', () => {
          service('remove', {
            userid: user.userid,
            items: [{
              dt: '0',
              uuids: order.uuid
            }]
          }, rs => {
            utils.toast('删除成功!')
            this.orders.splice(idx, 1)
            this.$emit('removeHandler')
          })
        })
      },

			detail(order){
				plus.webview.create(config.CDN_ADDRESS + '/orderDetail', 'orderDetail', {}, {
          state: this.orderState,
          flag: 1,
          order
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
	@import '@/assets/style/main.scss';
  
  .c-order-inner-page{
    @include box-vert-left-top;
    transition: transform .3s, opacity .3s;
    height: auto;

    .p-order-inner-case{
      position: relative;
      padding: 0 0 8px 0;
      transition: transform .3s, opacity .3s;

      .list-case{
        @include box-vert-left-top;
        transition: transform .3s;

        .tip-case{
          @include box-hori-left-middle;
          height: 32px;
          background: #fff6cd;
          width: 100%;
          border-radius:5px;
          color: rgba(115, 91, 39, .8);
          padding: 0 10px 0 28px;
          font-size: 11px;

          .icon-lighter2{
            text-align: center;
            position: absolute;
            width: 28px;
            line-height: 32px;
            height: 32px;
            top: 0;
            font-size: 18px;
            left: 0;
            color: rgba(115, 91, 39, 1);
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
        }
  
        .item-container{
          @include box-vert-left-top;
          width: 100%;
          height: auto;
          overflow: visible;
          background: #fff;
          position: relative;
          padding-left: 2px;

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
            padding: 0 10px 10px 10px;
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
            
            &.user-photo-confirmed-case{
              @include box-vert-left-middle;
            }
          }
        }
      }
    }
  }
</style>
