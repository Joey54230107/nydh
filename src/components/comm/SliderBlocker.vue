<template>
  <div :id="id" @longtap="longTapHandler" class="c-slider-blocker" :class="item.remove ? 'item-item-remove' : ''">
    <div class="c-slider-item-inner-case" :id="'slider-inner-' + id" @scroll="nativeScroll">
      <div class="c-slider-item-slider-case" :style="{'transform':'translateX(' + x + '%)'}">
        <div class="s-masker" @tap.self="clicked" v-if="x != 0"></div>
        <div class="item-container">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import utils from '@/plugins/utils'
  
	export default {
  	created(){
			mui.init({
				gestureConfig: {
					longtap: true
				}
			})
    },

    props: {
      id: {
        type: [String, Number],
        default: Math.random() + ''
      },
      sliderWidth: {
        type: [String, Number],
        default: '40'
      },
      item: {
        type: Object
      }
    },
    
    data(){
      return {
        scrolled: false,
        obj: {},
        x: 0
      }
    },
   
    mounted(){
      let obj = document.getElementById('slider-inner-' + this.id)
      obj.addEventListener('swipeleft', (ev) => {
      	if(!this.item.default){
					this.x = '-' + this.sliderWidth
        }
			})
			obj.addEventListener('swiperight', (ev) => {
				this.x = 0
			})
      //this.item.slider = this.obj
      //this.$emit('setSliderBlocker', this.obj)
    },

    methods: {
			longTapHandler(){
    		this.$emit('longTapHandler', this.item)
      },

      nativeScroll(){
        //this.item.slider && (this.item.slider.slidered = true)
      },

      clicked(){
      	if(this.x != 0){
      		this.x = 0
      		return false
        }else{

        }
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .c-slider-blocker{
    overflow: hidden;
    position: relative;
    z-index: 10000;
    transition: transform .3s, opacity .3s;

    &.item-item-remove{
      transform: translateX(-100%);
      opacity: 0;
    }
  
    .c-slider-item-inner-case{
      @include box-vert-left-top;
      height: auto;
      width: 100%;
      position: relative;

      &::-webkit-scrollbar{
        display: none;
      }

      .s-masker{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .1);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
      }

      .c-slider-item-slider-case{
        @include box-hori-left-top;
        height: auto;
        transition: transform .4s;
        position: relative;

        .item-container{

        }
      }
    }
  }
  
</style>
