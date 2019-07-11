<template>
  <div class="waiting-case">
    <div class="outer-ring-case">
      <div class="inner-ring-case">
        <div class="long-case"><i></i></div>
        <div class="short-case"><i></i></div>
        <span class="pointer"></span>
      </div>
    </div>
  </div>
</template>

<script>
	import utils from '@/plugins/utils'
	import config from '../../../config/address.js'
	import UserBo from '@/model/bo/User'
	import comboxMenu from '@/components/comm/ComboxMenu'
  import service from '@/api/service'

	export default {
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';

  .waiting-case {
    @include box-vert-center-middle;
    width: 100%;
    height: 100%;
    //background: rgba(0, 0, 0, .3);

    .outer-ring-case{
      @include box-vert-center-middle;
      width: 50px;
      height: 50px;
      border-radius: 50px;
      border: solid 5px rgba(13, 171, 255, .3);
      background: rgba(13, 171, 255, .2);

      .inner-ring-case{
        width: 30px;
        height: 30px;
        border-radius: 30px;
        border: solid 10px rgba(13, 171, 255, .9);
        position: relative;

        .long-case{
          position: absolute;
          width: 20px;
          height: 20px;
          top: -5px;
          left: -5px;
          border-radius: 20px;
          background: #008de1;
          animation: long-circle 1s linear infinite;

          i{
            width: 0;
            height: 0;
            border: solid 9px transparent;
            border-bottom-color: #008de1;
            border-bottom-width: 16px;
            position: absolute;
            top: -18px;
            left: 1px;
          }
        }

        .short-case{
          position: absolute;
          width: 10px;
          height: 10px;
          top: 0px;
          left: 0px;
          border-radius: 20px;
          background: #e77c6e;
          animation: short-circle 2s linear infinite;

          i{
            width: 0;
            height: 0;
            border: solid 5px transparent;
            border-bottom-color: #e77c6e;
            border-bottom-width: 10px;
            position: absolute;
            top: -11px;
            left: 0;
          }
        }

        .pointer{
          width: 4px;
          height: 4px;
          border-radius: 3px;
          background: #ffb100;
          position: absolute;
          top: 3px;
          left: 3px;
        }
      }
    }
  }

  @keyframes long-circle {
    0%{
      transform: rotate(0)
    }
    100%{
      transform: rotate(360deg)
    }
  }
  @keyframes short-circle {
    0%{
      transform: rotate(0)
    }
    100%{
      transform: rotate(360deg)
    }
  }
</style>
