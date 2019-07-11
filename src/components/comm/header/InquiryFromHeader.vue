<template>
  <header class="c-inquiryfrom-header-case">
    <div class="header-icon iconfont icon-let-arr" @tap="back"></div>
    <div class="header-text-case auto-fill">{{title}}</div>
    <div class="header-icon iconfont icon-plus"></div>
  </header>
</template>

<script>
  import comboxMenu from '@/components/comm/ComboxMenu'
  
  export default {
    name: 'back-header',
    
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    
    components: {
      comboxMenu
    },
    
    data(){
      return {
        headerMenus: [
          {name: '新增'},
          {name: '删除'}
        ]
      }
    },
    
    mounted(){
    },
    
    methods: {
      back(){
        //mui.back()
        plus.webview.currentWebview().hide('pop-in', 300)
      },
      
      menuHandler(item){
      }
    }
    
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-inquiryfrom-header-case{
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
      width: 44px;
      height: 50px;
      font-size: 20px;
      line-height: 50px;
      overflow: visible;
      
      &.icon-zhaoxiangji{
        font-size: 24px;
      }
    }
    
    .header-text-case{
      @include box-hori-center-middle;
      height: auto;
      font-size: 16px;
      color: #fff;
    }
  }
</style>
