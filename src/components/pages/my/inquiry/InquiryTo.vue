<template>
	<normal-layout id="pullrefresh" class="inquiry-page" :loaded="loaded">
		<back-header title="我发布的询价单" />
    
    <!--状态查询页签-->
		<hori-scroller class="pageframe-case" :resource="pages" />
		<order-footer />
	</normal-layout>
</template>

<script>
	import config from '../../../../../config/address.js'
	import backHeader from '@/components/comm/header/BackHeader'
	import orderFooter from '@/components/comm/footer/InquiryFooter'
	import scroller from '@/components/comm/Scroller'
	import normalLayout from '@/components/layout/Layout'
	import horiScroller from '@/components/comm/HoriScroller'

	export default {
		name: 'myinquiryto',

		components: {
			scroller,
			normalLayout,
			backHeader,
			orderFooter,
			horiScroller
		},
    
    created(){
      let sub = plus.webview.create(config.CDN_ADDRESS + '/inquiryToInnerList', 'inquiryToInner', {
        top: '104px',
        bottom: '55px',
        overflow: 'visible'
      })
      sub.show()
      plus.webview.currentWebview().append(sub)
    },

		data(){
			return {
				loaded: true,
				pages: [
					{name: '已发布', chose: true, code: 0},
					{name: '未发布', chose: false, code: 1},
          {name: '其他状态', chose: false, code: 2}
				],
    
			}
		},

		mounted(){
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
      padding: 0 6px;
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
      background: #fcfcfc;
			margin-top: 50px;
      
      .page-item{
        @include box-vert-center-middle;
        width: 50%;
        height: 32px;
        font-size: 16px;
        text-align: center;
        
        .state{
          width: auto;
          padding: 0 15px;
          height: 32px;
          line-height: 30px;
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
