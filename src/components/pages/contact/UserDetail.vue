<template>
	<normal-layout class="user-detail-page" :loaded="loaded">
    <normal-header :title="type == 0 ? '联系人详情' : '好友邀请'" :simple="true" />
    <scroller class="user-main auto-fill">
      <div class="user-info-case">
        <div class="photo-case">
          <span class="iconfont icon-v" v-if="user.isrealname == '1'"></span>
          <image-loader :src="user.url" class="user-photo" :defaultCls="'photo-' + ((user.sex == '025001') ? 'man' : 'woman') + '-case'" />
        </div>
        <div class="other-info-case auto-fill">
          <h3>{{user.isrealname == '1' ? user.name : user.nickname}}</h3>
          <label>位置：{{user.city || '未知'}}</label>
          <label>认证：{{user.isrealname == '1' ? '已认证' : '未认证'}}</label>
          <!--<button :class="'check-' + (user.relation == '1')">{{user.relation == '1' ? '已关注' : '关注' + (user.sex == '1' ? '他' : '她')}}</button>-->
        </div>
        <div class="chat-case">
          <div class="iconfont icon-chat" @tap.stop="message"><label>发消息</label></div>
          <div class="iconfont icon-phone"><label>电话</label></div>
        </div>
      </div>
      <div class="response-case" v-if="type == 1">
        <span class="iconfont icon-yinhao2"></span>
        <label>请求添加您为好友</label>
        <label class="remark">备注：{{params.joinremark}}</label>
      </div>
  
      <div class="row" style="margin-top: 10px;" @tap="setup" v-if="type == 0">
        <label>分组设置：</label>
        <a class="group-content auto-fill"><label v-for="(group, idx) in user.groups">{{group.value + ((idx != user.groups.length - 1) ? '、' : '')}}</label></a>
        <div class="setup">设置<span class="iconfont icon-right-arr"></span></div>
      </div>
      
      <div class="key-info-case">
        <hori-scroller class="pageframe-case" :resource="pages" @handler="look" :selected="st" />
        <div class="key-container-case">
        
        </div>
      </div>
    </scroller>
    
    <div class="friend-oper-case">
      <button @tap="response(true)" v-if="type == 1">通过邀请</button>
      <button @tap="response(false)" class="red" v-if="type == 1">拒绝</button>
      <confirm-button confirmStr="确定加入黑名单" class="black-case" @handler="confirmBlack" v-if="(type == 0) && (!hasBlack)">加入黑名单</confirm-button>
      <confirm-button confirmStr="确定从黑名单中恢复" class="black-case" @handler="recoverBlack" v-if="(type == 0) && hasBlack">从黑名单中恢复</confirm-button>
      <confirm-button confirmStr="确定删除" class="black-case delete-case" @handler="confirmRemove" v-if="type == 0">删除联系人</confirm-button>
    </div>
	</normal-layout>
</template>

