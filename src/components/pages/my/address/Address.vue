<template>
  <normal-layout class="address-detail-page" :loaded="loaded">
    <error-pop :msg="errMsg" />
    <normal-header title="地址编辑" :simple="true" />
    <div class="remark-tip">
      <span class="iconfont icon-lighter2"></span>
      请仔细填写每一项，避免送货时候遇到不必要的麻烦
    </div>
    <scroller class="addr-detail-case">
      <div class="ul">
        <ul class="border-radius-case">
          <li class="row">
            <input-text :must="true" placeholder="请输入收货人姓名" v-model="addr.gainer">收货人：</input-text>
          </li>
          <li class="row">
            <input-text :must="true" type="tel" placeholder="请输入收货人联系号码" v-model="addr.gainertel">联系号码：</input-text>
          </li>
        </ul>
  
        <ul class="border-radius-case">
          <li class="row">
            <label class="label-text">所在省：</label>
            <span class="content-text auto-fill">{{addr.prov}}</span>
            <span class="selector" @tap="choseProvince">请选择</span>
            <span class="iconfont icon-right-arr"></span>
          </li>
          <li class="row">
            <label class="label-text">所在市：</label>
            <span class="content-text auto-fill">{{addr.city}}</span>
            <span class="selector" @tap="choseCity">请选择</span>
            <span class="iconfont icon-right-arr"></span>
          </li>
          <li class="row">
            <input-text :must="true" placeholder="请输入收货详细地址" v-model="addr.addr">详细地址：</input-text>
          </li>
        </ul>
        <span class="comm-btn comm-blue-btn save-btn" @tap="save">保存地址</span>
      </div>
    </scroller>
    <province-picker :open="openPicker" :code="code" :provinceId="addr.provid" :openType="flag" @choseHandler="handler" />
  </normal-layout>
</template>

