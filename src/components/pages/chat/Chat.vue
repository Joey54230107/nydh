<template>
  <normal-layout class="chat-detail-page" :loaded="loaded">
    <header class="chat-header">
      <span class="iconfont icon-let-arr" @tap="back"></span>
      <image-loader :src="distUser.url" class="photo-case" :defaultCls="'photo-' + ((distUser.sex == '025001') ? 'man' : 'woman') + '-case'" />
      <h2 class="name">{{distUser.isrealname == 1 ? distUser.name : distUser.nickname}}</h2>
    </header>
    <div class="chat-room auto-fill">
      <div class="chat-pop-case" v-for="(msg, idx) in Message.messages" :key="idx">
        <div class="chat-pop-case-left" v-if="msg.id == user.userid">
          <image-loader :src="user.url" class="icon-photo" :defaultCls="'photo-' + ((user.sex == '025001') ? 'man' : 'woman') + '-case'" />
          <span class="pop-case" v-html="msg.m"></span>
        </div>
        <div class="chat-pop-case-right" v-else>
          <span class="pop-case" v-html="msg.m"></span>
          <image-loader :src="user.url" class="icon-photo" :defaultCls="'photo-' + ((user.sex == '025001') ? 'man' : 'woman') + '-case'" />
        </div>
      </div>
    </div>
    <form onsubmit="return false" @submit="searchSubmit" class="input-case">
      <span class="iconfont icon-voice"></span>
      <span ref="input" contenteditable="true" @tap.stop="openKeyborad" class="input auto-fill"></span>
      <span class="send" @tap.stop="send">发送</span>
      <span class="iconfont icon-plus2" @tap.stop="openDialog"></span>
    </form>
    <div class="dialog-case" :style="{'height': height + 'px'}">
      <div class="dialog-inner-case">
        <span class="iconfont icon-bq"><label>表情</label></span>
        <span class="iconfont icon-image2"><label>图片</label></span>
        <span class="iconfont icon-zxj"><label>拍照</label></span>
      </div>
    </div>
  </normal-layout>
</template>

