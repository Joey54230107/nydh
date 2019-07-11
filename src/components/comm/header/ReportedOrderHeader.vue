<template>
  <header class="c-reported-order-header-case">
    <div class="header-icon iconfont icon-let-arr" @tap="back">
      <label>返回</label>
    </div>
    <div class="header-text-case auto-fill">{{title}}</div>
    <div class="header-icon"></div>
  </header>
</template>

<script>
  export default {
    props: {
			title: {
				type: String,
        default: ''
      }
    },

		data(){
			return {}
		},

		mounted(){
		},

		methods: {
			back(){
        plus.webview.close('reportedOrder', 'pop-out', 200)
      },
      
      remove(){
			  this.$emit('removeHandler')
      }
    }

	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

	.c-reported-order-header-case{
		@include box-hori-left-middle;
    height: 50px;
    border-bottom: solid 0px #dcdcdc;
    background: url("../../../assets/img/header-bg.png") top left/100% 100% repeat-y;
    position: fixed;
    top: 0;
    overflow: visible;
    left: 0;
    z-index: 10;
    color: #fff;
    text-align: center;

    .header-icon{
      @include box-hori-center-middle;
      width: auto;
      height: 50px;
      font-size: 20px;
      line-height: 50px;
      overflow: visible;
      position: absolute;
      top: 0;

      &.icon-let-arr{
        left: 5px;
      }

      label{
        margin-top: -1px;
        height: 50px;
        font-size: 16px;
        width: auto;
      }
    }
    
    .header-text-case{
      @include box-hori-center-middle;
      height: auto;
      font-size: 18px;
      color: #fff;
    }
	}
</style>
