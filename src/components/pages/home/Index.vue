<template>
	<normal-layout class="index-page" :loaded="loaded">
    <index-header />
    <scroller class="index-scroller" @scrollerHandler="scrollerHandler">
      <!--地理位置和气象预报-->
      <ul class="location-case">
        <li class="pos-case" @tap="openLocation">
          <span class="iconfont icon-position3"></span>
          <label class="city-name">{{city}}</label>
        </li>

        <li class="user-info-case auto-fill">
          <label class="user-name stranger" v-if="!user.userid">朋友！<a class="login iconfont icon-menu"></a></label>
          <label class="user-name user" v-if="user.userid">
            <image-loader :src="user.url" class="user-photo" :defaultCls="user.sex == '025001' ? 'photo-man' : 'photo-woman'" />
            {{user.isrealname == '1' ? user.name : user.nickname}}
          </label>
        </li>
      </ul>

      <!--app应用-->
      <div class="app-outer-case">
        <ul class="app-case">
          <li class="auto-fill app-item-case" v-for="app in apps" @tap="appClick(app)">
            <div class="iconfont" :class="app.icon">
              <label>{{app.name}}</label>
            </div>
          </li>
        </ul>
      </div>

      <!--广告轮播-->
      <div class="adv-case">
        <banner :resource="imgs" id="banner" class="banner" />
      </div>

    </scroller>
	</normal-layout>
</template>

