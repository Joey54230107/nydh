<template>
  <div class="c-toast-masker-case">
    <div class="toast-case" :class="type" :style="{'transform': 'scale(' + top + ')', 'opacity': opacity}">
      <span v-if="type == 'success'" class="iconfont icon-check"></span>
      <span v-if="type == 'failed'" class="iconfont icon-close2"></span>
      <h3 :class="type">{{title}}</h3>
    </div>
  </div>
</template>

<script>

	export default {
		created(){
			mui.plusReady(() => {
				let win = plus.webview.currentWebview()

				window.addEventListener('toast', (e) => {
					this.title = e.detail.title || '操作成功'
					this.type = (e.detail.type || 'SUCCESS').toLowerCase()
					this.time = e.detail.time || 1000
					win.show()

					this.top = 1
					this.opacity = 1
					setTimeout(() => {
						this.top = 0
						this.opacity = 0

						setTimeout(() => {
							win.hide()
						}, 500)
					}, this.time)
				})
			})
    },

    data(){
		  return {
		  	title: '操作成功',
        type: 'SUCCESS',
				top: 0,
        opacity: 0
      }
    },

    methods: {
      close(){
        this.$emit('closeHandler')
      },
  
      voids(){}
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-toast-masker-case{
    @include box-vert-center-middle;
    width: 100%;
    height: 100%;
    background: transparent;
    position: relative;
    
    .toast-case{
      @include box-vert-center-middle;
      width: auto;
      max-width: 50%;
      height: auto;
      background: rgba(0, 0, 0, .85);
      border-radius: 5px;
      //box-shadow: 0 0 10px rgba(0, 0, 0, .3);
      transition: transform .2s, opacity .15s;
      padding: 5px 20px 10px 20px;
      
      &.failed{
      }

      .icon-check{
        height: auto;
        font-size: 24px;
        color: #fff;
        padding-top: 5px;
      }
      
      .icon-close2{
        height: auto;
        font-size: 24px;
        color: #fff;
        padding-top: 10px;
      }

      h3{
        width: auto;
        height: auto;
        font-weight: bold;
        text-align: center;
        line-height: 21px;
        
        &.success{
          font-size: 16px;
          color: #fff;
        }
        
        &.failed{
          font-size: 14px;
          color: #fff;
          padding-top: 6px;
          margin-bottom: 0;
        }
      }
    }
  }
</style>
