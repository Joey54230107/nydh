<template>
	<normal-layout class="farm-page" :loaded="loaded">
		<normal-header :title="flag == '0' ? '创建我的农场' : '编辑我的农场'" :simple="true" />
    <div id="mapper">
      123
    </div>
		<div class="farm-case auto-fill">
			<scroller>
				<ul class="boxer">
          <li class="row">
            <input-text placeholder="请输入农场名称" v-model="farm.name">农场名称：</input-text>
          </li>
          <li class="row">
            <input-text placeholder="请输入联系人" v-model="farm.name">联系人：</input-text>
          </li>
          <li class="row">
            <input-text placeholder="请输入联系电话" v-model="farm.name">联系电话：</input-text>
          </li>
          <li class="row">
            <input-text placeholder="请输入联系地址" v-model="farm.name">联系地址：</input-text>
          </li>
          <li class="row">
            <label>农场位置：</label>
            <div class="position auto-fill">
              <div class="iconfont icon-position"><label>重新定位</label></div>
            </div>
          </li>
          <li class="row row-auto">
            <input-area maxLength="50" class="auto-fill" v-model="farm.addr" placeholder="请输入农场描述" />
          </li>
        </ul>
			</scroller>
		</div>
    <footer>
      <span class="create-btn" @tap="save">确定保存</span>
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
  import FarmBo from '@/model/bo/Farm'
  import inputArea from '@/components/comm/InputArea'
  import radio from '@/components/comm/Radio'
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
      radio,
      inputText
		},

		data(){
			return {
        loaded: true,
				status: '',
        farm: {},
        position: {},
        flag: ''
      }
		},
    
    mounted(){
			mui.plusReady(() => {
				plus.webview.currentWebview().flag

				const script = document.createElement("script")
				script.src = "//api.map.baidu.com/api?ak=GOh9FDcf7qjCzHf5aEHoCv47rhtCGxfS&type=lite&v=1.0&callback=initialize"
				document.body.appendChild(script)

				window.initialize = () => {
					var map = new BMap.Map('mapper')
					this.mapper = map
					this.initPosition()
					this.initFarm()
				}
			})
    },
    
    methods: {
      initPosition(long, lati){
        let win = plus.webview.currentWebview()
        let flag = win.flag, farmId = win.farmId
        plus.geolocation.getCurrentPosition(rs => {
          console.log(JSON.stringify(rs))
          //GPS坐标系
          let pos = {
            lati: rs.coords.latitude, //维度
            long: rs.coords.longitude //经度
          }
          let point = new BMap.Point(pos.long, pos.lati)
          this.mapper.centerAndZoom(point, 15)
          this.mapper.addOverlay(new BMap.Marker(point))
          this.position = {
            city: rs.address.city,
            province: rs.address.province
          }
        })
      },
      
      initFarm(){
        let win = plus.webview.currentWebview()
        let flag = win.flag, farmId = win.farmId
        if(flag == '1'){
          service('', {}, rs => {
            this.farm = new FarmBo()
          })
        }else{
          this.farm = new FarmBo()
        }
      },
      
      save(){
        service('saveFarm', this.farm, rs => {
        
        })
      }
    }
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';
  
  .farm-page{
    @include box-vert-left-top;
	  background: $normalBgColor;
    
    #mapper{
      margin-top: 51px;
      height: 160px;
      background: #fff;
    }

	  .farm-case{
		  @include box-vert-left-top;
		  padding: 10px;
      
      .boxer{
        @include box-vert-left-top;
        border-radius: 9px;
        background: #fff;
        height: auto;
        overflow: hidden;
        
        .row{
          @include box-hori-left-middle;
          padding: 0 15px;
          height: 50px;
          border-bottom: solid 1px $normalBgColor;
          color: $textColor;
          
          .position{
            @include box-hori-right-middle;
            height: auto;
            color: $blue;
            font-size: 12px;
            
            .icon-position{
              @include box-hori-left-middle;
              font-size: 14px;
              width: auto;
              font-weight: bold;
              
              label{
                width: auto;
                font-size: 12px;
                padding-left: 2px;
                font-weight: normal;
              }
            }
          }
          
          label{
            width: 80px;
            height: auto;
            text-align: right;
          }
          
          input{
            margin: 15px 0;
            height: 20px;
            padding: 0 6px;
            border: none;
            font-size: 14px;
            color: $textStrongColor;
          }
          
          &.row-auto{
            height: 120px;
            padding: 10px 15px;
          }
        }
      }
	  }
    
    footer{
      @include box-vert-center-middle;
      padding: 0 10px;
      height: 60px;
      background: #fff;
      
      .create-btn{
        @include box-hori-center-middle;
        height: 42px;
        border-radius: 5px;
        background: $blue;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
</style>