<script>
	import config from '../../../../config/address.js'
	import scroller from '@/components/comm/Scroller'
  import normalHeader from '@/components/comm/NormalHeader'
	import normalLayout from '@/components/layout/Layout'
	import utils from '@/plugins/utils'
	import nameLetters from '@/components/comm/NameLetters'
	import horiScroller from '@/components/comm/HoriScroller'
	import service from '@/api/service'
  import imageLoader from '@/components/comm/ImageLoader'
  import sliderBlocker from '@/components/comm/SliderBlocker'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  import confirmButton from '@/components/comm/ConfirmButton'

	export default {
		created(){
			mui.plusReady(() => {
				plus.webview.show('userDetail', 'pop-in', 300)
			})
      
      window.addEventListener('setGroup', (e) => {
        this.setGroup(e.detail)
      })
		},

		components: {
			scroller,
			normalLayout,
			horiScroller,
			nameLetters,
      imageLoader,
      sliderBlocker,
      maskerDialog,
      normalHeader,
      confirmButton
		},

		data(){
			return {
				loaded: false,
        screen_height: window.screen.availHeight,
				user: {},
				confirm: false,
        type: '', //0=联系人主页过来；1=新的朋友页面过来
        params: {},
        hasBlack: false, //该用户是否是自己的黑名单用户
        pages: [
          {name: '他的农场', code:'1'},
          {name: '他的商品', code:'2'}
        ],
        st: '1'
			}
		},

		mounted(){
			mui.plusReady(() => {
				this.type = plus.webview.currentWebview().type
        this.params = plus.webview.currentWebview().params
				this.init()
			})
		},

		methods: {
			init(){
				let userid = plus.webview.currentWebview().userid
				service('getUserInfo', {
          userid: utils.getLocalUser().userid,
          friendid: userid
				}, rs => {
					this.user = rs
          this.loaded = true
          
          //检查该用户是否是自己的黑名单用户、对于其他方式跳转到userdetail页面来说，这里要判断下，可能user对象中没有groups数组
          if(rs.groups && Array.isArray(rs.groups)){
					  rs.groups.forEach(group => {
					    console.log(JSON.stringify(group))
					    if(group.code == '040003'){
					      this.hasBlack = true
              }
            })
          }
				})
			},
      
      confirmRemove(){
        service('removeFriend', {
          fsid: this.user.fsid,
          userid: utils.getLocalUser().userid,
          friendid: plus.webview.currentWebview().userid
        }, rs => {
          utils.toast('操作成功')
          if(this.type == '0'){
            setTimeout(() => {
              mui.fire(plus.webview.getWebviewById('contact'), 'removeHandler', {fsid: this.user.fsid})
              plus.webview.currentWebview().close('pop-out', 300)
            }, 320)
          }
        })
      },
      
      look(){
      
      },
      
      //跳转到聊天界面
      message(){
        plus.webview.create(config.CDN_ADDRESS + '/chatDetail', 'chatDetail', {}, {
          user: this.user
        })
      },
      
      response(agree){
        service('responseFriend', {
          userid: utils.getLocalUser().userid,
          friendid: this.params.friendid,
          fsid_app: this.params.fsid_app,
          fsid_resp: this.params.fsid_resp,
          st: this.params.st,
          source: this.params.source,
          resp: agree ? '1' : '0'
        }, rs => {
          utils.toast('操作成功')
          setTimeout(() => {
            mui.fire(plus.webview.getWebviewById('newFriends'), 'setResponse', {friendid: this.params.friendid})
            plus.webview.currentWebview().close('pop-out', 300)
          }, 350)
        })
      },
      
      setup(){
        plus.webview.create(config.CDN_ADDRESS + '/groupSetup', 'groupSetup', {}, {
          userid: this.user.userid,
          fsid: this.user.fsid,
          gourps: this.user.groups
        })
      },
      
      setGroup(param){
        this.user.groups = param.returnArr
      },

			black(){
				this.confirm = true
			},

			cancelConfirm(){
				this.confirm = false
			},

			back(){
        mui.fire(plus.webview.getWebviewById('contact'), 'setGroup', {
          user: this.user
        })
        plus.webview.currentWebview().close('pop-out', 300)
			},

			confirmBlack(){
				let userid = plus.webview.currentWebview().userid
				service('blackFriend', {
					userid: utils.getLocalUser().userid,
					friendid: userid
				}, rs => {
					utils.toast('操作成功')
          if(this.type == '0'){
            setTimeout(() => {
              mui.fire(plus.webview.getWebviewById('contact'), 'blackHandler', {fsid: this.user.fsid})
              plus.webview.currentWebview().close('pop-out', 300)
            }, 350)
          }
				})
			},
      
      recoverBlack(){
        let userid = plus.webview.currentWebview().userid
        service('unblackFriend', {
          userid: utils.getLocalUser().userid,
          friendid: userid
        }, rs => {
          utils.toast('操作成功')
          if(this.type == '0'){
            setTimeout(() => {
              mui.fire(plus.webview.getWebviewById('contact'), 'unblackHandler', {fsid: this.user.fsid})
              plus.webview.currentWebview().close('pop-out', 300)
            }, 350)
          }
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '@/assets/style/main.scss';

	.user-detail-page{
		@include box-vert-left-top;
		background: #f5f5f5;
    width: 100%;

		header{
			@include box-hori-center-middle;
			height: 50px;
			border-bottom: solid 1px #f1f1f1;
			font-size: 18px;
			color: #666;
			position: relative;
			background: #fff;
      width: 100%;

			.icon-let-arr{
				@include box-hori-center-middle;
				width: 32px;
				height: 50px;
				position: absolute;
				left: 0;
				top: 0;
				color: #999;
				font-size: 18px;
			}
		}

    .user-main{
      @include box-vert-left-top;
  
      .user-info-case{
        @include box-hori-left-middle;
        height: auto;
        padding: 10px;
        background: #fff;
    
        .photo-case{
          width: 54px;
          height: 54px;
          position: relative;
      
          .user-photo{
            width: 54px;
            height: 54px;
            overflow: hidden;
            border-radius: 64px;
          }
      
          .icon-v{
            text-align: center;
            position: absolute;
            line-height: 17px;
            bottom: 0;
            right: 0;
            width: 16px;
            height: 16px;
            background: #f8b68e;
            overflow: hidden;
            border-radius: 16px;
            color: #fff;
            font-size: 10px;
            z-index: 1;
            padding-left: 1px;
          }
        }
    
        .other-info-case{
          @include box-vert-left-top;
          margin-left: 16px;
          padding: 3px 0;
          position: relative;
          height: auto;
      
          h3{
            height: auto;
            font-size: 18px;
            color: #666;
            font-weight: bold;
            margin-bottom: 3px;
          }
      
          label{
            font-size: 10px;
            color: #999;
            height: 14px;
          }
      
          button{
            width: auto;
            height: 26px;
            padding: 0 10px;
            border-radius: 3px;
            font-size: 12px;
            position: absolute;
            top: 15px;
            right: 5px;
        
            &.check-true{
              background: #f85959;
              color: #fff;
            }
            &.check-false{
              border: solid .5px #f85959;
              color: #f85959;
            }
          }
        }
  
        .chat-case{
          @include box-hori-right-middle;
          width: 100px;
          height: 100%;
          font-size: 24px;
          color: #999;
          padding-right: 15px;

          .icon-chat{
            color: $blue;
          }
          
          .icon-phone{
            margin-left: 10px;
            padding-left: 10px;
            color: #999;
          }
          
          .iconfont{
            @include box-vert-center-top;
            position: relative;
            width: 40px;
            margin-top: -15px;
            
            label{
              @include box-hori-center-top;
              position: absolute;
              top: 100%;
              font-size: 10px;
              width: 100%;
              left: 0;
              margin-top: 3px;
              white-space: nowrap;
            }
            
            &.icon-phone{
              padding-right: 10px;
            }
            
            &:active{
              color: #008de1;
            }
          }
        }
      }
      
      .response-case{
        @include box-vert-center-top;
        background: #fff;
        padding: 20px 30px;
        height: auto;
        position: relative;
        
        .icon-yinhao2{
          width: auto;
          height: auto;
          position: absolute;
          left: 50%;
          margin-left: -110px;
          color: #eee;
          font-size: 24px;
        }
        
        label{
          color:#999;
          font-size: 16px;
          height: 30px;
          line-height: 30px;
          
          &.remark{
            color: #666;
            font-size: 14px;
          }
        }
      }
  
      .key-info-case{
        @include box-vert-left-top;
        background: #fff;
        height: auto;
        padding: 0 0 130px 0;
        margin-top: 10px;
        
        .pageframe-case{
          height: 44px;
          font-size: 16px;
          overflow: hidden;
          margin-top: 1px;
          background: #fff;
          border-bottom: solid 1px #f1f1f1;
        }
        
        .key-container-case{
          padding: 10px 15px;
          min-height: 300px;
        }
      }
  
      .row{
        @include box-hori-left-middle;
        height: 50px;
        padding: 0 5px 0 10px;
        background: #fff;
    
        label{
          width: 80px;
          height: auto;
          color: #999;
        }
    
        .group-content{
          @include box-hori-left-middle;
          color: #666;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          
          label{
            width: auto;
            padding: 0;
            color: #454545;
            white-space: nowrap;
          }
        }
    
        .setup{
          @include box-hori-right-middle;
          width: auto;
          height: 50px;
          font-size: 16px;
          color: #008de1;
          
          .iconfont{
            font-size: 21px;
          }
        }
    
        &:active{
          background: #fafafa;
        }
      }
    }
    
    .friend-oper-case{
      @include box-vert-left-top;
      position: fixed;
      z-index: 50;
      bottom: 0;
      left: 0;
      background: #fff;
      height: auto;
      width: 100%;
      padding: 10px 20px;
      //box-shadow: 0 -2px 15px rgba(0, 0, 0, .05);
      
      button{
        text-align: center;
        width: 100%;
        height: 42px;
        background: transparent;
        color: #008de1;
        border: solid .5px #008de1;
        font-size: 16px;
        border-radius: 3px;
        
        &.red{
          background: #f85959;
          margin-top: 8px;
          border: none;
          color: #fff;
        }
      }
      
      .black-case{
        @include box-hori-center-middle;
        height: 42px;
        width: 100%;
        background: transparent;
        border: solid .5px #f85959;
        color: #f85959;
        border-radius: 5px;
        font-size: 16px;
        text-align: center;
        transition: transform .3s;
        position: relative;
        
        .icon-close{
          @include box-vert-center-middle;
          width: 32px;
          height: 100%;
          position: absolute;
          top: 0;
          color: #f85959;
          right: 0;
          font-size: 24px;
          border-left: solid 1px #f85959;
        }
        
        &.delete-case{
          margin-top: 8px;
          background: #f85959;
          color: #fff;
        }
      }
    }
	}
</style>
