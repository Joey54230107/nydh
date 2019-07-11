<template>
  <div class="c-name-letter-case">
    <ul class="name-inner-case">
      <li class="iconfont icon-search"></li>
      <li v-for="item in resource" class="name-case">{{(item.fn).toUpperCase()}}</li>
    </ul>
  </div>
</template>

<script>

	export default {
		name: 'nameletters',

    props: {
			resource: {
				type: Array
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-name-letter-case{
    @include box-vert-left-middle;
    position: fixed;
    right: 2px;
    top: 0;
    width: 18px;
    height: 100%;
    z-index: 500;

    .name-inner-case{
      @include box-vert-center-middle;
      height: auto;
      background: rgba(0, 0, 0, .15);
      width: 16px;
      padding: 4px 0 8px;
      border-radius: 18px;
      text-align: center;
      margin-top: 50px;

      .icon-search{
        font-size: 12px;
        font-weight: bold;
        width: 100%;
        padding-left: 1px;
      }

      .name-case{
        line-height: 16px;
        height: auto;
        width: 100%;
        color: #000;
        font-family: arial;
        font-size: 12px;
      }
    }
  }
</style>
