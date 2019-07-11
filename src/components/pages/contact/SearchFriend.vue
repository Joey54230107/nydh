<template>
	<normal-layout class="search-friend-page" :loaded="loaded">
    <normal-header title="搜索联系人" :simple="true" />
    <div class="search-case">
      <form onsubmit="return false" @submit="searchSubmit" class="search-inner-case">
        <span class="iconfont icon-search"></span>
        <input type="search" id="searchIpt" class="auto-fill" v-model="searchText" placeholder="手机号码/用户名" />
      </form>
    </div>
    <div class="search-rs-case auto-fill">
      <scroller class="auto-fill" :status="status">
        <div class="user-item-case" v-for="user in users" @tap="detail(user)">
          <image-loader :src="user.url" class="user-photo" :defaultCls="'photo-' + ((user.sex == '025001') ? 'man' : 'woman') + '-case'" />
          <label class="user-name auto-fill">{{user.isrealname == 1 ? user.name : user.nickname}}{{user.userid == currUser.userid ? '（我自己）' : ''}}</label>
          <button class="add" @tap.stop="addFriend(user)" v-if="user.relation == '2' && user.userid != currUser.userid">添加</button>
          <span class="wait-response" v-if="user.relation == '1'">等待对方同意</span>
          <span class="friend" v-if="user.relation == '0'">已是好友</span>
        </div>
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
				loaded: true,
        searchText: '',
        users: [],
        currUser: {},
        status: '3'
			}
		},

		mounted(){
			mui.plusReady(() => {
				this.currUser = utils.getLocalUser()
				plus.webview.currentWebview().show('pop-in', 300)
				utils.openSoftKeyborad('searchIpt')
			})
		},

		methods: {
      searchSubmit(){
        if(this.searchText){
          this.status = '1'
          service('searchFriends', {
            userid: utils.getLocalUser().userid,
            input: this.searchText
          }, rs => {
            let users = rs.items || []
            this.users = users
            this.status = (users.length > 0) ? '2' : '0'
          }, err => {
            this.status = '0'
          })
        }
      },
      
      addFriend(user){
        service('addMyFriend', {
          userid: utils.getLocalUser().userid,
          friendid: user.userid
        }, rs => {
          utils.toast('添加成功，请等待对方响应')
          user.relation = '1'
        })
      },
      
      detail(user){
        plus.webview.create(config.CDN_ADDRESS + '/userDetail', 'userDetail', {}, {
          userid: user.userid
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '@/assets/style/main.scss';

	.search-friend-page{
		@include box-vert-left-top;
		background: #f0f0f0;
    
    .search-case{
      @include box-hori-center-middle;
      margin-top: 50px;
      height: auto;
      padding: 10px 15px;
      
      .search-inner-case{
        @include box-hori-center-middle;
        height: 42px;
        width: 100%;
        background: rgba(0, 0, 0, .08);
        border-radius: 7px;
        padding: 0 15px;
        
        input{
          @include box-hori-left-middle;
          text-align: left;
          background: transparent;
        }
        
        .icon-search{
          @include box-hori-center-middle;
          width: 24px;
          height: 100%;
          font-size: 16px;
        }
      }
    }
    
    .search-rs-case{
      padding: 5px 0;
      
      .user-item-case{
        @include box-hori-left-middle;
        background: #fff;
        padding: 10px 15px;
        height: auto;
        margin-bottom: 1px;
        
        .user-photo{
          width: 32px;
          height: 32px;
          border-radius: 9px;
          overflow: hidden;
        }
        
        .user-name{
          padding-left: 10px;
          color: #666;
          font-weight: bold;
          font-size: 16px;
        }
        
        .add{
          @include box-hori-center-middle;
          padding: 0 12px;
          width: auto;
          height: 28px;
          background: #008de1;
          color: #fff;
          border-radius: 5px;
        }
        
        .wait-response{
          width: auto;
          height: auto;
          color: #008de1;
          font-weight: bold;
        }
        
        .friend{
          width: auto;
          height: auto;
          color: #f85959;
          font-weight: bold;
        }
      }
    }
	}
</style>
