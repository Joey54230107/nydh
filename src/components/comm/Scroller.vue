<template>
  <div :id="id" class="auto-fill def-scroller" :class="dir == 'vert' ? 'mui-scroll-wrapper' : 'scroll-hori-inner'">
    <div :class="dir == 'vert' ? 'mui-scroll' : 'scroll-hori-inner'">
      <div class="scroll-contents" :class="load ? 'scroll-loader-contents' : ''">
        <slot v-if="status == '2'"></slot>
      </div>
    </div>

    <!--等待加载界面-->
    <div v-if="status == '1' && (!load) && (!refresh)" class="waitting-case">
      <img :src="require('@/assets/img/load2.gif')" />
      <label>加载中...</label>
    </div>

    <div v-if="status == '0'" class="no-data-comp-case">
      <img :src="require('@/assets/img/none.png')" class="none" />
      <h4 v-if="!$slots['no-data']">暂时没有查到任何数据，请稍后再试一试吧</h4>
      <slot name="no-data"></slot>
    </div>
  </div>
</template>

<script>
	export default {
		name: 'scroller',
    
    props: {
      dir: {
        type: String,
        default: 'vert'
      },
  
      load: {
        type: Boolean,
        default: false
      },
  
      refresh: {
        type: Boolean,
        default: false
      },

      type: {
      	type: String,
        default: ''
      },
      
      //当有上拉取数据时，第一次取大于此数值时才显示上拉取数据模块
      min: {
        type: [String, Number],
        default: 10
      },
  
      indicators: {
        type: Boolean,
        default: true
      },

      id: {
      	type: [String, Number],
        default: 'scroll_' + Math.random()
      },

			status: {
				type: [String, Number],
				default: '2'
      }
    },

		data(){
			return {
        size: 1,
				opa: 0,
				rotate: 0
			}
		},

		mounted(){
			mui.init({
				gestureConfig:{
					hold: true,
					release: true
				}
			})
      
      let scroller = mui('.mui-scroll').scroll({
        indicators: false
      })
      this.$emit('setScroller', scroller)
      
      document.getElementById(this.id).addEventListener('release', e => {
        
        if(this.refresh && this.action){
          this.translateY = 40
          this.showIcon = true
          this.tip = '正在拼命加载...'
          let success = false
  
          setTimeout(() => {
            this.$emit('loadRefresh', scroller, (success, len) => {
              this.showIcon = false
              this.action = false
              this.translateY = 0
              this.showRefresh = false
              this.tip = '下拉刷新'
              this.tip2 = '上拉加载数据'
      
              setTimeout(() => {
                scroller.scrollTo(0, 0, 0)
                this.flag = true
                success = true
              }, 500)
            })
          }, 1000)
  
          //10秒后默认自动恢复原状，哪怕更新失败
          success || setTimeout(() => {
            this.flag = true
            this.showIcon = false
          }, 10000)
        }
        
        if(this.load && this.action2){
          this.showIcon2 = true
          this.tip2 = '正在拼命加载...'
          let success = false
  
          setTimeout(() => {
            this.$emit('loadMore', scroller, (success, len) => {
              this.showIcon2 = false
              this.tip2 = len > 0 ? '上拉加载数据' : '暂无新数据'
              this.action2 = false
      
              setTimeout(() => {
                this.flag2 = true
                success = true
              }, 500)
            })
          }, 1000)
  
          //10秒后默认自动恢复原状，哪怕更新失败
          success || setTimeout(() => {
            this.flag2 = true
            this.showIcon2 = false
          }, 10000)
        }
			})
   
			document.getElementById(this.id).addEventListener('scroll', e => {
        this.$emit('scrollHandler', scroller)
      })
		}
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .vert-scroll{
    @include box-vert-left-top;
  }
  
  .def-scroller{
    position: relative;
    padding: 0;

    .refresh-case{
      @include box-hori-center-middle;
      height: 50px;
      position: absolute;
      top: 0;
      left: 0;

      .icon{
        @include box-vert-center-middle;
        width: 24px;
        height: 24px;
        background: url("~@/assets/img/load2.gif") center 3px/18px 18px no-repeat;
      }
    }

    .waitting-case{
      @include box-vert-center-top;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      
      img{
        margin-top: 160px;
        width: 32px;
        height: 32px;
      }

      label{
        padding-top: 10px;
        color: $textLessColor;
      }
    }

    .no-data-comp-case{
      @include box-vert-center-middle;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      
      .none{
        margin-top: -30%;
        width: 115px;
        height: 111px;
      }
  
      h4{
        @include box-hori-center-top;
        text-align: center;
        line-height: 24px;
        width: 60%;
        height: auto;
        margin-top: 20px;
        color: $textColor;
        font-size: 16px;
      }

    }
  }
  
  .scroll-contents{
    height: auto;
    position: relative;
    transition: transform .2s;
    
    &.scroll-loader-contents{
      padding-bottom: 50px;
    }
  }

  .more-case{
    @include box-hori-center-top;
    width: 100%;
    height: 32px;
    position: absolute;
    bottom: 0;
    left: 0;
    //background: rgba(0, 0, 0, .75);
    border-radius: 3px;
    z-index: 50;
    color: $textColor;
    transition: transform .3s;
  
    &.more-case-false{
      color: $textColor;
    }
  
    .icon{
      width: auto;
      height: 24px;
      background: url("~@/assets/img/load2.gif") left 2px/18px 18px no-repeat;
      padding-left: 24px;
    }
  }
</style>
