<template>
  <div class="c-error-masker-case">
    <div class="error-case" :style="{'transform': 'translateY(' + top + 'px)', 'opacity': opacity}">
      <!--<h4>{{title}}</h4>-->
      <div class="error-body auto-fill">
        <label>{{message}}</label>
      </div>
      <div class="btn-case">
        <button class="confirm auto-fill" @tap="confirmHandler">确定</button>
        <button class="nagative auto-fill" @tap="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script>

	export default {
		created(){
			let win = plus.webview.currentWebview()
			window.addEventListener('confirm', (e) => {
				this.message = e.detail.message || ''
        this.title = e.detail.title || '操作异常'
        this.callback = e.detail.callback
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
				callback: null
      }
    },

    methods: {
      close(){
        this.top = 30
        this.opacity = 0
  
        setTimeout(() => {
          plus.webview.currentWebview().hide()
        }, 350)
      },

			confirmHandler(){
      	mui.confirm('您确定要')
				mui.fire(plus.webview.currentWebview().opener(), 'callback')
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
    //background: rgba(0, 0, 0, .2);
    background: transparent;
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

      .btn-case{
        @include box-hori-center-middle;
        height: 45px;
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
        font-size: 16px;
        background: #f85959;
        border-radius: 3px;
        color: #fff;
        text-align: center;

        &.confirm{
          margin-right: 6px;
          background: #fff;
          color: #454545;
          border: solid 1px #eee;

          &:active{
            background: #f1f1f1;
          }
        }

        &.nagative{
          margin-left: 6px;

          &:active{
            opacity: .8;
          }
        }
      }
    }
  }
</style>
