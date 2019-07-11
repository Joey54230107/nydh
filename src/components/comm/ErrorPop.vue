<template>
  <div class="c-err-pop-case" :style="{'transform': 'translateY(' + y + 'px)'}">
    <span class="iconfont icon-attention2">&nbsp;&nbsp;{{errMsg}}</span>
    <span class="iconfont icon-close" @tap.stop="close"></span>
  </div>
</template>

<script>

	export default {
		props: {
      msg: {
        type: String,
        default: ''
      }
    },
    
    data(){
		  return {
		    y: -50,
        errMsg: ''
      }
    },
    
    watch: {
      msg(newVal, oldVal){
        if(newVal){
          this.errMsg = newVal.split('_')[0]
          this.y = 0
          setTimeout(() => {
            this.y = -50
          }, 2000)
        }
      }
    },

    computed: {
			
    },
    
    methods: {
    	close(){
    		this.y = -50
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-err-pop-case{
    @include box-hori-left-middle;
    height: 50px;
    background: #f85959;
    color: #fff;
    font-size: 12px;
    padding: 0 18px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200000000;
    line-height: 50px;
    transition: transform .3s;

    .icon-close{
      width: 32px;
      height: 50px;
      position: absolute;
      right: 0;
      top: 0;
      color: #fff;
      font-size: 24px;
    }
  }
</style>
