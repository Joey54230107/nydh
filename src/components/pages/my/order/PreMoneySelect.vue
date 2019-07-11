<template>
  <normal-layout class="accept-goods-page" :loaded="loaded">
    <div class="money-case">
      <header>设置预付款及付款方式<span class="iconfont icon-let-arr" @tap="back"></span></header>
      <ul>
        <li v-for="code in codes" @tap="chose(code)" :class="'check-' + code.chose">
          <label class="auto-fill">{{code.value}}</label>
          <span class="iconfont icon-check" v-show="code.chose"></span>
        </li>

        <li class="row">
          <input-text textWidth="135" placeholder="预付款" iptId="firstInput" v-model="params.firstpay">请输入预付金额(元)：</input-text>
        </li>
        
        <footer>
          <div class="comm-btn comm-blue-btn button" @tap="setMoney">确定</div>
        </footer>
      </ul>
    </div>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import goodsHeader from '@/components/comm/header/GoodsHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import imageLoader from '@/components/comm/ImageLoader'
	import sliderBlocker from '@/components/comm/SliderBlocker'
	import {price} from '@/plugins/filter/custom'
  import inputText from '@/components/comm/Input'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('moneySelect', 'pop-in', 300, () => {
					this.search()
				})
			})
    },
    
    components: {
      scroller,
      normalLayout,
      goodsHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			sliderBlocker,
      inputText
    },

    data(){
      return {
        loaded: false,
        codes: [],
        params: {
					firstpay: '0.00',
					paytype: '',
          paytypestr: ''
        }
      }
    },

    methods: {
			search(){
				let win = plus.webview.currentWebview()
				let firstpay = win.firstpay, paytype = win.paytype
        this.params.firstpay = price(firstpay)
				this.params.paytype = paytype
    
				service('getCode', {code: '013'}, rs => {
				  let list = rs[0].children
          list.forEach(item => {
          	if(item.code == paytype){
          		item.chose = true
              this.params.paytypestr = item.value
            }else{
							item.chose = false
            }
          })
          this.codes = list
          this.loaded = true
				})
			},
      
      back(){
			  mui.fire(plus.webview.getWebviewById('myOrderDetail'), 'setMoney', this.params)
        plus.webview.currentWebview().close('pop-out', 300)
      },
  
      chose(code){
        this.codes.forEach(item => {
          item.chose = (code.value == item.value)
        })
        this.params.paytype = code.code
        this.params.paytypestr = code.value
      },
      
      setMoney(){
        mui.fire(plus.webview.getWebviewById('myOrderDetail'), 'setMoney', this.params)
        plus.webview.currentWebview().close('pop-out', 300)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';

  .accept-goods-page{
    background: $normalBgColor;
    
    .money-case{
      @include box-vert-left-top;
      height: 100%;
    
      header{
        @include box-hori-center-middle;
        height: 50px;
        border-bottom: solid 1px #f1f1f1;
        position: relative;
        font-size: 18px;
        color: $textColor;
        background: #fff;
        font-weight: bold;
      
        .icon-let-arr{
          @include box-hori-center-middle;
          width: 32px;
          height: 50px;
          font-size: 21px;
          color: #999;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    
      ul{
        @include box-vert-left-top;
        height: auto;
        padding-top: 10px;
      
        li{
          @include box-hori-left-middle;
          height: 50px;
          margin-bottom: 1px;
          font-size: 14px;
          padding: 0 15px;
          background: #fff;
          color: #666;
          font-weight: bold;
          overflow: hidden;
        
          &:active{
            background: #f7f7f7;
          }
        
          &.row{
            margin-top: 10px;
            color: #999;
            font-weight: normal;

            &:active{
              background: #fff;
            }
          }
          
          &.check-true{
            color: #008de1;
            font-size: 16px;
          }
          
          .icon-check{
            font-size: 21px;
            color: #008de1;
          }
        }
      }
      
      footer{
        padding: 0 10px;
        margin-top: 50px;
        
        .button{
          width: 100%;
        }
      }
    }
  }
  
</style>
