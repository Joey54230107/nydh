<template>
  <normal-layout class="categorys-page" :loaded="loaded">
    <good-supplier-categorys-header title="品类列表" :supplier="supplier" @newCategory="newCategory" />
  
    <masker-dialog size="220" :show="showDialog" @closeHandler="close">
      <div class="closer iconfont icon-close">
        <button @tap.stop="confirmModify">确定修改</button>
      </div>
      <ul class="curr-category-case" v-if="category">
        <li class="row">
          <label>原单价 / 元：</label>
          <input class="auto-fill" type="tel" v-model="category.price" />
        </li>
        <li class="row">
          <label>原数量 / 元：</label>
          <input class="auto-fill" type="tel" v-model="category.amount" />
        </li>
        <li class="row">
          <label>原总价 / 元：</label>
          <input class="auto-fill" type="tel" v-model="category.total" />
        </li>
      </ul>
    </masker-dialog>
    
    <div class="supplier-info-case">
      <h3><span>¥</span> {{supplier.total | price}}</h3>
      <h4>{{supplier.amount}}种品类</h4>
    </div>
    <div class="categorys-case auto-fill">
      <scroller class="categorys-inner-case" v-if="categorys.length > 0">
        <slider-blocker v-for="(category, idx) in categorys" :id="'sup_' + idx" :item="category" sliderWidth="40" class="category-slider-case" :key="category.ctid">
          <div class="category-inner" :class="'category-inner-' + category.datatype">
            <div class="icon-remove" @tap.stop="removeCate(category)">删除此品类</div>
            <div class="category-photo-case">
              <image-loader :src="category.url" class="photo-case" :defaultCls="'photo-default-case'"></image-loader>
            </div>
            <div class="category-info-case auto-fill">
              <h3>{{category.ctname}} <span>{{category.amount}}株</span></h3>
              <h4><span v-if="category.ototal" class="old">¥</span><a v-if="category.ototal">{{category.ototal | price}}</a><span>¥</span>{{category.total | price}}</h4>
            </div>
            <button class="modify-btn" @tap.stop="modify(category)">改价</button>
          </div>
        </slider-blocker>
      </scroller>
    </div>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import goodSupplierCategorysHeader from '@/components/comm/header/GoodSupplierCategorysHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import imageLoader from '@/components/comm/ImageLoader'
  import photos from '@/components/comm/Photos'
  import sliderBlocker from '@/components/comm/SliderBlocker'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  
  export default {
    created(){
      window.addEventListener('addCategory', (e) => {
        this.addCategory(e.detail.category)
      })
    },
    
    components: {
      scroller,
      normalLayout,
      goodSupplierCategorysHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			photos,
      sliderBlocker,
      maskerDialog
    },

    data(){
      return {
        loaded: true,
        pages: [
          {name: '待发布', chose: true, code: '0'},
          {name: '待报价', chose: false, code: '1'},
          {name: '已完成', chose: false, code: '2'}
        ],
        filterPage: mui.preload({
					id: 'orderFilter',
					url: config.CDN_ADDRESS + '/orderFilter',
					styles: {
						background: 'transparent'
					}
				}),
				nodata: false,
				st: 0,
        curpage: 1,
        categorys: [],
        category: {},
				loadStyle: {
					top: 0,
					opacity: 1
				},
        showDialog: false,
        good: {},
        supplier: {}
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				let searchWin = plus.webview.getWebviewById('searchCateory')
				utils.masker()
				plus.webview.show('myGoodSupplierCategorys', 'pop-in', 200, () => {
					this.search()
				})
        this.good = plus.webview.currentWebview().good
        this.supplier = plus.webview.currentWebview().supplier
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
    
    watch: {
      category: {
        handler: (curVal, oldVal) => {
          if(curVal && oldVal){
            if((!isNaN(curVal.price)) && (!isNaN(curVal.amount))){
              curVal.total = curVal.price * curVal.amount
            }
          }
        },
        deep: true
      }
    },
    
    methods: {
      addCategory(category){
        let user = utils.getLocalUser()
        service('submitInvoice', {
          expdays: this.good.expdays || '5',
          supplierid: this.supplier.supplierid,
          remark: this.good.remark,
          cityid: user.cityid,
          title: this.good.title,
          userid: user.userid,
          uuid: this.supplier.uuid,
          groupid: this.good.groupid,
          items: [{
            imgs: '',
            ctid: category.ctid,
            amount: category.amount,
            cname: category.cname,
            ctname: category.ctname,
            ptype: '034001',
            remark: '',
            sctype: '020001',
            uuid: utils.getUuid(),
            specs: category.specs,
            total: category.total,
            price: category.price,
            scid: '0'
          }]
        }, rs => {
          console.log(JSON.stringify(rs))
        })
      },
      
      close(){
        this.showDialog = false
      },
  
      removeCate(category){
        let user = utils.getLocalUser()
        service('removeCategoryPriceInfo', {
          userid: user.userid,
          items: [
            {dt: '2', uuids: category.uuid}
          ]
        }, rs => {
          mui.toast('删除成功, 请等待对方确认')
        })
      },
  
      confirmModify(){
				let supplier = plus.webview.currentWebview().supplier
        this.showDialog = false
        service('modifyCategoryPriceInfo', {
					invoiceid: supplier.invoiceid,
          uuid: supplier.uuid,
          title: supplier.title,
					expdays: supplier.expdays,
					remark: supplier.remark,
          items: [{
						uuid: this.category.uuid,
						scid: '0',
						sctype: '020001',
						ctid: this.category.ctid,
						ctname: this.category.ctname,
						cname: this.category.cname,
						oprice: this.category.oprice,
						oamount: this.category.oamount,
						ototal: this.category.ototal,
						price: this.category.price,
						amount: this.category.amount,
						total: this.category.total,
						ptype: this.category.ptype,
						remark: this.category.remark,
						imgs: '',
						dt: '038002'
          }]
        }, rs => {
          console.log(JSON.stringify(rs))
        })
      },
      
      modify(category){
        this.category = category
        this.showDialog = true
      },
      
			searchGoods(item){
			  this.st = item.code
        this.search()
        Object.assign(this.loadStyle, {
          top: 30,
          opacity: 0
        })
        setTimeout(() => {
          this.search()
        }, 300)
      },
  
      /*临时添加新品类*/
      newCategory(){
			  this.searchPage && this.searchPage.show('pop-in', 200, () => {
			    mui.fire(this.searchPage, 'setType', {type: 1})
        })
      },

			search(){
			  let user = utils.getLocalUser(), supplier = plus.webview.currentWebview().supplier
        supplier && service('getMyGoodSupplierCategorys', {
          invoiceid: supplier.invoiceid,
          curpage: this.curpage
        }, rs => {
					console.log(JSON.stringify(rs.items))
					this.categorys = rs.items || []
				})
			},
  
      detail(category){
        plus.webview.create(config.CDN_ADDRESS + '/myGoodCategoryDetail', 'myGoodCategoryDetail', {}, {
          ctid: category.ctid,
          itemid: category.itemid,
          url: category.cf3,
          ctname: category.ctname,
          amount: category.amount,
          total: category.total
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .categorys-page{
    @include box-vert-left-top;
    background: #e1e1e1;
    position: relative;
    
    .curr-category-case{
      @include box-vert-left-top;
      height: 100%;
      width: 100%;
      background: #fff;
      padding: 50px 15px 0;
      
      .row{
        @include box-hori-left-middle;
        height: 50px;
        
        input{
          border-bottom: solid 1px #dedede;
          border-radius: 0;
          padding-top: 24px;
          padding-left: 2px;
          font-size: 16px;
        }
        
        label{
          padding-top: 12px;
          padding-right: 6px;
          width: 100px;
          text-align: right;
          color: #666;
        }
      }
    }
  
    .closer{
      background: #f1f1f1;
      position: absolute;
      top: 0;
      line-height: 50px;
      height: 50px;
      padding-left: 6px;
      padding-right: 10px;
      width: 100%;
      font-size: 32px;
      color: #787878;
    
      button{
        width: auto;
        height: 32px;
        background: #008de1;
        border-radius: 3px;
        color: #fff;
        line-height: 32px;
        padding: 0 12px;
        font-size: 14px;
        margin-top: 9px;
        float: right;
      }
    }
    
    .supplier-info-case{
      @include box-vert-center-top;
      margin-top: 60px;
      height: auto;
      background: #fff;
      padding: 20px 0 18px;
      text-align: center;
      border-top: solid 1px #e1e1e1;
      
      h3{
        font-size: 32px;
        color: #DF6158;
        font-weight: 300;
        
        span{
          font-weight: normal;
          font-size: 18px;
        }
      }
      
      h4{
        margin-top: 10px;
        font-size: 18px;
        color: #666;
      }
    }

    .categorys-case{
      @include box-vert-left-top;
      overflow: hidden;
      height: 100%;

      .categorys-inner-case{
        width: 100%;
        position: relative;
        overflow: hidden;

        .category-slider-case{
          height: auto;
          width: 100%;
          background: #ccc;
          margin-bottom: 1px;
          
          &:last-child{
            margin-bottom: 0;
          }
          
          .category-inner{
            @include box-hori-left-top;
            width: 100%;
            height: auto;
            padding: 10px;
            background: #f4f4f4;
            position: relative;

            &.category-inner-1{
              background: #74baf3;
            }
            &.category-inner-2{
              background: #e77c6e;
            }
            
            .icon-remove{
              @include box-vert-center-middle;
              font-size: 16px;
              height: 100%;
              width: 40%;
              position: absolute;
              top: 0;
              right: -40%;
              color: #fff;
              background: linear-gradient(to right, #E25C59 , #F8B68E);
            }
            
            .category-photo-case{
              width: 50px;
              height: 50px;
            }
            
            .category-info-case{
              @include box-vert-left-top;
              height: auto;
              padding: 2px 10px;
              
              h3{
                font-size: 16px;
                
                span{
                  color: #666;
                }
              }
              
              h4{
                padding-top: 10px;
                color: #DF6158;
                font-size: 18px;
                
                span{
                  font-size: 14px;
                  
                  &.old{
                    color: #999;
                  }
                }
                
                a{
                  color:#999;
                  text-decoration: line-through;
                  margin-right: 10px;
                }
              }
            }
            
            .modify-btn{
              width: 50px;
              height: 24px;
              position: absolute;
              background: transparent;
              top: 50%;
              margin-top: -12px;
              border: solid 1px #aaa;
              border-radius: 3px;
              line-height: 22px;
              text-align: center;
              color: #999;
              right: 10px;
            }
          }
        }
      }
    }
  }
</style>
