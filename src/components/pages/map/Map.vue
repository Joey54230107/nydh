<template>
  <div class="map-case">
    <header class="header" @tap.stop="back">
      <span class="iconfont icon-let-arr"></span>
      定位并采集商品信息
    </header>
    <div class="map-content auto-fill" id="map"></div>
    <span class="float-icon iconfont icon-plus2" @tap="record"></span>
    <span class="float-icon iconfont icon-refresh2" @tap="refresh"></span>

    <masker-dialog :show="isOpen" size="400" @closeHandler="closeMasker">
      <div class="group-case">
        <header>选择我的商品分组<span class="iconfont icon-close" @tap="closeMasker"></span></header>
        <div class="group-list-case auto-fill">
          <scroller class="auto-fill" :status="status" type="GOODS_GROUP">
            <div class="good-groups-none" slot="no-data">
              <h4>您还没有创建商品分组，拍照采集的商品必须存放在您的商品分组下</h4>
              <span class="create-btn" @tap="createGroup">立即创建分组</span>
            </div>

            <div class="group-item-case" v-for="group in groups" @tap="chose(group)">
              <h2>{{group.title}}</h2>
              <div class="info-case">
                <label>联系人：{{group.linker}}</label>
                <label>联系方式：{{group.linkertel}}</label>
              </div>
              <div class="iconfont icon-right-arr" @tap.stop="detail(group)">
                <label>编辑</label>
              </div>
            </div>
          </scroller>
        </div>
        <footer v-if="groups.length > 0">
          <span @tap="createGroup" class="create-group-btn">创建新的分组</span>
        </footer>
      </div>
    </masker-dialog>
  </div>
</template>

