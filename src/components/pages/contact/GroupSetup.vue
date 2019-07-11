<template>
	<normal-layout class="user-detail-page" :loaded="loaded">
    <normal-header title="设置人员分组" :simple="true" />
    <div class="remark-case">
      <remark class="remark-tipper-case">加入分组后，便能接收到对应分组的任务列表了</remark>
    </div>
    <scroller class="user-main auto-fill" :status="status">
      <li class="group-item-case" v-for="group in groups" @tap="choseItem(group)">
        <label class="auto-fill">{{group.value}}</label>
        <span class="iconfont icon-check" :class="'check-' + group.chose"></span>
      </li>
    </scroller>
		<footer>
      <confirm-button class="confirm-case" @handler="modfiy">确定设置</confirm-button>
		</footer>
	</normal-layout>
</template>

<script>
	import config from '../../../../config/address.js'
	import scroller from '@/components/comm/Scroller'
	import normalLayout from '@/components/layout/Layout'
  import normalHeader from '@/components/comm/NormalHeader'
  import remark from '@/components/comm/Remark'
  import confirmButton from '@/components/comm/ConfirmButton'
	import utils from '@/plugins/utils'
	import service from '@/api/service'
 
	export default {
		created(){
			mui.plusReady(() => {
				plus.webview.show('groupSetup', 'pop-in', 300)
			})
		},

		components: {
			scroller,
			normalLayout,
      normalHeader,
      remark,
      confirmButton
		},

		data(){
			return {
				loaded: true,
        screen_height: window.screen.availHeight,
				groups: [],
				confirm: false,
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
				service('getCode', {
					code: '040'
				}, rs => {
				  let _groups = plus.webview.currentWebview().gourps
          if(rs && Array.isArray(rs)){
					  let list = rs[0].children, groups = []
            list.forEach(item => {
              item.chose = false
              if(!(item.code == '040001' || item.code == '040002' || item.code == '040003')){
                _groups.forEach(group => {
                  if(group.code == item.code){
                    item.chose = true
                  }
                })
                groups.push(item)
              }
            })
            this.groups = groups
          }
          console.log(this.groups.length > 0 ? '2' : '0')
          this.status = this.groups.length > 0 ? '2' : '0'
				})
			},
      
      choseItem(item){
			  item.chose = !item.chose
      },

			back(){
				plus.webview.currentWebview().close('pop-out', 300)
			},
      
      modfiy(){
			  let groups = [], fsid = plus.webview.currentWebview().fsid, userid = plus.webview.currentWebview().userid, returnArr = []
        this.groups.forEach((item, idx) => {
          if(item.chose){
            groups.push(item.code)
            returnArr.push(item)
          }
        })
        
			  service('modifyFriend', {
          userid: utils.getLocalUser().userid,
          fsid,
          friendid: userid,
          groups: groups.join(',')
        }, rs => {
			    utils.toast('保存成功')
          mui.fire(plus.webview.getWebviewById('userDetail'), 'setGroup', {
            returnArr
          })
          plus.webview.currentWebview().close('pop-out', 300)
        })
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '@/assets/style/main.scss';

	.user-detail-page{
		@include box-vert-left-top;
		background: #f7f7f7;
    width: 100%;

    .user-main{
      @include box-vert-left-top;
      overflow: hidden;
      position: relative;
  
      .group-item-case{
        @include box-hori-left-middle;
        height: 50px;
        background: #fff;
        margin-bottom: 1px;
        padding: 0 15px;
        font-size: 16px;
        color: #666;
        
        .icon-check{
          text-align: right;
          width: 50px;
          font-weight: bold;
          height: auto;
          font-size: 18px;
          color: transparent;
          
          &.check-true{
            color: #008de1;
          }
        }
        
        &:active{
          background: rgba(0, 0, 0, .05);
          color: #000;
        }
      }
    }
    
    .remark-case{
      @include box-vert-left-middle;
      padding: 10px;
      margin-top: 51px;
      height: 55px;
      background: #fff;
      
      .remark-tipper-case{
        border-radius: 9px;
      }
    }

		footer{
			@include box-hori-center-top;
      width: 100%;
			position: fixed;
			bottom: 0;
			height: 55px;
			padding: 0 15px;
      z-index: 50;
      
      .confirm-case{
        @include box-hori-center-middle;
        height: 42px;
        width: 100%;
        background: #008de1;
        color: #fff;
        font-size: 16px;
        border-radius: 3px;
      }
		}
	}
</style>
