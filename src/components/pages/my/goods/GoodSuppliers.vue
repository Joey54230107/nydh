<template>
  <normal-layout class="good-suppliers-page" :loaded="loaded">
    <normal-header title="供应商列表" menuText="品类" @menuHandler="newCategory" icon="icon-plus2" />
    <div class="suppliers-case">
      <h3 class="supplier-num">此发货单共挑选了{{suppliers.length}}位供应商</h3>
      <div class="supplier-hori-case">
        <div class="supplier-hori-inner-case" :style="{'width': (100 * suppliers.length - 10) + 'px'}">
          <ul class="scroller-case" v-for="supplier in suppliers">
            <li class="supplier-item-case" @tap="detail(supplier)">
              <div class="photo-wrapper-case" :class="'wrapper-' + supplier.chose">
                <image-loader :src="supplier.supplier.url" class="photo-case" :class="'photo-case-' + supplier.chose" :defaultCls="'photo-' + ((supplier.supplier.sex == '025001') ? 'man' : 'woman') + '-case'">
                  <span class="iconfont icon-v" v-if="supplier.supplier.isrealname == '1'" :class="'icon-v-' + supplier.chose"></span>
                </image-loader>
              </div>
              <h3>{{supplier.supplier.name}}</h3>
            </li>
          </ul>
        </div>
      </div>

      <scroller class="suppliers-inner-case" @setScroller="setScroller">
        <div class="base-info">
          <h3>发货单号：{{currInvoice.invoiceno}}</h3>
          <time>创建日期：{{currInvoice.createtime | toDate('-')}}</time>
          <div class="remark-case" v-if="currInvoice.remark">
            <span class="tiper">备注</span>
            {{currInvoice.remark}}
          </div>
        </div>

        <ul class="categorys-case" :style="{'transform':'translateY(' + style.y + 'px)','opacity':style.opacity}">
          <slider-blocker v-for="(category, idx) in currInvoice.categorys" :id="category.itemid" :item="category" sliderWidth="25" class="category-item-case" :key="category.itemid">
            <div class="category-item-inner-case">
              <div class="icon-remove" @tap.stop="remove(category)">删除</div>
              <div class="name">
                <label>{{category.ctname}}</label>
                <span class="per-price">{{category.price | price}}</span>
                <span class="price">{{category.total | price}}</span>
              </div>
              <div class="state auto-fill">
                <h3>规格</h3>
                <h4 v-for="spec in category.specs">
                  {{spec.name}}：{{spec.min != undefined ? '最小：' + spec.min + spec.unitstr + '、' : ''}} {{spec.max != undefined ? '最大：' + spec.max + spec.unitstr : ''}}
                </h4>
                <h4 v-if="category.specs.length === 0">该品类未设置任何规格</h4>
              </div>
              <button class="modify-btn" v-if="category.state == '0'" @tap="modifyPrice(category)">改价</button>
            </div>
          </slider-blocker>
        </ul>
      </scroller>
    </div>

    <masker-dialog :show="isOpen" :size="300" @closeHandler="closeMasker" :force="true">
      <div class="price-case">
        <header>修改<a>{{currCategory.ctname}}</a>的报价<span class="iconfont icon-close" @tap.stop="closeMasker"></span></header>
        <ul>
          <li>
            <label>修改单价</label>
            <input type="text" v-model="currCategory.price" class="auto-fill" />
            <span class="unit">元</span>
            <span class="old-case">原价: {{currCategory.oprice | price}} 元</span>
          </li>
          <li>
            <label>修改数量</label>
            <input type="text" v-model="currCategory.amount" class="auto-fill" />
            <span class="unit">元</span>
            <span class="old-case">原数量: {{currCategory.oamount | toInt}} 株</span>
          </li>
          <li>
            <label>修改总价</label>
            <input type="text" v-model="currCategory.total" class="auto-fill" />
            <span class="unit">元</span>
            <span class="old-case">原总价: {{currCategory.ototal | price}} 元</span>
          </li>
        </ul>
        <div class="modify-tip">
          <span class="iconfont icon-lighter2"></span>
          为提高效率, 请您先线下与对方沟通好价格, 然后再填写!
        </div>
        <footer class="auto-fill">
          <button class="confirm-modify-btn" @tap="confirmModify">确定修改</button>
        </footer>
      </div>
    </masker-dialog>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import {price, toInt} from '@/plugins/filter/custom'
  import normalHeader from '@/components/comm/NormalHeader'
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
  import sliderBtn from '@/components/comm/SliderButton'

  export default {
  	created(){
			mui.plusReady(() => {
				plus.webview.show('myGoodSuppliers', 'pop-in', 300)
			})
    },

    components: {
      scroller,
      normalLayout,
      normalHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			photos,
      sliderBlocker,
      maskerDialog
    },

    data(){
      return {
        loaded: false,
				nodata: false,
				st: 0,
        curpage: 1,
        category: null,
        suppliers: [],
        good: null,
        supplier: {},
        showDialog: false,
        hisRemarks: [],
        currInvoice: {
					categorys: []
        },
        scroller: null,
				isOpen: false,
        currCategory: {},
        style: {
          y: 30,
          opacity: 0
        }
      }
    },

    mounted(){
			mui.plusReady(() => {
				this.search()
				let searchWin = plus.webview.getWebviewById('searchCateory')
				if(searchWin){
					this.searchPage = searchWin
				}else{
					this.searchPage = mui.preload({
						id: 'searchCateory',
						url: config.CDN_ADDRESS + '/searchCateory'
					})
				}
				this.hisRemarks = this.getHisRemarks()
      })
    },

    methods: {
      invoice(){
      },
  
      setScroller(scroller){
        this.scroller = scroller
      },
  
      remove(category){
        mui.confirm('您确定要从发货单中删除该品类么？', '删除品类', ['否','是'], e => {
          if(e.index == 1){
            let good = plus.webview.currentWebview().good
            service('removeCategory', {
              groupid: good.groupid,
              userid: utils.getLocalUser().userid,
              items: [{
                dt: 2,
                uuids: category.uuid
              }]
            }, rs => {
              utils.toast('操作成功！')
            })
          }
        })
      },

			confirmModify(){
      	mui.confirm('您确定要修改此品类的发货价格信息么?', '确认修改价格', ['否','是'], e => {
      		if(e.index = 1){
						let good = plus.webview.currentWebview().good
						this.showDialog = false
            service('modifyPrice', {
							invoiceid: this.currInvoice.invoiceid,
							groupid: good.groupid,
							userid: utils.getLocalUser().userid,
							uuid: this.currCategory.uuid,
							price: this.currCategory.price,
							amount: this.currCategory.amount,
							total: this.currCategory.total,
							ptype: '034001'
						}, rs => {
							utils.toast('修改成功')
              this.isOpen = false
						})
          }
        })
			},

			modifyPrice(category){
      	this.isOpen = true
        this.currCategory = JSON.parse(JSON.stringify(category))
				this.currCategory.price = price(this.currCategory.price)
				this.currCategory.total = price(this.currCategory.total)
				this.currCategory.amount = toInt(this.currCategory.amount)
      },

			closeMasker(){
      	mui.confirm('您确定要放弃本次修改么?', '放弃修改', ['是','否'], e => {
      		if(e.index == 0){
						this.isOpen = false
          }
        })
      },

			/*临时添加新品类*/
			newCategory(){
				this.searchPage && this.searchPage.show('pop-in', 300, () => {
					mui.fire(this.searchPage, 'setType', {type: 1})
					mui.fire(this.searchPage, 'setOpenerId', {openerId: 'myAcceptGoodCategorys'})
				})
			},
  
      delHis(){
        this.hisRemarks.splice(0, 10)
        utils.setLocalItem('his_remarks', '')
      },
  
      setHis(remark){
        this.supplier.remark = remark
      },
  
      publish(){
        this.hisRemarks.push(this.supplier.remark)
        utils.setLocalItem('his_remarks', this.hisRemarks.join('#'))
        service('publishInvoice', {
          uuid: this.supplier.uuid,
          expdays: this.supplier.expdays,
          remark: this.supplier.remark
        }, rs => {
          console.log(JSON.stringify(rs))
        })
        this.close()
      },
      
      close(){
        this.showDialog = false
      },
      
      getHisRemarks(){
        let remarks = utils.getLocalItem('his_remarks')
        remarks = remarks ? remarks.split('#').reverse().slice(0, 5) : []
        return remarks
      },
  
      send(supplier){
        if(supplier.status == '036001'){
          this.showDialog = true
          this.supplier = {
            expdays: '5',
            remark: '',
            uuid: supplier.uuid
          }
        }else if(supplier.stateus == '036002'){
        
        }
      },
  
			search(){
			  let user = utils.getLocalUser(), good = plus.webview.currentWebview().good
				service('getMyGoodSuppliers', {
          groupid: good.groupid
        }, rs => {
				  if(rs && Array.isArray(rs)){
				  	rs.forEach((item, idx) => {
				  		if(idx == 0){
                Object.assign(this.currInvoice, item)
                this.detail(this.currInvoice)
              }
              item.chose = (idx == 0)
            })
            this.suppliers = rs
            this.loaded = true
          }
				})
			},

      detail(invoice){
			  this.scroller && this.scroller.scrollTo(0, 0, 100)
			  Object.assign(this.style, {
			    y: 30,
          opacity: 0
        })
        setTimeout(() => {
			    this.suppliers.forEach(supplier => {
			      supplier.chose = (supplier.invoiceid == invoice.invoiceid)
          })
			    this.currInvoice.categorys.splice(0, 1000)
          Object.assign(this.currInvoice, invoice)
          service('getMyGoodSupplierCategorys', {
            invoiceid: invoice.invoiceid,
            userid: utils.getLocalUser().userid,
            groupid: invoice.groupid
          }, rs => {
            if(rs.items){
              this.currInvoice.categorys = rs.items
            }
            Object.assign(this.style, {
              y: 0,
              opacity: 1
            })
          })
        }, 300)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';

  .good-suppliers-page{
    @include box-vert-left-top;
    background: $normalBgColor;
    position: relative;
    height: 100%;
    padding-top: 50px;

    .suppliers-case{
      @include box-vert-left-top;

      .supplier-num{
        @include box-hori-left-middle;
        height: 39px;
        padding: 0 10px;
        background: #fff;
        margin-bottom: 1px;
        color: $textColor;
      }

      .supplier-hori-case{
        @include box-vert-left-top;
        width: 100%;
        height: 110px;
        padding: 12px 10px 8px 10px;
        overflow: hidden;
        background: #fff;
        border-bottom: solid 1px #fff;

        .supplier-hori-inner-case{
          @include box-hori-center-top;
          height: 100px;
          overflow-y: hidden;
          overflow-x: auto;
          width: 100%;

          .scroller-case{
            @include box-hori-center-top;
            height: 100px;
            width: 90px;

            .supplier-item-case{
              @include box-vert-center-top;
              width: 100%;
              height: 100px;
              overflow: hidden;
              margin-right: 10px;
              position: relative;

              .photo-wrapper-case{
                @include box-vert-center-middle;
                width: 64px;
                height: 64px;
                border-radius: 72px;
                background: #fff;
                position: relative;
                transition: opacity .3s;

                &.wrapper-true{
                  border: solid 2px #f85959;
                }
                &.wrapper-false{
                  border: solid 2px #ccc;
                  opacity: .5;
                }

                .photo-case{
                  width: 54px;
                  height: 54px;
                  border-radius: 64px;
                  position: relative;

                  .icon-v{
                    @include box-hori-center-middle;
                    position: absolute;
                    top: 0;
                    right: -7px;
                    width: 18px;
                    font-size: 12px;
                    height: 18px;
                    border-radius: 16px;
                    color: #fff;

                    &.icon-v-true{
                      background: $red;
                    }
                    &.icon-v-false{
                      color: #787878;
                      background: #ccc;
                    }
                  }
                  
                  &.photo-case-false{
                    opacity: .5;
                  }
                }
              }

              h3{
                width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                padding: 0 15px;
                font-weight: bold;
                padding: 10px 0 4px;
                text-align: center;
                font-size: 12px;
                color: #666;
                height: auto;
              }
            }
          }
        }
      }
      
      .good-info-case{
        @include box-vert-left-top;
        height: auto;
        margin-top: 50px;
        background: #fff;
        padding: 10px;
        margin-bottom: 1px;
        
        h3, h4{
          @include box-hori-left-middle;
          height: 24px;
          color: #666;
        }
      }

      .suppliers-inner-case{
        width: 100%;
        margin-top: 1px;
        position: relative;
        overflow: hidden;
        /*border-radius: 300px 300px 0 0/35px 35px 0 0;
        background: #f7f7f7;*/

        .base-info{
          @include box-vert-left-top;
          height: auto;
          padding: 10px 15px;
          background: #fff;
          font-size: 12px;

          h3{
            height: auto;
            color: #666;
            margin-bottom: 5px;
          }

          time{
            height: auto;
            color: #666;
          }

          .remark-case{
            height: auto;
            color: #74baf3;
            text-indent: 32px;
            position: relative;
            font-size: 12px;

            .tiper{
              width: auto;
              text-indent: 0;
              height: 14px;
              border: solid .5px #008de1;
              text-align: center;
              line-height: 14px;
              font-size: 10px;
              padding: 0 3px;
              display: block;
              position: absolute;
              top: 4px;
              left: 0;
              border-radius: 2px;
            }
          }
        }

        .categorys-case{
          @include box-vert-left-top;
          margin-top: 1px;
          padding: 10px;
          height: auto;
          transition: transform .3s, opacity .3s;

          .category-item-case{
            @include box-hori-left-middle;
            height: auto;
            background: #ccc;
            margin-bottom: 8px;
            border-radius: 9px;
            
            .category-item-inner-case{
              @include box-hori-left-middle;
              min-height: 50px;
              background: #fff;
              padding: 8px 15px 5px;
              position: relative;
              
              .icon-remove{
                @include box-vert-center-middle;
                height: 100%;
                width: 25%;
                background: #f85959;
                color: #fff;
                font-size: 16px;
                position: absolute;
                top: 0;
                right: -25%;
                
                &:active{
                  opacity: .8;
                }
              }
            }

            .name{
              @include box-vert-left-middle;
              width: 40%;
              height: auto;
              font-size: 18px;
              font-weight: bold;
              color: #666;
              border-right: solid 1px #f5f5f5;
              
              .per-price{
                font-size: 14px;
                color: #999;
                margin-top: 3px;
                font-weight: normal;
  
                &::before{
                  content: '单价';
                  font-size: 10px;
                  margin-right: 3px;
                }
  
                &::after{
                  content: '元';
                  font-size: 10px;
                  margin-left: 3px;
                }
              }

              .price{
                @include box-hori-left-middle;
                color: #f85959;
                font-size: 16px;
                font-weight: normal;
                position: relative;
                margin-top: -6px;
                
                &::before{
                  content: '总价';
                  font-size: 10px;
                  margin-right: 3px;
                  margin-top: 2px;
                }

                &::after{
                  content: '元';
                  font-size: 10px;
                  margin-left: 3px;
                  margin-top: 2px;
                }
              }
            }

            .state{
              @include box-vert-left-middle;
              height: auto;
              padding-left: 10px;
              
              h3{
                font-size: 12px;
                color: #008de1;
                font-weight: bold;
                padding-bottom: 6px;
              }
              
              h4{
                font-size: 11px;
                color: #74baf3;
                padding-bottom: 3px;
              }
            }

            .modify-btn{
              text-align: center;
              width: 50px;
              height: 28px;
              background: #f85959;
              color: #fff;
            }
          }
        }
      }
    }

    .price-case{
      @include box-vert-left-top;
      background: #f7f7f7;

      header{
        @include box-hori-center-middle;
        height: 50px;
        position: relative;
        border-bottom: solid 1px #f7f7f7;
        font-size: 16px;
        color: #666;
        background: #fff;

        .icon-close{
          @include box-vert-center-middle;
          width: 32px;
          height: 50px;
          font-size: 28px;
          color: #999;
          position: absolute;
          right: 5px;
          top: 0;
        }

        a{
          padding: 0 5px;
          font-weight: bold;
          color: #454545;
          font-size: 18px;
        }
      }

      ul{
        @include box-vert-left-top;
        height: auto;
        position: relative;

        li{
          @include box-hori-left-middle;
          height: 50px;
          margin-bottom: 1px;
          padding: 0 15px;
          background: #fff;

          label{
            width: 70px;
            height: auto;
            color: #666;
          }

          input{
            color: #333;
            height: 30px;
            padding: 0;
            margin: 0;
            font-size: 16px;
          }

          .unit{
            width: 16px;
            height: auto;
            color: #666;
            margin-right: 10px;
          }

          .old-case{
            @include box-hori-left-middle;
            width: 40%;
            padding-left: 10px;
            border-left: solid 1px #f1f1f1;
            color: #999;
          }
        }
      }

      .modify-tip{
        @include box-hori-left-middle;
        height: auto;
        width: 100%;
        background: #fff6cd;
        padding: 6px 12px;
        font-size: 12px;
        color: rgba(115, 91, 39, .8);

        .icon-lighter2{
          margin-top: -2px;
          color: #735b27;
          font-size: 24px;
          margin-right: 10px;
        }
      }

      footer{
        @include box-vert-center-top;
        padding: 13px 20px 0;

        button{
          width: 100%;
          background: #008de1;
          height: 42px;
          color: #fff;
          font-size: 16px;
          text-align: center;
        }
      }
    }
  }
</style>
