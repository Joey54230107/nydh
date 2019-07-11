<template>
  <normal-layout class="chat-page" :loaded="loaded">
    123123
  </normal-layout>
</template>

<script>
  import config from '../../../../config/address.js'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import stars from '@/components/comm/Stars'
  import utils from '@/plugins/utils'
  import imageLoader from '@/components/comm/ImageLoader'
  import service from '@/api/service'
  import loginMixin from '@/mixin/Login'
  
  export default {
    mixins: [loginMixin],
    
    created(){
      window.addEventListener('init', (e) => {})
    },
    
    components: {
      scroller,
      normalLayout,
      stars,
			imageLoader
    },
    
    data(){
      return {
        loaded: true,
        user: {}
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.user = utils.getLocalUser()
				this.loaded = true
			})
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .chat-page{
    @include box-vert-left-top;
    height: 100%;
    background: #ff0000;
    
  }
</style>
