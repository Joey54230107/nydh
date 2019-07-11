<template>
  <div class="c-confirm-btn-case">
    <div v-if="confirmStr" @tap.stop="confirmClicked" class="confirm-masker" :class="activeClass" :style="{'transform':'translateY(' + (confirm ? '0' : '100%') + ')'}">
      <span class="auto-fill confirm-txt">{{confirmStr}}</span>
      <span class="iconfont icon-close" @tap.stop="cancel"></span>
    </div>
    <div class="fix-case" @tap.stop="clicked" :style="{'transform':'translateY(' + (confirm ? '-100%' : '0') + ')'}"><slot></slot></div>
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
      },
      
      active: {
		    type: Boolean,
        default: true
      }
    },
    
    data(){
		  return {
        confirm: false
      }
    },

    methods: {
			clicked(){
        if(this.active){
          if(this.confirmStr){
            this.confirm = true
            this.$emit('callback', this.confirm)
          }else{
            this.$emit('handler')
          }
        }
      },

			confirmClicked(){
			  if(this.active){
          this.confirm = false
          this.$emit('handler')
        }
      },

			cancel(){
				this.confirm = false
				this.$emit('cancelCallback', this.confirm)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .c-confirm-btn-case{
    @include box-hori-center-middle;
    position: relative;
    overflow: hidden;

    .confirm-masker{
      @include box-hori-center-middle;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transition: transform .4s;

      span {
        @include box-vert-center-middle;
        width: 100%;
        text-align: center;
        height: 100%;

        &.confirm-txt{
          @include box-vert-center-middle;
        }
        &.icon-close{
          @include box-vert-center-middle;
          height: auto;
          border-left: solid 1px rgba(255, 255, 255, .2);
          width: 42px;
          font-weight: normal;
          font-size: 24px;
          padding-top: 1px;
        }
      }
    }

    .fix-case{
      @include box-hori-center-middle;
      height: 100%;
      transition: transform .4s;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
    }
  }
</style>
