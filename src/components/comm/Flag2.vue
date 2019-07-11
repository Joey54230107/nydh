<template>
  <div class="c-flag2-case" @tap="handle" :class="'chose-' + check">
    <span class="flag2-span" :class="'chose-' + check"></span>
    <a :class="'chose-' + check"></a>
    <div class="iconfont icon-check" :class="'icon-check-' + check"></div>
  </div>
</template>

<script>

	export default {
		props: {
			check: {
				type: Boolean,
        default: false
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
  
  .c-flag2-case{
    width: 42px;
    height: 21px;
    position: absolute;
    display: block;
    border: solid 1px #dedede;
    border-bottom: none;
    z-index: 1000;
    overflow: visible;
  
    &.chose-true{
      border: solid 0 #DF6158;
      background: linear-gradient(#f8b68e, #DF6158);
    }
    &.chose-false{
      border: solid 1px #dedede;
      background: #fff;
    }
    
    span{
      display: block;
      position: absolute;
      top: 100%;
      overflow: hidden;
      z-index: 1;
      width: 0;
      height: 0;
      border-left: solid 21px transparent;
      border-right: solid 21px transparent;
      border-bottom: solid 8px transparent;
  
      &.chose-true{
        border-top: solid 8px #DF6158;
      }
      &.chose-false{
        margin-top: 1px;
        left: -1px;
        border-top: solid 8px #dedede;
      }
    }
  
    a{
      width: 0;
      height: 0;
      position: absolute;
      top: 100%;
      left: -1px;
      z-index: 2;
      display: block;
      border-left: solid 21px transparent;
      border-right: solid 21px transparent;
      border-bottom: solid 8px transparent;
  
      &.chose-true{
        border-top: solid 8px rgba(223, 97, 88, .3);
      }
      &.chose-false{
        border-top: solid 8px #fff;
      }
    }
    
    .icon-check{
      @include box-vert-center-middle;
      width: 100%;
      height: 100%;
      font-size: 16px;
      padding-top: 2px;
    }
    .icon-check-true{
      color: #fff;
    }
    .icon-check-false{
      color: #eee;
    }
  }
</style>
