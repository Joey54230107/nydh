<template>
  <footer class="c-common-footer-case" :class="fixed ? '' : ''">
    <div class="common-btn-case">
      <slot></slot>
    </div>
  </footer>
</template>

<script>
  import utils from '@/plugins/utils'
  
	export default {
    props: {
      fixed: {
        type: Boolean,
        default: true
      }
    },
    
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

	.c-common-footer-case{
		@include box-hori-center-middle;
    height: 60px;
    background: #fff;
    padding: 0 10px;

    .common-btn-case{
      @include box-hori-center-middle;
      height: 46px;
      border-radius: 5px;
      background: $blue;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }
	}
</style>
