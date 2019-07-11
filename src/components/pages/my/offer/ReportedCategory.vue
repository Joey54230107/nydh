<template>
  <normal-layout :loaded="loaded" class="order-reported-category-page">
    <error-pop :msg="errMsg" />
    <normal-header title="供应商报价排名"/>
    <div class="category-case auto-fill">
      <div class="category-scroller">
        <div class="category-inner-case auto-fill">
          <div class="spec-case">
            <ul class="spec-inner-case auto-fill">
              <li class="left">
                {{category.ctname}}
              </li>
              <li class="right auto-fill">
                <h3>规格</h3>
                <div class="spec-item-case" v-for="spec in category.specs">
                  {{spec.name}}： {{((spec.min != '') && (spec.max != '')) ? ('最小' + spec.min + spec.unitstr + '，' + '最大' + spec.max + spec.unitstr) : (spec.min != '' ? '最小' + spec.min + spec.unitstr : '最大' + spec.max + spec.unitstr)}}
                </div>
                <div class="no-spec" v-if="category.specs.length == 0">该品类未设置规格</div>
              </li>
            </ul>
          </div>
          <hori-scroller class="pageframe-case" :resource="pages" @handler="choseType" />
          <scroller class="price-case" :status="status">
            <div class="transition-case" :style="{'transform':'translateY(' + y + 'px)', 'opacity':opacity}">
              <span class="tipper" v-if="code == '2'">报价按单价从高到低顺序排名</span>
              <slider-blocker v-for="(supplier, idx) in suppliers" :item="supplier" class="price-item-warp" :id="supplier.user.userid" :sliderWidth="(supplier.st == 0 && (!supplier.modifyRemark)) ? 25 : 0" :key="idx" v-show="supplier.itemtype == code">
                <div class="price-inner-case">
                  <div class="change-price-blocker" @tap.stop="changePrice(supplier)" v-if="supplier.isConfirm">改价</div>
                  <div class="user-photo-case">
                    <image-loader class="user-photo" @tapHandler.stop="openUserInfo(supplier.user)" :src="supplier.user.url" :defaultCls="'photo-' + ((supplier.user.sex == '025001') ? 'man' : 'woman') + '-case'" />
                  </div>
                  <div class="user-name-case auto-fill">
                    <h3>{{supplier.user.isrealname == 1 ? supplier.user.name : supplier.user.nickname}}</h3>
                    <span class="amount-txt" v-if="supplier.amount">提供{{supplier.amount | toInt}} 株</span>
                    <h4 v-if="supplier.itemtype == 2">{{supplier.price | price}}</h4>
                    <h5 v-if="supplier.itemtype == 2">{{supplier.total | price}}</h5>
                  </div>
                  <!--<div class="iconfont icon-check" v-if="!supplier.isConfirm && supplier.itemtype == '2'" :class="'chose-' + supplier.chose"></div>-->
                  <div class="category-chose" v-if="!supplier.isConfirm && supplier.itemtype == '2'">
                    <label>是否选择此供应商</label>
                    <radio v-model="supplier.chose" />
                  </div>
                  <div class="has-confirm" v-if="supplier.isConfirm && supplier.st == 1">已确认</div>
                  <div class="wait-confirm" v-if="supplier.isConfirm && supplier.st == 0 && supplier.modifyRemark">修改价格并待对方确认</div>
                  <div class="wait-confirm" v-if="supplier.isConfirm && supplier.st == 0 && (!supplier.modifyRemark)">同意价格并待对方确认</div>
                  <div class="wait-confirm refuse-request-case" v-if="supplier.isConfirm && supplier.st == 2">
                    被拒绝
                    <label class="reason">{{supplier.respremark}}</label>
                  </div>
                  <div class="refuse-case" v-if="supplier.itemtype == '1'">
                    <div class="content" v-if="supplier.abaremark">
                      <h5>理由</h5>
                      <label>{{supplier.abaremark}}</label>
                    </div>
                    <div class="content" v-if="!supplier.abaremark">
                      <label class="no-reason iconfont icon-yihan"><a>该用户未提供任何理由</a></label>
                    </div>
                  </div>
                </div>
              </slider-blocker>
            </div>
          </scroller>
        </div>
      </div>
      <footer>
        <span class="button" :class="chosed ? 'show' : ''" :active="chosed" @tap="save">确定供应商</span>
      </footer>
    </div>
    
    <masker-dialog size="350" :show="showDialog" @closeHandler="closeDialog">
      <div class="change-price-case">
        <header>修改价格<span class="iconfont icon-close"></span></header>
        <ul>
          <li class="row">
            <div class="label">
              <label>改后单价(元)：</label>
              <span>（原单价 {{currCategory.price | price}} 元）</span>
            </div>
            <input type="text" class="auto-fill" v-model="currCategory.price2" @input="cal" />
            <span class="iconfont icon-close2" v-show="currCategory.price2" @tap="cancels(1)"></span>
          </li>
          <li class="row">
            <div class="label">
              <label>改后数量(株)：</label>
              <span>（原数量 {{currCategory.amount | toInt}} 株）</span>
            </div>
            <input type="tel" class="auto-fill" v-model="currCategory.amount2" @input="cal" />
            <span class="iconfont icon-close2" v-show="currCategory.amount2" @tap="cancels(2)"></span>
          </li>
          <li class="row">
            <div class="label">
              <label>改后总价(元)：</label>
              <span>（原总价 {{currCategory.total | price}} 元）</span>
            </div>
            <input type="text" class="auto-fill" v-model="currCategory.total2" />
            <span class="iconfont icon-close2" v-show="currCategory.total2" @tap="cancels(3)"></span>
          </li>
          <li class="row" style="margin-top: 10px;">
            <label class="label">理由</label>
            <input type="text" class="auto-fill" v-model="currCategory.remark" placeholder="请填写修改理由" />
          </li>
        </ul>
        
        <footer>
          <button class="change-btn" @tap.stop="confirmModify">确定修改</button>
        </footer>
      </div>
    </masker-dialog>
  </normal-layout>
