<template>
	<normal-layout class="farm-page" :loaded="loaded">
		<normal-header title="我的农场" />
		<div class="farm-case auto-fill">
			<scroller :status="status">
				<div class="no-data" slot="no-data">
          <h3>您还没有创建属于您的农场</h3>
          <button @tap="create" class="blue-btn">创建一个</button>
        </div>
			</scroller>
		</div>
	</normal-layout>
</template>

<script>
	import config from '../../../../../config/address.js'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
	import normalHeader from '@/components/comm/NormalHeader'
	import utils from '@/plugins/utils'
	import horiScroller from '@/components/comm/HoriScroller'
	import service from '@/api/service'
  import imageLoader from '@/components/comm/ImageLoader'

	export default {
	  created(){
			mui.plusReady(() => {
				plus.webview.currentWebview().show('pop-in', 300)
			})
    },
    
		components: {
      scroller,
			normalHeader,
      normalLayout,
			horiScroller,
      imageLoader
		},

		data(){
			return {
        loaded: true,
				status: '1',
        farms: []
      }
		},
    
    mounted(){
			mui.plusReady(() => {
				this.search()
			})
    },
    
    methods: {
    	search(){
    	  service('getFarms', {
    	    userid: utils.getLocalUser().userid
        }, rs => {
          this.farms = rs.items
          this.status = this.farms.length > 0 ? '2' : '0'
          console.log(this.status)
        })
	    },
  
      create(){
        plus.webview.create(config.CDN_ADDRESS + '/farm', 'farm', {}, {
          flag: 0
        })
      }
    }
	}
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .farm-page{
    @include box-vert-left-top;
	  background: $normalBgColor;

	  .farm-case{
		  @include box-vert-left-top;
		  padding: 10px;
      margin-top: 50px;
      
      .no-data{
        @include box-vert-center-middle;
        height: auto;
        
        h3{
          @include box-vert-center-middle;
          font-size: 16px;
          padding: 10px 0;
          height: auto;
          color: $textColor;
        }
        
        .blue-btn{
          @include box-hori-center-middle;
          width: auto;
          padding: 0 30px;
          height: 42px;
          font-size: 16px;
          background: $blue;
          border-radius: 5px;
          color: #fff;
          margin-top: 30px;
          font-weight: bold;
          z-index: 1000;
          
          &:active{
            opacity: .8;
          }
        }
      }
	  }
  }
</style>
