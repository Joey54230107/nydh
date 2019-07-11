<template>
  <header class="page-header-case">
    <div class="header-icon"></div>
    <div class="header-text-case auto-fill">我的联系人</div>
    <div class="header-icon create">
      <!--<label class="blocker" @tap.stop="newUser">添加</label>-->
    </div>
  </header>
</template>

<script>

	export default {
		name: 'contactheader',

		data(){
			return {
			}
		},

		mounted(){
		},

		methods: {
			newUser(){
				this.$emit('newUser')
      }
    }

	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .c-contact-header-case{
    @include box-hori-left-middle;
    height: 50px;
    border-bottom: solid 0px #dcdcdc;
    background: url("../../../assets/img/header-bg.png") top left/100% 100% repeat-y;
    position: fixed;
    top: 0;
    overflow: visible;
    left: 0;
    z-index: 10;
    color: #fff;
    text-align: center;

    .header-icon{
      @include box-hori-center-middle;
      width: auto;
      height: 50px;
      font-size: 20px;
      line-height: 50px;
      overflow: visible;
      position: absolute;
      top: 0;

      &.icon-let-arr{
        left: 5px;
      }
      &.create{
        font-size: 16px;
        right: 10px;
      }

      label{
        margin-top: -1px;
        height: 50px;
        font-size: 16px;
        width: auto;

        &.blocker{
          height: 28px;
          background: rgba(223, 97, 88, .85);
          line-height: 28px;
          padding: 0 7px;
          border-radius: 3px;
          color: #fff;
          font-size: 14px;
        }
      }
    }

    .header-text-case{
      @include box-hori-center-middle;
      height: auto;
      font-size: 18px;
      color: #fff;
    }
  }
</style>
