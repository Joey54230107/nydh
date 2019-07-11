<template>
  <div class="page">
    <router-view/>
  </div>
</template>

<script>
  import utils from '@/plugins/utils'
  import config from '../config/address.js'
  
  export default {
    
    mounted(){
			mui.plusReady(() => {
				_preloads()
			})
      
      function _preloads(){
        /*预加载登录窗口*/
        if(!plus.webview.getWebviewById('login')){
          mui.preload({
            id: 'login',
            url: config.CDN_ADDRESS + '/login'
          })
        }
        
        /*/!*预加载等待动销窗口*!/
        if(!plus.webview.getWebviewById('waiting')){
          mui.preload({
            id: 'waiting',
            url: config.CDN_ADDRESS + '/waiting',
            styles: {
              zindex: 10000,
              background: 'transparent'
            }
          })
        }*/
        
        /*预加载Map窗口*/
        if(!plus.webview.getWebviewById('map')){
          mui.preload({
            id: 'map',
            url: config.CDN_ADDRESS + '/map'
          })
        }
        
        /*预加载Toast窗口*/
        if(!plus.webview.getWebviewById('toast')){
          mui.preload({
            id: 'toast',
            url: config.CDN_ADDRESS + '/toast',
            styles: {
              zindex: 10000,
              background: 'transparent'
            }
          })
        }
        
        /*预加载Error窗口*/
        if(!plus.webview.getWebviewById('error')){
          mui.preload({
            id: 'error',
            url: config.CDN_ADDRESS + '/error',
            styles: {
              zindex: 10000,
              background: 'transparent'
            }
          })
        }
        
        /*/!*预加载Confirm窗口*!/
				if(!plus.webview.getWebviewById('confirm')){
					mui.preload({
						id: 'confirm',
						url: config.CDN_ADDRESS + '/confirm',
						styles: {
							zindex: 10000,
							background: 'transparent'
						}
					})
				}*/
      }
      
      document.body.addEventListener('tap', () => {
        let combox = document.body.querySelector('.c-combox-menu-case')
        combox && (combox.style.display = 'none')
      })
    },
    
    data(){
      return {
      }
    },
    
    methods: {
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';
  
  .page{
    @include box-vert-left-top;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
