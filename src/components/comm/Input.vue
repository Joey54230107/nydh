<template>
  <div class="c-input-case">
    <label class="text" :style="{'color': textColor, 'width': textWidth + 'px'}" v-if="$slots.default">
      <slot></slot>
    </label>
    <input :type="type" class="ipt auto-fill" :value="value" @input="inputHandler" :placeholder="placeholder" :maxlength="maxLength" :id="iptId" :style="{'color': textColor, 'font-size': fontSize}" />
    <span class="iconfont icon-close2" v-show="show && cancelShow" @tap.stop="cancel"></span>
    <span class="must-input" v-if="must">（必填）</span>
  </div>
</template>

<script>
	import utils from '@/plugins/utils'

	export default {
		props: {
			maxLength: {
				type: [String, Number],
        default: ''
      },
      
      textWidth: {
        type: [String, Number],
        default: '80'
      },
      
      must: {
        type: Boolean,
        default: false
      },
      
      fontSize: {
			  type: [String, Number],
        default: '16px'
      },
      
      textColor: {
        type: [String, Number],
        default: '#666'
      },
      
      cancelShow: {
        type: Boolean,
        default: true
      },
      
      iptId: {
        type: [String, Number],
        default: ''
      },

			value: {
				type: [String, Number],
        default: ''
      },
      
      placeholder: {
			  type: [String, Number],
        default: ''
      },
      
      type: {
			  type: String,
        default: 'text'
      }
    },
  
    data(){
			return {
      }
    },
    
    computed: {
      show(){
        return (this.value + '').trim() != '' ? true : false
      }
    },
    
    methods: {
      inputHandler(e){
        let val = e.target.value
        this.$emit('input', val)
        this.$emit('changeHandler')
      },
  
      cancel(){
        this.$emit('input', '')
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-input-case{
    @include box-hori-left-middle;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
    border: none;
    margin: 0;

    label.text{
      @include box-hori-right-middle;
      height: auto;
      position: relative;
      
      i{
        width: 10px;
        height: 10px;
        background: rgba(248, 89, 89, .75);
        border-radius: 8px;
        position: absolute;
        right: 8px;
        top: -4px;
      }
    }

    input.ipt{
      height: 20px;
      border: none;
      padding: 0 6px;
      margin: 0;
      color: $textColor;
      background: transparent;
  
      &::-webkit-input-placeholder{
        color: #b0b0b0;
        font-size: 12px;
      }
    }
    
    .icon-close2{
      @include box-hori-left-middle;
      width: 16px;
      height: 100%;
      font-size: 14px;
      color: rgba(248, 89, 89, .4);
      margin-left: 10px;
    }
    
    .must-input{
      width: auto;
      padding: 0 2px;
      color: $red;
      font-size: 12px;
    }
  }
</style>
