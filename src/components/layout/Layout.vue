<template>
  <div class="normal-layout-case full">
    <div class="normal-def-case" v-if="waiting">
      <header>APP的标题</header>
      <ul>
        <li v-for="item in (new Array(5))"></li>
      </ul>
      
      <h1>加载中</h1>

      <h4>加载中...</h4>
    </div>
    <div class="layout-container auto-fill">
      <slot v-if="loaded"></slot>
    </div>
  </div>
</template>

<script>

	export default {
		name: 'scroller',
    
    props: {
      loaded: {
        type: Boolean,
        default: false
      }
    },

		data(){
			return {
        waiting: false
			}
		},
    
    watch: {
      loaded: {
        handler(newVal){
          if(newVal){
            this.waiting = false
          }
        }
      }
    },

		mounted(){
		  //如果500毫秒后数据还没有加载完毕，则显示假列表，等数据加载完毕后再取消
		  setTimeout(() => {
		    if(!this.loaded){
		      this.waiting = true
        }
      }, 500)
		},
    
    methods: {
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

	.normal-layout-case{
    @include box-vert-left-top;
    height: 100%;
    width: 100%;
		position: relative;
    overflow: hidden;
    
    .normal-def-case{
      @include box-vert-left-top;
      width: 100%;
      height: 100%;
      padding: 8px;
      position: absolute;
      z-index: 100;
      
      h1{
        font-family: "Arial Black"
      }
      
      header{
        @include box-hori-center-middle;
        height: 50px;
        border-bottom: solid 1px #dedede;
        font-size: 18px;
        color: #333;
        font-weight: bold;
      }
      
      ul{
        position: relative;
        width: 100%;
        height: auto;
        padding: 45px 20px;
        
        .icon-case{
          width: 50px;
          height: 50px;
          background: rgba(0, 0, 0, .4);
          line-height: 50px;
          text-align: center;
          font-size: 24px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -25px;
          margin-top: -25px;
          color: #fff;
          border-radius: 14px;
          
          .icon{
            width: 50px;
            height: 50px;
            line-height: 50px;
          }
        }
        
        li{
          width: 100%;
          height: 14px;
          background: rgba(128, 128, 128, .15);
          margin-bottom: 15px;
          border-radius: 14px;
        }
      }

      .chilun-case{
        margin: 0 auto;
        width: 100px;
        height: 100px;
        position: relative;

        .star1{
          width: 50px;
          height: 50px;
          font-size: 50px;
          color: #f85959;
          position: absolute;
          line-height: 48px;
          text-align: center;
          animation: rotate1 6s linear infinite;

          .icon-stars{
            margin: 0;
            padding: 0;
            width: 50px;
            height: 50px;
            color: #f85959;
            position: absolute;
            transform: rotate(24deg);
            left: 0;
            top: 0;
            line-height: 48px;
            text-align: center;
            font-size: 50px;
            //background: rgba(0, 0, 0, .4);
          }
        }

        .star2{
          width: 50px;
          height: 50px;
          font-size: 40px;
          color: #74baf3;
          position: absolute;
          line-height: 48px;
          text-align: center;
          left: 44px;
          margin-top: 4px;
          animation: rotate2 6s linear infinite;

          .icon-stars{
            margin: 0;
            padding: 0;
            width: 50px;
            height: 50px;
            color: #74baf3;
            position: absolute;
            transform: rotate(24deg);
            left: 0;
            top: 0;
            line-height: 48px;
            text-align: center;
            font-size: 40px;
            //background: rgba(0, 0, 0, .4);
          }
        }

        .star3{
          width: 50px;
          height: 50px;
          font-size: 27px;
          color: #fdd100;
          position: absolute;
          line-height: 48px;
          text-align: center;
          left: 36px;
          margin-top: 36px;
          animation: rotate3 6s linear infinite;

          .icon-stars{
            margin: 0;
            padding: 0;
            width: 50px;
            height: 50px;
            color: #fdd100;
            position: absolute;
            transform: rotate(24deg);
            left: 0;
            top: 0;
            line-height: 48px;
            text-align: center;
            font-size: 27px;
            //background: rgba(0, 0, 0, .4);
          }
        }

        i{
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 30px;
          background: #fff;
          display: block;
          top: 22px;
          left: 22px;
        }
      }

      h4{
        margin-top: 50px;
        width: 100%;
        text-align: center;
        height: auto;
        font-size: 18px;
        color: #666;
      }

    }
    
    .layout-container{
      @include box-vert-left-top;
      position: relative;
      width: 100%;
    }

    @keyframes rotate1 {
      0%{
        transform: rotate(0);
      }
      100%{
        transform: rotate(360deg);
      }
    }

    @keyframes rotate2 {
      0%{
        transform: rotate(0);
      }
      100%{
        transform: rotate(-360deg);
      }
    }

    @keyframes rotate3 {
      0%{
        transform: rotate(0);
      }
      100%{
        transform: rotate(360deg);
      }
    }
	}
</style>
