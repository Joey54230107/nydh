<template>
  <normal-layout class="examiner-page" :loaded="loaded">
    <normal-header title="设置验收人员" />
    <hori-scroller class="pageframe-case" :resource="pages" @handler="search" :selected="st"></hori-scroller>
    <div class="scroller-warpper auto-fill">
      <scroller class="users-scroller" :status="status">
        <slider-blocker class="user-inner-case" v-for="(user, idx) in users" :id="idx" :item="user" :sliderWidth="0" :key="user.fsid" v-show="user.display">
          <div class="user-info-case" @tap.stop="choseUser(user)">
            <div class="photo-case">
              <image-loader :src="user.friend.url" class="user-photo" :defaultCls="'photo-' + ((user.friend.sex == '025001') ? 'man' : 'woman') + '-case'" />
            </div>
            <div class="user-case auto-fill">
              <h3>{{user.friend.name}}</h3>
            </div>
            <span class="iconfont icon-check" :class="'icon-check-' + user.chose"></span>
          </div>
        </slider-blocker>
      </scroller>
    </div>
    <footer>
      <span class="comm-btn comm-blue-btn confirm-btn" @tap="setExaminers">确定验收人员</span>
    </footer>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
	import normalHeader from '@/components/comm/NormalHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import imageLoader from '@/components/comm/ImageLoader'
	import sliderBlocker from '@/components/comm/SliderBlocker'
	import ring from '@/components/comm/Ring'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.show('examiners', 'pop-in', 300, () => {})
			})
    },
    
    components: {
      scroller,
      normalLayout,
			normalHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			sliderBlocker
    },

    data(){
      return {
        loaded: true,
        pages: [
          {name: '验收组', code:'040004'},
          {name: '所有', code:'0'}
        ],
        st: '040004',
        users: [],
        status: ''
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.searchUsers()
			})
    },
    
    methods: {
      searchUsers(){
        this.status = '1'
        service('getFriends', {
          userid: utils.getLocalUser().userid
        }, rs => {
          if(rs && Array.isArray(rs)){
            rs.forEach(user => {
              user.jointime = utils.formatCreatetime(user.jointime)
              user.display = true
              user.chose = false
            })
            if(this.st != '0'){
              let has = false
              rs.forEach(user => {
                let groups = user.groups, isIn = false
                groups.forEach(group => {
                  if(group.code == this.st){
                    isIn = true
                    has = true
                  }
                })
                user.display = isIn
              })
              this.status = has ? '2' : '0'
            }else{
              this.status = rs.length > 0 ? '2' : '0'
            }
            this.users = rs
          }else{
            this.status = '0'
          }
        }, err => {
          this.status = '0'
        })
      },
      
      search(item){
        this.st = item.code
        this.searchUsers()
      },
  
      choseUser(user){
        user.chose = !user.chose
      },
      
      setExaminers(){
        let tradeid = plus.webview.currentWebview().tradeid, examiners = [], users = []
        this.users && this.users.forEach(user => {
          if(user.chose){
            examiners.push({
              uuid: utils.getUuid(),
              friendid: user.friend.userid
            })
            users.push({
              name: user.friend.userid ? user.friend.name : user.name,
              url: user.friend.userid ? user.friend.url : '',
              sex: user.friend.userid ? user.friend.sex : '025001'
            })
          }
        })
        if(examiners.length == 0){
          utils.toast('请选择验收人员', 2000, 'FAILED')
          return ;
        }
        service('setExaminers', {
          tradeid,
          userid: utils.getLocalUser().userid,
          days: 1,
          items: examiners
        }, rs => {
          utils.toast('操作成功')
          mui.fire(plus.webview.getWebviewById('myAcceptOrderDetail'), 'setExaminers', {
            users
          })
          plus.webview.currentWebview().close('pop-out', 300)
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .examiner-page{
    @include box-vert-left-top;
    background: #f0f0f0;
    position: relative;
  
    header{
      @include box-hori-center-middle;
      height: 50px;
      border-bottom: solid 1px #f1f1f1;
      font-size: 18px;
      color: #666;
      position: relative;
      background: #fff;
      width: 100%;
    
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
  
    .pageframe-case{
      height: 44px;
      font-size: 16px;
      overflow: hidden;
      background: #fff;
    }

    .scroller-warpper{
      @include box-vert-left-top;
      position: relative;
      padding: 0 10px 55px;
      margin-top: 10px;

      .users-scroller{
        @include box-vert-left-top;
        position: relative;
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
              width: 30%;
              position: absolute;
              right: -30%;
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
              overflow: hidden;
              margin-right: 10px;
            }

            .user-case{
              @include box-vert-left-middle;

              h3{
                height: auto;
                font-size: 16px;
                font-weight: bold;
                color: #666;
              }
            }

            .icon-check{
              @include box-vert-center-middle;
              padding-top: 2px;
              width: 24px;
              height: 24px;
              font-size: 16px;
              border-radius: 24px;
  
              &.icon-check-true{
                background: #008de1;
                color: #fff;
              }
              &.icon-check-false{
                background: #dedede;
                color: transparent;
              }
            }
          }
        }
      }
    }
  
    footer{
      @include box-vert-left-middle;
      height: 60px;
      padding: 0 10px;
      background: #fff;
      
      .confirm-btn{
        width: 100%;
      }
    }
  }
</style>
