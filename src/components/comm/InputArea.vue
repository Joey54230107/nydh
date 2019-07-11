<template>
  <div class="c-input-area-case">
    <textarea :value="value" @input="change" :placeholder="placeholder" class="c-text-area" @tap="open" :maxlength="maxLength"></textarea>
    <div class="limit">{{count}}/{{maxLength}}个字</div>
    <div class="clear iconfont icon-delete" @tap.stop="clear" v-if="value"> 清空</div>
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

			value: {
				type: String,
        default: ''
      },
      
      placeholder: {
			  type: String,
        default: ''
      }
    },

    data(){
			return {
				waitting: true,
        noData: false
      }
    },

    computed: {
    	count(){
    		return this.value.length
      }
    },
    
    methods: {
			change($event){
        this.$emit('input', $event.target.value)
      },

			open(){
				utils.openSoftKeyborad()
			},
  
      clear(){
        this.$emit('input', '')
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-input-area-case{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
    border: none;
    margin: 0;

    textarea{
      @include box-vert-left-top;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      padding: 8px 10px;
      background: rgba(128, 128, 128, .1);
      color: #666;
      font-size: 12px;
      border: none;
      outline: none;
      resize: none;
    }

    .limit{
      position: absolute;
      width: auto;
      height: auto;
      color: #999;
      font-size: 12px;
      bottom: 5px;
      z-index: 5;
      right: 12px;
      margin: 0;
    }
    
    .clear{
      position: absolute;
      width: auto;
      height: auto;
      color: $textLessColor;
      font-size: 12px;
      bottom: 5px;
      z-index: 5;
      left: 12px;
      margin: 0;
    }
  }
</style>
