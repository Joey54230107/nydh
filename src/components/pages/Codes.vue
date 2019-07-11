<template>
  <div class="code-case">
    <header>选择{{title}}<span class="iconfont icon-let-arr" @tap="back"></span></header>
    <div class="tip-case">当前选择："{{text}}"</div>
    <scroller class="scroller-case auto-fill">
      <div class="code-item-case" :class="'code-item-case-' + code.chose" v-for="code in codes" @tap="chose(code)">
        <label class="auto-fill">{{code.value}}</label>
        <span class="iconfont icon-check" :class="'check-' + code.chose"></span>
      </div>
    </scroller>
  </div>
</template>

<script>
  import address from '../../../config/address'
  import utils from '@/plugins/utils'
  import service from '@/api/service'
  import scroller from '@/components/comm/Scroller'

	export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('codes', 'pop-in', 300)
				let code = plus.webview.currentWebview().code, title = plus.webview.currentWebview().title
				this.title = title
				this.init(code)
			})
    },
    
    components: {
      scroller
    },
    
		data(){
			return {
			  codes: [],
        title: ''
			}
		},

		mounted(){
		  this.codes = []
    },
    
    computed: {
		  text(){
		    let value
		    this.codes.forEach(item => {
		      if(item.chose){
		        value = item.value
          }
        })
        return value
      }
    },
    
    methods: {
		  init(code){
        let _code = plus.webview.currentWebview().value
		    service('getCode', {code}, rs => {
		      let codes = rs[0].children || []
          codes.forEach(item => {
            item.chose = (item.code == _code)
          })
          this.codes = codes
        })
      },
      
      back(){
		    plus.webview.currentWebview().close('pop-out', 300)
      },
      
      chose(code){
        let win = plus.webview.currentWebview()
        let openerId = win.openerId
        code.chose = true
        mui.fire(plus.webview.getWebviewById(openerId), 'setCode', {
          code
        })
        win.close('pop-out', 300)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

	.code-case{
    @include box-vert-left-top;
    height: 100%;
    width: 100%;
    background: #f7f7f7;
    
    header{
      @include box-hori-center-middle;
      height: 50px;
      background: #fff;
      font-size: 18px;
      color: #333;
      font-weight: bold;
      position: relative;
      
      .icon-let-arr{
        @include box-hori-center-middle;
        height: 50px;
        width: 32px;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 18px;
      }
    }
    
    .tip-case{
      @include box-hori-left-middle;
      height: auto;
      color: #999;
      font-size: 14px;
      padding: 0 15px;
      margin-top: 15px;
    }
    
    .scroller-case{
      margin-top: 10px;
  
      .code-item-case{
        @include box-hori-left-middle;
        height: 50px;
        background: #fff;
        padding: 0 15px;
        font-size: 16px;
        margin-bottom: 1px;
  
        &.code-item-case-true{
          color: #008de1;
        }
        &.code-item-case-false{
          color: #666;
        }
    
        .icon-check{
          @include box-vert-center-middle;
          width: 50px;
          height: 50px;
          font-size: 18px;
          
          &.check-false{
            color: transparent;
          }
          &.check-true{
            color: #008de1;
            font-weight: bold;
          }
        }
      }
    }
    
  }
</style>
