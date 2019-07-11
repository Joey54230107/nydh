<template>
  <header class="c-goods-header-case">
    <div class="header-icon iconfont icon-let-arr" @tap="back">
      <label>返回</label>
    </div>
    <div class="header-text-case auto-fill">{{title}}</div>
    <div class="header-icon create">
      <label class="blocker" v-if="status == '037001' || status == '037002'" @tap="create2">
        添加品类
        <div class="combox" v-if="status == '037001'">
          <i class="arr"></i>
          <span class="item-case">来自发货单</span>
          <span class="item-case" @tap.stop="create">其他品类</span>
        </div>
      </label>
    </div>
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
      },
  
      status: {
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
    
    methods: {
      back(){
        plus.webview.currentWebview().close('pop-out', 200)
      },

			create(){
        this.$emit('createCategory')
      },
  
      create2(){
			  if(this.status == '037002'){
          this.$emit('createCategory')
        }
      }
    }
    
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-goods-header-case{
    @include box-hori-left-middle;
    height: 50px;
    border-bottom: solid 0px #dcdcdc;
    background: url("../../../assets/img/header-bg.png") top left/100% 100% repeat-y;
    //position: fixed;
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
          background: #DF6158;
          line-height: 28px;
          padding: 0 10px;
          border-radius: 3px;
          color: #fff;
          font-size: 14px;
          position: relative;
          
          .combox{
            height: auto;
            width: 100%;
            border-radius: 5px;
            background: #DF6158;
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 7px;
            margin-left: -50px;
            box-shadow: 0 0 20px rgba(0, 0, 0, .15);
            transform: scale(0);
            opacity: 0;
            transition: transform .15s, opacity .15s;
            
            .arr{
              width: 0;
              height: 0;
              border: solid 6px transparent;
              border-bottom-color: #DF6158;
              position: absolute;
              top: -12px;
              left: 50%;
              z-index: 5;
              margin-left: -6px;
            }
            
            .item-case{
              @include box-hori-center-middle;
              height: 32px;
              color: #fff;
              font-size: 11px;
              font-weight: 300;
              border-bottom: solid 1px rgba(255, 255, 255, .2);
              
              &:last-child{
                border: none;
              }
            }
          }
          
          &:hover{
            
            .combox{
              transform: scale(1);
              opacity: 1;
              
              &:active{
                transform: scale(0);
                opacity: 0;
              }
            }
          }
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
