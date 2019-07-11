<template>
  <div class="c-license-case" :class="'c-license-case-' + !!num" :style="{'width': size + 'px', 'height': size + 'px', 'border-radius': size + 'px'}">
    <span class="card-province" v-if="num">{{province}}{{letter}}</span>
    <div class="card-num auto-fill" v-if="num">{{otherNumber}}</div>
    <div class="no-card" v-if="!num">无车辆</div>
  </div>
</template>

<script>

	export default {
		props: {
			size: {
				type: String,
        default: '50'
      },
      
      num: {
        type: String,
        default: ''
      }
    },

    computed: {
			province(){
				if(this.num && this.num.length >= 7){
				  return this.num.substring(0, 1)
        }
        return ''
      },
      
      letter(){
        if(this.num && this.num.length >= 7){
          return this.num.substring(1, 2).toUpperCase()
        }
        return ''
      },
  
      otherNumber(){
        if(this.num && this.num.length >= 7){
          return this.num.substring(2).toUpperCase()
        }
        return ''
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
  
  .c-license-case{
    @include box-vert-left-top;
    position: relative;
    color: #fff;
    overflow: hidden;
  
    &.c-license-case-true{
      background: #74baf3;
      border: solid 2px #008de1;
    }
    &.c-license-case-false{
      background: #dedede;
      border: solid 2px #ccc;
    }
    
    .card-province{
      @include box-hori-center-middle;
      width: 100%;
      height: 40%;
      font-size: 12px;
    }
    
    .card-num{
      @include box-hori-center-top;
      width: 100%;
      font-size: 12px;
      background: #008de1;
    }
    
    .no-card{
      @include box-hori-center-middle;
      width: 100%;
      height: 100%;
      color: #999;
      font-size: 12px;
    }
  }
</style>
