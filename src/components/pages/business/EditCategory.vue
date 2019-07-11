<template>
  <normal-layout class="edit-category-page" :loaded="loaded" @backHandler="backHandler">
    <error-pop :msg="errMsg" />
    <normal-header :title="title" :hide="true" />
    <div class="edit-case auto-fill">
      <div class="category-info-case">
        <label>{{category.ctname}}</label>
        <div class="spec-case auto-fill">
          <h3>规格</h3>
          <span class="spec-item-case" v-for="spec in category.specs">
            {{spec.name}}： {{(spec.min != null && spec.max != null) ? ('最小' + spec.min + spec.unitstr + '，' + '最大' + spec.max + spec.unitstr) : (spec.min != null ? '最小' + spec.min + spec.unitstr : '最大' + spec.max + spec.unitstr)}}
          </span>
          <span class="no-spec" v-if="category.specs.length == 0">该品类未设置规格</span>
        </div>
      </div>
      
      <div class="info-case" v-if="openerId == 'business'">
        <div class="amount-case">需求数：{{category.amount | toInt}} 株</div>
        <div class="amount-case">已接单人数：{{category.taked > 0 ? category.taked + ' 人' : '尚无人接单'}}</div>
        <div class="taked-case">
          <span class="taked-btn">去接单</span>
        </div>
      </div>

      <!--未确认报价信息的品类, 可以编辑-->
      <ul class="price-case" v-if="(!category.confirm.confirmid) && (openerId != 'business') && orderStatus == 0">
        <li class="row">
          <input-text placeholder="请输入单价" iptId="firstIpt" :must="true" @changeHandler="cal" v-model="category.edit.price">单价(元)：</input-text>
        </li>
        <li class="row">
          <input-text placeholder="请输入数量" @changeHandler="cal" :must="true" v-model="category.edit.amount">数量(株)：</input-text>
        </li>
        <li class="row">
          <input-text placeholder="请输入总价" :must="true" v-model="category.edit.total">总价(元)：</input-text>
        </li>
      </ul>

      <!--已经确认报价信息的品类, 只能查看不允许编辑-->
      <ul class="price-case" v-if="(category.confirm.confirmid && (openerId != 'business')) || orderStatus == 2">
        <li class="row">
          <label>品类单价(元)：</label>
          <input type="text" v-model="category.edit.price" class="auto-fill" readonly="readonly" />
          
          
        </li>
        <li class="row">
          <label>提供数量(株)：</label>
          <input type="text" v-model="category.edit.amount" class="auto-fill" readonly="readonly" />
        </li>
        <li class="row">
          <label>品类总价(元)：</label>
          <input type="text" v-model="category.edit.total" class="auto-fill" readonly="readonly" />
        </li>
        <li class="row" v-if="category.confirm.remark">
          <label>对方修改理由：</label>
          <span class="simple-reason auto-fill">{{category.confirm.remark}}</span>
        </li>
        <li class="row-edit" v-if="category.confirm.remark && category.confirm.st == '1'">
          <span>请填写您的理由：</span>
          <input-area class="reason-case" maxLength="30" v-model="remark"></input-area>
        </li>
        
        <li class="reason-case" v-if="category.confirm.st == '2'">
          <h4>您已拒绝该品类报价</h4>
          <div class="giveup-case">
            <strong>原因：</strong>{{category.confirm.respremark}}
          </div>
        </li>
      </ul>
    </div>
    <footer v-if="category.confirm.confirmid && category.confirm.st == '0' && (openerId != 'business')">
      <span class="giveup-btn" @tap="showReasonDialog('02')">放弃</span>
      <span class="confirm-btn" @tap="agree" :class="'confirm-btn-' + showArea">确认</span>
    </footer>
  
    <footer v-if="(!category.confirm.confirmid) && (openerId != 'business') && orderStatus == 0">
      <span class="giveup-btn" @tap.stop="showReasonDialog('01')">放弃报价</span>
      <confirm-button class="confirm-btn" @handler="saveHandler" :class="'confirm-btn-' + showArea">提交报价信息</confirm-button>
    </footer>
  
    <masker-dialog :show="isOpen" size="280" @closeHandler="closeMasker">
      <div class="giveup-reason-case">
        <header>填写放弃原因<span class="iconfont icon-close" @tap="closeMasker"></span></header>
        <div class="reason-case-inner auto-fill">
          <label>放弃报价必须填写原因</label>
          <input-area class="reason-text" maxLength="30" v-model="remark"></input-area>
        </div>
        <footer>
          <span class="reason-btn" @tap.stop="giveup('01')">确定放弃</span>
        </footer>
      </div>
    </masker-dialog>
  </normal-layout>
