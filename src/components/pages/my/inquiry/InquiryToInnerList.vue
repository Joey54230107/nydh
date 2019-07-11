<template>
  <div id="inquiryInnerListContainer" class="mui-content mui-scroll-wrapper page">
    <div class="mui-scroll">
      <div class="p-inquiryto-inner-case">
        <ul class="chose-case">
          <li v-for="(item, idx) in list" class="chose-item-case">
            <span :class="item.chose ? 'iconfont icon-check' : 'chose-false'" @tap="choseItem(item)"></span>
          </li>
        </ul>
        <!--<ul class="list-case" :style="{'transform': transform}">
          <li v-for="(item, idx) in list" class="item-case">
            <div class="item-inner-case">
              <flag v-if="item.flag">{{item.flag}}</flag>
              <h2 :style="{'padding-left': item.flag ? '20px' : '0'}">{{item.name}}</h2>
              <time>{{item.time | toDate('/')}}</time>
              <span class="icon iconfont icon-right-arr"></span>
              <div class="item-btm auto-fill">
                <label :class="'state-' + item.state">{{item.state ? '已经有人报价了，快去看看吧' : '还没有人给您报价'}}</label>
              </div>
            </div>
          </li>
        </ul>-->
        
        <slider-list class="list-case" :style="{'transform': transform}">
          <slider-blocker v-for="(item, idx) in list" class="item-case" :key="item.id" :id="'item_' + idx">
            <div class="item-inner-case">
              <flag v-if="item.flag">{{item.flag}}</flag>
              <h2 :style="{'padding-left': item.flag ? '20px' : '0'}">{{item.name}}</h2>
              <time>{{item.time | toDate('/')}}</time>
              <span class="icon iconfont icon-right-arr"></span>
              <div class="item-btm auto-fill">
                <label :class="'state-' + item.state">{{item.state ? '已经有人报价了，快去看看吧' : '还没有人给您报价'}}</label>
              </div>
            </div>
          </slider-blocker>
        </slider-list>
      </div>
    </div>
  </div>
</template>

<script>
	import config from '../../../../../config/address.js'
  import imageLoader from '@/components/comm/ImageLoader'
  import flag from '@/components/comm/Flag'
  import sliderBlocker from '@/components/comm/SliderBlocker'
  import sliderList from '@/components/comm/SliderList'

	export default {
		name: 'myinquirytoinnerlist',

		components: {
      imageLoader,
      flag,
      sliderBlocker,
      sliderList
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
				transform: 'translateX(0)',
			  list: [
          {name: '十亩茶花 200株', time: '1531981769371', flag:'急', state:true, chose:false},
          {name: '香樟树，朴树 1车', time: '1531981769371', state:true, chose:false},
          {name: '冷香玫瑰 直径12公分 200朵冷香玫瑰 直径12公分 200朵', time: '1531981769371', state:false, chose:false},
          {name: '三叶地锦', time: '1531981769371', flag:'NEW', state:false, chose:false},
          {name: '桂花 无忧树 1000株', time: '1531981769371', state:true, chose:false},
          {name: '毛白杨 2米分支 120棵', time: '1531981769371', state:false, chose:false}
        ]
			}
		},

		mounted(){
      document.body.addEventListener('tap', () => {
        let combox = document.body.querySelector('.c-combox-menu-case')
        combox && (combox.style.display = 'none')
      })

			window.addEventListener('toOrder', (e, a) => {
				console.log(a)
				this.transform = 'translateX(60px)'
			})
      
      window.addEventListener('cancelOrder', (e, a) => {
        this.transform = 'translateX(0px)'
        this.list.forEach(item => {
          item.chose = false
        })
      })
		},

		methods: {
      pulldownRefresh(){
        window.setTimeout(() => {
          mui('#inquiryInnerListContainer').pullRefresh().endPulldownToRefresh()
        }, 2000)
      },
      
      choseItem(item){
        item.chose = !item.chose
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
    background: #e1e1e1;
  }

	.p-inquiryto-inner-case{
    padding: 0 8px 10px 8px;
    position: relative;
    background: #e1e1e1;

    .chose-case{
      @include box-vert-left-top;
      height: auto;
      width: 80px;
      position: absolute;
      top: 10px;
      left: 0;

      .chose-item-case{
        @include box-vert-center-middle;
        height: 76px;

        span{
          width: 24px;
          height: 24px;
          border-radius: 24px;
          overflow: hidden;
          text-align: center;
  
          &.icon-check{
            line-height: 24px;
            background: #ec8a7c;
            font-size: 18px;
            color: #fff;
          }
          &.chose-false{
            border: solid 2px #ec8a7c;
            background: rgba(255, 255, 255, 1);
          }
        }
      }
    }
    
    .list-case{
      @include box-vert-left-top;
      height: auto;
      box-shadow: 0 0 10px #dedede;
      border-radius: 6px;
      transition: transform .3s;
      
      .item-case{
        @include box-vert-left-top;
        width: 100%;
        height: 76px;
        position: relative;
        border-radius: 0;
        background: #fff;
        border-bottom: solid 1px #D9D9D9;
        
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
          background: #fff;
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
            top: 45px;
            color: rgba(0, 0, 0, .2);
            font-size: 24px;
            width: 24px;
            height: 30px;
          }
          
          .item-btm{
            @include box-hori-left-bottom;
            
            label{
              height: auto;
              color: #999;
              font-size: 12px;
              
              &.state-true{
                color: #74baf3
              }
            }
          }
        }
      }
    }
  }
</style>
