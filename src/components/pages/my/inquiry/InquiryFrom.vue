<template>
	<normal-layout id="pullrefresh" class="inquiry-page" :loaded="loaded">
		<inquiry-from-header title="我接到的报价单" />
    
    <!--搜索框-->
		<div class="search-case">
			<span class="icon iconfont icon-search"></span>
			<input type="text" />
		</div>
  
	</normal-layout>
</template>

<script>
	import config from '../../../../../config/address.js'
	import inquiryFromHeader from '@/components/comm/header/InquiryFromHeader'
	import scroller from '@/components/comm/Scroller'
	import normalLayout from '@/components/layout/Layout'
  import utils from '@/plugins/utils'

	export default {
		name: 'myinquiryfrom',

		components: {
			scroller,
			normalLayout,
      inquiryFromHeader
		},
    
    created(){
      let sub = plus.webview.create(config.CDN_ADDRESS + '/inquiryFromInnerList', 'inquiryFromInner', {
        top: '100px',
        bottom: '0',
        overflow: 'visible'
      })
      sub.show()
      plus.webview.currentWebview().append(sub)
    },

		data(){
			return {
				loaded: true,
				pages: [
					{name: '已发布', chose: true, id: 0},
					{name: '未发布', chose: false, id: 1},
          {name: '其他状态', chose: false, id: 2}
				],
    
			}
		},

		mounted(){
      utils.masker()
      plus.webview.show('myInquiryFrom', 'pop-in', 200)
		},

		methods: {
      changePage(item){
        this.pages && this.pages.forEach(page => {
          page.chose = (item.id === page.id)
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '@/assets/style/main.scss';

	.inquiry-page{
		@include box-vert-left-top;
		background: #e1e1e1;

		.search-case{
			@include box-hori-center-middle;
			margin-top: 50px;
			height: 50px;
			background: #e1e1e1;
			position: relative;
      padding: 0 8px;
      overflow: visible;

			input{
				overflow: hidden;
				height: 32px;
				background: #fff;
				border-radius: 5px;
				padding: 0 35px;
				line-height: 26px;
				font-size: 16px;
			}

			.icon{
				width: 32px;
				height: 50px;
				position: absolute;
				left: 16px;
				top: 0;
				color: #666;
				font-size: 18px;
				line-height: 52px;
			}
		}

		.pageframe-case{
      @include box-hori-left-middle;
			height: 40px;
      background: #fcfcfc;
      
      .page-item{
        @include box-vert-center-middle;
        width: 50%;
        height: 40px;
        font-size: 16px;
        text-align: center;
        
        .state{
          width: auto;
          padding: 0 15px;
          height: 40px;
          line-height: 38px;
          border-bottom: solid 4px transparent;
          color: #787878;
          transition: border .4s;
          
          &.state-true{
            color: #e77c6e;
            border-bottom: solid 4px rgba(255, 80, 0, .6);
          }
        }
      }
		}
	}
</style>
