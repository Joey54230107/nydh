<template>
  <div class="c-alert-masker-case" @tap="close" v-if="innerShow">
    <div class="dialog-wrapper" :style="{'height': size + 'px', 'transform': 'translateY(' + y + 'px)'}" @tap.stop="voids">
      <slot></slot>
    </div>
  </div>
</template>

<script>

	export default {
		props: {
			show: {
			  type: Boolean,
        default: false
      },
      
      size: {
        type: String,
        default: '120'
      }
    },
    
    data(){
		  return {
		    y: 0,
        innerShow: false
      }
    },

    methods: {
      close(){
        this.$emit('closeHandler')
      },
  
      voids(){}
    },
    
    watch: {
		  show(curVal, oldVal){
        if(curVal === true){
          this.innerShow = true
          setTimeout(()=>{
            this.y = 0 - this.size
          }, 100)
        }else{
          this.y = 0
          setTimeout(()=>{
            this.innerShow = false
          }, 100)
        }
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-dialog-masker-case{
    @include box-vert-left-top;
    position: fixed;
    display: block;
    border: none;
    overflow: hidden;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    
    .dialog-wrapper{
      @include box-vert-left-top;
      height: auto;
      width: 100%;
      position: absolute;
      top: 100%;
      left: 0;
      transition: transform .2s;
    }
  }
</style>
