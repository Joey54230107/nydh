<template>
	<div class="portal-case">
		<guide v-show="loadGuide == 'do'" />
		<div class="biz-case mui-content" v-if="loadBizPage == 'do'">
			<nav-footer :navs="subpages" @navClick="navClick" />
		</div>
	</div>
</template>

<script>
	import utils from '@/plugins/utils'
	import guide from '@/components/pages/Guide'
	import navFooter from '@/components/comm/footer/NavFooter'
	import config from '../../../config/address.js'
  import service from '@/api/service'
  import Message from '@/model/event/Message'
  import locations from '@/assets/libs/locations'

	export default {
    created(){
      window.addEventListener('navClick', (e) => {
        this.navClick({
          id: e.detail.id
        })
      })
    },
    
		components: {
			navFooter,
			guide
		},

		data(){
			return {
				loadGuide: 'undo',
				loadBizPage: 'undo',
				subpages: [
					{path:'/home', chose:true, id:'home', name:'首页', icon:'icon-home', login:false, msg:false},
					{path:'/business', chose:false, id:'business', name:'生意圈', icon:'icon-business', login:true, msg:false},
          {path:'/liaotian', chose:false, id:'liaotian', name:'聊天', icon:'icon-chat', login:true, msg:false},
					{path:'/contact', chose:false, id:'contact', name:'联系人', icon:'icon-contacts', login:true, msg:false},
					{path:'/my', chose:false, id:'my', name:'我的', icon:'icon-my', login:true, msg:false}
				],
				opacity: 0,
				chosedSub: null
			}
		},

		mounted(){
			mui.plusReady(() => {
        utils.removeLocalItem('code_locations')
				this.initPages()
        
        window.setTimeout(() => {
          this.setSpecs()
          this.setLocations()
        }, 2000)
			})
		},

		methods: {
		  loadGuidePage(){
        let isGuideLoaded = Boolean(utils.getLocalItem('GUIDE_LOADED'))
        if(isGuideLoaded){
          this.loadGuide = 'undo'
          this.loadBizPage = 'do'
        }else{
          this.loadGuide = 'do'
          window.setTimeout(() => {
            this.loadBizPage = 'do'
          }, 100)
          utils.setLocalItem('GUIDE_LOADED', 'true')
        }
        return isGuideLoaded
      },
      
			initPages(){
				let isGuideLoaded = this.loadGuidePage(), win = plus.webview.currentWebview()
				this.subpages.forEach((page) => {
					let path = config.CDN_ADDRESS + page.path
					let sub = plus.webview.create(path, page.id, {
						top: '0',
						bottom: '55px'
					})
					if(page.chose){
						sub.hide()
						this.chosedSub = sub
					}else{
						sub.hide()
					}
					win.append(sub)
				})

				if(!isGuideLoaded){
					window.setTimeout(() => {
						this.chosedSub.show('fade-in', 300, () => {
							this.loadGuide = 'undo'
						})
					}, 3000)
				}else{
					this.chosedSub.show()
				}
			},

			navClick(menu){
				this.subpages && this.subpages.forEach(item => {
					if(item.id === menu.id){
						plus.webview.show(item.id, 'fade-in', 0)
            item.chose = true
					}else{
						plus.webview.hide(item.id, 'fade-out', 0)
            item.chose = false
					}
				})
        if(menu.id == 'business'){
				  /*生意圈页面*/
          mui.fire(plus.webview.getWebviewById('businessInnerList'), 'init')
          mui.fire(plus.webview.getWebviewById('business'), 'init')
        }else if(menu.id == 'my'){
          /*我的页面*/
          mui.fire(plus.webview.getWebviewById('my'), 'init')
        }else if(menu.id == 'liaotian'){
          /*聊天页面*/
          mui.fire(plus.webview.getWebviewById('chats'), 'init')
        }else if(menu.id == 'home'){
          /*首页页面*/
          mui.fire(plus.webview.getWebviewById('home'), 'init')
        }else if(menu.id == 'contact'){
          /*联系人页面*/
          mui.fire(plus.webview.getWebviewById('contact'), 'initMessage')
        }
			},

			releaseGuide(){
				this.loadGuide = 'undo'
			},
      
      setSpecs(){
			  let specs = utils.getLocalItem('code_specs')
        if(!specs){
			    service('getSpecs', {}, rs => {
			      utils.setLocalItem('code_specs', rs)
          })
        }
      },
      
      setLocations(){
        let _locations = utils.getLocalItem('code_locations')
        if(!_locations){
          utils.setLocalItem('code_locations', locations)
        }
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
	.portal-case{
		width: 100%;
		height: 100%;
		position: relative;

		.biz-case{
			width: 100%;
			height: 100%;
		}
	}
</style>