<script>
  import config from '../../../../config/address.js'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import stars from '@/components/comm/Stars'
  import utils from '@/plugins/utils'
  import imageLoader from '@/components/comm/ImageLoader'
  import service from '@/api/service'
  import loginMixin from '@/mixin/Login'
  import MessageBo from '@/model/bo/Message'
	import md5 from '@/plugins/md5'
  import '@/plugins/strophe.js'
  
  export default {
    mixins: [loginMixin],
    
    created(){
			mui.plusReady(() => {
				plus.webview.currentWebview().show('pop-in', 300)
			})
    },
    
    components: {
      scroller,
      normalLayout,
      stars,
			imageLoader
    },
    
    data(){
      return {
        loaded: false,
        user: {},
        distUser: {},
        height: 0,
        edit: false,
        Message: {messages: []},
        connection: null,
        jid: '',
        mid: ''
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.user = utils.getLocalUser()
				this.init()
			})
    },
    
    methods: {
      init(){
        let win = plus.webview.currentWebview()
        this.distUser = win.user
        console.log(win.user)
        service('getMessageAddressInfo', {
          mobile: this.user.mobile
        }, rs => {
          this.loaded = true
          this.Message = new MessageBo({
            id: 'CHAT_MSG_' + this.distUser.userid
          })
          this.connection = new Strophe.Connection(rs.server.bosh)
          this.jid = this.distUser.userid + '@' + rs.server.service
          this.mid = utils.getLocalUser().userid + '@' + rs.server.service

          this.connection.connect(this.jid, md5(rs.account.pwd), function(status){
            if (status == Strophe.Status.CONNECTING){
              console.log("连接过程中...")
            }else if (status == Strophe.Status.CONNFAIL) {
              console.log("连接失败")
            }else if(status == Strophe.Status.AUTHFAIL){
              console.log("登录失败")
            }else if(status == Strophe.Status.DISCONNECTING){
              console.log("正在断开连接...")
            }else if(status == Strophe.Status.DISCONNECTED){
              console.log("连接断开")
            } else if (status == Strophe.Status.CONNECTED) {
              console.log('start talking!')
            }
          })

          this.connection.rawOutput = function (data) {
						console.log('发送: ' + data)
					}
        })
      },
      
      searchSubmit(){
      },
  
      openKeyborad(){
        this.height = 0
      },
  
      send(){
        /*this.Message.addMessage({
          id: this.user.userid,
          msg: this.$refs.input.innerHTML
        })
        this.$refs.input.value = ''*/

        const msg = $msg({
					to: this.jid,
					from: this.mid,
					type: 'chat'
				}).c("body", {mt: 'text'}, this.$refs.input.innerHTML)

				this.connection.send(msg.tree())
        alert(123)
      },
      
      openDialog(){
        this.height = 100
        this.$refs.input.blur()
      },
      
      back(){
        plus.webview.currentWebview().close('pop-out', 300)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .chat-detail-page{
    @include box-vert-left-top;
    height: 100%;
    background: #ededed;
    
    .chat-header{
      @include box-hori-center-middle;
      height: 50px;
      background: #fff;
      
      .iconfont{
        @include box-hori-center-middle;
        width: 32px;
        height: 50px;
        font-size: 24px;
        color: #666;
        position: absolute;
        left: 0;
        top: 0;
      }
      
      .photo-case{
        width: 36px;
        height: 36px;
        border-radius: 32px;
      }
      
      .name{
        margin-left: 10px;
        height: auto;
        color: #666;
        font-size: 16px;
        width: auto;
        font-weight: bold;
      }
    }
    
    .chat-room{
      @include box-vert-left-top;
      padding: 10px;
      
      .chat-pop-case{
        margin-top: 10px;
        height: auto;
        margin-bottom: 5px;
  
        .icon-photo{
          width: 42px;
          height: 42px;
          border-radius: 11px;
          position: relative;
        }
  
        .pop-case{
          margin-left: 10px;
          border-radius: 10px;
          background: #fff;
          max-width: 60%;
          width: auto;
          height: auto;
          padding: 10px;
          position: relative;
    
          &:before{
            content: '';
            width: 0;
            height: 0;
            border: solid 6px transparent;
            border-right-color: #fff;
            position: absolute;
            left : -12px;
            top: 15px;
          }
        }
  
        .chat-pop-case-left{
          @include box-hori-left-top;
        }
        .chat-pop-case-right{
          @include box-hori-right-top;
  
          .pop-case{
            margin-right: 10px;
    
            &:before{
              content: '';
              width: 0;
              height: 0;
              border: solid 6px transparent;
              border-left-color: #fff;
              position: absolute;
              left: 100%;
              top: 15px;
            }
          }
        }
      }
    }
    
    .input-case{
      @include box-hori-left-bottom;
      background: #f6f6f6;
      min-height: 55px;
      height: auto;
      padding: 10px 10px;
      
      .iconfont{
        @include box-hori-center-middle;
        width: 28px;
        height: 28px;
        border-radius: 32px;
        border: solid 1.5px #333;
        margin: 0 0 5px 0;
        font-size: 16px;
        color: #333;
        
        &.icon-voice{
          padding-top: 2px;
        }
      }
      
      .input{
        min-height: 36px;
        border-radius: 5px;
        background: #fff;
        margin: 0 8px;
        display: inline-block;
        min-width: 1px;
        user-select:text;
        height:auto;
        padding: 8px 10px;
      }
      
      .send{
        height:auto;
        color: #008de1;
        margin: 0 8px 8px 0;
        font-weight: bold;
      }
    }
    
    .dialog-case{
      @include box-hori-left-top;
      background: #dedede;
      //transition: height .2s;
      overflow: hidden;
      
      .dialog-inner-case{
        @include box-hori-left-middle;
        padding: 10px 15px;
        margin-top: -6px;
        
        .iconfont{
          @include box-hori-center-middle;
          width: 50px;
          height: 50px;
          border-radius: 11px;
          background: #fff;
          color: #999;
          font-size: 28px;
          margin: 0 12px;
          position: relative;
          
          label{
            width: 100%;
            position: absolute;
            top: 100%;
            left: 0;
            height: auto;
            text-align: center;
            color: #666;
            font-size: 10px;
            margin-top: 2px;
          }
        }
      }
    }
  }
</style>
