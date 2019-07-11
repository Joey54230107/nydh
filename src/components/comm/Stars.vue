<template>
  <ul class="c-stars-case">
    <li v-for="star in lightStars" class="icon2 icon-true iconfont icon-stars"></li>
    <li v-for="star in darkStars" class="icon2 icon-false iconfont icon-stars"></li>
  </ul>
</template>

<script>
	export default {
		name: 'stars',
    
    props: {
		  level: {
		    type: [String, Number],
        default: '1'
      }
    },
    
    data(){
		  return {
        lightStars: new Array(parseInt(this.level)),
        darkStars: new Array(5 - this.level)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .c-stars-case{
    @include box-hori-left-middle;
    width: auto;
    padding: 0 10px;
    height: 30px;
  
    .icon2{
      width: 24px;
      height: 24px;
      font-size: 16px;
    }
    .icon-true{
      color: #ffb000;
    }
    .icon-false{
      color: #ccc;
    }
  }
</style>
