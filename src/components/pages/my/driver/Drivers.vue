<template>
  <normal-layout class="address-page" :loaded="loaded">
    <normal-header title="选择车牌信息" menuText="新建" @menuHandler="create" icon="icon-plus2" />

    <div class="car-inner-case auto-fill">
      <scroller class="car-case" :status="status">
        <div class="car-list-case" v-if="drivers.length > 0">
          <slider-block :id="'slider-' + idx" v-for="(driver, idx) in drivers" :item="driver" :key="idx" @scrollHandler="scrollHandler" class="car-item-case" sliderWidth="25">
            <div class="car-item-inner-case">
              <slider-btn class="remove-car" confirmStr="确定删除" @handler="removeCar(driver, idx)">删除</slider-btn>
              <span class="iconfont icon-car"></span>
              <div class="car-detail-case auto-fill" @tap.stop="choseDriver(driver)">
                <h3>{{driver.plateno}}</h3>
                <h4>司机姓名: {{driver.drivername}}&nbsp;&nbsp;{{driver.drivertel}}</h4>
                <h5 class="info text-ellipse">车型: {{driver.trucktypestr}}</h5>
                <h5 class="info text-ellipse">经营范围: {{driver.biz}}</h5>
              </div>
              <div class="chose-case" @tap.stop="detail(driver)">
                <span class="iconfont icon-edit"></span>
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
	import normalLayout from '@/components/layout/Layout'
	import scroller from '@/components/comm/Scroller'
  import DriverBo from '@/model/bo/Driver'
	import sliderBlock from '@/components/comm/SliderBlocker'
	import normalHeader from '@/components/comm/NormalHeader'
	import sliderBtn from '@/components/comm/SliderButton'

	export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('drivers', 'pop-in', 300, () => {
					this.search()
				})
			})
  
      window.addEventListener('refresh', () => {
        this.search()
      })
    },

		data(){
			return {
        loaded: false,
        drivers: [],
        openerId: '',
        status: '1'
			}
		},

		components: {
      imageLoader,
			normalHeader,
			normalLayout,
			scroller,
			sliderBlock,
			sliderBtn
		},

		methods: {
      search(){
        let user = utils.getLocalUser()
        this.status = '1'
        this.openerId = plus.webview.currentWebview().openerId
        service('getCars', {
          userid: user.userid
        }, rs => {
          let drivers = rs.items || []
        	this.loaded = true
					drivers.forEach(item => {
						item.remove = false
          })
          this.drivers = drivers
          this.status = drivers.length > 0 ? '2' : '0'
        }, err => {
          this.status = '0'
        })
      },
      
      choseDriver(driver){
        if(this.openerId == 'myOrderDetail'){
          let page = plus.webview.getWebviewById('myOrderDetail')
          if(page){
            mui.fire(page, 'setDriver', driver)
          }
          plus.webview.currentWebview().close('pop-out', 300)
        }
      },

			removeCar(car, idx){
				service('deleteCar', {
					userid: utils.getLocalUser().userid,
					uuids: car.uuid
				}, rs => {
          car.remove = true
					setTimeout(() => {
            this.drivers.splice(idx, 1)
            this.status = this.drivers.length > 0 ? '2' : '0'
            utils.toast('删除成功')
					}, 300)
				})
			},

			create(){
      	let driver = new DriverBo()
				plus.webview.create(config.CDN_ADDRESS + '/driver', 'driver', {}, {driver})
      },
      
      detail(driver){
        plus.webview.create(config.CDN_ADDRESS + '/driver', 'driver', {}, {driver})
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
    background: #f7f7f7;

    .car-inner-case {
      @include box-hori-left-top;
      width: 100%;
      position: relative;
      overflow: hidden;
      padding: 10px;

      .car-case{
        @include box-vert-left-top;
        margin-top: 50px;
        position: relative;

        .no-car-case{
          @include box-vert-center-middle;
          width: 100%;
          height: 100px;
          position: absolute;
          top: 100px;
          left: 0;

          .icon-position3{
            font-size: 64px;
            color: #dedede;
          }

          h4{
            @include box-hori-center-middle;
            font-size: 16px;
            padding-top: 64px;
            text-align: center;
            color: #999;

            a{
              color: #008de1;
              padding: 0 3px;
              text-decoration: underline;
            }
          }

        }

        .car-list-case{
          @include box-vert-left-top;
          height: auto;

          .car-item-case{
            @include box-hori-left-middle;
            height: auto;
            min-height: 50px;
            background: #dedede;
            border-radius: 7px;
            margin-bottom: 8px;
            position: relative;

            .car-item-inner-case{
              @include box-hori-left-middle;
              width: 100%;
              height: auto;
              min-height: 50px;
              padding: 10px 2px 10px 10px;
              background: #fff;

              .icon-car{
                width: 36px;
                height: auto;
                padding-left: 5px;
                font-size: 24px;
                color: #008de1;
              }

              .remove-car{
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

              .icon-edit{
                width: 24px;
                height: auto;
                font-size: 18px;
                color: #ccc;
              }
            }

            .icon-position3{
              width: 50px;
              height: auto;
              font-size: 28px;
              text-align: center;
              color: #74baf3;
              padding-top: 2px;
            }

            .car-detail-case{
              @include box-vert-left-top;
              height: auto;
              color: #333;
              font-size: 14px;
              padding: 0 5px;

              h4{
                font-size: 14px;
                color: #666;
              }

              h3{
                position: relative;
                font-size: 18px;
                color: #666;
                font-weight: bold;

                .default-chose{
                  width: auto;
                  height: auto;
                  padding: 0 2px;
                  border: solid 1px #74baf3;
                  color: #74baf3;
                  border-radius: 2px;
                  position: absolute;
                }
              }

              h5{
                margin-top: 1px;
              }
            }

            .icon-right-arr{
              width: 24px;
              height: auto;
              font-size: 24px;
              color: #9e9e9e;
            }
          }
        }
      }
    }
  }
</style>
