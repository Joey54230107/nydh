<template>
  <div class="location-case">
    <ul class="sider-case">
      <li v-for="(letter, key) in locations" @tap="choseLetter(key)" class="letter-case">{{key}}</li>
    </ul>
    <location-header title="地理定位" />
    <div class="curr-local-case">
      <h3>您当前位置</h3>
      <div class="address-case">
        <address class="auto-fill">{{city}}</address>
        <div class="re-location iconfont icon-re-pos">
          <span>重定位</span>
        </div>
      </div>
    </div>
    <scroller class="citys-case auto-fill" @setScroller="setScroller">
      <ul class="city-outer-case">
        <li class="city-item-case" v-for="(letter, key) in locations">
          <h3 class="letter-case" :id="'letter_' + key">{{key}}</h3>
          <div v-for="city in letter" class="city" @tap="choseCity(city)">
            {{city.name}}
          </div>
        </li>
      </ul>
    </scroller>
  </div>
</template>

<script>
	import utils from '@/plugins/utils'
	import config from '../../../config/address.js'
	import locationHeader from '@/components/comm/header/LocationHeader'
  import service from '@/api/service'
  import scroller from '@/components/comm/Scroller'

	export default {
	  components: {
      locationHeader,
      scroller
    },
    
    data(){
	    return {
        winId: '',
        scroller: null,
	      locations: [],
        city: ''
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				let win = plus.webview.getWebviewById('location')
				let winId = win.winId
				this.init(winId)
				this.locations = JSON.parse(utils.getLocalItem('code_locations')),
				win.show('pop-in', 200)
			})
    },
    
    methods: {
      init(winId){
        this.winId = winId
        this.city = utils.getLocalItem('local_city')
      },
  
      choseLetter(key){
        let offsetTop = 0 - document.getElementById('letter_' + key).offsetTop
        this.scroller && this.scroller.scrollTo(0, offsetTop, 0)
      },
  
      choseCity(city){
        let win = plus.webview.getWebviewById(this.winId)
        utils.setLocalItem('local_city', city.name)
        mui.fire(win, 'setCity')
        console.log(city.name)
        plus.webview.currentWebview().hide('pop-out', 200)
      },
  
      setScroller(scroller){
        this.scroller = scroller
      }
    }
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';

  .location-case {
    @include box-vert-center-middle;
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    
    .sider-case{
      @include box-vert-center-middle;
      height: 100%;
      width: 20px;
      position: fixed;
      right: 0;
      top: 50px;
      bottom: 50px;
      z-index: 501;
      
      .letter-case{
        @include box-hori-center-middle;
        height: 10px;
        padding: 8px 0;
        color: #333;
        font-size: 12px;
      }
    }
    
    .citys-case{
      @include box-vert-left-top;
      position: relative;
      
      .city-outer-case{
        @include box-vert-left-top;
        height: auto;
        margin: 0;
        
        .city-item-case{
          @include box-vert-left-top;
          height: auto;
          background: #f1f1f1;
          
          .letter-case{
            @include box-hori-left-middle;
            margin: 0;
            height: 30px;
            background: #74baf3;
            color: #fff;
            padding: 0 10px;
            font-size: 18px;
          }
          
          .city{
            @include box-hori-left-middle;
            margin-left: 10px;
            height: 36px;
            border-bottom: solid 1px rgba(0, 0, 0, .1);
  
            &:active{
              background: #fff;
            }
          }
          
        }
      }
    }

    .curr-local-case{
      @include box-vert-left-top;
      margin-top: 50px;
      height: auto;
      padding: 10px;

      h3{
        height: 20px;
        color: #999;
        font-size: 14px;
      }

      .address-case{
        @include box-hori-left-middle;
        height: 20px;
        color: #333;

        address{
          font-style: normal;
          font-size: 18px;
          line-height: 16px;
        }

        .re-location{
          @include box-hori-left-middle;
          margin-top: 2px;
          line-height: 20px;
          width: auto;
          height: 20px;
          font-size: 18px;
          color: #008de1;

          span{
            height: 20px;
            line-height: 18px;
            font-size: 14px;
            padding-left: 4px;
          }
        }
      }
    }
  }
</style>
