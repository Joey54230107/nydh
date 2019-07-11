<template>
  <normal-layout class="index-page" :loaded="loaded">
    <div class="user-info-case">
      <h1>
        <span class="iconfont icon-vip" :class="'vip-' + (user.isrealname == '1')"></span>
        {{user.nickname}}
      </h1>
      <div class="user-photo-case" @tap="editUser">
        <image-loader :src="user.url" :defaultCls="user.sex == '025001' ? 'photo-man' : 'photo-woman'" />
      </div>
      <span class="icon iconfont icon-qcode"></span>
    </div>
    <scroller class="my-case" :indicators="false" @setScroller="setScroller">
      <div class="user-oper-case">
        <ul class="inner-case">
          <li class="info-case">
            <span class="role-case" :class="'role-case-' + role.code" v-for="role in user.roles">{{role.name}}</span>
          </li>
          <li class="oper-case" v-for="(menu, idx) in menus">
            <div class="oper-inner-case" :style="{'border-top': (idx == 0) ? 'solid 1px rgba(0, 0, 0, .05)' : 'none'}">
              <div class="oper-line" @tap="dispatch(menu)">
                <div class="iconfont">{{menu.name.substring(0, 1)}}</div>
                <div class="sub-case auto-fill" v-if="menu.sub.length > 0">
                  <h3 v-for="item in menu.sub" class="auto-fill" @tap="dispatch(item)">
                    {{item.name}}
                  </h3>
                </div>
                <!--<span class="arr iconfont icon-right-arr"></span>-->
              </div>
            </div>
          </li>
          <li class="oper-btn-case">
            <span class="quit" @tap="quit">切换账号</span>
          </li>
        </ul>
      </div>
    </scroller>
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
  
  export default {
    mixins: [loginMixin],
    
    created(){
      window.addEventListener('init', (e) => {
        this.init()
      })
      
      window.addEventListener('loginSuccessInit', (e) => {
        this.loginSuccessInit()
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
        loaded: true,
        user: {},
				menus: [
          {name: '我的', chose: false, path: '', id: 'bjd', parent: '', icon:'icon-gyd', sub: [
            {name: '我的账簿', chose: false, path: '/myAccount', id: 'myAccount', code: 'icon-account2', sub: []},
            {name: '我的农场', chose: false, path: '/myFram', id: 'myFram', code: 'icon-farm', sub: []}
          ]},
          
					{name: '报价单', chose: false, path: '', id: 'bjd', parent: '', icon:'icon-xjd', sub: [
						{name: '我收的报价单', chose: false, path: '/myAccept', id: 'myAccept', parent: 'bjd', sub: []},
						{name: '我创建的报价单', chose: false, path: '/myOffer', id: 'myOffer', parent: 'bjd', sub: []}
					]},

					{name: '发货单', chose: false, path: '', id: 'fhd', parent: '', icon:'icon-qgd', sub: [
						{name: '我收到的发货单', chose: false, path: '/myAcceptGoods', id: 'myAcceptGoods', parent: 'fhd', sub: []},
						{name: '我创建的发货单', chose: false, path: '/myGoods', id: 'myGoods', parent: 'fhd', sub: []}
					]},

					{name: '订单', chose: false, path: '', id: 'dd', parent: '', icon:'icon-order', sub: [
						{name: '我收到的订单', chose: false, path: '/myAcceptOrders', id: 'myAcceptOrders', parent: 'dd', sub: []},
						{name: '我创建的订单', chose: false, path: '/myOrders', id: 'myOrders', parent: 'dd', sub: []}
					]},
          
          {name: '维护', chose: false, path: '', id: 'bjd', parent: '', icon:'icon-cog', sub: [
            {name: '地址管理', chose: false, path: '/addresses', id: 'addresses', code: 'icon-position3', sub: []},
            {name: '车辆管理', chose: false, path: '/drivers', id: 'drivers', code: 'icon-car', sub: []}
          ]}
				],
				menus2: [
					{name: '地址管理', chose: false, path: '/addresses', id: 'addresses', code: 'icon-position3', sub: []},
					{name: '车辆管理', chose: false, path: '/drivers', id: 'drivers', code: 'icon-car', sub: []},
					{name: '我的账簿', chose: false, path: '/myAccount', id: 'myAccount', code: 'icon-account2', sub: []},
					{name: '我的农场', chose: false, path: '/myFram', id: 'myFram', code: 'icon-farm', sub: []}
				],
        scroller: null
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.user = utils.getLocalUser()
				this.loaded = true
			})
    },
    
    methods: {
      setScroller(scroller){
        this.scroller = scroller
      },
      
      init(){
        this.user = utils.getLocalUser()
      },
      
      setMsg(){
        let user = utils.getLocalUser()
     
        window.setTimeout(() => {
          service('sendMsg', {
            userid: user.userid,
            data: [{"code":0,"route":"/my"}]
          })
        }, 5000)
        
        setInterval(() => {
          let msg = utils.getLocalItem('evt_my') || ''
          if(msg){
            //console.log('新消息：', msg)
            //msg = JSON.parse(msg)
          }
        }, 2000)
      },
  
      quit(){
        this.scroller && this.scroller.scrollTo(0, 0, 200)
        utils.confirm('退出当前账号并切换到其他账号', () => {
          utils.removeLocalItem('user')
          plus.webview.show('login', 'fade-in', 300, () => {
            mui.fire(plus.webview.getWebviewById('login'), 'init', {
              openerId: 'my'
            })
          })
        })
      },
  
      loginSuccessInit(){
				mui.fire(plus.webview.getWebviewById(plus.runtime.appid), 'navClick', {
					id: 'my'
				})
      },

			dispatch(menu){
      	if(menu.sub.length == 0){
      	  //utils.masker(true)
      	  if(menu.id == 'myOffer'){
      	    plus.webview.create(config.CDN_ADDRESS + '/myOffer', 'myOffer')
          }else if(menu.id == 'myAccept'){
            plus.webview.create(config.CDN_ADDRESS + '/myAccept', 'myAccept')
          }else if(menu.id == 'myGoods'){
						plus.webview.create(config.CDN_ADDRESS + '/myGoods', 'myGoods')
					}else if(menu.id == 'myAcceptGoods'){
            plus.webview.create(config.CDN_ADDRESS + '/myAcceptGoods', 'myAcceptGoods')
          }else if(menu.id == 'myAcceptOrders'){
            plus.webview.create(config.CDN_ADDRESS + '/myAcceptOrders', 'myAcceptOrders')
          }else if(menu.id == 'myOrders'){
            plus.webview.create(config.CDN_ADDRESS + '/myOrders', 'myOrders')
          }else if(menu.id == 'drivers'){
            plus.webview.create(config.CDN_ADDRESS + '/drivers', 'drivers', {}, {
              openerId: 'addresses'
            })
					}else if(menu.id == 'addresses'){
						plus.webview.create(config.CDN_ADDRESS + '/addresses', 'addresses', {}, {
							openerId: 'my'
            })
					}else if(menu.id == 'myFram'){
						plus.webview.create(config.CDN_ADDRESS + '/myFram', 'myFram')
					}
	      }
			},
  
      editUser(){
        plus.webview.create(config.CDN_ADDRESS + '/userEditor', 'userEditor')
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .index-page{
    @include box-vert-left-top;
    height: 100%;
    background: #f1f1f1;
    
    .user-info-case{
      @include box-vert-center-top;
      height: 80px;
      width: 100%;
      border-radius: 0 0 200px 200px/0 0 30px 30px;
      box-shadow: 0 -2px 10px #999;
      background: $red;
      position: fixed;
      top: 0;
      left: 0;
      overflow: visible;
      padding-top: 10px;
      z-index: 100;
      
      .icon{
        width: 32px;
        height: 40px;
        color: #fff;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 24px;
        line-height: 44px;
      }
      
      h1{
        @include box-hori-center-middle;
        padding: 0 15px;
        border-radius: 20px;
        width: auto;
        background: rgba(255, 255, 255, .8);
        font-size: 16px;
        color: #D16157;
        height: 25px;
        position: relative;
        
        .icon-vip{
          margin-right: 4px;
        }
  
        .vip-true{
          color: #D16157;
        }
  
        .vip-false{
          color: #999;
        }
      }
      
      .user-photo-case{
        overflow: hidden;
        width: 100px;
        height: 100px;
        border-radius: 128px;
        position: absolute;
        top: 45px;
        left: 50%;
        margin-left: -50px;
        padding: 0;
        //box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
        border: solid 6px #fff;
        
        .default-photo{
          @include box-hori-center-middle;
          width: 100px;
          height: 100px;
          border-radius: 128px;
        }

        .photo-man{
          background: url("../../../assets/img/man.png") top left/cover no-repeat;
        }
        .photo-woman{
          background: url("../../../assets/img/woman.png") center center/cover no-repeat;
        }
      }
    }
    
    .my-case{
      @include box-vert-left-top;
      position: relative;
      margin: 100px 0 0 0;
  
      .user-oper-case{
        @include box-vert-left-top;
        height: auto;
    
        .inner-case{
          padding-top: 30px;
          height: auto;
          background: #fcfcfc;
          border-radius: 200px 200px 0 0/50px 50px 0 0;
          //box-shadow: 0 2px 20px rgba(0, 0, 0, .21);

          .hori-case{
            @include box-hori-left-middle;
            height: auto;
            padding: 10px;
            margin-bottom: 15px;

            .menu2-case{
              @include box-vert-center-top;
              height: auto;

              .iconfont{
                font-size: 32px;

                &.icon-position3{
                  font-size: 30px;
                  color: #008de1;
                }
                &.icon-car{
                  color: #008de1;
                }
                &.icon-account2{
                  color: #f85959;
                }
                &.icon-farm{
                  font-size: 28px;
                  color: #f8b68e;
                }
              }

              label{
                width: 100%;
                text-align: center;
                color: #666;
                font-size: 12px;
                margin-top: 10px;
                font-weight: bold;
              }
            }
          }
      
          .info-case{
            @include box-hori-center-top;
            height: 30px;
        
            .role-case{
              width: auto;
              height: 21px;
              line-height: 19px;
              border-radius: 3px;
              margin: 0 6px;
              font-size: 14px;
              color: #fff;
              padding: 0 4px;
          
              &.role-case-1{
                background: #FCAA9F;
                border: solid 1px #FCAA9F;
              }
              &.role-case-2{
                background: #ffb000;
                border: solid 1px #ffb000;
              }
              &.role-case-3{
                background: #74baf3;
                border: solid 1px #74baf3;
              }
            }
          }
      
          .level-case{
            @include box-hori-center-middle;
            height: auto;
            margin-bottom: 10px;
          }
      
          .oper-case{
            @include box-hori-center-top;
            width: 100%;
            padding: 0 0 0 15px;
        
            .oper-inner-case{
              @include box-vert-left-top;
              background: #fcfcfc;
              width: 100%;
              height: auto;
              border-bottom: solid .5px rgba(0, 0, 0, .08);
              margin: 0 auto 1px auto;
          
              .oper-line{
                @include box-hori-left-middle;
                height: auto;
                padding: 0 0;
                //padding-left: 15px;
            
                .iconfont{
                  @include box-hori-center-middle;
                  width: 50px;
                  font-size: 21px;
                  height: 50px;
                  border-radius: 32px;
                  border: solid 1 $blue;
                  background: rgba(0, 141, 225, .2);
                  color: $blue;
                }
            
                label{
                  white-space: nowrap;
                  width: 45px;
                  height: auto;
                  color: #454545;
                  font-size: 16px;
                  
                  &.font-true{
                    font-weight: bold;
                    text-align: center;
                  }
                }
                
                .sub-case{
                  @include box-vert-left-middle;
                  height: auto;
                  margin-left: 15px;
                  //border-left: solid 1px #eee;
                  padding-left: 10px;
                  
                  h3{
                    @include box-hori-left-middle;
                    color: $textStrongColor;
                    height: 50px;
                    position: relative;
                    border-bottom: solid .5px rgba(0, 0, 0, .08);
                    
                    &:last-child{
                      border: none;
                    }
                  }
                }
              }
          
              .arr{
                width: 32px;
                height: auto;
                font-size: 24px;
                color: #999;
                text-align: right;
              }
            }
          }
      
          .oper-btn-case{
            margin-bottom: 50px;
            //padding: 30px 30px 0;
            padding: 8px 0;
            height: auto;
            border-bottom: solid 1px #f0f0f0;
        
            .quit{
              @include box-hori-center-middle;
              width: 100%;
              border-radius: 3px;
              height: 46px;
              text-align: center;
              line-height: 46px;
              color: $red;
              font-size: 18px;
              background: transparent;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>
