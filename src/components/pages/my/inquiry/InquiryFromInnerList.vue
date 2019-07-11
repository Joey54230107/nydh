<template>
  <div id="inquiryInnerListContainer" class="mui-content mui-scroll-wrapper">
    <div class="mui-scroll auto-fill">
      <div class="p-inquiryto-inner-case">
        <ul class="list-case">
          <li v-for="(item, idx) in list" class="item-case">
            <div class="item-inner-case">
              <h2 :style="{'padding-left': item.flag ? '20px' : '0'}">{{item.name}}</h2>
              <span class="icon iconfont icon-right-arr"></span>
              <time>{{item.time | toDate('/')}}</time>
              <div class="remark-case">
                <span class="iconfont icon-yinhao qcode"></span>
                {{item.remark}}
              </div>
              <div class="honour-case auto-fill">
                <span class="author-case">{{item.author}}</span>
                <span class="spliter"></span>
                <span class="iconfont" :class="[item.stateIcon, 'honour-item-case-' + item.state]"></span>
                <label class="auto-fill honour-text" :class="'honour-text-' + item.state">{{text[item.state]}}</label>
                <span class="report-case">我要报价</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
	import config from '../../../../../config/address.js'
  import imageLoader from '@/components/comm/ImageLoader'
  import flag from '@/components/comm/Flag'

	export default {
		name: 'myinquiryfrominnerlist',

		components: {
      imageLoader,
      flag
		},
    
    created(){
      mui.init({
        pullRefresh: {
          container: '#inquiryInnerListContainer',
          down: {
            callback: this.pulldownRefresh
          }/*,
					up: {
						contentrefresh: '正在加载...',
						callback: this.pulldownRefresh
					}*/
        }
      })
    },

		data(){
			return {
			  text: {'1':'信誉良好', '2':'被投诉未核实'},
			  list: [
          {name: '十亩茶花 200株', time: '1531981769371', remark:'本人种殖10亩地茶花，9月份上市，咨询相关价格，欢迎选购', stateIcon:'icon-gyd', state:'1', author:'周先生'},
          {name: '香樟树，朴树 1车', time: '1531981769371', remark:'本人种殖10亩地茶花，9月份上市，咨询相关价格，欢迎选购', stateIcon:'icon-gyd', state:'1', author:'孙先生'},
          {name: '冷香玫瑰 直径12公分 200朵冷香玫瑰 直径12公分 200朵', time: '1531981769371', remark:'本人种殖10亩地茶花，9月份上市，咨询相关价格，欢迎选购', stateIcon:'icon-exception', state:'2', author:'赵先生'},
          {name: '三叶地锦', time: '1531981769371', remark:'本人种殖10亩地茶花，9月份上市，咨询相关价格，欢迎选购', stateIcon:'icon-gyd', state:'1', author:'李先生'},
          {name: '桂花 无忧树 1000株', time: '1531981769371', remark:'本人种殖10亩地茶花，9月份上市，咨询相关价格，欢迎选购', stateIcon:'icon-gyd', state:'1', author:'王先生'},
          {name: '毛白杨 2米分支 120棵', time: '1531981769371', remark:'本人种殖10亩地茶花，9月份上市，咨询相关价格，欢迎选购', stateIcon:'icon-gyd', state:'1', author:'朱先生'}
        ]
			}
		},

		mounted(){
      document.body.addEventListener('tap', () => {
        let combox = document.body.querySelector('.c-combox-menu-case')
        combox && (combox.style.display = 'none')
      })
		},

		methods: {
      pulldownRefresh(){
        window.setTimeout(() => {
          mui('#inquiryInnerListContainer').pullRefresh().endPulldownToRefresh()
        }, 2000)
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
	@import '@/assets/style/main.scss';
  
  .mui-pull-loading{
    margin-top: 21px;
  }
  .mui-pull-caption{
    font-weight: normal;
    font-size: 14px;
  }
  .mui-pull{
    overflow: visible;
  }
  .mui-pull-top-pocket, .mui-pull-bottom-pocket{
    height: 80px;
  }
  .mui-pull-caption{
    margin-top: 3px;
  }

  #inquiryInnerListContainer{
    height: auto;
    background: #e1e1e1;
    overflow: visible;
  }

	.p-inquiryto-inner-case{
    padding: 0 8px 10px 8px;
    
    .list-case{
      @include box-vert-left-top;
      height: auto;
      //box-shadow: 0 0 10px #dedede;
      //border-radius: 6px;
      
      .item-case{
        @include box-vert-left-top;
        width: 100%;
        height: 90px;
        position: relative;
        padding-right: 10px;
        border-radius: 6px;
        background: #fff;
        margin-bottom: 10px;
        
        &:last-child{
          margin-bottom: -1px;
        }
        
        &:active{
          background: #f8f8f8;
        }
    
        .item-inner-case{
          @include box-vert-center-top;
          width: 100%;
          height: 100%;
          background: transparent;
          //border-bottom: solid 1px #dfdfdf;
          padding: 6px 10px;
          position: relative;
          overflow: hidden;
      
          h2{
            font-size: 18px;
            color: #343434;
            padding: 0 70px 0 20px;
            white-space: nowrap;
            overflow: hidden;
            height: 20px;
            text-overflow: ellipsis;
          }
          time{
            position: absolute;
            width: 70px;
            top: 0;
            right: 0px;
            padding: 8px 0 0 0;
            color: #aaa;
          }
  
          .icon{
            position: absolute;
            right: -6px;
            top: 61px;
            color: #e3615e;
            font-size: 24px;
            width: 24px;
            height: 30px;
          }
          
          .remark-case{
            display: block;
            width: 100%;
            overflow: hidden;
            padding: 0 18px;
            line-height: 18px;
            font-size: 14px;
            color: #aaa;
            white-space: nowrap;
            text-overflow: ellipsis;
            height: 24px;
            position: relative;

            .qcode{
              top: 0;
              left: 0;
              position: absolute;
              color: #f8b68e;
            }
          }
          
          .honour-case{
            @include box-hori-left-middle;

            .report-case{
              height: 22px;
              line-height: 20px;
              width: auto;
              color: #e3615e;
              padding-right: 4px;
            }

            .author-case{
              width: auto;
              height: 22px;
              line-height: 20px;
              color: #666;
            }
            
            .spliter{
              width: 1px;
              height: 16px;
              background: #ccc;
              margin: 0 8px 0 10px;
            }
  
            .honour-item-case-1{
              width: 22px;
              height: 22px;
              color: #5CA8E8;
              border-radius: 3px;
              padding: 0 4px;
              font-size: 18px;
              line-height: 22px;
            }
            .honour-item-case-2{
              width: 22px;
              height: 22px;
              color: #e77c6e;
              border-radius: 3px;
              padding: 0 4px;
              font-size: 14px;
              line-height: 20px;
            }
  
            .honour-text{
              width: auto;
              font-size: 14px;
              height: 22px;
              line-height: 20px;
              padding-left: 4px;
              
              &.honour-text-1{
                color: #5CA8E8;
              }
              &.honour-text-2{
                line-height: 20px;
                padding-left: 0px;
                color: #e77c6e;
              }
            }
          }
        }
      }
    }
  }
</style>
