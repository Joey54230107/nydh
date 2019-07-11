<template>
  <normal-layout class="driver-page" :loaded="loaded">
    <driver-header title="我的车辆" @newDriver="newDriver" />

    <scroller class="driver-case">
      <div class="no-driver-case" v-if="drivers.length == 0">
        <span class="iconfont icon-position3"></span>
        <h4 @tap="create">您尚未<a>添加</a>过任何地址，快来试试吧^_^</h4>
      </div>

      <div v-if="drivers.length > 0">
        aasdf{{drivers.length}}
      </div>
    </scroller>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import driverHeader from '@/components/comm/header/DriverHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import OrderBo from '@/model/bo/Order'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('drivers', 'pop-in', 300, () => {
					this.search()
				})
			})
    },
    
    components: {
      scroller,
      normalLayout,
      driverHeader,
			horiScroller,
			orderInnerList
    },

    data(){
      return {
        loaded: true,
				drivers: [],
				nodata: false
      }
    },

    methods: {
			search(){
				let user = util.getLocalUser()
				service('getDrivers', {
					userid: user.userid
        }, rs => {
					this.drivers = rs.items
          this.nodata = this.dirvers.length === 0
					console.log(JSON.stringify(rs.items))
        })
      },

			newDriver(){

      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .driver-page{
    @include box-vert-left-top;
    background: #f1f1f1;
    position: relative;

    .driver-case{
      @include box-vert-left-top;
      position: relative;
      overflow: hidden;
      padding-top: 50px;

      .no-driver-case{
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
            color: #74baf3;
            text-decoration: underline;
            border-radius: 2px;
            padding: 4px 5px;
          }
        }

      }

    }
  }
</style>
