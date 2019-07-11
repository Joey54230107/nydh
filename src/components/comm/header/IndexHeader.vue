<template>
  <header class="page-header-case" style="height: 55px;">
    <div class="header-search-case auto-fill">
      <span class="search-icon iconfont icon-search"></span>
      <span class="search-text">搜品类/报价单</span>
    </div>
    <div class="header-icon" @tap="position" style="right: -5px;">
      <!--<div class="search">
        <span class="iconfont icon-eye"></span>
        <h3>找农场</h3>
      </div>-->
    </div>
  </header>
</template>

<script>
  import imageLoader from '@/components/comm/ImageLoader'
  import utils from '@/plugins/utils'
  import config from '../../../../config/address.js'
  
	export default {
    props: {
    },
    
    components: {
      imageLoader
    },
    
		data(){
			return {
			}
		},
    
    methods: {
      position(){
        /*let url = config.SERVER_ADDRESS + '/upload'
        utils.takePhoto(url, (rs, status) => {
          rs = JSON.parse(rs.responseText)
          if(status == 200){
            let path = config.SERVER_ADDRESS + rs.data.distPath
            alert(path)
          }else{
            utils.error(rs.message)
          }
        })*/
  
        plus.webview.show('map', 'pop-in', 300)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .header-search-case{
    @include box-hori-center-middle;
    height: 36px;
    background: transparent;
    border: solid .5px #fff;
    border-radius: 4px;
    margin: 0 10px 0 10px;
  
    .search-icon{
      width: 24px;
      height: 30px;
      line-height: 32px;
      font-size: 16px;
    }
  
    .search-text{
      width: auto;
      padding-top: 1px;
      height: 30px;
      line-height: 30px;
    }
  }
  
  .search{
    @include box-vert-center-top;
    width: 50px;
    height: 50px;
    
    .iconfont{
      font-size: 21px;
      color: #fff;
      line-height: 36px;
      height: 26px;
    }
    
    h3{
      height: auto;
      color: #fff;
      font-size: 9px;
    }
  }
</style>
