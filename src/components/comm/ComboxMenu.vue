<template>
  <div class="c-combox-menu-case" :style="style">
    <ul class="combox-menu-inner auto-fill" :class="'inner-' + effect">
      <i :class="['arr-' + arr, 'arr-' + effect]"></i>
      <li class="combox-item-case" :class="'item-' + effect" v-for="item in resource" @tap="handler(item)">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>

	export default {
		name: 'comboxmenu',
    
    props: {
			width: {
				type: String,
        default: '100%'
      },
      resource: {
				type: Array,
        default: []
      },
      arr: {
				type: String,
        default: 'top-left'
      },
      offsetY: {
			  type: String,
        default: '7px'
      },
      effect: {
			  type: String,
        default: 'white'
      }
    },

		data(){
			return {
				style: this.initStyle()
			}
		},

		mounted(){
			let parentEl = this.$el.parentNode
			parentEl.addEventListener('tap', () => {
				this.$el.style.display = 'block'
				event.stopPropagation()
      })
		},

    methods: {
			handler(item){
				event.stopPropagation()
				this.$emit('handler', item)
				this.$el.style.display = 'none'
      },
      
      initStyle(){
			  let style = {
          width: this.width,
          height: 'auto',
          'margin-top': this.offsetY
        }
        if(this.arr == 'top-left'){
          style.left = '2px'
        }else if(this.arr == 'top-right'){
          style.right = '2px'
        }
        return style
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .c-combox-menu-case{
    margin: 0 auto;
    display: none;
    position: absolute;
    height: auto;
    top: 100%;
    z-index: 500;
    font-size: 14px;
  }

  .combox-menu-inner{
    @include box-vert-left-top;
    width: 100%;
    border-radius: 9px;
    position: relative;
  
    &.inner-white{
      background: #fff;
      color: #333;
    }
    &.inner-dark{
      background: #454545;
    }
  
    .combox-item-case{
      @include box-hori-center-middle;
      height: 40px;
  
      &.item-white{
        border-bottom: solid 1px #e1e1e1;
        
        &:last-child{
          border-bottom: none;
        }
        
        &:active{
          background: rgba(0, 0, 0, .05);
        }
      }
      &.item-dark{
        border-bottom: solid 1px #666;
  
        &:last-child{
          border-bottom: none;
        }
      }
    }
  
    i{
      width: 0;
      height: 0;
      border: solid 8px transparent;
      position: absolute;
      z-index: 100;
      overflow: hidden;
    
      &.arr-top-left{
        top: -16px;
        left: 12px;
  
        &.arr-white{
          border-bottom-color: #fff;
        }
        &.arr-dark{
          border-bottom-color: #666;
        }
      }
      &.arr-top-right{
        top: -16px;
        right: 12px;
  
        &.arr-white{
          border-bottom-color: #fff;
        }
        &.arr-dark{
          border-bottom-color: #666;
        }
      }
    }
  }
</style>
