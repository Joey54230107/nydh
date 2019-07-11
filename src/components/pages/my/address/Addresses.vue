<template>
  <normal-layout class="address-page" :loaded="loaded">
    <normal-header title="我的收货地址" menuText="添加地址" @menuHandler="create" icon="icon-plus2" />
    <div class="addr-inner-case auto-fill">
      <scroller class="addr-case" :status="status">
        <div class="no-data-case" slot="no-data">
          <h3>您还未添加任何送货地址</h3>
          <span class="create-btn" @tap="create">添加地址</span>
        </div>
        <div class="addr-list-case" v-if="addresses.length > 0">
          <slider-block @longTapHandler="showDefault" :id="'slider-' + idx" v-for="(addr, idx) in addresses" :item="addr" :key="addr.addrid" @scrollHandler="scrollHandler" class="addr-item-case" sliderWidth="25" :class="addr.remove ? 'addr-item-remove' : ''">
            <div class="default-case" v-if="addr.default"><span class="iconfont icon-check def-circle-case"><label>设为默认</label></span></div>
            <div class="addr-item-inner-case">
              <slider-btn class="remove-addr" confirmStr="确定删除" @handler="removeAddr(addr, idx)">删除</slider-btn>
              <span class="iconfont icon-position3"></span>
              <div class="addr-detail-case auto-fill" @tap="choseAddr(addr)">
                <h4>{{addr.prov}} {{addr.city}}</h4>
                <address>{{addr.addr}}</address>
                <h5 class="info text-ellipse">收货单位：{{addr.gainer}} &nbsp;| &nbsp;{{addr.gainertel}}</h5>
              </div>
              <div class="edit-case" @tap="detail(addr)">
                <div class="iconfont icon-edit"><label class="edit-text">编辑</label></div>
              </div>
            </div>
          </slider-block>
        </div>
      </scroller>
    </div>
  </normal-layout>
</template>

