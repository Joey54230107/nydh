<template>
  <header class="c-business-header-case">
    <div class="header-search-case auto-fill">
      <span class="search-icon iconfont icon-search"></span>
      <span class="search-text">搜索您感兴趣的品类</span>
    </div>
  </header>
</template>

<script>
  import utils from '@/plugins/utils'
  
	export default {
		props: {
      flag: {
        type: [String, Number]
      }
    },

		data(){
			return {
			  city: this.getCity()
			}
		},
    
    watch: {
		  flag(newVal, oldVal){
		    this.city = this.getCity()
      }
    },
    
    methods: {
		  getCity(){
		    let city = utils.getLocalItem('local_city')
        console.log(city)
        return city.length >= 3 ? city.substring(0, 3) + '...' : city
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

	.c-business-header-case{
		@include box-hori-left-middle;
    height: 50px;
    border-bottom: solid 0px #dcdcdc;
    background: url("../../../assets/img/header-bg.png") top left repeat-y;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    color: #fff;
    text-align: center;
    
    .c-geolocation-case{
      @include box-hori-center-middle;
      width: auto;
      height: auto;
      position: relative;
      padding: 0 6px;
      
      .city-name{
        font-size: 12px;
        height: auto;
        margin-top: -4px;
      }
      
      .icon-position3{
        width: auto;
        height: auto;
        font-size: 24px;
        color: #0DABFF;
      }
    }
    
    .geo-case{
      width: auto;
      height: auto;
    }
    
    .header-icon{
      width: 44px;
      height: 50px;
      font-size: 20px;
      line-height: 50px;

      &.icon-zhaoxiangji{
        font-size: 24px;
      }
    }
    
    .header-search-case{
      @include box-hori-center-middle;
      height: 30px;
      background: rgba(255, 255, 255, .3);
      //border: solid 1px rgba(255, 255, 255, .5);
      border-radius: 30px;
      margin: 0 10px;

      .search-icon{
        width: 24px;
        height: 30px;
        line-height: 32px;
        font-size: 18px;
      }

      .search-text{
        width: auto;
        height: 30px;
        line-height: 30px;
      }
    }
	}
</style>
