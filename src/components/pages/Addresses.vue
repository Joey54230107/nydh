<template>
  <normal-layout class="address-page" :loaded="loaded">
    <address-header title="选择我的收货目的地" />
  
    <div class="addr-case">
      <scroller class="addr-inner-case">
        123
      </scroller>
    </div>
  </normal-layout>
</template>

<script>
	import utils from '@/plugins/utils'
	import config from '../../../config/address.js'
	import UserBo from '@/model/bo/User'
	import comboxMenu from '@/components/comm/ComboxMenu'
  import service from '@/api/service'
  import imageLoader from '@/components/comm/ImageLoader'
  import addressHeader from '@/components/comm/header/AddressHeader'

	export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('addressChose', 'pop-in', 300)
			})
    },

		data(){
			return {
        loaded: true
			}
		},

		components: {
      imageLoader,
      addressHeader
		},

		mounted(){
			mui.plusReady(() => {
			})
		},

		methods: {
      search(){
        let user = utils.getLocalUser()
        service('getAddresses', {
          userid: user.userid
        }, rs => {
          console.log(JSON.stringify(rs))
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';

  .login-case{
    width: 100%;
    height: 100%;
    position: relative;
    background: #999;

    &:after{
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: .5;
      z-index: 2;
      background: url("../../assets/img/login_bg.jpeg") center center/100% 100% no-repeat #fff;
      filter: blur(10px);
    }

    .login-inner-case{
      @include box-vert-center-top;
      height: 100%;
      position: relative;
      z-index: 20;

      .camera{
        overflow: visible;
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(255, 255, 255, .7);
        line-height: 34px;
        text-align: center;
        font-size: 21px;
        width: 36px;
        height: 36px;
        color: #666;
        border-radius: 50px;
        border: solid 1px #dedede;

        .camera-show{
          display: none;
        }

        &:active{
          background: rgba(255, 255, 255, .9);
        }
        &:focus{

          .camera-show{
            display: block;
          }
        }
      }

      .close{
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 32px;
        color: #666;
      }

      .photo-case{
        @include box-vert-center-middle;
        height: 200px;

        .photo-border{
          @include box-vert-center-middle;
          width: 128px;
          height: 128px;
          border-radius: 100px;
          border: solid 8px rgba(255, 255, 255, .3);
          position: relative;
          overflow: hidden;
          
          .default-photo{
            width: 112px;
            height: 112px;
            border-radius: 112px;
          }
        }
      }

      .oper-row{
        @include box-hori-center-middle;
        padding: 15px 15px 0;
        height: auto;

        .input-case{
          @include box-hori-left-middle;
          height: 44px;
          width: 100%;
          border-radius: 7px;
          background: rgba(255, 255, 255, .4);

          input{
            @include box-hori-left-middle;
            height: 20px;
            padding: 0 20px;
            border: none;
            margin: 0;
            background: transparent;
            font-size: 18px;
            color: #333;
          }

          .icon{
            text-align: right;
            width: 36px;
            height: 44px;
            line-height: 48px;
            font-size: 18px;
            color: #454545;
          }
        }
      }

      .oper-btn-case{
        height: auto;
        padding: 15px 15px 0;

        .btn{
          @include box-hori-center-middle;
          width: 100%;
          border-radius: 5px;
          height: 46px;
          text-align: center;
          color: #fff;
          font-size: 18px;
          border: none;
          padding: 0;
          margin-bottom: 15px;
  
          &.btn-yellow{
            background: #ffd100;
            color: #333;
    
            &:active{
              background: #C24F4F;
            }
          }
          &.btn-red{
            background: #DD6464;
            color: #fff;
    
            &:active{
              background: #C24F4F;
            }
          }
          &.btn-green{
            background: #6AA89D;

            &:active{
              background: #4F887E;
            }
          }

          label, span{
            width: auto;
            height: auto;
          }
          
          .icon-check{
            font-size: 24px;
          }

          span{
            font-size: 24px;
            padding: 0 10px 0 0;
          }

          &:active{
            background: #EF957F;
          }
        }
        
        .operation-case{
          @include box-hori-center-middle;
          height: 50px;
          color: #fff;
          font-size: 16px;
          text-decoration: underline;
        }
      }
    }
  
    .photo-man{
      background: url("../../assets/img/man.png") center center/cover no-repeat;
    }
    .photo-woman{
      background: url("../../assets/img/woman.png") center center/cover no-repeat;
    }
  }
</style>
