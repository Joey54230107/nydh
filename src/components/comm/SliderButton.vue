<template>
  <div class="c-slider-btn-case" @tap.stop="clicked">
    <div v-if="confirmStr" @tap.stop="confirmClicked" class="confirm-masker" :class="activeClass" :style="{'transform':'translateX(' + (confirm ? '0' : '100%') + ')'}">
      <span class="auto-fill confirm-txt">{{confirmStr}}</span>
      <div class="auto-fill cancel" @tap.stop="cancel">
        取消
        <span class="iconfont icon-right-arr"></span>
      </div>
    </div>
    <div class="fix-case" :style="{'transform':'translateX(' + (confirm ? '-100%' : '0') + ')'}"><slot></slot></div>
  </div>
</template>

<script>
	export default {
    props: {
		  confirmStr: {
		    type: String,
        default: ''
      },

			activeClass: {
		  	type: String,
        default: ''
      }
    },
    
    data(){
		  return {
        confirm: false
      }
    },

    methods: {
			clicked(){
				if(this.confirmStr){
					this.confirm = true
        }else{
					this.$emit('handler')
        }
      },

			confirmClicked(){
				this.confirm = false
        this.$emit('handler')
      },

			cancel(){
				this.confirm = false
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .c-slider-btn-case{
    @include box-hori-center-middle;
    position: relative;
    overflow: hidden;

    .confirm-masker{
      @include box-vert-center-middle;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transition: transform .4s;

      .auto-fill{
        @include box-vert-center-middle;
        width: 100%;
        text-align: center;

        &.confirm-txt{
          @include box-vert-center-bottom;
          padding-top: 2px;
          font-weight: bold;
        }
        &.cancel{
          @include box-hori-center-top;
          padding-top: 4px;
          padding-left: 8px;
          color: #999;
          font-weight: normal;
          font-size: 12px;

          .iconfont{
            padding-top: 1px;
            font-size: 16px;
            font-weight: bold;
            color: #aaa;
          }
        }
      }
    }

    .fix-case{
      @include box-vert-center-middle;
      height: 100%;
      transition: transform .4s;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
    }

    .icon-close{
      width: 24px;
      height: 24px;
      border-radius: 0 0 20px 0;
      background: #f85959;
      position: absolute;
      top: 0;
      color: #fff;
      font-size: 20px;
      padding-left: 1px;
      left: 0;
    }
  }
</style>
