<template>
  <ul class="c-ring-case" :style="style">
    <!--<i :style="{'background': bgColor}"></i>-->
    <!--<span class="pointer" :style="{'height': size + 'px', 'width': size + 'px', 'background': color}" v-if="percent != 0"></span>
    <span class="pointer" :style="{'height': size + 'px', 'width': size + 'px', 'background': color}" v-if="percent != 0"></span>-->
    <span class="bg-cirle" :style="{'line-height': (height - size * 2) + 'px', 'width': width + 'px', 'height': height + 'px', 'border': 'solid ' + size + 'px ' + bgColor}"><!--{{Math.floor(percent * 100)}}<a class="percent">%</a>--></span>
    <li class="left-case" :style="halfStyle">
      <div style="position:absolute;top:0;overflow:hidden;" :style="{halfStyle, 'left':width*.5+'px'}">
        <div :style="{'width':width*.5+'px', 'height':height+'px', 'transform': 'rotate(' + leftAngle + ')', 'border':'solid ' + size + 'px ' + color, 'border-left':'none'}" style="border-radius:0 100px 100px 0;transform-origin:left;"></div>
      </div>
    </li>
    <li class="right-case" :style="halfStyle">
      <div style="position:absolute;top:0;overflow:hidden;" :style="{halfStyle, 'left':(0-width*.5)+'px'}">
        <div :style="{'width':width*.5+'px', 'height':height+'px', 'transform': 'rotate(' + rightAngle + ')', 'border':'solid ' + size + 'px ' + color, 'border-right':'none'}" style="border-radius:100px 0 0 100px;transform-origin:right;"></div>
      </div>
    </li>
    <slot></slot>
  </ul>
</template>

<script>
	export default {
		name: 'ring',
    
    props: {
      width: {
        type: [String, Number],
        default: '50'
      },
      height: {
        type: [String, Number],
        default: '50'
      },
      size: {
        type: String,
        default: '4'
      },
      percent: {
      	type: [String, Number],
        default: 0
      },
      color: {
        type: String,
        default: '#ffb000'
      },
      bgColor: {
        type: String,
        default: '#ffb000'
      }
    },
    
    data(){
		  return {
		  	leftAngle: this.setLeftAngle(),
        rightAngle: this.setRightAngle(),
        style: {
          width: this.width + 'px',
          height: this.height + 'px'
        },
        halfStyle: {
          width: this.width * .5 + 'px',
          height: this.height + 'px'
        }
      }
    },

    mounted(){
    	console.log(this.leftAngle, this.rightAngle)
    },

    methods: {
    	setLeftAngle(){
    		if(this.percent == 0){
    			return '180deg'
        }else{
					if(Number(this.percent) <= .5){
						return (0 - (180 - 180 * this.percent / .5)) + 'deg'
					}else{
						return '0deg'
					}
        }
      },

      setRightAngle(){
    		if(this.percent == 1){
    			return '0deg'
        }else{
					if(Number(this.percent) > .5){
						return (180 - 180 * (.5 - this.percent) / .5) + 'deg'
					}else{
						return '180deg'
					}
        }
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .c-ring-case{
    @include box-hori-left-top;
    position: relative;
    color: #e77c6e;
    overflow: hidden;
    border-radius: 100px;

    i{
      z-index: 50;
      width: 6px;
      height: 6px;
      position: absolute;
      top: -2px;
      left: 50%;
      margin-left: -2px;
      border-radius: 5px;
    }
    
    .pointer{
      position: absolute;
      top: 0;
      left: 23px;
      border-radius: 30px;
      z-index: 1000;
    }

    .percent{
      font-size: 10px;
      color: #666;
    }

    .bg-cirle{
      border-radius: 100px;
      position: absolute;
      top: 0;
      left: 0;
      text-align: center;
      font-size: 16px;
      display: block;
    }
    
    .left-case{
      position: relative;
      overflow: visible;
      padding: 0;
    }
    .right-case{
      position: relative;
      overflow: visible;
      padding: 0;
    }
  }
</style>
