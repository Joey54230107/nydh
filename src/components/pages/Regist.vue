<template>
  <div class="regist-case">
    <error-pop :msg="msg" />
    <span class="iconfont icon-close" @tap="close"></span>
    <ul class="form-case">
      <li class="row">
        <input type="tel" class="ipt-case" placeholder="请输入您的手机号码" v-model="user.mobile" />
      </li>
      <li class="row">
        <input type="text" class="ipt-case" placeholder="请输入您的昵称" v-model="user.nickname" />
      </li>
      <li class="row">
        <input type="text" class="ipt-case" placeholder="请输入您的登录密码" v-model="user.password" />
      </li>
      <li class="row">
        <input type="text" class="ipt-case" placeholder="请输入核实您的登录密码" v-model="user.password2" />
      </li>
      <li class="row">
        <button class="regist-btn" @tap="regist">确定注册</button>
      </li>
    </ul>
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
      window.addEventListener('init', (e) => {})
    },

		data(){
			return {
        msg: '',
        user: {
          mobile: '124',
          password: '1234',
          nickname: '1234',
          password2: '1234'
        }
			}
		},

		components: {
      errorPop
		},
    
    mounted(){
			mui.plusReady(() => {
				plus.webview.show('regist', 'pop-in', 300)
			})
    },

		methods: {
      close(){
        plus.webview.currentWebview().close('pop-out', 300)
      },
      
      regist(){
        if(!(this.user.mobile.trim())){
          utils.setError.call(this, 'msg', '手机号码必须输入')
          return ;
        }
        if(!(this.user.password.trim())){
          utils.setError.call(this, 'msg', '密码必须输入')
          return ;
        }
        if(!(this.user.password2.trim())){
          utils.setError.call(this, 'msg', '核实密码必须输入')
          return ;
        }
        if(this.user.password2.trim() != this.user.password.trim()){
          utils.setError.call(this, 'msg', '核实密码必须与密码一致')
          return ;
        }
        if(!(this.user.nickname.trim())){
          utils.setError.call(this, 'msg', '昵称必须输入')
          return ;
        }
        this.user.password = md5(this.user.password)
        service('userRegist', this.user, rs => {
          console.log(JSON.stringify(rs))
          utils.toast('注册成功')
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';
  
  .regist-case{
    @include box-vert-center-top;
    height: 100%;
    width: 100%;
    background: #fff;
    position: relative;
    
    .icon-close{
      @include box-hori-center-middle;
      width: 50px;
      height: 50px;
      font-size: 32px;
      color: #666;
      position: absolute;
      top: 0;
      left: 0;
    }
    
    .form-case{
      @include box-vert-center-top;
      height: auto;
      padding: 100px 30px 0;
      
      .row{
        @include box-hori-center-middle;
        height: 50px;
        margin-top: 15px;
        
        .ipt-case{
          @include box-hori-center-middle;
          text-align: center;
          font-size: 18px;
          height: 50px;
          background: rgba(255, 255, 255, .9);
          border: none;
          
          &::-webkit-input-placeholder{
            color: #999;
            font-size: 14px;
          }
        }
        
        .regist-btn{
          background: transparent;
          color: #fff;
          text-align: center;
          height: 50px;
          border: solid 1px #fff;
          border-radius: 3px;
          font-size: 16px;
        }
      }
    }
  }
</style>
