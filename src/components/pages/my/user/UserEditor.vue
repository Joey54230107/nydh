<template>
  <normal-layout class="user-info-page" :loaded="loaded">
    <user-editor-header title="编辑我的信息" />
  
    <scroller class="user-case">
      <ul class="user-info-case">
        <li class="photo-edit-case">
          <image-loader :src="user.url" class="photo-case" :defaultCls="'photo-' + ((user.sex == '025001') ? 'man' : 'woman') + '-case'" />

          <span class="photo-case photo-editor-case iconfont icon-plus2"></span>
        </li>
        <li class="row">
          <label>用户昵称：</label>
          <input type="text" v-model="user.name" class="auto-fill" />
          <span class="iconfont icon-edit1"></span>
        </li>
      </ul>
    </scroller>

    <footer>
      <button @tap="askSave">
        保存
        <div class="confirm-save" :style="{'transform': 'translateY(' + (confirm ? '0' : '100%') + ')'}" @tap.stop="save">
          确认要更新个人信息么?
          <span class="iconfont icon-close" @tap.stop="cancelSave"></span>
        </div>
      </button>
    </footer>
  </normal-layout>
</template>

<script>
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import stars from '@/components/comm/Stars'
  import utils from '@/plugins/utils'
  import imageLoader from '@/components/comm/ImageLoader'
  import service from '@/api/service'
  import userEditorHeader from '@/components/comm/header/UserEditorHeader'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('userEditor', 'pop-in', 300, () => {
					this.search()
				})
			})
    },
    
    components: {
      scroller,
      normalLayout,
      stars,
			imageLoader,
      userEditorHeader
    },
    
    data(){
      return {
        loaded: true,
        user: {},
        confirm: false
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.user = utils.getLocalUser()
				this.loaded = true
			})
    },
    
    methods: {
			askSave(){
				this.confirm = true
      },

			cancelSave(){
				this.confirm = false
      },

      save(){

      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .user-info-page{
    @include box-vert-left-top;
    background: #f1f1f1;
    
    .user-case{
      @include box-vert-center-top;
      width: 100%;
      margin-top: 50px;
      
      .user-info-case{
        @include box-vert-left-top;
        height: auto;
        margin-top: 10px;

        .photo-edit-case{
          @include box-hori-left-middle;
          height: auto;
          padding: 8px 10px 15px;

          .photo-case{
            width: 54px;
            height: 54px;
            border-radius: 7px;
            overflow: hidden;

            &.photo-editor-case{
              @include box-vert-center-middle;
              background: #fff;
              margin-left: 10px;
              font-size: 18px;
              color: #999;
            }
          }
        }
        
        .row{
          @include box-hori-left-middle;
          height: 50px;
          margin-bottom: 1px;
          background: #fff;
          padding: 0 15px;
          
          label{
            width: 80px;
            height: auto;
            color: #666;
          }
          
          input{
            @include box-vert-left-middle;
            padding: 0;
            height: 20px;
            margin-top: -2px;
            font-size: 16px;
          }
          
          .icon-edit1{
            @include box-hori-center-middle;
            width: 32px;
            height: 50px;
            font-size: 18px;
            color: #ccc;
          }
        }
      }
    }

    footer{
      @include box-hori-center-top;
      height: 55px;
      padding: 0 20px;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 10;

      button{
        width: 100%;
        background: #008de1;
        text-align: center;
        color: #fff;
        font-size: 16px;
        height: 42px;
        line-height: 42px;
        position: relative;
        overflow: hidden;

        .confirm-save{
          @include box-hori-center-middle;
          width: 100%;
          height: 100%;
          background: #0977b8;
          transition: transform .3s;
          position: absolute;
          top: 0;
          left: 0;

          .icon-close{
            width: 32px;
            height: 42px;
            font-size: 24px;
            position: absolute;
            right: 0;
            top: 0;
            border-left: solid 1px #008de1;
          }
        }
      }
    }
  }
</style>
