<template>
  <header class="page-header-case" :class="simple ? 'simple' : ''">
    <div v-if="!noBack" class="header-icon iconfont icon-let-arr" @tap="back"><label>返回</label></div>
    <div class="header-text-case auto-fill">{{title}}</div>
    <div class="header-icon create">
      <label v-if="!icon" class="blocker" @tap.stop="handler">{{menuText}}</label>
      <label v-if="icon" class="blocker iconfont" :class="icon" @tap.stop="handler">&nbsp;{{menuText}}</label>
    </div>
  </header>
</template>

<script>

	export default {
		props: {
			title: {
				type: String,
        default: ''
      },

      menuText: {
				type: String,
        default: ''
      },

      //右侧菜单图标（如果有）
      icon: {
				type: String,
        default: ''
      },
      
      //定义点击“返回”按钮后， 是close还是hide
      hide: {
        type: Boolean,
        default: false
      },
      
      //定义头的样式（红色和白色背景）
      simple: {
        type: Boolean,
        default: false
      },
      
      //定义是否有“返回”按钮
      noBack: {
        type: Boolean,
        default: false
      }
    },
    
    methods: {
			back(){
				this.$emit('backHandler')
        if(this.hide){
          plus.webview.currentWebview().hide('pop-out', 300)
        }else{
          plus.webview.currentWebview().close('pop-out', 300)
        }
			},

			handler(){
				this.$emit('menuHandler')
			}
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
</style>
