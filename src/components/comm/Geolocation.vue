<template>
  <div class="c-geolocation-case">
    <span class="iconfont icon-position2"></span>
    <label class="city-name">{{city}}</label>
  </div>
</template>

<script>
  import utils from '@/plugins/utils'
  
	export default {
		created(){
		  let city = utils.getLocalItem('local_city')
      if(city){
		    this.address = {
		      city
        }
      }else{
        plus.geolocation.getCurrentPosition(rs => {
          this.address = rs.address
          //this.address && utils.setLocalItem('geolocation', this.address)
          utils.setLocalItem('local_city', this.address.city)
        }, err => {
          console.log('geoError', JSON.stringify(err))
        })
      }
    },
    
    data(){
		  return {
        address: null
      }
    },
    
    computed: {
      city(){
        let _city = this.address ? this.address.city : '北京市'
        return _city.length > 3 ? _city.substring(0, 3) + '...' : _city
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-geolocation-case{
    @include box-vert-center-middle;
    width: auto;
    height: auto;
    position: relative;
    padding: 0 6px;
    
    .city-name{
      font-size: 12px;
      height: auto;
      margin-top: -4px;
    }
    
    .icon-position2{
      padding-top: 4px;
      width: auto;
      height: auto;
      font-size: 16px;
      color: #0DABFF;
    }
  }
</style>
