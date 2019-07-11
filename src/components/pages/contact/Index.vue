<template>
	<normal-layout class="index-contact-page" :loaded="loaded">
    <normal-header title="我的联系人" :noBack="true" />
		<ul class="oper-case">
			<li class="oper-inner-case auto-fill" @tap="newFriends">
				<span class="iconfont icon-user1"></span>
				<a>新的朋友</a>
			</li>
			<li class="oper-inner-case auto-fill">
				<span class="iconfont icon-tongxunlu"></span>
				<a>导入通讯录</a>
			</li>
			<li class="oper-inner-case auto-fill" @tap="create">
				<span class="iconfont icon-plus"></span>
				<a>添加联系人</a>
			</li>
		</ul>
		<hori-scroller class="pageframe-case" :resource="pages" @handler="searchUsers" :selected="st2" />

		<div class="scroller-wrapper auto-fill">
			<scroller class="users-scroller auto-fill" :style="{'transform':'translateY(' + y + ')', 'opacity':opacity}" :status="status">
				<slider-blocker class="user-inner-case" v-for="(user, idx) in users" :id="idx" :item="user" :sliderWidth="25" :key="user.fsid" v-show="user.display">
					<div class="user-info-case" @tap="detail(user)">
            <span class="remove-case" @tap.stop="confirmRemove(user, idx)">删除</span>
						<div class="photo-case">
              <span class="iconfont icon-v"></span>
							<image-loader :src="user.friend.url" class="user-photo" :defaultCls="'photo-' + ((user.friend.sex == '025001') ? 'man' : 'woman') + '-case'" />
						</div>
						<div class="user-case auto-fill">
							<h3>{{user.friend.name}}</h3>
						</div>
						<time>{{user.jointime}}</time>
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
  import sliderBtn from '@/components/comm/SliderButton'

	export default {
    created(){
      window.addEventListener('initMessage', (e) => {
        this.init()
      })
      window.addEventListener('setGroup', (e) => {
        this.setGroup(e.detail)
      })
      window.addEventListener('removeHandler', (e) => {
        this.removeHandler(e.detail)
      })
      window.addEventListener('blackHandler', (e) => {
        this.blackHandler(e.detail)
      })
      window.addEventListener('unblackHandler', (e) => {
        this.unblackHandler(e.detail)
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
      sliderBtn
		},

		data(){
			return {
				loaded: true,
				pages: [
					{name: '所有', code:'0', chose: true},
					{name: '验收组', code:'040004', chose: false},
					{name: '出苗组', code:'040005', chose: false},
					{name: '财务组', code:'040006', chose: false},
					{name: '黑名单', code:'040003', chose: false}
				],
        st2: '0',
				sessionUser: {},
        users: [],
        st: '0',
        currUser: {},
        isOpen: false,
        screen_height: window.screen.availHeight,
        y: '0',
        opacity: 1,
        status: ''
			}
		},

		mounted(){
			mui.plusReady(() => {
				this.sessionUser = utils.getLocalUser()
			})
		},
  
		methods: {
			newFriends(){
				plus.webview.create(config.CDN_ADDRESS + '/newFriends', 'newFriends', {})
			},
      
      setGroup(param){
        this.init()
      },
      
      create(){
        plus.webview.create(config.CDN_ADDRESS + '/searchFriend', 'searchFriend', {})
      },
      
      removeHandler(param){
        this.users.forEach((user, idx) => {
          if(user.fsid == param.fsid){
            user.remove = true
            this.users.splice(idx, 1)
          }
        })
      },
      
      blackHandler(param){
        this.users.forEach(user => {
          if(user.fsid == param.fsid){
            user.groups.push({
              code: '040003',
              value: '黑名单'
            })
          }
        })
      },
      
      unblackHandler(param){
        this.users.forEach(user => {
          if(user.fsid == param.fsid){
            for(let i=0; i<user.groups.length; i++){
              let group = user.groups[i]
              if(group.code == '040003'){
                user.groups.splice(i, 1)
                break ;
              }
            }
          }
        })
      },

		  init(){
        this.status = '1'
        service('getFriends', {
          userid: utils.getLocalUser().userid
        }, rs => {
          let users = []
          if(rs && Array.isArray(rs)){
            rs.forEach(user => {
              user.jointime = utils.formatCreatetime(user.jointime)
              user.display = true
              user.remove = false
            })
            if(this.st != '0'){
              rs.forEach(user => {
                let groups = user.groups, isIn = false
                groups.forEach(group => {
                  if(group.code == this.st){
                    isIn = true
                  }
                })
                user.display = isIn
              })
            }
            this.users = rs
            this.status = rs.length > 0 ? '2' : '0'
          }else{
            this.status = '0'
          }
        }, err => {
          this.status = '0'
        })
      },
      
			confirmRemove(user, idx){
		    utils.confirm('确定删除该好友', () => {
          user.remove = true
          service('removeFriend', {
            fsid: user.fsid,
            userid: utils.getLocalUser().userid,
            friendid: user.friend.userid ? user.friendid : ''
          }, rs => {
            user.remove = true
            setTimeout(() => {
              this.users.splice(idx, 1)
              utils.toast('操作成功')
              //删除完后， 要判断该组内剩余status状态
              this.setStatus()
            }, 350)
          })
        })
			},
      
      setStatus(){
        if(this.st == '0'){
          this.status = this.users.length > 0 ? '2' : '0'
        }else{
          let isIn2 = false
          this.users.forEach(user => {
            let groups = user.groups, isIn = false
            groups.forEach(group => {
              if(group.code == this.st){
                isIn = true
                isIn2 = true
              }
            })
          })
          this.status = isIn2 ? '2' : '0'
        }
      },

			detail(user){
        plus.webview.create(config.CDN_ADDRESS + '/userDetail', 'userDetail', {}, {
          userid: user.friend.userid,
          fsid: user.fsid,
          type: '0'
        })
			},

			initMessage(){

			},

			newUser(){
		  	alert(123)
			},
      
      closeMasker(){
		    this.isOpen = false
      },
      
			searchUsers(item){
		    this.st = item.code
        this.y = '30px'
        this.opacity = 0
        setTimeout(() => {
          this.users.forEach(user => {
            if(this.st == '0'){
              this.users.forEach(user => {
                user.display = true
              })
            }else{
              let groups = user.groups, isIn = false, hasBlack = false
              groups.forEach(group => {
                if(group.code == this.st){
                  isIn = true
                }
                if(group.code == '040003'){
                  hasBlack = true
                }
              })
              if(this.st == '040003'){
                user.display = isIn
              }else{
                if(hasBlack){
                  user.display = false
                }else{
                  user.display = isIn
                }
              }
            }
          })
          this.y = 0
          this.opacity = 1
  
          this.setStatus()
        }, 450)
			},
   
			contact(){
				plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, address => {
					address && address.find([], contacts => {
            contacts && contacts.forEach(user => {
              console.log(user.displayName + ',' + user.phoneNumbers[0].value)
            })
					})
				}, err => {
					console.log('打开相册失败!')
				});
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '@/assets/style/main.scss';

	.index-contact-page{
		@include box-vert-left-top;
		background: $normalBgColor;
		width: 100%;

		.search-case{
			@include box-vert-center-middle;
			margin-top: 50px;
			height: auto;
			padding: 6px 10px 0;
			background: #fff;

			span{
				@include box-hori-center-middle;
				width: 100%;
				background: #efefef;
				height: 36px;
				border-radius: 3px;
				color: #333;

				label{
					font-size: 12px;
					margin-left: 6px;
				}
			}
		}

		.oper-case{
			@include box-hori-center-middle;
			padding: 20px;
			height: auto;
			background: #fff;
      margin-top: 50px;

			.oper-inner-case{
				@include box-vert-center-top;
				height: 100%;
				border-left: solid 1px #f5f5f5;

				&:first-child{
					border: none;
				}

				.iconfont{
					height: 24px;
					font-size: 24px;
					color: #999;

					&.icon-plus{
						color: #ffa556;
						font-size: 21px;
					}
					&.icon-user1{
						font-size: 25px;
						color: #008de1;
					}
					&.icon-tongxunlu{
						color: #008de1;
					}
				}

				a{
					margin-top: 4px;
					height: 12px;
					font-size: 12px;
					color: #666;
				}
			}
		}

		.pageframe-case{
      height: 44px;
			font-size: 16px;
			overflow: hidden;
			margin-top: 1px;
			background: #fff;
		}

		.scroller-wrapper{
			@include box-vert-left-top;
			padding: 0 8px;

			.users-scroller{
				@include box-vert-left-top;
				position: relative;
				margin-top: 10px;
				padding: 0 0 55px;
				overflow: hidden;
        transition: transform .2s, opacity .2s;

				.user-inner-case{
					@include box-hori-left-top;
					width: 100%;
					overflow: hidden;
					background: #ccc;
					height: auto;
					margin-bottom: 8px;
					border-radius: 9px;

					.user-info-case{
						@include box-hori-left-middle;
						height: auto;
						background: #fff;
						padding: 10px;
						position: relative;
						width: 100%;

						.remove-case{
							@include box-vert-center-middle;
							width: 25%;
							position: absolute;
							right: -25%;
							top: 0;
							height: 100%;
							background: #fff;
							color: #f85959;
							overflow: hidden;
              font-weight: bold;
						}

						.photo-case{
							width: 42px;
							height: 42px;
							border-radius: 11px;
							margin-right: 10px;
              position: relative;
              
              .user-photo{
                width: 42px;
                height: 42px;
                border-radius: 9px;
                overflow: hidden;
              }
              
              .icon-v{
                @include box-hori-center-middle;
                width: 18px;
                font-size: 12px;
                padding-left: 2px;
                height: 18px;
                background: #ffff00;
                color: $textStrongColor;
                position: absolute;
                right: -8px;
                bottom: 0;
                z-index: 5;
                border-radius: 18px;
              }
						}

						.user-case{
							@include box-vert-left-middle;
              padding-left: 10px;

							h3{
								height: auto;
								font-size: 16px;
								font-weight: bold;
								color: #666;
							}
						}

						time{
							position: absolute;
							right: 15px;
							top: 5px;
							color: #999;
							font-size: 10px;
							width: auto;
						}
            
            &:active{
              background: #f9f9f9;
            }
					}
				}
			}
		}
	}
</style>
