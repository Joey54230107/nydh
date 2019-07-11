<template>
	<normal-layout class="group-page" :loaded="loaded">
		<normal-header title="编辑我的商品分组" :simple="true" />
		<div class="group-case auto-fill">
			<scroller>
				<ul class="form-case">
					<li class="row-case">
            <input-text placeholder="请填写分组标题" v-model="group.title">分组标题：</input-text>
				  </li>
					<li class="row-case">
            <input-text placeholder="请填写联系人" v-model="group.linker">联系人：</input-text>
					</li>
					<li class="row-case">
            <input-text placeholder="请填写联系电话" v-model="group.linkertel">联系电话：</input-text>
					</li>
					<li class="row-case row-area-case">
						<input-area maxLength="200" class="auto-fill" placeholder="商品备注、越详细越好哦" v-model="group.remark" />
					</li>
				</ul>
			</scroller>
		</div>
		<footer>
			<span class="comm-btn comm-blue-btn blue-btn" @tap="save">确定保存</span>
		</footer>
	</normal-layout>
</template>

<script>
	import config from '../../../../../config/address.js'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
	import normalHeader from '@/components/comm/NormalHeader'
	import utils from '@/plugins/utils'
	import horiScroller from '@/components/comm/HoriScroller'
	import service from '@/api/service'
  import imageLoader from '@/components/comm/ImageLoader'
	import inputArea from '@/components/comm/InputArea'
	import GroupBo from '@/model/bo/Group'
  import inputText from '@/components/comm/Input'

	export default {
	  created(){
			mui.plusReady(() => {
				plus.webview.currentWebview().show('pop-in', 300)
			})
    },
    
		components: {
      scroller,
			normalHeader,
      normalLayout,
			horiScroller,
      imageLoader,
			inputArea,
      inputText
		},

		data(){
			return {
        loaded: true,
				status: '1',
				group: new GroupBo(),
				position: {
        	lat: '',
					log: ''
				},
				openerId: ''
      }
		},
    
    mounted(){
			mui.plusReady(() => {
				let win = plus.webview.currentWebview()
				let flag = win.flag, group = win.group || {}, openerId = win.openerId
				this.initPosition()
				this.openerId = openerId
				if(flag == '1'){
					this.group = group
					this.group.userid = utils.getLocalUser().userid
				}
			})
    },
    
    methods: {
    	initPosition(){
				plus.geolocation.getCurrentPosition(rs => {
					this.position.lat = rs.coords.latitude  //维度
					this.position.log = rs.coords.longitude //经度
				})
	    },

	    save(){
        if(!utils.ruleMust(this.group.title)){
          utils.toast('请填写分组标题', 2000, 'FAILED')
          return ;
        }
        if(!utils.ruleMust(this.group.linker)){
          utils.toast('请填写联系人', 2000, 'FAILED')
          return ;
        }
        if(!utils.ruleMust(this.group.linkertel)){
          utils.toast('请填写联系电话', 2000, 'FAILED')
          return ;
        }
        utils.confirm('确定保存分组', () => {
          this.group.coords = this.position.lat + ',' + this.position.log
          delete this.group.productcount
          service('saveGoodGroup', this.group, rs => {
            utils.toast('保存成功')
            plus.webview.currentWebview().close('pop-out', 300)
          })
        })
	    }
    }
	}
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .group-page{
    @include box-vert-left-top;
	  background: $normalBgColor;

	  .group-case{
		  @include box-vert-left-top;
      margin-top: 10px;

		  .form-case{
			  @include box-vert-left-top;
			  background: #fff;
			  height: auto;
			  margin-top: 50px;

			  .row-case{
				  @include box-hori-left-middle;
				  height: 50px;
				  padding: 0 15px;
				  border-bottom: solid 1px $normalBgColor;

				  &.row-area-case{
					  @include box-hori-left-top;
					  height: 160px;
					  padding: 15px;
				  }

				  label{
					  width: 80px;
					  height: auto;
					  text-align: right;
					  color: $textColor
				  }

				  input{
					  height: 20px;
					  background: transparent;
					  padding: 0 10px;
				  }

				  &:last-child{
					  border: none;
				  }
			  }
		  }
	  }
  }

	footer{
		@include box-hori-center-middle;
		padding: 0 10px;
		height: 60px;
		background: #fff;

		.blue-btn{
			@include box-hori-center-middle;
			width: 100%;
		}
	}
</style>
