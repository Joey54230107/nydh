<template>
  <div class="c-medal-case">
    <div :class="level" class="circel">{{num}}</div>
    <i></i>
  </div>
</template>

<script>
	export default {
	  props: {
	    level: {
	      type: String,
        default: 'gold' //gold | silver | copper
      }
    },
    
    computed: {
	    num(){
	      return this.level == 'gold' ? '1' : (this.level == 'silver' ? '2' : '3')
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-medal-case{
    display: block;
    width: 12px;
    height: 27px;
    background: transparent;
    position: relative;
    margin-top: 17px;
    
    i{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border: solid 6px #F55046;
      border-bottom-color: transparent;
    }
    
    .circel{
      @include box-vert-center-middle;
      width: 28px;
      height: 28px;
      border-radius: 32px;
      margin: -12px 0 0 -8px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      font-family: Arial;
      position: absolute;
      z-index: 100;
  
      &.gold{
        background: #E8B902;
        border: solid 4px #FFD200;
      }
  
      &.silver{
        background: #B2C1C1;
        border: solid 4px #D7DFDF;
      }
      
      &.copper{
        background: #D87D00;
        border: solid 4px #FFBA4A;
      }
    }
  }
</style>
