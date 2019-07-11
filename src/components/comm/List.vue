<template>
  <div class="c-list-case auto-fill" style="background:#ff0000; overflow: hidden;">
    <!--<div class="c-list-watting-case" v-if="status == 1" style="background:#ff0000;">12222222222222222</div>-->
    <div class="c-no-data-case" style="background:#ccc;">
      <div style="width:100%; height:auto;font-size:64px; background:#000; color:#ff0000;border:solid 1px #000;">32</div>
    </div>
    <!--<slot v-if="status == 2"></slot>-->
  </div>
</template>

<script>

	export default {
		props: {
			status: {
				type: [String, Number],
        default: '0'
      }
    },

    data(){
			return {
				waitting: true,
        noData: false
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
  
  .c-list-case{
    @include box-vert-left-top;
    width: 100%;
    height: auto;

    .c-list-watting-case{
      @include box-vert-center-middle;
      width: 100%;
      height: 100%;
      background: url("~@/assets/img/load2.gif") center 100px/42px 42px no-repeat;
    }

    .c-no-data-case{
      @include box-vert-center-middle;
      width: 100%;
      height: 100%;
      background: #ff0000;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100000;

      .icon-nodata2{
        font-size: 32px;
        height: auto;
        color: #ccc;
      }
    }
  }
</style>
