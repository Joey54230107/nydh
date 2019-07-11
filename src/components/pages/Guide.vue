<template>
  <div class="cp-guide">
    <footer></footer>
  </div>
</template>

<script>
  import address from '../../../config/address'
  import utils from '@/plugins/utils'

	export default {
		name: 'guide',

		data(){
			return {
				opacity: 1,
        m: Math.random()
			}
		},

		mounted(){
			//new Message()
		}
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

	.cp-guide{
		@include box-vert-center-middle;
    width: 100%;
    height: 100%;
    font-size: 48px;
    position: absolute;
    z-index: 1000;
    background: #f7f7f7;
    transition: opacity 1s;

    footer{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 100px;
      background: #fff;
    }
	}
</style>