</template>

<script>
	/*
		根据传递过来的flag参数区分是新订单，还是订单详情
		0 = 新订单
		1 = 订单详情
	* */
	import service from '@/api/service'
	import config from '../../../../../config/address.js'
  import normalHeader from '@/components/comm/NormalHeader'
	import scroller from '@/components/comm/Scroller'
	import normalLayout from '@/components/layout/Layout'
	import OrderBo from '@/model/bo/Order'
	import CategoryBo from "@/model/bo/Category"
	import SupplierBo from '@/model/bo/Supplier'
	import PageResultBo from '@/model/PagedResult'
	import CargoBo from '@/model/bo/Cargo'
	import utils from '@/plugins/utils'
	import imageLoader from '@/components/comm/ImageLoader'
	import medal from '@/components/comm/Medal'
	import sliderBlocker from '@/components/comm/SliderBlocker'
	import horiScroller from '@/components/comm/HoriScroller'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  import {price, toInt} from '@/plugins/filter/custom.js'
  import sliderBtn from '@/components/comm/SliderButton'
  import confirmButton from '@/components/comm/ConfirmButton'
  import errorPop from '@/components/comm/ErrorPop'
  import radio from '@/components/comm/Radio'

	export default {
		created(){
			mui.plusReady(() => {
				plus.webview.getWebviewById('reportedCategory').show('pop-in', 300)
			})
		},

		components: {
			scroller,
			normalLayout,
      normalHeader,
			imageLoader,
			medal,
			sliderBlocker,
			horiScroller,
      maskerDialog,
      sliderBtn,
      confirmButton,
      errorPop,
      radio
		},

		data(){
			return {
				category: new CategoryBo(),
				user: {},
				cargo: new CargoBo(),
				showCargo: false,
				pages: [
					{name: '已报价', chose: true, code: '2', sub: []},
					{name: '尚未报价', chose: false, code: '0', sub: []},
					{name: '放弃报价', chose: false, code: '1', sub: []}
				],
        oriSuppliers: [],
        suppliers: [],
        code: '2',
				loaded: false,
        orderid: '',
        showDialog: false,
        currCategory: {},
        status: '1',
        y: 0,
        opacity: 1,
        errMsg: ''
			}
		},

		mounted(){
			mui.plusReady(() => {
				let win = plus.webview.getWebviewById('reportedCategory')
				let _category = win.category, orderid = win.orderid
				this.orderid = orderid
				this.status = '1'
        this.user = utils.getLocalUser()

				service('getReportedCategoryDetail', {
						itemid: _category.id,
						orderid,
						userid: utils.getLocalUser().userid}
					, rs => {
						let category = new CategoryBo(rs), suppliers = []
						CategoryBo.setSpecs.call(category, rs.specs)
						rs.takings && rs.takings.forEach((item, idx) => {
							let supplier = new SupplierBo(item.supplier)
							supplier.amount = item.confirm.confirmid ? item.confirm.amount : item.taking.amount
							supplier.total = item.confirm.confirmid ? item.confirm.total : item.taking.total
							supplier.price = item.confirm.confirmid ? item.confirm.price : item.taking.price
							supplier.takitemid = item.taking.takitemid
							supplier.modifyRemark = item.confirm.remark || ''

							supplier.taktype = item.taking.taktype
							//supplier.chose = !!item.confirm.confirmid
							supplier.chose = false
							supplier.itemid = category.id
							supplier.st = item.confirm.st
							supplier.itemtype = item.taking.itemtype
							supplier.confirmid = item.confirm.confirmid || ''
							supplier.abaremark = item.taking.abaremark
							supplier.respremark = item.confirm.respremark || ''
							supplier.isConfirm = item.confirm.confirmid ? true : false
							this.oriSuppliers.push(supplier)

							if(supplier.chose){
								CargoBo.add.call(this.cargo, supplier)
							}
						})
						this.formatSuppliers()
						category.suppliers = this.suppliers
						this.category = category
						this.$nextTick(() => {
							this.loaded = true
						})
					}, err => {
						this.status = '0'
					})
			})
		},
    
    computed: {
		  chosed(){
		    let hasIn = false
		    this.suppliers && this.suppliers.forEach(supplier => {
		      if(supplier.chose){
            hasIn = true
          }
        })
		    return hasIn
      }
    },

		methods: {
      cal(){
        this.currCategory.total2 = this.currCategory.price2 * this.currCategory.amount2
      },
      
			showCargoDetail(){
				if(this.cargo.items.length > 0){
					this.showCargo = !this.showCargo
				}
			},
      
      formatSuppliers(){
			  let suppliers = []
        this.oriSuppliers.forEach(supplier => {
          if(supplier.itemtype == this.code){
            suppliers.push(supplier)
          }
        })
        suppliers.forEach((supplier, idx) => {
          if(idx < 3){
            supplier.level = (idx == 0) ? 'gold' : ((idx == 1) ? 'silver' : 'copper')
          }
        })
        this.suppliers = suppliers
        this.status = (this.suppliers.length > 0) ? '2' : '0'
      },

			choseType(item){
        this.y = 30
        this.opacity = 0
        setTimeout(() => {
          this.code = item.code
          this.formatSuppliers()
          this.y = 0
          this.opacity = 1
        }, 320)
      },

			close(){
				mui.fire(plus.webview.getWebviewById(plus.runtime.appid), 'navClick', {
					id: 'business'
				})
				plus.webview.getWebviewById('order').close()
				plus.webview.getWebviewById('reportedOrder').close()
				plus.webview.currentWebview().close('pop-out', 200)
			},
      
      closeDialog(){
			  this.showDialog = false
      },
      
      confirmModify(){
        if(!this.currCategory.price2 || this.currCategory.price2 <= 0){
          utils.setError.call(this, 'errMsg', '单价必须输入大于0的数值')
          return false
        }
        if(!this.currCategory.amount2 || this.currCategory.amount2 <= 0){
          utils.setError.call(this, 'errMsg', '数量必须输入大于0的数值')
          return false
        }
        if(!this.currCategory.total2 || this.currCategory.total2 <= 0){
          utils.setError.call(this, 'errMsg', '总价必须输入大于0的数值')
          return false
        }
        if(this.currCategory.remark.trim() == ''){
          utils.setError.call(this, 'errMsg', '请填写修改价格理由')
          return false
        }
        if(this.currCategory.price2 == this.currCategory.price || this.currCategory.amount2 == this.currCategory.amount || this.currCategory.total2 == this.currCategory.total){
          utils.setError.call(this, 'errMsg', '未修改任何数值！')
          return false
        }
        
        service('modifySupplierPrice', {
          orderid: this.orderid,
          userid: utils.getLocalUser().userid,
          itemid: this.currCategory.itemid,
          confirmid: this.currCategory.confirmid,
          price: this.currCategory.price2,
          amount: this.currCategory.amount2,
          total: this.currCategory.total2,
          remark: this.currCategory.remark
        }, rs => {
          utils.toast('操作成功')
          setTimeout(() => {
            this.closeDialog()
            this.currSupplier.price = this.currCategory.price2
            this.currSupplier.amount = this.currCategory.amount2
            this.currSupplier.total = this.currCategory.total2
          }, 320)
        })
      },
      
			hide(){
				this.showCargo = false
			},

			openUserInfo(user){
			},

			setScroller(scroller){
				this.scroller = scroller
			},
      
      changePrice(supplier){
			  this.currSupplier = supplier
			  this.showDialog = true
        this.currCategory = {
          price: supplier.price,
          amount: supplier.amount,
          total: supplier.total,
          price2: price(supplier.price),
          amount2: toInt(supplier.amount),
          total2: price(supplier.total),
          confirmid: supplier.confirmid,
          itemid: supplier.itemid,
          remark: ''
        }
      },

			save(){
        let len = 0
        this.suppliers && this.suppliers.forEach(supplier => {
          if(supplier.chose){
            ++ len
          }
        })
				if(len == 0){
					utils.toast('请选择至少一个供应商', 2000, 'FAILED')
					return ;
				}
				utils.confirm('确定选择这些供应商', () => {
          let user = utils.getLocalUser()
          let params = {
            userid: user.userid,
            orderid: this.orderid,
            itemid: this.category.id,
            complete: '0',
            items: []
          }
          this.suppliers && this.suppliers.forEach(supplier => {
            if(supplier.chose){
              params.items.push({
                takitemid: supplier.takitemid,
                price: supplier.price,
                amount: supplier.amount,
                total: supplier.total,
                supplierid: supplier.user.userid,
                remark: ''
              })
            }
          })
          service('saveReportedCategorySuppliers', params, rs => {
            this.suppliers && this.suppliers.forEach(supplier => {
              if(supplier.chose){
                supplier.isConfirm = true
                supplier.st = '0'
                supplier.chose = false
              }
            })
            utils.toast('操作成功')
          }, err => {
            utils.error(err)
          })
        })
			},

			chose(supplier){
			  if(supplier.isConfirm){
			    return ;
        }
				if(supplier.chose){
					CargoBo.remove.call(this.cargo, supplier)
				}else{
					CargoBo.add.call(this.cargo, supplier)
				}
				supplier.chose = !supplier.chose

				/*mui.confirm('选择该供应商当前报价信息后就不能再更改报价了哦, 确定选择么?', '', ['是','否'], e => {
					if(e.index == 0){
						if(supplier.chose){
							CargoBo.remove.call(this.cargo, supplier)
						}else{
							CargoBo.add.call(this.cargo, supplier)
						}
						supplier.chose = !supplier.chose
					}
				})*/
			},

			clear(){
				mui.confirm('您确定要清空该品类已选择的供应商么？', '请谨慎操作', ['否','是'], e => {
					if(e.index == 1){
						CargoBo.clear.call(this.cargo)
						this.hide()
						this.category.suppliers && this.category.suppliers.forEach(supplier => {
							supplier.chose = false
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';

  .order-reported-category-page{
    @include box-vert-left-top;
    background: $normalBgColor;

    .category-photo-case{
      margin: 50px 0 0 0;
      height: 180px;
      width: 100%;
    }

    .category-case{
      @include box-vert-left-top;

      .category-scroller{
        position: relative;
        overflow: hidden;
        height: 100%;

        .category-inner-case{
          @include box-vert-center-top;
          height: 100%;
          color: #333;
          margin-top: 50px;

          .spec-case{
            @include box-hori-left-top;
            height: auto;
            width: 100%;
            color: rgba(0, 0, 0, .5);
            background: #fff;

            .spec-inner-case{
              @include box-hori-left-middle;
              padding: 12px 10px;
              border-bottom: solid 1px #f1f1f1;

              .left{
                @include box-vert-center-middle;
                width: 100px;
                height: 100%;
                font-size: 18px;
                color: #666;
                padding: 0 10px;
                font-weight: bold;
              }

              .right{
                @include box-vert-left-middle;
                border-left: solid 1px #f1f1f1;
                padding: 0 10px 3px 10px;

                h3{
                  height: auto;
                  font-size: 14px;
                  color: #008de1;
                  width: 100%;
                  font-weight: bold;
                  margin-bottom: 3px;
                }

                .spec-item-case{
                  height: 16px;
                  font-size: 12px;
                  color: #74baf3;
                  margin: 0;
                  padding: 0;
                }
                
                .no-spec{
                  height: 16px;
                }
              }
            }
          }

          .total-case{
            @include box-vert-center-middle;
            height: 50px;
            //border-top: solid 1px #e1e1e1;
            background: #fff;

            h3{
              @include box-hori-center-middle;
              width: auto;
              color: #787878;
              font-size: 24px;
              height: 30px;

              label{
                margin-top: 2px;
                font-size: 14px;
                padding-left: 4px;
              }
            }

            h2{
              height: auto;
              width: auto;
              color: #aaa;
              //background: #74baf3;
              padding: 10px;
              //border-radius: 100px/20px;
            }

            h1{
              @include box-hori-center-middle;
              width: auto;
              color: #DF6158;
              font-size: 32px;
              font-weight: 300;
              height: auto;

              label{
                margin-top: 10px;
                font-size: 14px;
                padding-left: 6px;
              }
            }
          }

          .no-data-case{
            @include box-vert-center-top;
            height: auto;

            .icon-nodata3{
              height: auto;
              margin: 80px 0 30px;
              padding: 0;
              font-size: 48px;
              color: #DF6158;
            }

            h3{
              width: auto;
              font-size: 14px;
              color: #666;

              a{
                font-size: 16px;
                color: #008de1;
                text-decoration: underline;
              }
            }
          }

          .tip{
            @include box-hori-center-middle;
            width: auto;
            height: 24px;
            background: url("../../../../assets/img/yellow.png") left top/100% 100%;
            color: #63511F;
            border-radius: 20px;
            padding: 0 16px;
            margin: 12px 0 10px 0;
          }

          .price-case{
            @include box-vert-left-top;
            height: auto;
            margin-top: 1px;
            position: relative;
            overflow: hidden;
            
            .transition-case{
              padding: 10px;
              transition: transform .3s, opacity .3s;
              
              .tipper{
                @include box-hori-left-top;
                color: #666;
                height: 30px;
                padding: 0 5px;
                font-size: 12px;
              }
            }

            .price-item-warp{
              @include box-vert-left-top;
              //border-bottom: solid 1px #e1e1e1;
              height: auto;
              position: relative;
              background: #ccc;
              margin-bottom: 8px;
              border-radius: 9px;

              &:last-child{
                border: none;
              }

              .price-inner-case{
                @include box-hori-left-middle;
                height: auto;
                background: #fff;
                padding: 10px 5px 10px 0;
                position: relative;

                .category-chose{
                  @include box-vert-right-middle;
                  height: auto;
                  width: auto;
                  margin-top: -5px;
                  padding-right: 10px;
                  
                  label{
                    font-size: 12px;
                    color: $textColor;
                    padding-bottom: 15px;
                  }
                }

                .has-confirm{
                  width: 90px;
                  height: auto;
                  text-align: center;
                  font-size: 16px;
                  font-weight: bold;
                  color: #008de1;
                }
                
                .wait-confirm{
                  @include box-vert-right-middle;
                  width: 120px;
                  height: auto;
                  text-align: right;
                  font-size: 12px;
                  line-height: 18px;
                  font-weight: bold;
                  color: #f85959;
                  padding-right: 8px;
                  
                  &.refuse-request-case{
                    font-size: 16px;
                    font-weight: bold;
                    
                    .reason{
                      @include box-hori-right-middle;
                      text-align: right;
                      margin-top: 10px;
                      font-weight: normal;
                      font-size: 12px;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    }
                  }
                }
  
                .medal-case{
                  @include box-vert-center-middle;
                  width: 32px;
                  height: 76px;
                  margin-right: 5px;
    
                  .order-idx{
                    @include box-vert-center-middle;
                    width: 32px;
                    height: 76px;
                    color: #aaa;
                    font-size: 24px;
                  }
                }

                .user-photo-case{
                  @include box-vert-right-middle;
                  width: 60px;
                  height: 100%;
                  position: relative;

                  .user-photo{
                    width: 50px;
                    height: 50px;
                    border-radius: 7px;
                    overflow: hidden;
                  }
                }

                .user-name-case{
                  @include box-vert-left-middle;
                  height: 100%;
                  padding: 0 10px;
                  
                  .amount-txt{
                    font-size: 12px;
                    color: $textLessColor;
                    margin-top: 3px;
                    margin-bottom: -5px;
                  }

                  h3{
                    @include box-hori-left-middle;
                    height: 18px;
                    line-height: 18px;
                    font-size: 16px;
                    color: #666;
                    font-weight: bold;
                  }
                  h4{
                    @include box-hori-left-middle;
                    height: auto;
                    font-size: 14px;
                    color: #9f9f9f;
                    margin-top: 4px;
                    font-weight: 300;
                    
                    &::before{
                      content: '单价';
                      font-size: 12px;
                      padding-right: 2px;
                      padding-top: 3px;
                      font-weight: normal;
                    }
                    &::after{
                      content: '元';
                      font-size: 12px;
                      padding-left: 2px;
                      padding-top: 3px;
                      font-weight: normal;
                    }
                  }
                  
                  h5{
                    @include box-hori-left-middle;
                    height: 24px;
                    line-height: 22px;
                    font-size: 14px;
                    color: #f85959;
                    font-weight: 300;
                    margin-top: -2px;
                    
                    &::before{
                      content: '总价';
                      font-size: 12px;
                      padding-right: 2px;
                      padding-top: 3px;
                      font-weight: normal;
                    }
                    &::after{
                      content: '元';
                      font-size: 12px;
                      padding-left: 2px;
                      padding-top: 3px;
                      font-weight: normal;
                    }
                  }

                  a{
                    height: 24px;
                    line-height: 24px;
                    color: #999;
                    font-size: 12px;
                  }
                }

                .refuse-case{
                  @include box-vert-left-middle;
                  width: 55%;
                  font-size: 12px;
                  color: #999;
                  padding: 10px;
                  height: auto;

                  .content{
                    @include box-vert-left-middle;
                    border-left: solid 1px #f1f1f1;
                    padding-left: 10px;
                    height: auto;

                    h5{
                      height: auto;
                      font-size: 14px;
                      color: $red;
                      font-weight: bold;
                    }
                    
                    label{
                      height: auto;
                      padding: 4px 0 0;
                    }
                  }
                  
                  .icon-yihan{
                    @include box-hori-left-middle;
                    font-size: 24px;
                    
                    a{
                      font-size: 14px;
                      padding-left: 8px;
                      color: #999;
                    }
                  }
                }

                .discuss-case{
                  @include box-hori-left-middle;
                  width: 56px;
                  height: 32px;
                  border-left: solid 1px #e7e7e7;
                  padding-left: 8px;
                  position: relative;
                  color: #999;

                  .icon-right-arr{
                    @include box-hori-left-middle;
                    position: absolute;
                    width: 21px;
                    height: 100%;
                    font-size: 21px;
                    top: 0;
                    right: 0;
                    margin-top: 1px;
                  }
                }

                .change-price-blocker{
                  @include box-vert-center-middle;
                  width: 25%;
                  height: 76px;
                  position: absolute;
                  top: 0;
                  font-weight: bold;
                  right: -25%;
                  background: #fff;
                  padding: 0;
                  color: #008de1;
                  line-height: 0;
                  font-size: 16px;
                }
              }

              .price-chose-case{
                @include box-vert-center-top;
                position: absolute;
                height: 28px;
                background: rgba(128, 128, 128, .1);

                h3{
                  line-height: 20px;
                  width: auto;
                  height: 20px;
                  border-radius: 18px;
                  text-align: center;
                  color: #fff;
                  padding: 0 15px;
                  background: url("../../../../assets/img/header-bg.png") top left/100% 100% repeat-y;
                }
              }
            }
          }
        }

        .pageframe-case{
          @include box-hori-left-middle;
          overflow: hidden;
          height: 44px;
          background: #fff;
        }
      }
      
      footer{
        @include box-hori-left-middle;
        position: fixed;
        bottom: 0;
        left: 0;
        height: 55px;
        z-index: 5;
        background: #fff;
        box-shadow: 0 -2px 15px rgba(0, 0, 0, .05);
        padding: 0 10px;
        
        label{
          @include box-hori-left-middle;
          color: #666;
          
          .icon-up-arr{
            width: 24px;
            color: #999;
          }
        }
        
        .button{
          @include box-hori-center-middle;
          width: 100%;
          border-radius: 3px;
          font-weight: bold;
          height: 40px;
          background: #ccc;
          color: #888;
          font-size: 16px;
          text-align: center;
          
          &.show{
            background: #008de1;
            color: #fff;
          }
        }
      }
    }
    
    .change-price-case{
      @include box-vert-left-top;
      height: 100%;
      background: #f5f5f5;
      position: relative;
      border-radius: 9px 9px 0 0;
      overflow: hidden;
      
      header{
        @include box-hori-center-middle;
        height: 50px;
        border-bottom: solid 1px #f1f1f1;
        color: #666;
        font-size: 18px;
        position: relative;
        font-weight: bold;
        background: #fff;
        
        .icon-close{
          text-align: center;
          line-height: 50px;
          font-size: 28px;
          color: #999;
          font-weight: normal;
          position: absolute;
          right: 0;
          top: 0;
          width: 50px;
          height: 50px;
        }
      }
      
      ul{
        @include box-vert-left-top;
        
        .row{
          @include box-hori-left-middle;
          height: 50px;
          padding: 0 15px;
          background: #fff;
          margin-bottom: 1px;
          
          .label{
            @include box-vert-left-middle;
            width: 130px;
            text-align: right;
            color: #666;
            
            label{
              height: auto;
              font-size: 14px;
              padding-top: 4px;
              padding-left: 6px;
            }
            
            span{
              font-size: 10px;
              color: #999;
            }
          }
          
          input{
            font-size: 18px;
            height: 30px;
            padding: 0 8px;
            background: transparent;
  
            &::-webkit-input-placeholder{
              color: #aaa;
              font-size: 14px;
            }
          }
          
          .icon-close2{
            color: #dedede;
            font-size: 16px;
          }
        }
      }
      
      footer{
        height: auto;
        position: absolute;
        bottom: 10px;
        width: 100%;
        padding: 0 20px;
        
        button{
          text-align: center;
          border-radius: 5px;
          height: 42px;
          width: 100%;
          background: #008de1;
          color: #fff;
          font-size: 16px;
        }
      }
    }
  }
</style>