</template>

<script>
	import config from '../../../../config/address.js'
  import {price, toInt} from '@/plugins/filter/custom.js'
	import imageLoader from '@/components/comm/ImageLoader'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import OrderBo from '@/model/bo/Order'
  import CategoryBo from '@/model/bo/Category'
  import scroller from '@/components/comm/Scroller'
	import normalLayout from '@/components/layout/Layout'
  import normalHeader from '@/components/comm/NormalHeader'
	import confirmButton from '@/components/comm/ConfirmButton'
  import inputArea from '@/components/comm/InputArea'
  import errorPop from '@/components/comm/ErrorPop'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  import inputText from '@/components/comm/Input'

	export default {
		created(){
			window.addEventListener('init', (e) => {
			  this.init(e)
			})
    
    },

	  components: {
      scroller,
      imageLoader,
			normalLayout,
      normalHeader,
			confirmButton,
			inputArea,
      errorPop,
      maskerDialog,
      inputText
    },
    
		data(){
			return {
				category: {
          specs: [],
          edit: {},
					confirm: {}
        },
        title: '',
        readonly: false,
        openerId: '',
        confirm: true,
				loaded: false,
        remark: '',
        showArea: false,
        errMsg: '',
        isOpen: false,
        openFlag: '',
        orderStatus: ''
			}
		},
    
    mounted(){
		  this.loaded = true
    },

		methods: {
		  init(e){
		    this.readonly = e.detail.readonly
        this.category = e.detail.category
        this.openerId = e.detail.openerId
        this.orderid = e.detail.orderid
        this.takid = e.detail.takid
        this.takitemid = e.detail.takitemid
        this.st = e.detail.st //这个是 category.confirm 里的st
        this.orderStatus = e.detail.orderStatus //这个是 st （0=未提交、1=已提交）
        this.category.edit.price = price(this.category.edit.price) == 0 ? '' : price(this.category.edit.price)
        this.category.edit.total = price(this.category.edit.total) == 0 ? '' : price(this.category.edit.total)
        this.category.edit.amount = toInt(this.category.edit.amount)
        this.showArea = false
        this.remark = ''
        if(!this.category.confirm){
          this.category.confirm = {}
        }
        if(this.openerId == 'business'){
          this.title = '报价单品类需求详情'
        }else{
        	if(this.st == '0'){
        		this.title = '确认我的报价信息'
          }else{
						this.title = '填写报价信息'
          }
        }
        plus.webview.getWebviewById('businessEditCategory').show('pop-in', 300)
        setTimeout(() => {
          this.loaded = true
          //utils.openSoftKeyborad('firstIpt')
        }, 300)
      },
      
      closeMasker(){
		    this.isOpen = false
      },
      
      showReasonDialog(openFlag){
        this.isOpen = true
        this.openFlag = openFlag
      },
      
      backHandler(){
		    this.loaded = false
      },
      
			cancel(type){
				if(type == 1){
					this.category.edit.price = ''
				}else if(type == 2){
					this.category.edit.amount = ''
				}else if(type == 3){
					this.category.edit.total = ''
				}
      },
      
      cal(){
			  let _price = this.category.edit.price, amount = this.category.edit.amount
        if(_price && amount && (!isNaN(_price)) && (!isNaN(amount))){
			    this.category.edit.total = price(_price * amount)
        }
      },
      
      open(){
        utils.openSoftKeyborad()
      },

			saveHandler(){
        if(this.showArea){
          return ;
        }
        if(!(utils.ruleNumber(this.category.edit.price))){
          utils.toast('单价请输入大于0的数值', 3000, 'FAILED')
          return ;
        }
        if(!(utils.ruleNumber(this.category.edit.amount))){
          utils.toast('数量请输入大于0的数值', 3000, 'FAILED')
          return ;
        }
        if(!(utils.ruleNumber(this.category.edit.total))){
          utils.toast('总价请输入大于0的数值', 3000, 'FAILED')
          return ;
        }
        let currWin = plus.webview.currentWebview()
        mui.fire(plus.webview.getWebviewById(this.openerId), 'setCategory', {
          category: this.category
        })
        currWin.hide('pop-out', 300)
      },

			giveup(){
			  if(!utils.ruleMust(this.remark)){
			    utils.toast('必须填写放弃理由', 3000, 'FAILED')
          return ;
        }
        let currWin = plus.webview.currentWebview()
        if(this.openFlag == '01'){
          //放弃报价操作
          service('giveupOffer', {
            userid: utils.getLocalUser().userid,
            orderid: this.orderid,
            items: [{
              allotid: this.category.allotid,
              remark: this.remark
            }]
          }, rs => {
            utils.toast('操作成功')
            mui.fire(plus.webview.getWebviewById(this.openerId), 'giveupCallback', {
              category: this.category,
              reason: this.remark,
              flag: this.openFlag
            })
            currWin.hide('pop-out', 300)
            this.closeMasker()
          })
        }else{
          service('offerAgreeOrNagtive', {
            orderid: this.orderid,
            takid: this.takid,
            items: [{
              takitemid: this.takitemid,
              st: this.st,
              resp: '0',
              reason: this.remark
            }]
          }, rs => {
            utils.toast('操作成功')
            mui.fire(plus.webview.getWebviewById(this.openerId), 'giveupCallback', {
              category: this.category,
              reason: this.remark,
              flag: this.openFlag
            })
            currWin.hide('pop-out', 300)
            this.closeMasker()
          })
        }
      },
      
      agree(){
      	utils.confirm('确认该品类达成合作意向', () => {
					service('offerAgreeOrNagtive', {
						orderid: this.orderid,
						takid: this.takid,
						items: [{
							takitemid: this.takitemid,
							st: this.st,
							resp: '1',
							reason: ''
						}]
					}, rs => {
						utils.toast('操作成功')
						mui.fire(plus.webview.getWebviewById(this.openerId), 'agreeCallback', {
							category: this.category
						})
						currWin.hide('pop-out', 300)
					})
        }, '再考虑下')
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
	@import '@/assets/style/main.scss';
  
  .edit-category-page{
    @include box-vert-left-top;
    background: $normalBgColor;
    height: 100%;
    width: 100%;
    position: relative;

    .edit-case{
      @include box-vert-center-top;
      padding-top: 50px;
      background: #fff;

      .category-info-case{
        @include box-hori-left-middle;
        width: 100%;
        padding: 10px;
        height: auto;
        background: #fff;

        label{
          text-align: center;
          height: auto;
          width: 120px;
          font-size: 18px;
          font-weight: bold;
          color: #666;
        }

        .spec-case{
          @include box-vert-left-middle;
          height: auto;
          border-left: solid 1px #f1f1f1;
          padding-left: 10px;

          h3{
            font-size: 16px;
            color: #008de1;
            font-weight: bold;
          }

          .spec-item-case{
            color: #74baf3;
            font-size: 12px;
          }
          
          .no-spec{
            padding: 10px 0;
            color: #999;
          }
        }
      }

      .price-case{
        @include box-vert-left-top;
        margin-top: 10px;
        background: #fff;
        height: auto;
        padding-right: 10px;
        
        .row-edit{
          @include box-vert-left-top;
          height: auto;
          width: 100%;
          //border-bottom: solid 1px #f5f5f5;
          padding: 15px 15px;
          position: relative;

          span{
            font-size: 12px;
            width: 110px;
            color: #666;
            margin-bottom: 6px;
          }

          .reason-case{
            height: 100px;
            padding: 0;
            
            &::-webkit-input-placeholder{
              color: #999;
            }
          }
        }

        .row{
          @include box-hori-left-middle;
          height: 50px;
          width: 100%;
          border-bottom: solid 1px #f5f5f5;
          padding-left: 15px;

          &:last-child{
            border-bottom: none;
          }

          label{
            text-align: right;
            height: auto;
            width: 90px;
            color: #888;
            font-size: 12px;
          }
          
          .simple-reason{
            padding-left: 10px;
          }

          input{
            @include box-hori-left-middle;
            margin: 0;
            height: 30px;
            border: none;
            outline: none;
            padding: 0 10px;
            color: #333;
            font-size: 18px;
  
            &::-webkit-input-placeholder{
              color: #ccc;
              font-size: 14px;
              transform: translateY(-1px);
            }
          }

          .oper-case{
            @include box-vert-center-middle;
            width: 50px;
            height: 50px;

            .icon-close2{
              width: 18px;
              height: 18px;
              border-radius: 18px;
              font-size: 18px;
              color: #dedede;
              font-weight: bold;
              line-height: 20px;
              margin-right: 5px;
            }
          }
        }
        
        .reason-case{
          @include box-vert-center-top;
          background: #f5f5f5;
          padding: 25px;
          margin-top: 50px;
          
          h4{
            @include box-hori-center-top;
            width: 100%;
            color: #f85959;
            font-weight: bold;
          }
          
          .giveup-case{
            @include box-hori-center-top;
            margin-top: 15px;
            color: #999;
            font-size: 12px;
            
            strong{
              width: auto;
            }
          }
        }
      }
      
      .info-case{
        @include box-vert-left-top;
        height: auto;
  
        .amount-case{
          height: auto;
          margin-top: 1px;
          padding: 10px 16px;
          background: #fff;
          color: $textColor;
        }
  
        .taked-case{
          @include box-vert-center-middle;
          height: auto;
          padding-top: 50px;
    
          .taked-btn{
            @include box-hori-center-middle;
            background: #008de1;
            width: 50%;
            color: #fff;
            font-size: 16px;
            border-radius: 3px;
            height: 40px;
            margin-top: 20px;
          }
        }
      }
    }

    footer{
      @include box-vert-left-bottom;
      width: 100%;
      padding: 10px 15px;
      font-size: 16px;
      height: 110px;
      background: #fff;
      
      
      .get-service{
        font-size: 12px;
        position: absolute;
        top: 0;
        line-height: 14px;
        right: 25px;
        color: #008de1;
        border-bottom: solid .5px #008de1;
        width: auto;
        padding-bottom: 0;
      }
  
      .remark-service{
        font-size: 12px;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 14px;
        color: #008de1;
        width: 100%;
        height: auto;
        padding: 0 15px;
      }

      .giveup-btn{
        @include box-hori-center-middle;
        height: 42px;
        font-weight: bold;
        background: transparent;
        border: solid .5px #f85959;
        color: #f85959;
        margin-bottom: 10px;
        border-radius: 3px;

        &:active{
          //background: #f85959;
          color: #fff;
        }
      }

      .confirm-btn{
        @include box-hori-center-middle;
        height: 42px;
        background: #008de1;
        color: #fff;
        font-weight: bold;
        border-radius: 3px;

        &:active{
          opacity: .8;
        }
  
        &.confirm-btn-true{
          background: #dedede;
          color: #999;
        }
        &.confirm-btn-false{
          background: #008de1;
          color: #fff;
        }
      }
    }
  }

  .giveup-reason-case{
    @include box-vert-left-top;
    border-radius: 7px 7px 0 0;
    overflow: hidden;
    background: #fff;
    height: 100%;
    
    header{
      @include box-hori-center-middle;
      height: 50px;
      background: #fff;
      color: $textColor;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      border-bottom: solid 1px $normalBgColor;
      
      .icon-close{
        @include box-vert-center-middle;
        width: 32px;
        height: 50px;
        position: absolute;
        right: 0;
        top: 0;
        color: $textLessColor;
        font-size: 24px;
      }
    }
    
    .reason-case-inner{
      @include box-vert-left-top;
      padding: 15px 10px;
      
      label{
        @include box-vert-left-top;
        color: $textColor;
        height: 30px;
        padding: 0 5px;
      }
      
      .reason-text{
        width: 100%;
        height: 100px;
        background: #fff;
      }
    }
    
    footer{
      @include box-vert-center-top;
      height: 55px;
      padding: 0 10px;
      background: transparent;
      
      .reason-btn{
        @include box-hori-center-middle;
        height: 42px;
        width: 100%;
        border-radius: 5px;
        background: $red;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        
        &:active{
          opacity: .8;
        }
      }
    }
  }
</style>