<script>
	import config from '../../../../../config/address.js'
	import utils from '@/plugins/utils'
	import UserBo from '@/model/bo/User'
	import comboxMenu from '@/components/comm/ComboxMenu'
  import service from '@/api/service'
  import imageLoader from '@/components/comm/ImageLoader'
  import normalHeader from '@/components/comm/NormalHeader'
	import normalLayout from '@/components/layout/Layout'
	import scroller from '@/components/comm/Scroller'
  import AddressBo from '@/model/bo/Address'
	import sliderBlock from '@/components/comm/SliderBlocker'
	import sliderBtn from '@/components/comm/SliderButton'

	export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('addresses', 'pop-in', 300, () => {
					this.search()
				})
			})
  
      window.addEventListener('refreshAddress', () => {
        this.search()
      })
    },

		data(){
			return {
        loaded: false,
				addresses: [],
        openerId: '',
        status: ''
			}
		},

		components: {
      imageLoader,
			normalLayout,
			scroller,
			sliderBlock,
			sliderBtn,
			normalHeader
		},

		methods: {
      search(){
        this.status = '1'
        let user = utils.getLocalUser()
				this.openerId = plus.webview.currentWebview().openerId
        service('getAddresses', {
          userid: user.userid
        }, rs => {
          let address = rs.items || []
        	this.loaded = true
          address.forEach(item => {
          	item.remove = false
            item.default = false
          })
          this.addresses = address
          this.status = this.addresses.length > 0 ? '2' : '0'
        }, err => {
          this.status = '0'
        })
      },

			showDefault(item){
      	//item.default = true
      },
      
      removeAddr(addr, idx){
				service('removeAddress', {
					userid: utils.getLocalUser().userid,
					uuids: addr.uuid
				}, rs => {
          addr.remove = true
          setTimeout(() => {
						this.addresses.splice(idx, 1)
						utils.toast('删除成功')
          }, 300)
				})
      },
      
      choseAddr(addr){
      	if(this.openerId == 'myOrderDetail'){
          let page = plus.webview.getWebviewById('myOrderDetail')
          if(page){
            mui.fire(page, 'setAddress', addr)
          }
          plus.webview.currentWebview().close('pop-out', 300)
        }
      },

			create(){
      	let addr = new AddressBo()
				plus.webview.create(config.CDN_ADDRESS + '/address', 'address', {}, {addr})
      },
      
      detail(addr){
        plus.webview.create(config.CDN_ADDRESS + '/address', 'address', {}, {addr})
      },

			scrollHandler(){

      }
		}
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';

  .address-page{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    position: relative;
    background: #f0f0f0;

    .addr-inner-case{
      @include box-hori-left-top;
      width: 100%;
      position: relative;
      overflow: hidden;
      padding: 10px;

      .addr-case{
        @include box-vert-left-top;
        margin-top: 50px;
        position: relative;

        .no-data-case{
          @include box-vert-center-middle;
          width: 100%;
          height: 100px;
          
          .create-btn{
            @include box-hori-center-middle;
            font-size: 16px;
            font-weight: bold;
            background: $blue;
            color: #fff;
            padding: 0 30px;
            border-radius: 5px;
            width: auto;
            height: 36px;
            margin-top: 30px;
            z-index: 10;
            
            &:active{
              opacity: .8;
            }
          }
          
          h3{
            @include box-hori-center-middle;
            text-align: center;
            line-height: 24px;
            width: 60%;
            height: auto;
            color: $textColor;
            font-size: 16px;
          }
        }

        .addr-list-case{
          @include box-vert-left-top;
          height: auto;

          .addr-item-case{
            @include box-hori-left-middle;
            height: auto;
            min-height: 50px;
            background: #dedede;
            margin-bottom: 8px;
            border-radius: 9px;
            position: relative;

            .default-case{
              @include box-hori-center-middle;
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, .65);
              z-index: 50;

              .def-circle-case{
                width: 40px;
                margin-left: -50px;
                height: 40px;
                background: rgba(255, 255, 255, .6);
                border-radius: 50px;
                line-height: 40px;
                text-align: center;
                font-size: 24px;
                color: #fff;
                position: relative;

                label{
                  @include box-hori-left-middle;
                  width: 70px;
                  height: 40px;
                  font-size: 16px;
                  top: 0;
                  color: rgba(255, 255, 255, .6);
                  position: absolute;
                  left: 50px;
                }
              }
            }

            .addr-item-inner-case{
              @include box-hori-left-middle;
              height: auto;
              min-height: 50px;
              padding: 8px;
              background: #fff;
              position: relative;

              .edit-case{
                @include box-vert-right-middle;
                width: 55px;
                height: 50px;

                .icon-edit{
                  @include box-hori-left-middle;
                  width: 100%;
                  height: auto;
                  font-size: 18px;
                  color: $textLessColor;
                  
                  .edit-text{
                    margin-left: 4px;
                    font-size: 14px;
                    padding-bottom: 2px;
                  }
                }
              }

              .remove-addr{
                @include box-vert-center-top;
                width: 25%;
                height: 100%;
                background: #fff;
                color: #f85959;
                font-weight: bold;
                padding-top: 32px;
                position: absolute;
                right: -25%;
                top: 0;
                font-size: 16px;

                &:active{
                  opacity: .8;
                }
              }
            }

            .chose-case{
              @include box-vert-center-middle;
              width: 50px;
              height: 100%;

              .icon-check{
                @include box-vert-center-middle;
                width: 30px;
                height: 30px;
                border-radius: 32px;

                &.icon-check-true{
                  color: #fff;
                  background: #008de1;
                }
                &.icon-check-false{
                  color: #999;
                  background: rgba(0, 0, 0, .1);
                }
              }
            }

            .icon-position3{
              width: 36px;
              height: auto;
              font-size: 24px;
              text-align: left;
              color: $blue;
              padding-left: 3px;
              padding-top: 2px;
            }

            .addr-detail-case{
              @include box-vert-left-top;
              height: auto;
              color: #454545;
              font-size: 14px;
              padding: 0 5px 0 0;
              //border-left: solid 1px #eee;

              h4{
                font-size: 18px;
                font-weight: bold;
                color: #666;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }

              address{
                font-style: normal;
                margin-top: -3px;
                color: #666;
              }

              .info{
                width: 100%;
                color: #aaa;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 12px;
                margin-top: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>