<script>
	import utils from '@/plugins/utils'
  import service from '@/api/service'
  import imageLoader from '@/components/comm/ImageLoader'
	import normalHeader from '@/components/comm/NormalHeader'
	import normalLayout from '@/components/layout/Layout'
	import scroller from '@/components/comm/Scroller'
  import provincePicker from '@/components/comm/ProvincePicker'
  import errorPop from '@/components/comm/ErrorPop'
  import inputText from '@/components/comm/Input'

	export default {
    created(){
			mui.plusReady(() => {
				let addr = plus.webview.currentWebview().addr
				addr && (this.addr = addr)
				utils.masker()
				plus.webview.show('address', 'pop-in', 300)
			})
    },

		data(){
			return {
        loaded: true,
        provinces: [],
        resource: [],
        addr: {addrid: ''},
				openPicker: false,
        flag: 'province',
        code: '',
				errMsg: ''
			}
		},

		components: {
      imageLoader,
			normalHeader,
			normalLayout,
			scroller,
			provincePicker,
			errorPop,
      inputText
		},

		mounted(){
			mui.plusReady(() => {
				this.initProvinces()
			})
		},

		methods: {
      cancels(flag){
        if(flag == 1){
          this.addr.gainer = ''
        }else if(flag == 2){
          this.addr.gainertel = ''
        }else if(flag == 3){
          this.addr.addr = ''
        }
      },
      
			handler(item){
				if(item){
				  this.code = item.id
					if(this.flag == 'province'){
						Object.assign(this.addr, {
              prov: item.name,
							provid: item.id
						})
            this.addr.city = ''
            this.addr.cityid = ''
					}else{
						Object.assign(this.addr, {
							city: item.name,
							cityid: item.id
						})
					}
        }
        this.resource = []
        this.openPicker = false
      },

			initProvinces(){
			  let strs = utils.getLocalItem('LOCAL_PROVINCES')
        if(strs){
			    let arr = JSON.parse(strs)
          this.provinces = arr
          this.resource = arr
        }else{
          service('getProvincesOrCitys', {
            type: 0,
            provid: 0,
            cityid: 0
          }, rs => {
            utils.setLocalItem('LOCAL_PROVINCES', JSON.stringify(rs))
            this.provinces = rs
            this.resource = rs
          })
        }
      },

      getCitys(id, callback){
				service('getProvincesOrCitys', {
					type: 1,
					provid: id,
					cityid: 0
				}, rs => {
					this.resource = rs
          callback && callback()
				})
      },

			choseCity(){
      	if(this.addr.provid == ''){
      		utils.toast('请先选择省', 2000, 'FAILED')
        }else{
					this.flag = 'city'
          this.code = this.addr.cityid
					this.openPicker = true
        }
      },

			choseProvince(){
				this.flag = 'province'
        this.code = this.addr.provid
				this.openPicker = true
      },

      save(){
				let user = utils.getLocalUser()
        if(!(utils.ruleMust(this.addr.gainer))){
          utils.toast('请填写收货人姓名', 2000, 'FAILED')
          return ;
        }
        if(!(utils.ruleMust(this.addr.gainertel))){
          utils.toast('请填写收货人电话', 2000, 'FAILED')
          return ;
        }
        if(!(utils.ruleMust(this.addr.provid))){
          utils.toast('请选择送货目的地所在省', 2000, 'FAILED')
          return ;
        }
        if(!(utils.ruleMust(this.addr.cityid))){
          utils.toast('请选择送货目的地所在市', 2000, 'FAILED')
          return ;
        }
        if(!(utils.ruleMust(this.addr.addr))){
          utils.toast('请填写详细收货地址', 2000, 'FAILED')
          return ;
        }
				service('saveAddr', {
					userid: user.userid,
					items:[{
						uuid: this.addr.uuid,
						provid: this.addr.provid,
						cityid: this.addr.cityid,
						addr: this.addr.addr,
            gainer: this.addr.gainer,
            gainertel: this.addr.gainertel
					}]
        }, rs => {
          utils.toast('操作成功')
          setTimeout(() => {
            let win = plus.webview.getWebviewById('addresses')
            mui.fire(win, 'refreshAddress')
            plus.webview.currentWebview().close('pop-out', 300)
          }, 1500)
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';

  .address-detail-page{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    position: relative;
    background: #f0f0f0;

    .addr-detail-case{
      @include box-vert-left-top;
      position: relative;

      .ul{
        @include box-vert-left-top;
        height: auto;
        padding: 0 10px;
        
        .save-btn{
          width: 100%;
          margin-top: 50px;
        }
  
        .border-radius-case{
          @include box-vert-left-top;
          border-radius: 11px;
          overflow: hidden;
          height: auto;
          background: #fff;
          margin-bottom: 10px;
        }

        .row{
          @include box-hori-left-middle;
          height: 50px;
          background: #fff;
          border-bottom: solid 1px #f0f0f0;
          position: relative;
          padding: 0 5px;
          
          .label-text{
            text-align: right;
            width: 80px;
            color: $textColor;
          }
          
          .content-text{
            padding: 0 5px;
          }

          .icon-right-arr{
            @include box-vert-center-middle;
            color: #ccc;
            height: 100%;
            width: 24px;
            font-size: 24px;
            padding-top: 2px;
          }

          .selector{
            color: #bbb;
            font-size: 14px;
            width: auto;
          }
          
          &:last-child{
            border-bottom: none;
          }
        }
      }
    }
  
    .remark-tip{
      @include box-hori-left-middle;
      margin-top: 50px;
      height: 40px;
      width: 100%;
      background: rgba(0, 141, 225, .15);
      padding: 8px 12px;
      font-size: 12px;
      color: $blue;
      margin-bottom: 10px;
    
      .icon-lighter2{
        margin-top: -2px;
        font-size: 24px;
        margin-right: 10px;
      }
    }

    footer{
      @include box-hori-center-middle;
      height: 50px;
      background: #008de1;
      color: #fff;
      font-size: 16px;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 20;
    }
  }
</style>
