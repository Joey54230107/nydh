<template>
  <div class="login-case">
    <error-pop :msg="msg" />
    <header><span class="iconfont icon-close" @tap="close"></span><div class="regist" @tap="regist">快速注册</div></header>
    <ul class="login-inner-case auto-fill">
      <li class="oper-row">
        <div class="input-case">
          <span class="icon iconfont icon-user-simple"></span>
          <input type="tel" id="login_tel" class="auto-fill" v-model="user.mobile" placeholder="您的手机号码" />
        </div>
      </li>
      <li class="oper-row">
        <div class="input-case">
          <span class="icon iconfont icon-psd"></span>
          <input type="password" class="auto-fill" v-model="password" placeholder="您的登录密码" />
        </div>
      </li>
      <li class="oper-btn-case">
        <!--<div class="agreement-case">
          <span class="iconfont icon-check"></span>我已<a>阅读协议</a>并同意
        </div>-->
        <div class="btn btn-red" @tap="login">
          <label>登录系统</label>
        </div>
        <!--<div class="operation-case" @tap="backHome">返回首页</div>-->
      </li>
      <li class="forget-case">
        忘记密码了？
      </li>
    </ul>
    <footer>
      <label @tap="goNav('home')">看看首页如何</label>
      <label @tap="goNav('business')">去生意圈逛逛</label>
    </footer>
  </div>
</template>

<script>
	import utils from '@/plugins/utils'
	import config from '../../../config/address.js'
	import UserBo from '@/model/bo/User'
  import service from '@/api/service'
  import errorPop from '@/components/comm/ErrorPop'
  import md5 from '@/plugins/md5'

	export default {
    created(){
			window.addEventListener('init', (e) => {
				this.init(e.detail)
			})
			window.addEventListener('loginSuccessInit', (e) => {
				this.loginSuccessInit()
			})
    },

		data(){
			return {
				password: '123',
        cancel: true,
        openerId: '',
				user: {},
        msg: '',
        openError: false,
			}
		},

		components: {
      errorPop
		},
    
    mounted(){
			mui.plusReady(() => {
				this.user = utils.getLocalUser()
				utils.openSoftKeyborad('login_tel')
			})
    },

		methods: {
    	goNav(id){
				this.close()
        setTimeout(() => {
					mui.fire(plus.webview.getWebviewById(plus.runtime.appid), 'navClick', {
						id
					})
        }, 0)
      },

		  init(param){
		    let ipt = document.getElementById('login_tel')
		    this.cancel = !!(param.cancel)
        this.user = utils.getLocalUser()
        this.openerId = param.openerId
        
        setTimeout(() => {
          utils.openSoftKeyborad()
          ipt.focus()
          
        }, 300)
      },
      
      regist(){
        plus.webview.create(config.CDN_ADDRESS + '/regist', 'regist')
      },
      
			close(){
				plus.webview.currentWebview().hide('fade-out', 300)
			},
      
      takePhoto(){
        if(mui.os.plus){
          let menus = [
            {title: '拍照'},
            {title: '从相册中选择'}
          ]
          plus.nativeUI.actionSheet({
            cancel: "取消",
            buttons: menus
          }, ev => {
            if(ev.index == 1){
              this.openCamera()
            }
          })
        }
      },

			cameraHandler(item){
				if(item.id == '1'){
					this.openCamera()
        }
      },
      
			login(){
        if(!(this.user.mobile.trim())){
          utils.setError.call(this, 'msg', '账号（手机号码）必须输入')
          return ;
        }
        if(!(this.password.trim())){
          utils.setError.call(this, 'msg', '登录密码必须输入')
          return ;
        }
				service('checkLogin', {
          mobile: this.user.mobile,
          password: md5(this.password)
        }, rs => {
					let win = plus.webview.getWebviewById(this.openerId)
					this.user = new UserBo(rs.user)
					utils.setLocalItem('user', JSON.stringify(this.user))
          utils.setLocalItem('token', rs.token)
          utils.toast('登录成功')
          mui.fire(win, 'loginSuccessInit')
          this.close()
        })
			}
		}
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';

  .login-case{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    position: relative;
    background: #fff;
    
    header{
      @include box-hori-center-middle;
      height: 50px;
      background: #fff;
      color: #333;
      //font-weight: bold;
      font-size: 18px;
      position: relative;
      
      .iconfont{
        @include box-vert-center-middle;
        position: absolute;
        width: 50px;
        height: 50px;
        color: #666;
        left: 0;
        top: 2px;
        font-size: 32px;
      }
      
      .regist{
        @include box-hori-center-middle;
        position: absolute;
        width: auto;
        height: auto;
        right: 15px;
        top: 15px;
        font-size: 16px;
        color: #666;
        border-bottom: solid 1px #666;
      }
    }
    
    .login-inner-case{
      @include box-vert-center-top;
      height: auto;
      position: relative;
      padding: 100px 20px 0;

      .oper-row{
        @include box-hori-center-middle;
        padding: 15px 15px 0;
        height: auto;

        .input-case{
          @include box-hori-left-middle;
          height: 44px;
          width: 100%;
          border-radius: 0;
          border-bottom: solid 1px #eee;

          input{
            @include box-hori-left-middle;
            height: 20px;
            padding: 0;
            border: none;
            margin: 0;
            background: transparent;
            font-size: 18px;
            color: #333;
          }

          .icon{
            text-align: left;
            width: 36px;
            margin-left: 5px;
            height: 44px;
            line-height: 48px;
            font-size: 18px;
            color: #999;
          }
          
          &:hover{
            border-bottom: solid 1px #008de1;
            
            .icon{
              color: #008de1;
            }
          }
        }
      }

      .oper-btn-case{
        height: auto;
        padding: 75px 15px 0;
        
        .agreement-case{
          @include box-hori-left-middle;
          margin-bottom: 10px;
          color: #008de1;
  
          a{
            font-weight: bold;
            padding: 0 2px;
            color: #008de1;
            text-decoration: underline;
          }
          
          .iconfont{
            width: 16px;
            height: 16px;
            border: solid 1px #999;
            border-radius: 3px;
            line-height: 14px;
            font-size: 14px;
            font-weight: bold;
            margin-right: 5px;
            margin-left: 5px;
            
            &.check-true{
              color: #008de1;
            }
          }
        }

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
          background: #f85959;
          
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
            opacity: .8;
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
      
      .forget-case{
        @include box-hori-center-top;
        color: #008de1;
        padding: 0 10px;
      }
    }

    footer{
      @include box-hori-center-top;
      height: 30px;

      label{
        @include box-hori-center-middle;
        width: auto;
        color: $textColor;
        font-size: 14px;
        height: 14px;
        padding: 0 15px;

        &:last-child{
          border-left: solid 1px #dedede;
        }
      }
    }
  }
</style>
