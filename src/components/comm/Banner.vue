<template>
  <div :id="id" class="mui-slider banner-case" >
    <div class="mui-slider-group mui-slider-loop">
      <div class="mui-slider-item mui-slider-item-duplicate" :style="{'background-color': resource[(resource.length - 1)].bgColor}">
        <img :src="resource[(resource.length - 1)].imgUrl">
      </div>
      <div class="mui-slider-item" v-for="pic in resource" :style="{'background-color': pic.bgColor}">
        <img :src="pic.imgUrl">
      </div>
      <div class="mui-slider-item mui-slider-item-duplicate" :style="{'background-color': resource[0].bgColor}">
        <img :src="resource[0].imgUrl">
      </div>
    </div>
    <!--<div class="mui-slider-indicator">
      <div class="mui-indicator mui-active"></div>
      <div class="mui-indicator"></div>
      <div class="mui-indicator"></div>
      <div class="mui-indicator"></div>
    </div>-->
  </div>
</template>

<script>
  export default {
    name: 'banner',
    
    props: {
      id: {
        type: String,
        default: ''
      },
      
      interval: {
        type: [String, Number],
        default: 5000
      },
      
      resource: {
        type: Array
      }
    },
    
    data(){
      return{}
    },
    
    mounted(){
      console.log(this.resource)
      if(this.id){
        let slider = mui("#" + this.id)
        slider.slider({
          interval: parseInt(this.interval + '')
        })
      }
    }
  }
</script>


<style lang="scss" scoped type="text/scss">
  .banner-case{
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    .mui-slider-group{
      width: 100%;
      height: 100%;
      text-align: center;
      
      .mui-slider-item{
        
        img{
          height: 100%;
          width: 100%;
        }
        
        label{
          width: 100%;
          height: 30px;
          background: rgba(0, 0, 0, .4);
          display: block;
          position: absolute;
          bottom: 0;
          left: 0;
          line-height: 30px;
          color: #fff;
          padding-left: 10px;
          text-align: left;
        }
      }
    }
    
    .mui-slider-indicator{
      width: auto;
      right: 10px;
      bottom: 5px;
      
      .mui-indicator{
        width: 10px;
        height: 10px;
        border-radius: 10px;
        box-shadow: none;
        transition: background .3s;
        margin: 1px 3px;
      }
    }
  }
</style>
