<template>
  <div class="c-image-loader-case" :style="bgStyle" @tap="tapHandler" :class="(err || src == '') ? defaultCls : ''">
    <span class="def iconfont icon-image2" v-if="cancel && (!defaultCls)"></span>
    <span class="def-no-bg" :class="defaultCls" v-if="cancel && (defaultCls)"></span>
    <slot></slot>
  </div>
</template>

<script>

	export default {
    props: {
		  src: {
		    type: String,
        default: ''
      },
  
      mode: {
		    type: String,
        default: 'background' //background | img
      },

      effect: {
		  	type: String,
        default: 'cover'  //cover=自动按比例填充(会裁剪), auto=计算图片尺寸与容器尺寸,选择合适比列填充,费性能, full=无脑拉伸
      },

      bgColor: {
		  	type: String,
        default: 'transparent'
      },

			defaultCls: {
		  	type: String,
        default: ''
      }
    },

		data(){
			return {
			  bgStyle: {
          //transition: 'opacity .3s'
        },
        err: false,
        cancel: true
			}
		},

    mounted(){
      this.setImage()
		},
    
    watch: {
      src(newVal, oldVal){
        if(newVal && (newVal != oldVal)){
          this.setImage()
        }
      }
    },

    methods: {
			tapHandler(){
				this.$emit('tapHandler')
      },
      
      setImage(){
        if(this.src){
          let img = new Image()
          img.src = this.src + '?t=' + Math.random()
          
          img.onload = () => {
            if(this.effect == 'cover'){
              this.cancel = false
              this.$set(this.bgStyle, 'background', 'url(' + img.src + '?t=' + Math.random() + ') center center/cover no-repeat ' + this.bgColor)
              this.$set(this.bgStyle, 'opacity', 1)
            }
          }
    
          img.onerror = () => {
            this.err = true
            this.bgStyle.opacity = 1
            if(this.defaultCls){
              this.cancel = false
            }
            //console.log('load image err', this.defaultCls)
          }
        }else{
        
        }
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-image-loader-case{
    @include box-vert-center-middle;
    position: relative;
    width: 100%;
    height: 100%;
    transition: background .2s, opacity .2s;
    background: #fff;
  
    .def{
      @include box-vert-center-middle;
      width: 100%;
      height: 100%;
      font-size: 12px;
      color: rgba(0, 0, 0, .2);
      background: #e5e5e5;
    }
  
    .def-no-bg{
      @include box-vert-center-middle;
      width: 100%;
      height: 100%;
    }
  
  }
</style>