<script>
	import config from '../../../../config/address.js'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import indexHeader from '@/components/comm/header/IndexHeader'
	import utils from '@/plugins/utils'
	import service from '@/api/service'
	import maskerDialog from '@/components/dialog/MaskerDialog'

	export default {
		components: {
      scroller,
      indexHeader,
      normalLayout,
			maskerDialog
		},

		data(){
			return {
        mapper: null,
				isOpen: false,
        status: '',
				groups: []
      }
		},
    
    mounted(){
			const script = document.createElement("script");
			script.src = "//api.map.baidu.com/api?ak=GOh9FDcf7qjCzHf5aEHoCv47rhtCGxfS&type=lite&v=1.0&callback=initialize";
			document.body.appendChild(script)

			window.initialize = () => {
				var map = new BMap.Map('map');
				this.mapper = map

				mui.plusReady(() => {
					this.initPosition()
				})
			}
    },
    
    methods: {
			closeMasker(){
				this.isOpen = false
      },

      initPosition(){
        plus.geolocation.getCurrentPosition(rs => {
          //GPS坐标系
          let pos = {
            lati: rs.coords.latitude, //维度
            long: rs.coords.longitude //经度
          }
          this.mapper.centerAndZoom(new BMap.Point(pos.long, pos.lati), 15)
					this.setPeople(pos, this.mapper)
        })
      },
      
      setPeople(pos, mapper){
      	let user = utils.getLocalUser()
        
        function UserOverlay(){}
        UserOverlay.prototype = new BMap.Overlay()
        UserOverlay.prototype.initialize = function(map){
          let div = this._div = document.createElement("div")
          div.setAttribute('style', 'width:50px;height:50px;border:solid 3px #fff;background:url(' + user.url + ') center center/44px 44px no-repeat #fff;z-index:100000;position:absolute;border-radius:50px;')
          div.innerHTML = '<div style="width:0;height:0;border:solid 8px transparent;border-top-color:#fff;position:absolute;left:14px;top:45px;"></div>'
					map.getPanes().markerPane.appendChild(div);
          return div
        }
        UserOverlay.prototype.draw = function(){
          let pixel = mapper.pointToOverlayPixel(new BMap.Point(pos.long, pos.lati))
          this._div.style.left = pixel.x + "px"
          this._div.style.top  = pixel.y + 18 + "px"
        }
        
				mapper.addOverlay(new UserOverlay())
      },
      
      back(){
        plus.webview.currentWebview().hide('pop-out', 300)
      },

      record(){
      	this.isOpen = true
        this.status = '1'
        service('getMyGoodGroups', {
        	userid: utils.getLocalUser().userid
        }, rs => {
        	this.groups = rs.items || []
          this.status = this.groups.length > 0 ? '2' : '0'
        })
      },

      refresh(){
      	this.initPosition()
      },

      createGroup(){
      	this.closeMasker()
				plus.webview.create(config.CDN_ADDRESS + '/group', 'group', {}, {
					flag: '0',
          openerId: 'map'
        })
      },

      detail(group){
				this.closeMasker()
				plus.webview.create(config.CDN_ADDRESS + '/group', 'group', {}, {
					flag: '1',
					openerId: 'map',
          group
				})
      },

			chose(group){
				plus.webview.create(config.CDN_ADDRESS + '/goods', 'goods', {}, {
					flag: '0',
					openerId: 'map',
					group
				})
      }
    }
	}
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .map-case{
    @include box-vert-left-top;
	  background: #fff;
    width: 100%;
    height: 100%;
    position: relative;
    
    .map-content{
      width: 100%;
      height: 100%;
    }
    
    .header{
      @include box-hori-center-middle;
      height: 50px;
      width: 100%;
      font-size: 18px;
      color: $textColor;
      font-weight: bold;
      padding: 8px;
      background: #fff;
      border-bottom: solid 1px #dedede;
      
      .icon-let-arr{
        @include box-hori-center-middle;
        width: 32px;
        height: 50px;
        position: absolute;
        left: 0;
        top: 0;
        color: $textLessColor;
        font-weight: normal;
        font-size: 24px;
      }
    }
    
    .body-case{
      @include box-vert-left-top;
      position: relative;
      overflow: hidden;
      padding-top: 10px;
      border-top: solid 1px #dedede;
      
      ul{
        @include box-vert-left-top;
        
        li{
          @include box-hori-left-middle;
          height: 50px;
          font-size: 14px;
          padding: 0 10px;
          background: #fff;
          margin-bottom: 1px;
          position: relative;
          
          label{
            width: 70px;
            height: auto;
            color: #666;
          }
          
          &.tip-case{
            height: auto;
            padding: 5px 10px;
            color: #454545;
            font-size: 12px;
            background: transparent;
          }
          
          .detail{
            @include box-vert-center-middle;
            background: #008de1;
            width: auto;
            height: 24px;
            padding: 0 5px;
            color: #fff;
            position: absolute;
            top: 13px;
            border-radius: 3px;
            right: 10px;
          }
          
          .icon-phone{
            @include box-vert-center-middle;
            width: auto;
            height: 24px;
            padding: 0 5px;
            color: #999;
            position: absolute;
            top: 13px;
            border-radius: 3px;
            right: 10px;
            font-size: 21px;
          }
        }
      }
    }

    .float-icon{
      @include box-vert-center-middle;
      width: 36px;
      height: 36px;
      background: rgba(0, 0, 0, .65);
      position: fixed;
      right: 10px;
      border-radius: 50px;
      color: #fff;
      font-size: 18px;
      z-index: 100000000;

      &.icon-plus2{
        bottom: 50px;
        font-size: 16px;
      }

      &.icon-refresh2{
        bottom: 100px;
      }
    }

    .group-case{
      @include box-vert-left-top;
      background: $normalBgColor;
      border-radius: 7px 7px 0 0;
      overflow: hidden;

      header{
        @include box-hori-center-middle;
        height: 50px;
        background: #fff;
        color: $textColor;
        font-weight: bold;
        font-size: 16px;
        position: relative;

        .icon-close{
          @include box-hori-center-middle;
          font-size: 24px;
          color: $textLessColor;
          width: 32px;
          height: 50px;
          position: absolute;
          right: 0;
          top: 0;
        }
      }

      .group-list-case{
        @include box-vert-left-top;
        padding: 10px;

        .good-groups-none{
          @include box-vert-center-top;
          height: auto;
          color: $textColor;
          position: relative;

          h4{
            @include box-hori-center-top;
            text-align: center;
            line-height: 24px;
            width: 60%;
            height: auto;
            margin-top: 20px;
            color: $textColor;
            font-size: 16px;
          }

          .create-btn{
            @include box-hori-center-middle;
            width: 140px;
            padding: 0 25px;
            height: 40px;
            color: #fff;
            background: $blue;
            border-radius: 3px;
            transform: translateY(30px);
            position: absolute;
            left: 50%;
            margin-left: -70px;
            z-index: 1000;
            font-weight: bold;

            &:active{
              opacity: .8;
            }
          }
        }

        .group-item-case{
          @include box-vert-left-top;
          height: auto;
          padding: 10px 15px;
          background: #fff;
          border-radius: 9px;
          position: relative;
          margin-bottom: 10px;

          h2{
            height: auto;
            font-weight: bold;
            font-size: 16px;
            color: $textColor;
          }

          .info-case{
            @include box-hori-left-top;
            height: auto;
            margin-top: 10px;

            label{
              height: 16px;
              font-size: 12px;
              color: $textLessColor;
              margin-right: 10px;
            }
          }

          .icon-right-arr{
            @include box-vert-center-middle;
            width: 24px;
            font-size: 24px;
            color: $textLessColor;
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;

            label{
              @include box-hori-left-middle;
              width: auto;
              position: absolute;
              left: -30px;
              font-size: 14px;
              top: -1px;
              height: 100%;
            }
          }
        }
      }

      footer{
        @include box-vert-center-middle;
        height: 60px;
        padding: 0 10px;
        background: #fff;

        .create-group-btn{
          @include box-hori-center-middle;
          height: 42px;
          border-radius: 5px;
          background: $blue;
          color: #fff;
          font-size: 16px;
          font-weight: bold;

          &:active{
            opacity: .8;
          }
        }
      }
    }
  }
</style>
