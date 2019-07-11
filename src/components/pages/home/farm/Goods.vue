<template>
	<normal-layout class="goods-page" :loaded="loaded">
		<normal-header title="编辑我的商品" :simple="true" menuText="从品类库选" />
		<div class="chose-stand" @tap="select">从标准品类库中挑选（推荐）</div>
		<div class="goods-case auto-fill">
			<scroller class="info-sroller auto-fill" :indicators="false">
				<ul class="form-case">
          <li class="row-case">
            <span class="title">填写商品基础信息</span>
          </li>
					<li class="row-case">
						<label>商品学名：</label>
						<input type="text" class="auto-fill" v-model="goods.scname" />
					</li>
					<li class="row-case">
						<label>商品别名：</label>
						<input type="text" class="auto-fill" v-model="goods.alias" />
					</li>
					<li class="row-case">
						<label>库存数：</label>
						<input type="tel" class="auto-fill" v-model="goods.stock" />
					</li>
          <li class="row-case">
            <label>已销售：</label>
            <input type="tel" class="auto-fill" v-model="goods.saled" />
          </li>
					<li class="row-case row-area-case">
						<input-area maxLength="200" class="auto-fill" placeholder="商品备注、越详细越好哦" v-model="goods.descript" />
					</li>
				</ul>
        <ul class="form-case" style="margin-top: 10px;">
          <li class="row-case">
            <span class="title">填写商品规格信息</span>
          </li>
          <li class="spec-row-case" v-for="(spec, idx) in goods.specs">
            <h3><a>规格{{idx + 1}}：</a>{{spec.name}}</h3>
            <div class="spec-info-case">
              <label v-if="spec.min != ''">最小：{{spec.min}}米、</label>
              <label v-if="spec.max != ''">最大：{{spec.max}}米</label>
            </div>
            <span class="iconfont icon-delete delete-case" @tap.stop="removeSpec(idx)"></span>
          </li>
          <li class="row-case" style="height:auto; padding:10px 0;">
            <span class="add-spec-btn" @tap="addSpec">添加商品规格</span>
          </li>
        </ul>
        <div class="public-case">
          <label>是否公开：</label>
          <radio-input v-model="goods.ispublic" />
        </div>
        <label class="tipper">公开的商品才能在生意圈中被人查询到</label>
        <div class="imgs-case">
          <div class="img-item-case iconfont icon-image" v-for="img in goods.imgs" @tap="takePic"></div>
        </div>
			</scroller>
		</div>
		<footer>
			<span class="blue-btn" @tap="save">确定保存</span>
		</footer>
    
    <masker-dialog :show="isOpen" size="300" @closeHandler="closeMasker">
      <div class="spec-case">
        <header>编辑规格<span class="iconfont icon-close" @tap="closeMasker"></span></header>
        <ul class="spec-edit-case auto-fill">
          <li>
            <label>规格名称：</label>
            <input type="text" class="def-spec-ipt auto-fill" v-model="defaultSpec.name" placeholder="请输入规格名称" />
          </li>
          <li>
            <label>最小限制规格：</label>
            <input type="text" class="def-spec-ipt auto-fill" v-model="defaultSpec.min" placeholder="请输入最小限制" />
          </li>
          <li>
            <label>最大限制规格：</label>
            <input type="text" class="def-spec-ipt auto-fill" v-model="defaultSpec.max" placeholder="请输入最大限制" />
          </li>
        </ul>
        <footer>
          <span @tap="saveSpec" class="create-spec-btn">保存规格</span>
        </footer>
      </div>
    </masker-dialog>
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
	import GoodsBo from '@/model/bo/Goods'
  import radioInput from '@/components/comm/Radio'
  import maskerDialog from '@/components/dialog/MaskerDialog'

	export default {
	  created(){
			mui.plusReady(() => {
				plus.webview.currentWebview().show('pop-in', 300)
			})
    
      window.addEventListener('setCategory', (e) => {
        this.setCategory(e.detail.category)
      })
    },
    
		components: {
      scroller,
			normalHeader,
      normalLayout,
			horiScroller,
      imageLoader,
			inputArea,
      radioInput,
      maskerDialog
		},

		data(){
			return {
        loaded: true,
				status: '1',
				goods: new GoodsBo(),
				position: {
        	lat: '',
					log: ''
				},
				openerId: '',
				searchPage: null,
        isOpen: false,
        defaultSpec: this.createSpec()
      }
		},
    
    mounted(){
			mui.plusReady(() => {
				let win = plus.webview.currentWebview()
				let flag = win.flag, goods = win.goods || {}, openerId = win.openerId, group = win.group
				this.initPosition()
				this.openerId = openerId
				if(flag == '1'){
					this.goods = new GoodsBo(goods)
				}
				let searchWin = plus.webview.getWebviewById('searchCateory')
				if(searchWin){
					this.searchPage = searchWin
				}else{
					this.searchPage = mui.preload({
						id: 'searchCateory',
						url: config.CDN_ADDRESS + '/searchCateory'
					})
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
  
      createSpec(){
        return {
          name: '',
          min: '',
          max: '',
          uuid: utils.getUuid(),
          specid: '',
          unit: '002001001',
          unitstr: '米',
          id: '',
          stand: 2
        }
      },
  
      addSpec(){
    	  this.isOpen = true
        this.defaultSpec = this.createSpec()
      },
  
      closeMasker(){
    	  this.isOpen = false
      },

	    save(){
        let win = plus.webview.currentWebview()
        let group = win.group, openerId = win.openerId, params = JSON.parse(JSON.stringify(this.goods))
        params.imgs = params.imgs.join(',')
        params.fuuid = group.uuid
        params.ispublic = params.ispublic ? '1' : '0'
        params = {
          userid: utils.getLocalUser().userid,
          items: [params]
        }
        service('saveGoods', params, rs => {
          utils.toast('保存成功')
          plus.webview.currentWebview().close('pop-out', 300)
        })
	    },

	    select(){
        this.searchPage && this.searchPage.show('pop-in', 300, () => {
          mui.fire(this.searchPage, 'setType', {type: 1})
          mui.fire(this.searchPage, 'setOpenerId', {openerId: 'goods'})
        })
	    },
  
      setCategory(category){
        this.goods = Object.assign({}, this.goods, {
          scname: category.ctname,
          alias: category.ctname,
          category: {
            ctid: category.ctid,
            cttype: '004002',
            ctname: category.ctname,
            remark: '从标准品类库中选择'
          }
        })
        console.log('GOOD', JSON.stringify(this.goods))
      },
      
      takePic(){
        utils.takePhoto(config.IMAGE_ADDRESS, rs =>{
          console.log('rs', rs)
        })
      },
  
      saveSpec(){
        this.goods.specs.push({
          unit: this.defaultSpec.unit,
          min: this.defaultSpec.min,
          max: this.defaultSpec.max,
          name: this.defaultSpec.name,
          rise: this.defaultSpec.rise,
          uuid: this.defaultSpec.uuid
        })
        this.closeMasker()
      },
      
      removeSpec(idx){
        utils.confirm('确定移除此规格', () => {
          this.goods.specs.splice(idx, 1)
        })
      }
    }
	}
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .goods-page{
    @include box-vert-left-top;
	  background: $normalBgColor;

	  .chose-stand{
		  @include box-hori-left-bottom;
		  width: auto;
		  height: auto;
		  color: $red;
		  font-size: 12px;
		  margin: 50px 0 0 15px;
		  padding: 10px 2px 0;
		  border-bottom: solid 1px $red;
		  font-weight: bold;
	  }

	  .goods-case{
		  @include box-vert-left-top;
		  padding: 10px;
      
      .info-sroller{
        overflow: hidden;
      }

		  .form-case{
			  @include box-vert-left-top;
			  background: #fff;
			  border-radius: 9px;
			  height: auto;

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
          
          .add-spec-btn{
            @include box-hori-center-middle;
            width: 50%;
            height: 36px;
            border: solid .5px $blue;
            background: #fff;
            color: $blue;
            font-weight: bold;
            border-radius: 5px;
            margin: 0 auto;
          }
          
          .title{
            @include box-hori-center-middle;
            height: 50px;
            font-size: 16px;
            font-weight: bold;
            color: $textColor;
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
        
        .spec-row-case{
          @include box-vert-left-middle;
          height: auto;
          padding: 10px 60px 7px 15px;
          border-bottom: solid 1px $normalBgColor;
          position: relative;
          
          h3{
            @include box-hori-left-middle;
            height: auto;
            font-size: 14px;
            color: $textColor;
            
            a{
              color: $textColor;
              font-weight: bold;
            }
          }
          
          .spec-info-case{
            @include box-hori-left-middle;
            color: $textLessColor;
            font-size: 12px;
            margin-top: 4px;
          }
          
          .delete-case{
            @include box-vert-center-middle;
            height: 100%;
            width: 50px;
            position: absolute;
            top: 0;
            right: 0;
            color: $red;
            font-size: 18px;
          }
  
          &:last-child{
            border: none;
          }
        }
		  }
      
      .public-case{
        @include box-hori-left-middle;
        padding: 10px;
        margin-top: 10px;
      }
      
      .tipper{
        color: #999;
        padding: 0 10px;
        font-size: 12px;
      }
      
      .imgs-case{
        @include box-hori-left-top;
        height: 80px;
        margin-top: 15px;
        padding: 0 10px;
        
        .img-item-case{
          @include box-vert-center-middle;
          width: 64px;
          height: 64px;
          font-size: 24px;
          color: #999;
          background: #fff;
          border-radius: 9px;
          margin-right: 15px;
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
			height: 42px;
			background: $blue;
			border-radius: 5px;
			color: #fff;
			font-size: 16px;
			font-weight: bold;
		}
	}
  
  .spec-case{
    @include box-vert-left-top;
    background: $normalBgColor;
    border-radius: 7px 7px 0 0;
    overflow: hidden;
    
    header{
      @include box-hori-center-middle;
      height: 50px;
      background: #fff;
      font-size: 16px;
      font-weight: bold;
      color: $textColor;
      position: relative;
      
      .icon-close{
        @include box-vert-center-middle;
        width: 32px;
        height: 50px;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 24px;
        color: $textLessColor;
      }
    }
    
    .spec-edit-case{
      margin-top: 1px;
      background: #fff;
      
      li{
        @include box-hori-left-middle;
        height: 50px;
        padding: 0 15px;
        border-bottom: solid 1px $normalBgColor;
        
        label{
          text-align: right;
          width: 100px;
          color: $textColor;
        }
      }
    }
    
    footer{
      @include box-hori-center-top;
      height: 50px;
      padding: 0 10px;
      
      .create-spec-btn{
        @include box-hori-center-middle;
        background: $blue;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        height: 42px;
        border-radius: 5px;
        
        &:active{
          opacity: .8;
        }
      }
    }
  }
</style>
