<template>
  <div class="c-flag-case" :style="{'width': size + 'px', 'height': size + 'px'}" @tap="handle">
    <slot></slot>
    <div class="flag-inner" :style="style"></div>
  </div>
</template>

<script>

	export default {
		props: {
			size: {
				type: String,
        default: '16'
      },
      
      activeColor: {
        type: String,
        default: '#DF6158'
      },
      
      normalColor: {
        type: String,
        default: '#eee'
      },
      
      active: {
        type: Boolean,
        default: false
      },

      dirs: {
				type: String,
        default: 'right'
      }
    },

    computed: {
			style(){
				if(this.dirs == 'left'){
					return {
						border: 'solid ' + this.size * .5 + 'px transparent',
            'border-top-color': this.active ? this.activeColor : this.normalColor,
						'border-left-color': this.active ? this.activeColor : this.normalColor
          }
        }else{
					return {
						border: 'solid ' + this.size * .5 + 'px transparent',
						'border-top-color': this.active ? this.activeColor : this.normalColor,
						'border-right-color': this.active ? this.activeColor : this.normalColor,
          }
        }
      }
    },
    
    methods: {
      handle(item){
        this.$emit('handle', item)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-flag-case{
    position: absolute;
    display: block;
    border: none;
    overflow: hidden;
    z-index: 1000;
    
    .flag-inner{
      width: 0;
      height: 0;
    }
  }
</style>
