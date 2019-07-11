<template>
  <div :id="id" class="auto-fill def-scroller" :class="dir == 'vert' ? 'mui-scroll-wrapper' : 'scroll-hori-inner'">
    <div :class="dir == 'vert' ? 'mui-scroll' : 'scroll-hori-inner'">
      <div class="scroll-contents" :class="loadMore ? 'scroll-loader-contents' : ''" :style="style">
        <slot v-if="state == '2'"></slot>
  
        <!--上拉读取数据-->
        <div class="more-case" v-if="loadMore && state == '2'" :class="'more-case-' + flag2">
          <span class="icon" v-if="showIcon2"></span>
          {{tip2}}
        </div>
      </div>
    </div>

    <!--等待加载界面、对于上拉读取，下拉刷新来说，不要改变status -->
    <div v-if="state != '0' && state != '2'" class="waitting-case">
      <img :src="require('@/assets/img/load2.gif')" class="loading-img" />
      <label>加载中...</label>
    </div>

    <div v-if="state == '0'" class="no-data-case">
      <img :src="require('@/assets/img/none.png')" class="none" />
      <h4 v-if="!$slots['no-data']">暂时没有查到任何数据，请稍后再试一试吧</h4>
      <slot name="no-data"></slot>
    </div>

    <!--下拉刷新-->
    <div class="refresh-case" v-if="loadRefresh && showRefresh">
      <span class="icon" v-if="showIcon"></span>
      {{tip}}
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

      type: {
      	type: String,
        default: ''
      },
      
      //当有上拉取数据时，第一次取大于此数值时才显示上拉取数据模块
      min: {
        type: [String, Number],
        default: 10
      },
      
      id: {
      	type: [String, Number],
        default: 'scroll_' + Math.floor((1 + Math.random())*1000000)
      },

			status: {
				type: [String, Number],
				default: '1'
      }
    },

		data(){
			return {
			  loadMore: !!this.$listeners.loadMore,
        loadRefresh: !!this.$listeners.loadRefresh,
        flag: true, //上拉取数据锁
        flag2: true, //下拉刷新锁
        tip: '下拉刷新',
        tip2: '上拉加载数据',
        showIcon: false,
        showIcon2: false,
        showRefresh: false,
        translateY: 0,
        action: false,
        action2: false,
        style: {
			    transform: 'translateY(0)',
          opacity: 1
        },
        state: '1'
			}
		},
    
    watch: {
      status(newVal, oldVal){
        if(newVal == '3'){
          return ;
        }
        if(newVal == '1' || (newVal != '0' && newVal != '2')){
          this.state = '1'
        }else if((newVal == '2' || newVal == '0') && (newVal != oldVal)){
          this.state = newVal
        }
      }
    },

		mounted(){
			mui.init({
				gestureConfig:{
					hold: true,
					release: true
				}
			});
			
      let scroller = mui('.mui-scroll').scroll({
        indicators: false
      })
      
      this.$emit('setScroller', scroller)
      
      document.getElementById(this.id).addEventListener('release', e => {
        
        /*下拉刷新*/
        if(this.loadRefresh && this.action){
          //this.translateY = 40
          Object.assign(this.style, {
            transform: 'translateY(40px)'
          })
          this.showIcon = true
          this.tip = '正在拼命加载...'
          let success = false
          const callback = (success, rs, oldRs) => {
            oldRs.splice(0, 1000)
            rs.forEach(item => {
              oldRs.push(item)
            })
            this.showIcon = false
            this.action = false
            //this.translateY = 0
            Object.assign(this.style, {
              transform: 'translateY(0)'
            })
            this.showRefresh = false
            this.tip = '刷新当前数据'
            this.tip2 = '上滑加载数据'
            setTimeout(() => {
              scroller.scrollTo(0, 0, 0)
              this.flag = true
              success = true
            }, 500)
          }
  
          setTimeout(() => {
            this.$emit('loadRefresh', callback)
          }, 1000)
  
          //5秒后默认自动恢复原状，哪怕更新失败
          success || setTimeout(() => {
            this.flag = true
            this.showIcon = false
          }, 5 * 1000)
        }
        
        /*上拉取数据*/
        if(this.loadMore && this.action2){
          this.showIcon2 = true
          this.tip2 = '正在拼命加载...'
          let success = false
          const callback = (success, rs, oldRs) => {
            if(rs && Array.isArray(rs) && rs.length > 0){
              rs.forEach(item => {
                oldRs.push(item)
              })
            }
            this.showIcon2 = false
            this.tip2 = rs.length > 0 ? '上滑加载数据' : '暂无新数据'
            this.action2 = false
  
            setTimeout(() => {
              this.flag2 = true
              success = true
            }, 500)
          }
  
          setTimeout(() => {
            this.$emit('loadMore', callback)
          }, 1000)
  
          //5秒后默认自动恢复原状，哪怕更新失败
          success || setTimeout(() => {
            this.flag2 = true
            this.showIcon2 = false
          }, 5 * 1000)
        }
			})
   
			document.getElementById(this.id).addEventListener('scroll', e => {
        let y = Math.abs(scroller.y), y2 = scroller.y, maxY = Math.abs(scroller.maxScrollY)
        this.$emit('scrollHandler', scroller)
        
        if((!this.loadMore) && (!this.loadRefresh)){
          this.flag2 = this.flag = false
          return ;
        }
        
        //上拉加载
        if(maxY <= y - 60){
          if(this.flag2){
            this.flag2 = false
            this.action2 = true
          }
        }

        if(y2 >= 60){
					//下拉刷新动作
          if(this.flag) {
            this.action = true
            this.flag = false
            this.showRefresh = true
          }
        }
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
    transition: transform .3s, opacity .3s;

    .refresh-case{
      @include box-hori-center-middle;
      height: 50px;
      position: absolute;
      top: 0;
      left: 0;
      color: $textLessColor;

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
      
      .loading-img{
        margin-top: 160px;
        width: 32px;
        height: 32px;
      }

      label{
        padding-top: 10px;
        color: $textLessColor;
      }
    }

    .no-data-case{
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
    transition: transform .3s, opacity .3s;
    
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
