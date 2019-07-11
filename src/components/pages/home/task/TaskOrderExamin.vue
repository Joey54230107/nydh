<template>
  <normal-layout class="category-examin-page" :loaded="loaded">
    <error-pop :msg="errMsg" />
    <normal-header title="品类验收结果" />
    <div class="info-case auto-fill">
      <scroller class="auto-fill">
        <div class="category-info-case">
          <h2 class="title">{{category.ctname}}</h2>
          <ul class="price-case">
            <li class="row price">总价：{{category.total | price}} 元</li>
            <li class="row price">单价：{{category.price | price}} 元</li>
            <li class="row">数量：{{category.amount | toInt}} 株</li>
          </ul>
        </div>
        
        <div class="examin-info-case">
          <header class="title">验收结果</header>
          <ul class="result-case">
            <li class="cell">
              <input-text placeholder="请填写验收总价" iptId="firstInput" v-model="category.total2">验收总价：</input-text>
            </li>
            <li class="cell">
              <input-text placeholder="请填写验收单价" v-model="category.price2">验收单价：</input-text>
            </li>
            <li class="cell">
              <input-text type="tel" placeholder="请填写验收数量" v-model="category.amount2">验收数量：</input-text>
            </li>
          </ul>
        </div>
  
        <div class="examin-info-case">
          <header class="title">验收备注</header>
          <div class="result-remark-case">
            <input-area placeholder="请填写验收备注" v-model="category.remark2" />
          </div>
        </div>
      </scroller>
    </div>
	  <footer class="btn-case">
      <span class="comm-btn comm-blue-btn auto-fill plain" @tap.stop="finished(true)">验收通过</span>
      <span class="comm-btn comm-red-btn auto-fill" @tap.stop="finished(false)">不通过</span>
    </footer>
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
	import UserBo from '@/model/bo/User'
  import AddressBo from '@/model/bo/Address'
  import DriverBo from '@/model/bo/Driver'
  import imageLoader from '@/components/comm/ImageLoader'
  import {toInt, price} from '@/plugins/filter/custom'
  import inputArea from '@/components/comm/InputArea'
	import errorPop from '@/components/comm/ErrorPop'
  import inputText from '@/components/comm/Input'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('categoryExamin', 'pop-in', 300, () => {
					this.init()
				})
			})
    },
    
    components: {
      scroller,
      normalLayout,
			normalHeader,
			horiScroller,
      imageLoader,
			errorPop,
      inputArea,
      inputText
    },

    data(){
      return {
        loaded: true,
				category: {},
				errMsg: ''
      }
    },

    methods: {
      init(){
			  let win = plus.webview.currentWebview()
        let category = win.category
        
        category.total2 = price(category.total)
        category.price2 = price(category.price)
        category.amount2 = toInt(category.amount)
        category.remark2 = category.examine.remark
        this.category = category
      },
  
      finished(flag){
        let win = plus.webview.currentWebview()
        if(!this.category.amount2 || this.category.amount2 <= 0){
          utils.setError.call(this, 'errMsg', '验收数量必须填写')
          return false
        }
        if(!this.category.total2 || this.category.total2 <= 0){
          utils.setError.call(this, 'errMsg', '验收总价必须填写')
          return false
        }
        if(!this.category.price2 || this.category.price2 <= 0){
          utils.setError.call(this, 'errMsg', '验收单价必须填写')
          return false
        }
        if(!this.category.remark2 || this.category.remark2 <= 0){
          utils.setError.call(this, 'errMsg', '验收备注必须填写')
          return false
        }
        service('examinFinished', {
          userid: utils.getLocalUser().userid,
          tradeid: win.tradeid,
          items: [{
            rs: flag ? 1 : 0,
            imgs: '',
            amount: this.category.amount2,
            price: this.category.price2,
            total: this.category.total2,
            remark: this.category.remark2,
            uuid: this.category.uuid,
            itemid: this.category.itemid
          }]
        }, rs => {
          utils.toast('操作成功！')
          mui.fire(plus.webview.getWebviewById('categoryExamin'), 'examHandler', {
            amount: this.category.amount2,
            price: this.category.price2,
            total: this.category.total2,
            remark: this.category.remark2,
            uuid: this.category.uuid
          })
          plus.webview.currentWebview().close('pop-out', 300)
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .category-examin-page{
    @include box-vert-left-top;
    position: relative;
    height: 100%;
    background: #f0f0f0;
    padding-top: 60px;
    padding-bottom: 20px;
    
    .info-case{
      padding: 0 10px;
      
      .category-info-case{
        @include box-hori-left-middle;
        padding: 15px;
        background: #fff;
        border-radius: 9px;
        
        .title{
          @include box-hori-center-middle;
          width: 120px;
          height: auto;
          font-size: 16px;
          color: $textColor;
          font-weight: bold;
        }
        
        .price-case{
          border-left: solid 1px #eee;
          padding: 0 0 0 10px;
          
          .row{
            margin-top: -3px;
            height: 24px;
            font-size: 14px;
            color: #999;
            
            &.price{
              color: #f85959;
            }
            
            &:last-child{
              margin-bottom: -4px;
            }
          }
        }
      }
      
      .examin-info-case{
        height: auto;
        margin-top: 10px;
        background: #fff;
        border-radius: 9px;
        
        .title{
          @include box-hori-center-middle;
          height: 50px;
          font-size: 16px;
          font-weight: bold;
          color: #666;
          border-bottom: solid 1px #f0f0f0;
        }
        
        .result-case{
          @include box-vert-left-top;
          padding: 0 15px 0 10px;
          
          .cell{
            @include box-hori-left-middle;
            height: 50px;
            border-bottom: solid 1px #f0f0f0;
          }
        }
      }
      
      .result-remark-case{
        height: 100px;
        padding: 10px;
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
      box-shadow: -10px 0 10px rgba(0, 0, 0, .07);
      padding: 0 5px;
      
      .comm-btn{
        margin: 0 5px;
      }
	  }
  }
</style>
