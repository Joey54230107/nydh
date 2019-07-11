<template>
  <div class="c-radio-case" :class="'radio-state-' + value" @tap="radioClick">
    <label :class="'pos-' + !!value">
      <span class="iconfont icon-check" v-if="value"></span>
      <span class="iconfont icon-close" v-if="!value"></span>
    </label>
    <span class="pointer" :class="'pointer-' + value"></span>
    <slot></slot>
  </div>
</template>

<script>

	export default {
		props: {
		  value: {
		    type: Boolean,
        default: 0
      }
    },
    
    data(){
      return {
      
      }
    },
    
    methods: {
      radioClick(){
        let value = this.value ? false : true
        this.$emit('input', value)
        //this.$emit('clickHandler', value)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-radio-case{
    @include box-hori-left-middle;
    width: 65px;
    height: 24px;
    border-radius: 32px;
    overflow: hidden;
    position: relative;
    transition: background .2s;
    
    label{
      @include box-hori-center-middle;
      height: 100%;
      font-size: 16px;
      color: #fff;
      
      &.pos-true{
        padding-right: 34px;
      }
      &.pos-false{
        padding-left: 34px;
      }
      
      .icon-close{
        font-size: 24px;
      }
      .icon-check{
        font-size: 16px;
      }
    }
    
    .pointer{
      position: absolute;
      width: 22px;
      height: 22px;
      background: #fff;
      border-radius: 26px;
      top: 1px;
      transition: left .2s;
  
      &.pointer-true{
        left: 42px;
      }
      &.pointer-false{
        left: 1px;
      }
    }
  
    &.radio-state-true{
      background: $blue;
    }
  
    &.radio-state-false{
      background: $red;
    }
  }
</style>
