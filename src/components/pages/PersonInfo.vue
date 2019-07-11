<template>
  <div class="personInfo-case">
    <div class="card-case">
      <span class="iconfont icon-close" @tap="close"></span>
      <header class="user-info-case">
        <div class="user-photo-case">
          <image-loader class="user-photo" :src="user.url" :defaultCls="'photo-' + ((user.sex == '025001') ? 'man' : 'woman') + '-case'" />
        </div>
        <div class="user-name-case auto-fill">
          <h2>{{user.isrealname == 1 ? user.name : user.nickname}}</h2>
          <div class="iconfont icon-vip" :class="user.isrealname == 1 ? 'vip-true' : 'vip-false'"><label>{{user.isrealname == 1 ? '已实名认证' : '未实名认证'}}</label></div>
        </div>
      </header>
      <ul class="user-case" v-if="user.userid != sessionUser.userid">
        <li class="cell auto-fill">
          <h3>{{user.concern}}</h3>
          <h4>关注</h4>
        </li>
        <li class="cell auto-fill">
          <h3>{{user.concerned}}</h3>
          <h4>粉丝</h4>
        </li>
        <li class="cell auto-fill">
          <!--008001=陌生人、 008002=好友、 008003=黑名单-->
          <div class="button iconfont" :class="user.relation == '008001' ? 'icon-shoucang' : (user.relation == '008002' ? 'icon-stars' : 'icon-sad')" @tap.stop="userClick">
            {{user.relation == '008001' ? '未关注' : (user.relation == '008002' ? '已关注' : '已拉黑')}}
          </div>
        </li>
      </ul>
      <div class="qcode-case auto-fill">
        <div id="qcodeContainer"></div>
      </div>
      <span class="iconfont icon-refresh" @tap.stop="refresh">&nbsp;&nbsp;刷新二维码</span>
    </div>
  </div>
</template>

<script>
	import utils from '@/plugins/utils'
	import config from '../../../config/address.js'
  import imageLoader from '@/components/comm/ImageLoader'
  import service from '@/api/service'
  import UserBo from '@/model/bo/User'
  import '@/assets/libs/qrcode.min.js'

	export default {
		components: {
			imageLoader
    },

    data(){
			return {
				user: {},
        qcode: null,
        sessionUser: {}
      }
    },

		mounted(){
			mui.plusReady(() => {
				this.init()
				plus.webview.getWebviewById('personInfo').show('fade-in', 200)
        this.sessionUser = utils.getLocalUser()
				this.qcode = new QRCode(document.getElementById("qcodeContainer"), {
					width : 200,
					height : 200,
					colorDark: '#666',
					colorLight: '#f1f1f1'
				})
				this.qcode.makeCode('http://www.baidu.com')
			})
		},

		methods: {
			close(){
				plus.webview.currentWebview().close('fade-out', 200)
      },
      
      userClick(){
			  if(this.user.relation == '008001'){
			    //关注他
          service('addFriend', {
            userid: this.sessionUser.userid,
            friendid: this.user.userid
          }, rs => {
            mui.toast('关注成功！')
            this.user.relation = '008002'
          })
        }else if(this.user.relation == '008002'){
          //取消关注
          mui.confirm('您确定要取消关注"' + this.user.name + '"么？', '取消关注', ['是','否'], e => {
            if(e.index == 0){
              service('removeFriend', {
                userid: this.sessionUser.userid,
                friendid: this.user.userid
              }, rs => {
                mui.toast('取消关注成功！')
                this.user.relation = '008001'
              })
            }
          })
        }else if(this.user.relation == '008003'){
          //取消拉黑（恢复成好友）
        }
      },
      
      init(){
			  let win = plus.webview.getWebviewById('personInfo'), user = utils.getLocalUser()
        let userid = win.userid
        if(userid == user.userid){
			    //自己
          this.user = user
          utils.masker()
        }else{
          //别人
          service('getUserInfo', {
            userid: user.userid,
            linkid: userid
          }, rs => {
            this.user = new UserBo(rs)
            utils.masker()
          })
        }
        //console.log(JSON.stringify(user))
      },

      refresh(){
				utils.masker(true)
        setTimeout(() => {
					utils.masker()
					this.qcode.makeCode('http://www.baidu.com?t=' + Math.random())
        }, 1000)
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';

  .personInfo-case{
    @include box-vert-center-middle;
    width: 100%;
    height: 100%;
    position: relative;
    background: #111;

    .card-case{
      @include box-vert-left-top;
      width: 86%;
      height: 75%;
      background: #fff;
      border-radius: 7px;
      overflow: hidden;
      position: relative;
      
      .icon-close{
        width: auto;
        height: 32px;
        line-height: 32px;
        position: absolute;
        z-index: 50;
        right: 5px;
        top: 5px;
        font-size: 32px;
        color: #787878;
      }

      .user-info-case{
        @include box-hori-left-middle;
        width: 100%;
        height: 90px;
        background: url("../../assets/img/header-bg.png") left top/100% 100% no-repeat;
        position: relative;
        padding: 0 15px;

        .user-photo-case{
          width: 60px;
          height: 60px;
          background: #f1f1f1;
          border-radius: 72px;
          overflow: visible;
          padding: 2px;
          position: relative;

          .user-photo{
            width: 56px;
            height: 56px;
            border-radius: 84px;
            overflow: hidden;
          }
        }
        
        .user-name-case{
          @include box-vert-left-top;
          text-align: left;
          height: auto;
          color: #333;
          padding: 0 10px;
          
          h2{
            font-size: 16px;
            margin: 0;
          }
          
          .icon-vip{
            font-size: 14px;
            width: auto;
            height: 20px;
            line-height: 20px;
            padding: 0 8px;
            border-radius: 20px;
            margin: 10px 0 0 0;
  
            &.vip-true{
              background: #ffd100;
              color: #666;
            }
            &.vip-false{
              background: #ccc;
              color: #787878;
            }
            
            label{
              font-size: 12px;
              padding-left: 4px;
            }
          }
        }
      }
      
      .user-case{
        @include box-hori-center-middle;
        height: 60px;
        background: #ccc;
        
        .cell{
          @include box-vert-center-middle;
          height: auto;
          border-right: solid 1px #9c9c9c;
          
          &:last-child{
            border: none;
          }
          
          h3{
            padding: 0;
            margin: 0;
            height: auto;
            width: auto;
            font-size: 18px;
            font-weight: 300;
            color: #fff;
            padding-bottom: 5px;
          }
          h4{
            padding: 0;
            margin: 0;
            width: auto;
            height: auto;
            font-size: 12px;
            color: #666;
          }
          .button{
            width: auto;
            height: 28px;
            padding: 0 10px;
            background: #DF6158;
            border-radius: 5px;
            line-height: 28px;
            color: #eee;
            font-size: 14px;
            
            &.icon-sad{
              background: #333;
            }
            
            &:active{
              opacity: .8;
            }
          }
        }
      }

      .qcode-case{
        @include box-vert-center-middle;
        width: 100%;
        padding-top: 10px;

        #qcodeContainer{
          width: 200px;
          height: 200px;
          background: #fff;
          color: #666;
        }
      }

      .icon-refresh{
        width: 100%;
        height: 30px;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
    }
  }
</style>
