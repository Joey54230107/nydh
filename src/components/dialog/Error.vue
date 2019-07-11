<template>
  <div class="c-error-masker-case">
    <div class="error-case" :style="{'transform': 'translateY(' + top + 'px)', 'opacity': opacity}">
      <h4>{{title}}</h4>
      <div class="error-body auto-fill">
        <label>{{message}}</label>
      </div>
      <button @tap="close">我知道了</button>
    </div>
  </div>
</template>

<script>

	export default {
		created(){
			let win = plus.webview.getWebviewById('error')
			window.addEventListener('error', (e) => {
				this.message = e.detail.message || ''
        this.title = e.detail.title || '操作异常'
				win.show()
        setTimeout(() => {
          this.top = 0
          this.opacity = 1
        }, 150)
			})
    },

    data(){
		  return {
        message: '',
				top: 30,
        opacity: 0,
        title: ''
      }
    },

    methods: {
      close(){
        this.top = 30
        this.opacity = 0
  
        setTimeout(() => {
          plus.webview.currentWebview().hide()
        }, 350)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-error-masker-case{
    @include box-vert-center-bottom;
    width: 100%;
    height: 100%;
    background: transparent;
    //background: rgba(255, 255, 255, .8);
    position: relative;
    
    .error-case{
      @include box-vert-center-middle;
      width: 80%;
      height: 190px;
      background: #fff;
      border-radius: 15px;
      top: 50%;
      color: #333;
      margin-top: -120px;
      left: 10%;
      position: absolute;
      box-shadow: 0 0 20px 6px rgba(248, 89, 89, .15);
      transition: transform .15s, opacity .2s;
      padding: 15px 25px;
  
      .error-body{
        @include box-hori-left-top;
        padding: 10px 10px 0;
        overflow-y: auto;
        margin-bottom: 15px;
        
        label{
          @include box-vert-center-middle;
          text-align: center;
          width: 100%;
          line-height: 21px;
          height: auto;
          color: #787878;
          font-size: 14px;
        }
      }
      
      h4{
        @include box-hori-center-middle;
        height: auto;
        color: #666;
        font-weight: bold;
        font-size: 18px;
      }
      
      button{
        height: 40px;
        width: 100%;
        font-size: 16px;
        background: #f85959;
        border-radius: 3px;
        color: #fff;
        text-align: center;
      }
    }
  }
</style>