<script>
	import config from '../../../../config/address.js'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import normalHeader from '@/components/comm/NormalHeader'
  import indexHeader from '@/components/comm/header/IndexHeader'
	import utils from '@/plugins/utils'
  import banner from '@/components/comm/Banner'
	import imageLoader from '@/components/comm/ImageLoader'

	export default {
	  created(){
      window.addEventListener('setCity', (e) => {
        this.setCity(e.detail.name)
      })
      window.addEventListener('init', (e) => {
        this.init()
      })
			window.addEventListener('loginSuccessInit', (e) => {
				this.loginSuccessInit()
			})
    },
    
		components: {
      scroller,
      indexHeader,
      normalLayout,
			banner,
			imageLoader,
      normalHeader
		},

		data(){
			return {
        loaded: true,
        city: '',
        apps: [
					{name: '我的任务', cls: 'cars', code: '01', icon: 'icon-my-task'},
					{name: '品类百科', cls: 'cate', code: '02', icon: 'icon-baike'},
					{name: '我的消息', cls: 'msg', code: '03', icon: 'icon-my-msg'},
					{name: '寻找农场', cls: 'qcode', code: '04', icon: 'icon-my-fram'},
					{name: '车辆追踪', cls: 'pos', code: '05', icon: 'icon-track'},
        ],
        user: {},
        imgs: [
					{imgUrl: config.SERVER_ADDRESS + '/cdn/banner/banner-1.jpg'},
					{imgUrl: config.SERVER_ADDRESS + '/cdn/banner/banner-2.jpg'},
					{imgUrl: config.SERVER_ADDRESS + '/cdn/banner/banner-3.jpg'},
					{imgUrl: config.SERVER_ADDRESS + '/cdn/banner/banner-4.jpg'},
					{imgUrl: config.SERVER_ADDRESS + '/cdn/banner/banner-5.jpg'}
        ]
      }
		},
    
    mounted(){
			mui.plusReady(() => {
				this.user = utils.getLocalUser()
				this.getLocation()
			})
    },
    
    methods: {
      scrollerHandler(scroller){
        console.log(scroller.y)
      },
      
      init(){
        this.user = utils.getLocalUser()
      },

			appClick(app){
      	let user = utils.getLocalUser()
        
        console.log(JSON.stringify(navigator))
        
      	if(app.code == '04'){
      		//我的农场
          utils.loginVerificate(() => {
						plus.webview.show('map', 'pop-in', 300)
          })
        }else if(app.code == '01'){
          //我的任务
          utils.loginVerificate(() => {
            plus.webview.create(config.CDN_ADDRESS + '/tasks', 'tasks', {}, {
              userid: user.userid
            })
          })
        }
      },
      
      openLocation(){
        utils.openLocationWin('home')
      },

			loginSuccessInit(){
      	alert(JSON.stringify(this.user))
				this.user = utils.getLocalUser()
      },
      
      /*注意,以后此方法要移动到引导加载页中*/
      getLocation(){
      	let city = utils.getLocalItem('local_city'), province = utils.getLocalItem('local_province')
        if(city != '' && province != ''){
      		this.city = city
          this.province = province
        }else{
					plus.geolocation.getCurrentPosition(rs => {
            utils.setLocalItem('local_city', rs.address.city)
            utils.setLocalItem('local_province', rs.address.province)
						this.getLocation()
					})
        }
      },
  
      setCity(name){
      	this.getLocation()
      }
    }
	}
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .index-page{
    @include box-vert-left-top;
	  background: $normalBgColor;
    
    .index-scroller{
      @include box-vert-left-top;
      
      .location-case{
        @include box-hori-left-middle;
        height: 60px;
        background: #fff;

        .pos-case{
          @include box-hori-left-middle;
          width: 40%;
          padding: 0 8px;
          height: 18px;
  
          .icon-position3{
            width: auto;
            padding-top: 2px;
            color: #008de1;
            font-size: 28px;
          }

          label{
            font-size: 14px;
            padding: 0 2px;
          }

          .city-name{
            white-space: nowrap;
            max-width: 70px;
            width: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 18px;
            font-weight: bold;
            color: #666;
          }

          .icon-down-arr{
            font-size: 18px;
            color: #ccc;
            font-weight: bold;
          }
        }

        .user-info-case{
          @include box-hori-right-middle;
          padding: 0 15px;

          .user-name{
            @include box-hori-left-middle;
            width: auto;
            font-weight: bold;
            color: $textColor;
            font-size: 16px;

            &:before{
              content: '您好，';
            }

            .user-photo{
              width: 32px;
              height: 32px;
              border-radius: 18px;
              overflow: hidden;
              margin: 0 6px 0 0;
            }

            .login{
              @include box-hori-left-middle;
              width: auto;
              color: #999;
              padding-left: 6px;
              font-size: 18px;
              height: 14px;
              border-left: solid 1px #ccc;
            }
          }
        }
      }

      .app-outer-case{
        @include box-hori-left-middle;
        overflow: hidden;
  
        .app-case{
          @include box-hori-left-top;
          height: 110px;
          //margin-top: 1px;
          //border-top: solid 1px #f5f5f5;
          background: #fff;
          //border-radius: 9px;
    
          .app-item-case{
            @include box-vert-center-top;
            height: 64px;
            padding-top: 0;
            overflow: hidden;
      
            div{
              @include box-vert-center-top;
              width: 56px;
              height: 50px;
              position: relative;

              &.iconfont{
                font-size: 24px;
                color: #666;
                margin-top: 10px;
              }

        
              label{
                color: #787878;
                width: 60px;
                height: 20px;
                position: absolute;
                left: 50%;
                margin-left: -30px;
                text-align: center;
                top: 30px;
                font-size: 12px;
              }
            }
          }
        }
      }
      
      .adv-case{
        height: 120px;
        overflow: hidden;
        margin-top: -30px;
        position: relative;
        padding: 0 12px;

        .banner{
          border-radius: 9px;
        }
        
        .adv{
          display: block;
          width: 40px;
          bottom: 0;
          text-align: center;
          left: 0;
          z-index: 10;
          height: 14px;
          background: rgba(255, 255, 255, .75);
          position: absolute;
          line-height: 14px;
          font-size: 10px;
          border-radius: 0 5px 0 0;
        }
      }
    }
    
    .weatch{
      width:32px;
      height: 24px;

      &.duoyun{
        background: url("../../../assets/img/weather/duoyun.png") center center/auto 24px no-repeat;
      }
      &.dayu{
        background: url("../../../assets/img/weather/dayu.png") center center/auto 24px no-repeat;
      }
      &.taiyang{
        background: url("../../../assets/img/weather/taiyang.png") center center/auto 24px no-repeat;
      }
      &.xue{
        background: url("../../../assets/img/weather/xue.png") center center/auto 24px no-repeat;
      }
      &.leiyu{
        background: url("../../../assets/img/weather/dayu.png") center center/auto 24px no-repeat;
      }
    }
  }
</style>
