<template>
	<normal-layout class="new-friends-page" :loaded="loaded">
    <normal-header title="新的朋友" :simple="true" />
    <div class="friends-inner-case auto-fill">
      <scroller class="friends-case" :status="status">
        <slider-blocker class="user-inner-case" v-for="(user, idx) in users" :id="idx" :item="user" sliderWidth="30" :key="user.friendid">
          <div class="user-info-case" @tap="detail(user)">
            <div class="photo-case">
              <image-loader :src="user.friend.url" class="user-photo" :defaultCls="'photo-' + ((user.friend.sex == '025001') ? 'man' : 'woman') + '-case'" />
            </div>
            <h3 class="auto-fill">
              <label>{{user.friend.name}}</label>
              <span class="remark" v-if="user.jointype == 1">"{{user.joinremark || ''}}"</span>
            </h3>
            <button v-if="user.jointype == 1" @tap.stop="accept(user, idx)">接受</button>
            <button class="waiting" v-if="user.jointype == 0">待对方接受</button>
          </div>
        </slider-blocker>
      </scroller>
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

	export default {
		created(){
			mui.plusReady(() => {
				plus.webview.show('newFriends', 'pop-in', 300)
			})

      window.addEventListener('setResponse', (e) => {
        this.setResponse(e.detail)
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
      normalHeader
		},

		data(){
			return {
				loaded: false,
        screen_height: window.screen.availHeight,
				users: [],
        status: ''
			}
		},

		mounted(){
			mui.plusReady(() => {
				this.init()
			})
		},

		methods: {
			init(){
			  this.status = '1'
				service('getIdentfriends', {
						userid: utils.getLocalUser().userid
					}, rs => {
				  if(rs && Array.isArray(rs)){
				    rs.forEach(item => {
				      item.remove = false
            })
          }
					this.users = rs
					this.loaded = true
          this.status = this.users.length > 0 ? '2' : '0'
				}, err => {
				  this.status = '0'
        })
			},
      
      setResponse(params){
			  this.users.forEach((item, idx) => {
			    if(item.friendid == params.friendid){
            this.users.splice(idx, 1)
          }
        })
      },

			back(){
				plus.webview.currentWebview().close('pop-out', 300)
			},
      
      detail(user){
        plus.webview.create(config.CDN_ADDRESS + '/userDetail', 'userDetail', {}, {
          userid: user.friendid,
          fsid: user.fsid,
          type: user.jointype == '1' ? '1' : '2', //查看好友加好友请求界面
          params: user
        })
      },
      
      accept(user, idx){
        mui.confirm('确定要接收该用户的好友请求么？', '确定添加', ['是','否'], e => {
          if(e.index == 0){
            service('responseFriend', {
              userid: utils.getLocalUser().userid,
              friendid: user.friendid,
              fsid_app: user.fsid_app,
              fsid_resp: user.fsid_resp,
              st: user.st,
              source: '041001',
              resp: 1
            }, rs => {
              utils.toast('操作成功')
              this.users.splice(idx, 1)
            })
          }
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '@/assets/style/main.scss';

	.new-friends-page{
		@include box-vert-left-top;
		background: $normalBgColor;

		header{
			@include box-hori-center-middle;
			height: 50px;
			border-bottom: solid 1px #f1f1f1;
			font-size: 16px;
			color: #333;
			position: relative;
			background: #fff;

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

    .friends-inner-case{
      @include box-vert-left-top;
      margin-top: 10px;
      position: relative;
      padding: 0 10px;
      
      .friends-case{
        @include box-vert-left-top;
        width: 100%;
        
        .user-inner-case{
          @include box-hori-left-top;
          height: auto;
          background: #ccc;
          margin-bottom: 8px;
          border-radius: 9px;
      
          .user-info-case{
            @include box-hori-left-middle;
            height: auto;
            padding: 10px;
            position: relative;
            background: #fff;
        
            .photo-case{
              width: 42px;
              height: 42px;
          
              .user-photo{
                width: 42px;
                height: 42px;
                border-radius: 7px;
                overflow: hidden;
              }
            }
        
            h3{
              @include box-vert-left-middle;
              height: 42px;
              font-size: 16px;
              color: #666;
              font-weight: bold;
              margin-left: 10px;
              position: relative;
          
              .remark{
                color: #999;
                font-size: 12px;
                font-weight: normal;
                margin-top: 10px;
              }
            }
        
            button{
              height: 28px;
              background: #008de1;
              color: #fff;
              width: auto;
              padding: 0 10px;
              border-radius: 3px;
              margin-right: 5px;
          
              &.waiting{
                background: transparent;
                color: #008de1;
                font-weight: bold;
                margin-right: 0;
              }
            }
          }
        }
      }
    }
	}
</style>
