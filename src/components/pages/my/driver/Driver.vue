<template>
  <normal-layout class="car-detail-page" :loaded="loaded">
    <error-pop :msg="errMsg" />
    <normal-header :title="driver.verouteid ? '修改车辆信息' : '添加车辆信息'" menuText="保存" @menuHandler="save" />
    <scroller class="car-detail-case">
      <div class="ul">
        <ul class="border-radius-case">
          <li class="row">
            <label>司机姓名：</label>
            <input type="text" class="ipt auto-fill" placeholder="请输入司机姓名" v-model="driver.drivername" />
            <span class="iconfont icon-close2 closer" v-show="driver.drivername" @tap.stop="cancels(1)"></span>
          </li>
          <li class="row">
            <label>司机号码：</label>
            <input type="tel" class="ipt auto-fill" placeholder="请输入司机联系号码" v-model="driver.drivertel" />
            <span class="iconfont icon-close2 closer" v-show="driver.drivertel" @tap.stop="cancels(2)"></span>
          </li>
          <li class="row">
            <label>经营范围：</label>
            <input type="text" class="ipt auto-fill" placeholder="请输入经营范围" v-model="driver.biz" />
            <span class="iconfont icon-close2 closer" v-show="driver.biz" @tap.stop="cancels(3)"></span>
          </li>
          <li class="row" @tap="openCode">
            <label>车辆类型：</label>
            <input type="text" class="ipt auto-fill" readonly="readonly" v-model="driver.trucktypestr" />
            <span class="iconfont icon-right-arr closer"></span>
          </li>
        </ul>

        <ul class="border-radius-case">
          <li class="row" style="margin-top:10px; height:40px;">
            <h4>车牌录入</h4>
            <span class="remove iconfont icon-delete" @tap="clears">&nbsp;清空</span>
          </li>
          <li class="block-case">
            <span class="block-item-case" @tap="choseProv">{{str1}}<i class="iconfont icon-down-arr"></i></span>
            <span class="block-item-case" @tap="choseCar">{{str2}}<i class="iconfont icon-down-arr"></i></span>
            <span class="block-item-case">{{tempArr[0]}}</span>
            <span class="block-item-case">{{tempArr[1]}}</span>
            <span class="block-item-case">{{tempArr[2]}}</span>
            <span class="block-item-case">{{tempArr[3]}}</span>
            <span class="block-item-case">{{tempArr[4]}}</span>
          </li>
          <li class="keyborad-case">
            <div class="keyborad-inner-case">
              <span v-for="key in nums" class="key-item" @tap="setKey(key)">{{key}}</span>
              <div class="del-btn iconfont icon-huishan" @tap="delKey"></div>
            </div>
          </li>
        </ul>

        <li class="row2" style="margin-top:10px;">
          <h4>司机备注：</h4>
          <textarea v-model="driver.remark"></textarea>
        </li>
      </div>
    </scroller>
    <province-picker :open="openPicker" :code="code" :openType="flag" :resource="resource" @choseHandler="handler" />
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
	import utils from '@/plugins/utils'
  import service from '@/api/service'
  import imageLoader from '@/components/comm/ImageLoader'
	import normalLayout from '@/components/layout/Layout'
	import scroller from '@/components/comm/Scroller'
  import provincePicker from '@/components/comm/ProvincePicker'
	import normalHeader from '@/components/comm/NormalHeader'
  import errorPop from '@/components/comm/ErrorPop'

	export default {
    created(){
			mui.plusReady(() => {
				utils.masker()
				plus.webview.show('driver', 'pop-in', 300)
			})
  
      window.addEventListener('setCode', (params) => {
        this.setCode(params.detail)
      })
    },

		data(){
			return {
        loaded: true,
        nums: ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'],
        resource: [],
        driver: {},
				openPicker: false,
        code: '',
        flag: 'prov',
        str1: '京',
        str2: 'A',
        tempArr: ['','','','',''],
        list1: [
          {name:'京', id:'1'},
          {name:'津', id:'2'},
          {name:'沪', id:'3'},
          {name:'渝', id:'4'},
          {name:'冀', id:'5'},
          {name:'豫', id:'6'},
          {name:'云', id:'7'},
          {name:'辽', id:'8'},
          {name:'黑', id:'9'},
          {name:'湘', id:'10'},
          {name:'皖', id:'11'},
          {name:'鲁', id:'12'},
          {name:'新', id:'13'},
          {name:'苏', id:'14'},
          {name:'浙', id:'15'},
          {name:'赣', id:'16'},
          {name:'鄂', id:'17'},
          {name:'桂', id:'18'},
          {name:'甘', id:'19'},
          {name:'晋', id:'20'},
          {name:'蒙', id:'21'},
          {name:'陕', id:'22'},
          {name:'吉', id:'23'},
          {name:'闽', id:'24'},
          {name:'贵', id:'25'},
          {name:'粤', id:'26'},
          {name:'青', id:'27'},
          {name:'藏', id:'28'},
          {name:'川', id:'29'},
          {name:'宁', id:'30'},
          {name:'琼', id:'31'},
          {name:'临', id:'32'}
        ],
        list2: [
          {name:'A', id:'1'},
          {name:'B', id:'2'},
          {name:'C', id:'3'},
          {name:'D', id:'4'},
          {name:'E', id:'5'},
          {name:'F', id:'6'},
          {name:'G', id:'7'},
          {name:'H', id:'8'},
          {name:'I', id:'9'},
          {name:'J', id:'10'},
          {name:'K', id:'11'},
          {name:'L', id:'12'},
          {name:'M', id:'13'},
          {name:'N', id:'14'},
          {name:'O', id:'15'},
          {name:'P', id:'16'},
          {name:'Q', id:'17'},
          {name:'R', id:'18'},
          {name:'S', id:'19'},
          {name:'T', id:'20'},
          {name:'U', id:'21'},
          {name:'V', id:'22'},
          {name:'W', id:'23'},
          {name:'X', id:'24'},
          {name:'Y', id:'25'},
          {name:'Z', id:'26'}
        ],
        errMsg: ''
			}
		},

    mounted(){
			mui.plusReady(() => {
				this.driver = plus.webview.getWebviewById('driver').driver
				this.str1 = this.setProvince()
				this.str2 = this.setLetter()
				this.tempArr = this.setOthers()
			})
    },

		components: {
      imageLoader,
			normalHeader,
			normalLayout,
			scroller,
			provincePicker,
      errorPop
		},
  
		methods: {
      setProvince(){
        let no = plus.webview.getWebviewById('driver').driver.plateno
        if(no){
          return no.substring(0, 1)
        }else{
          return '京'
        }
      },
      
      clears(){
        this.str1 = ''
        this.str2 = ''
        this.tempArr = ['','','','','']
      },

			handler(item){
				if(item){
					if(this.flag == 'prov'){
						this.str1 = item.name
					}else{
						this.str2 = item.name
					}
					this.code = item.id
				}
				this.openPicker = false
			},
      
      setCode(params){
        this.driver.trucktypestr = params.code.value
        this.driver.trucktype = params.code.code
      },
      
      openCode(){
        plus.webview.create(config.CDN_ADDRESS + '/codes', 'codes', {}, {
          code: '024',
          title: '车辆类型',
          openerId: 'driver',
          value: this.driver.trucktype
        })
      },

			choseProv(){
        this.code = ''
				this.flag = 'prov'
				this.resource = this.provinces
				this.openPicker = true
        this.list1.forEach(item => {
          if(item.name == this.str1){
            this.code = item.id
          }
        })
			},
      
      setLetter(){
        let no = plus.webview.getWebviewById('driver').driver.plateno
        if(no){
          return no.substring(1, 2)
        }else{
          return 'A'
        }
      },
      
      cancels(flag){
        if(flag == 1){
          this.driver.drivername = ''
        }else if(flag == 2){
          this.driver.drivertel = ''
        }else if(flag == 3){
          this.driver.biz = ''
        }
      },
      
      setOthers(){
        let arr = ['','','','',''], no = plus.webview.getWebviewById('driver').driver.plateno
        if(no){
          return no.substring(2).split('')
        }
        return arr
      },
      
			setKey(key){
				for(let i=0; i<this.tempArr.length; i++){
					if(this.tempArr[i] == ''){
						this.tempArr.splice(i, 1, key)
            break ;
          }
        }
      },

			choseCar(){
        this.code = ''
				this.flag = 'car'
				this.resource = this.cars
				this.openPicker = true
        this.list2.forEach(item => {
          if(item.name == this.str2){
            this.code = item.id
          }
        })
			},

			delKey(){
				for(let i=this.tempArr.length - 1; i>=0; i--){
					if(this.tempArr[i] != ''){
						this.tempArr.splice(i, 1, '')
						break ;
					}
				}
      },

		  save(){
				let user = utils.getLocalUser()
        if(!this.driver.drivername){
          utils.setError.call(this, 'errMsg', '请填写司机姓名')
          return ;
        }
        if(!this.driver.drivertel){
          utils.setError.call(this, 'errMsg', '请填写司机号码')
          return ;
        }
        if(!this.driver.biz){
          utils.setError.call(this, 'errMsg', '请填写经营范围')
          return ;
        }
        if(!(this.str1 && this.str2 && this.tempArr.join('') && (this.tempArr.length == 5))){
          utils.setError.call(this, 'errMsg', '请填写车牌信息')
          return ;
        }
				service('saveCar', {
					userid: user.userid,
					items:[{
						uuid: this.driver.uuid,
						drivername: this.driver.drivername,
						drivertel: this.driver.drivertel,
						plateno: this.str1 + this.str2 + this.tempArr.join(''),
            trucktype: this.driver.trucktype,
            remark: this.driver.remark,
            biz: this.driver.biz
					}]
        }, rs => {
				  utils.toast('操作成功')
          setTimeout(() => {
            let win = plus.webview.getWebviewById('drivers')
            mui.fire(win, 'refresh')
            plus.webview.currentWebview().close('pop-out', 300)
          }, 1500)
        })
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
  @import '@/assets/style/main.scss';

  .car-detail-page{
    @include box-vert-left-top;
    width: 100%;
    height: 100%;
    position: relative;
    background: #f7f7f7;

    .car-detail-case{
      @include box-vert-left-top;
      margin-top: 60px;
      position: relative;

      .ul{
        @include box-vert-left-top;
        height: auto;
        padding: 0 10px;

        .border-radius-case{
          @include box-vert-left-top;
          border-radius: 9px;
          overflow: hidden;
          height: auto;
          background: #fff;
          margin-bottom: 10px;
          padding: 0 10px;
        }

        .row{
          @include box-hori-left-middle;
          height: 50px;
          background: #fff;
          //margin-bottom: 1px;
          padding-right: 10px;
          position: relative;
          border-bottom: solid 1px rgba(0, 0, 0, .05);
  
          .closer{
            @include box-hori-right-middle;
            line-height: 50px;
            font-size: 18px;
            width: 50px;
            color: #dedede;
            overflow: hidden;
            height: 50px;
            position: absolute;
            right: 8px;
            padding-right: 8px;
            top: 0px;
          }

          label{
            @include box-hori-right-middle;
            width: 85px;
            color: #666;
            margin-right: 5px;
            height: 20px;
          }

          h4{
            @include box-hori-left-middle;
            font-size: 18px;
            width: 100%;
            color: #666;
            font-weight: bold;
            padding-left: 15px;
          }
          
          .remove{
            width: auto;
            height: auto;
            padding: 0 10px;
            position: absolute;
            right: 10px;
            top: 10px;
            font-size: 14px;
            color: #008de1;
            
            &:active{
              color: #f85959;
            }
          }

          .ipt{
            @include box-hori-left-middle;
            height: 40px;
            font-size: 16px;
            border: none;
            margin: 0;
            padding: 0 5px;
            color: #333;
          }

          .icon-right-arr{
            @include box-vert-center-middle;
            color: #ccc;
            height: 100%;
            width: 24px;
            font-size: 24px;
          }

          .selector{
            color: #74baf3;
            font-size: 14px;
            width: auto;
          }
        }
        
        .row2{
          @include box-vert-left-top;
          height: 170px;
          //padding: 10px 15px;
          
          h4{
            @include box-hori-left-middle;
            font-size: 14px;
            width: 100%;
            color: #666;
            padding-left: 10px;
            height: auto;
          }
          
          textarea{
            height: 80px;
            width: 100%;
            background: #e1e1e1;
            border-radius: 9px;
            border: none;
            font-size: 12px;
            margin-top: 5px;
            padding: 8px 10px;
          }
        }

        .block-case{
          @include box-hori-center-middle;
          height: auto;
          padding: 10px 0;
          background: #fff;

          .block-item-case{
            line-height: 50px;
            font-size: 24px;
            text-align: center;
            width: 11%;
            font-weight: bold;
            height: 60px;
            margin: 0 1.5%;
            border-radius: 4px;
            border: dashed 1px #999;
            position: relative;

            .icon-down-arr{
              text-align: center;
              position: absolute;
              bottom: 6px;
              height: 10px;
              font-size: 21px;
              padding: 0;
              line-height: 10px;
              width: 20px;
              left: 50%;
              margin-left: -10px;
              color: #666;
            }
          }
        }

        .keyborad-case{
          @include box-hori-center-top;
          padding: 20px 0 10px 0;
          text-align: center;
          
          .keyborad-inner-case{
            width: auto;
            height: auto;
            display: inline-block;
          }

          .key-item{
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 32px;
            background: #f0f0f0;
            line-height: 32px;
            font-size: 19px;
            color: #999;
            display: inline-block;
            margin: 0 5px 10px 5px;
            font-weight: 300;

            &:active{
              border-radius: 3px;
              background: #999;
              color: #fff;
            }
          }

          .del-btn{
            position: relative;
            line-height: 32px;
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 32px;
            padding-left: 15px;
            overflow: hidden;
  
            &.icon-huishan{
              position: absolute;
              margin: 0 0 0 20px;
              padding: 0;
              color: #f85959;
              font-size: 32px;
            }
          }
        }
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
