<template>
  <div class="c-tip-case">
    <span class="iconfont icon-lighter2"></span>
    <slot></slot>
  </div>
</template>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .c-tip-case{
    @include box-hori-left-middle;
    height: 100%;
    width: 100%;
    background: #fff6cd;
    padding: 6px 12px;
    font-size: 12px;
    color: rgba(115, 91, 39, .8);
  
    .icon-lighter2{
      margin-top: -2px;
      color: #735b27;
      font-size: 24px;
      margin-right: 10px;
    }
  }
</style>
