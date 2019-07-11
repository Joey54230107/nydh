<template>
  <header class="page-header-case">
    <div class="header-icon iconfont icon-let-arr" @tap="back"></div>
    <div class="header-text-case auto-fill">{{title}}</div>
    <div class="header-icon create">
      <label class="iconfont icon-plus2 blocker" @tap.stop="newOrder">&nbsp;创建</label>
    </div>
  </header>
</template>

<script>
  import comboxMenu from '@/components/comm/ComboxMenu'
  
	export default {
		name: 'back-header',

    props: {
			title: {
				type: String,
        default: ''
      }
    },
    
    components: {
      comboxMenu
    },

		data(){
			return {
        headerMenus: [
          {name: '新增'},
          {name: '删除'}
        ]
			}
		},

		methods: {
			back(){
        plus.webview.currentWebview().close('pop-out', 300)
      },
      
      newOrder(){
			  this.$emit('newOrder')
      }
    }

	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
</style>
