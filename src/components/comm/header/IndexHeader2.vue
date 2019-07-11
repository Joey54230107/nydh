<template>
  <header class="page-header-case">
    <div class="header-search-case">
      <span class="search-icon iconfont icon-search"></span>
      <span class="search-text auto-fill">搜品类/报价单</span>
    </div>
    <div class="header-icon" @tap="position" style="right: -5px;">
      <div class="search">
        <span class="iconfont icon-eye"></span>
        <h3>找农场</h3>
      </div>
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
  
  .index-header{
    @include box-hori-center-middle;
    height: 55px;
    background: #fff;
    padding: 5px 50px 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    
    .header-search-case{
      @include box-hori-left-middle;
      height: 38px;
      background: #e9e9e9;
      border-radius: 50px;
      width: 100%;
      padding: 0 42px 0 10px;
      color: #666;
      
      .search-icon{
        width: 32px;
      }
      .search-text{
        @include box-hori-center-middle;
      }
    }
    
    .header-icon{
      width: 50px;
      height: 50px;
  
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
    }
  }
</style>
