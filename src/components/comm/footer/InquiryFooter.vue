<template>
  <footer class="c-inquiry-footer-case">
    <div class="footer-inner-case" :class="'footer-inner-case-' + state">
      <div class="toOrder-case" v-if="!state" @tap="order">
        <span class="iconfont icon-dd"></span>
        <label> 转化为订单</label>
      </div>
      <button class="cancel-btn" v-if="state" @tap="cancel">取消</button>
      <button class="confirm-btn" v-if="state" @tap="confirm">确定</button>
    </div>
  </footer>
</template>

<script>
  import utils from '@/plugins/utils'
  
	export default {
		name: 'inquiryfooter',

		data(){
			return {
				state: false
			}
		},

		mounted(){
		},

		methods: {
			order(){
				this.state = true
				mui.fire(plus.webview.getWebviewById("inquiryToInner"), 'toOrder', 'a');
      },

			cancel(){
				this.state = false
      },
      
      confirm(){
        mui.confirm('您确定要将此3张询价单转化为订单么？', '生成订单', ['否','是'], (e) => {
          if(e.index == 1){
            this.state = false
            mui.fire(plus.webview.getWebviewById("inquiryToInner"), 'cancelOrder', 'a');
          }
        })
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '~@/assets/style/main.scss';

	.c-inquiry-footer-case{
		@include box-hori-left-bottom;
    overflow: visible;
    height: 55px;
    position: fixed;
    background: #e1e1e1;
    bottom: 0;
    left: 0;
    text-align: center;
    z-index: 10;

    .footer-inner-case{
      background: rgba(255, 255, 255, 1);
      position: relative;
      overflow: visible;
      transition: all .3s;

      &.footer-inner-case-true{
        @include box-hori-center-middle;
        height: 55px;
        border-radius: 0;
      }
      &.footer-inner-case-false{
        @include box-hori-center-middle;
        height: 40px;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, .08);
        border-radius: 500px 500px 0 0/100px 100px 0 0;
      }
      
      .toOrder-case{
        @include box-hori-center-middle;
        height: 40px;
        font-size: 16px;
  
        .iconfont{
          height: 26px;
          width: 26px;
          //background: rgba(0, 0, 0, .1);
          font-size: 16px;
          line-height: 24px;
          border: solid 1px #ccc;
          border-radius: 16px;
        }
        label{
          height: auto;
          color: #666;
          width: auto;
          padding-left: 4px;
        }
      }

      .cancel-btn{
        width: 45%;
        height: 42px;
        background: #dedede;
        border-radius: 6px;
        border: none;
        color: #666;
        font-size: 16px;
        margin-right: 8px;
      }

      .confirm-btn{
        margin-left: 8px;
        width: 45%;
        height: 42px;
        background: #ec8a7c;
        border-radius: 6px;
        border: none;
        color: #fff;
        font-size: 16px;
      }
    }
	}
</style>
