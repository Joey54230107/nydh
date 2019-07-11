<template>
  <header class="c-good-supplier-categorys-header-case">
    <div class="header-icon iconfont icon-let-arr" @tap="back">
      <div class="photo-wrapper">
        <span class="iconfont icon-v" v-if="supplier.supplier.isrealname == 1"></span>
        <image-loader :src="supplier.supplier.url" class="photo-case" :defaultCls="'photo-' + ((supplier.supplier.sex == '025001') ? 'man' : 'woman') + '-case'"></image-loader>
      </div>
      <h3 class="auto-fill info-case">
        <span class="user-name auto-fill">{{supplier.supplier.name}}</span>
        <time>{{date}}发布</time>
      </h3>
    </div>
  </header>
</template>

<script>
  import comboxMenu from '@/components/comm/ComboxMenu'
  import imageLoader from '@/components/comm/ImageLoader'
  import {toDateStr} from '@/plugins/filter/custom'
  
  export default {
    name: 'back-header',
    
    props: {
      title: {
        type: String,
        default: ''
      },
      supplier: {
        type: Object
      }
    },
    
    components: {
      comboxMenu,
      imageLoader
    },
    
    data(){
      return {
        headerMenus: [
          {name: '新增'},
          {name: '删除'}
        ],
  
        date: toDateStr(parseInt(this.supplier.supplier.createtime))
      }
    },
    
    mounted(){
    },
    
    methods: {
      back(){
        plus.webview.currentWebview().close('pop-out', 300)
      },
  
      newCategory(){
        this.$emit('newCategory')
      },

      call(){
      	mui.confirm('拨打电话 ' + (this.supplier.mobile || '18367145158') + '么?', '', ['是','否'], e => {
      		if(e.index == 0){
      			alert(123)
          }
        })
      }
    }
    
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-good-supplier-categorys-header-case{
    @include box-hori-left-middle;
    height: 50px;
    border-bottom: solid 0px #dcdcdc;
    background: #fff;
    position: fixed;
    top: 0;
    overflow: visible;
    left: 0;
    z-index: 10;
    color: #fff;
    text-align: center;
    
    .header-icon{
      @include box-hori-center-middle;
      width: 100%;
      height: 50px;
      font-size: 20px;
      line-height: 60px;
      overflow: visible;
      position: absolute;
      top: 0;
      color: #666;
      
      &.icon-let-arr{
        left: 5px;
        color: #666;
      }
      &.icon-plus{
        right: 11px;
        height: 28px;
        color: #fff;
        top: 10px;
        border-radius: 3px;
        padding: 1px 8px;
        background: #DF6158;
        
        &:active{
          opacity: .8;
        }

        label{
          height: 28px;
          line-height: 28px;
          font-size: 14px;
        }
      }

      .photo-wrapper{
        width: 32px;
        height: 32px;
        margin-left: 5px;
        position: relative;
        overflow: visible;

        .photo-case{
          width: 32px;
          height: 32px;
          overflow: hidden;
          border-radius: 36px;
        }

        .icon-v{
          width: 16px;
          height: 16px;
          border-radius: 18px;
          background: #ffd100;
          position: absolute;
          border: solid 1px #fff;
          top: 0;
          right: -10px;
          z-index: 1;
          line-height: 14px;
          padding: 0 0 0 1px;
          font-size: 9px;
          color: #fff;
        }
      }
      
      .info-case{
        @include box-hori-left-middle;
        color: #666;
        font-size: 16px;
        padding: 0 15px;
        height: 32px;
        line-height: 16px;
        position: relative;
  
        .user-name{
          @include box-hori-left-middle;
          white-space: nowrap;
          font-weight: bold;
          color: $textColor;
        }
        
        time{
          @include box-hori-left-middle;
          width: auto;
          font-size: 12px;
          color: $textLessColor;
        }
      }
      
      label{
        margin-top: -1px;
        height: 60px;
        font-size: 14px;
        width: auto;
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
