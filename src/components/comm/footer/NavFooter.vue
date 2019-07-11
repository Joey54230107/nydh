<template>
  <footer class="c-footer-case">
    <div class="footer-item-case auto-fill" @tap="menuClick(menu)" :class="'item-' + menu.chose" v-for="menu in menus">
      <span class="nav-icon" :class="'iconfont ' + menu.icon">
        <i v-if="menu.msg"></i>
      </span>
      <a class="nav-text">{{menu.name}}</a>
    </div>
  </footer>
</template>

<script>
  import utils from '@/plugins/utils'
  
	export default {
		name: 'navfooter',

    props: {
			navs: {
				type: Array
      }
    },

		data(){
			return {
				menus: this.navs
			}
		},

		mounted(){
      this.setMsg()
		},

		methods: {
		  setMsg(){
        /*setInterval(() => {
          let msg = utils.getLocalItem('receive_msg') || ''
          if(msg){
            msg = JSON.parse(msg)
            this.menus[1].msg = (msg.biz_num > 0)
          }
        }, 2000)*/
      },
      
			menuClick(item){
			  let access = true
			  if(item.login && (!utils.hasLogin())){
          plus.webview.show('login', 'fade-in', 300, () => {
            mui.fire(plus.webview.getWebviewById('login'), 'init', {
            	cancel: true,
              openerId: item.id
            })
          })
          return ;
        }
				this.menus && this.menus.forEach(menu => {
					menu.chose = (menu.path === item.path)
        })
        this.$emit('navClick', item)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '~@/assets/style/main.scss';

	.c-footer-case{
		@include box-hori-left-middle;
    height: 55px;
    border-top: solid 1px #f3f3f3;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    z-index: 100;
    padding: 2px 0;

    .footer-item-case{
      @include box-vert-center-middle;
      height: 49px;
      border-radius: 10px;
      margin: 0 2px;
      transition: background .4s;

      &.item-true{
        color: #008de1;
        background: rgba(0, 141, 225, .1);
        
        a{
          font-weight: bold;
        }
      }
      &.item-false{
        color: #666;
      }

      .nav-icon{
        margin-top: -3px;
        height: 36px;
        width: 100%;
        font-size: 30px;
        line-height: 36px;
        position: relative;
        
        i{
          width: 10px;
          height: 10px;
          background: #ff0000;
          border-radius: 8px;
          position: absolute;
          top: 3px;
          right: 20px;
        }
      }

      .nav-text{
        font-size: 10px;
        line-height: 14px;
        height: 14px;
        color: inherit;
      }
      
      .icon-home{
        font-size: 24px;
      }
      .icon-business{
        font-size: 26px;
      }
      .icon-chat{
        font-size: 21px;
      }
      .icon-contacts{
        font-size: 30px;
      }
      .icon-my{
        font-size: 21px;
      }
    }
	}
</style>
