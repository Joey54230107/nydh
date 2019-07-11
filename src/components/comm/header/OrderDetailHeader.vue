<template>
  <header class="page-header-case">
    <div class="header-icon iconfont icon-let-arr" @tap="back"></div>
    <div class="header-text-case auto-fill">{{title}}</div>
    <div class="header-icon create" @tap="addCategory">
      <label class="iconfont icon-plus2 blocker">&nbsp;添加品类</label>
    </div>
  </header>
</template>

<script>
  export default {
		name: 'back-header',

    props: {
			title: {
				type: String,
        default: ''
      },
  
      orderState: {
        type: [String, Number],
        default: ''
      },
  
      flag: {
        type: [String, Number],
        default: ''
      }
    },

		data(){
			return {}
		},

		mounted(){},

		methods: {
			back(){
        if(this.orderState == '0'){
          //如果是可以修改的， 那么返回后要刷新列表界面
          let win = plus.webview.getWebviewById('myOffer')
          mui.fire(win, 'changePage', {code: this.orderState})
        }else{
          //没有修改的， 直接返回即可
          plus.webview.close('orderDetail', 'pop-out', 300)
        }
      },

			addCategory(){
			  this.$emit('addCategory')
      }
    }

	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
</style>
