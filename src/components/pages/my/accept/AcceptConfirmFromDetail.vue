<template>
  <div id="businessCategoryListContainer">
    <div class="category-list-case">
      <div class="order-info-case">
        <span class="iconfont icon-order"></span>
        <div class="order-info auto-fill">
          <h3>报价单标题：{{order.title}}</h3>
          <time>发布时间：{{order.createtime}}</time>
          <span class="iconfont icon-close" @tap="close"></span>
        </div>
      </div>
      <div class="tip-case">
        请注意过期时间：{{order.latestime}}
      </div>
      <div class="page-frame-case auto-fill">
        <scroller class="category-scroller auto-fill" @setScroller="setScroller">
          <ul class="category-inner-list-case">
            <slider-blocker v-for="(category, idx) in categorys" class="category-item-case" :key="idx" sliderWidth="45">
              <div class="category-item-inner-case" @tap="price(category)">
                <div class="operation-btn icon-price" @tap.stop="price(category)">报价</div>
                <div class="operation-btn icon-refuse" @tap.stop="remove(order, idx, $event)">拒绝</div>

                <image-loader class="category-photo-case" :src="category.url" />
                <div class="category-info-case auto-fill">
                  <h3>{{category.ctname}}<label> x{{category.amount}}</label></h3>
                  <ul class="spec-case">
                    <span class="spec-name" v-if="category.specs.length > 0">规格</span>
                    <div class="spec-value-case">
                      <span class="spec-name spec-name-no" v-if="category.specs.length == 0">该品类未设置规格</span>
                      <li v-for="spec in category.specs" class="spec-item" v-if="category.specs.length > 0">
                        {{spec.name}}: &nbsp;{{(spec.max && spec.min) ? (spec.min + '米 ～ ' + spec.max + '米') : ((spec.max || spec.min) + '米')}}
                      </li>
                    </div>
                  </ul>
                  <ul class="my-price-case" v-if="category.amount2 && category.price && category.total">
                    <div class="price-value-case">
                      <li><label>{{category.price | price}}</label>元 x {{category.amount2 | toInt}}株，<label>总计 {{category.total | price}}</label>元</li>
                    </div>
                  </ul>
                </div>
              </div>
            </slider-blocker>
          </ul>
        </scroller>
      </div>
    </div>
    <footer class="footer-case">
      <span class="price-tip">合计 {{totalMoney}} 元</span>
      <div class="submit-btn auto-fill">
        <div class="iconfont icon-send" @tap="publish">&nbsp;<span>发布我的报价信息</span></div>
      </div>
    </footer>
	</div>
</template>

<script>
	import config from '../../../../../config/address.js'
	import imageLoader from '@/components/comm/ImageLoader'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import OrderBo from '@/model/bo/Order'
  import CategoryBo from '@/model/bo/Category'
  import scroller from '@/components/comm/Scroller'
  import timeCounter from '@/components/comm/TimeCounter'
  import sliderBlocker from '@/components/comm/SliderBlocker'

	export default {
	  components: {
      scroller,
      imageLoader,
      timeCounter,
      sliderBlocker
    },
    
		data(){
			return {
				order: {
				  user: {}
        },
        pages: [
          {name: '朋友分配给我的', chose: true, code: 1},
          {name: '其他品类列表', chose: false, code: 0}
        ],
        curpage: 1,
        categorys: [],
        latestime: '',
        params: null,
        category: {},
        showMasker: false,
        top: 250,
        st: 0
			}
		},

		mounted(){
			mui.plusReady(() => {
				utils.masker()
				plus.webview.show('myAccecptConfirmDetail', 'slide-in-bottom', 300)
				let order = plus.webview.currentWebview().order, st = plus.webview.currentWebview().st
				this.init(order, st)
			})
		},

		methods: {
      init(order, st){
        this.order = order
        this.st = st
        this.search(order.takid)
        this.latestime = order.latestime
      },
      
      savePrice(){
				let user = utils.getLocalUser()
        let params = {
					uuid: this.order.uuid,
					paytype: '013001',
					orderid: this.order.orderid,
					userid: user.userid,
					cityid: user.cityid,
					remark: '',
					items: [{
						itemid: this.category.id,
						amount: this.category.amount2,
						total: this.category.total,
						price: this.category.price,
						ptype: '034001',
						allotid: this.category.allotid,
						uuid: this.category.uuid
          }]
        }
				console.log('保存的参数', JSON.stringify(params))
				service('saveOrderTakes', params, rs => {
					this.closeMasker()
					mui.toast('保存成功，请继续操作')
				})
      },
      
      price(category){
        this.category = category
        this.showMasker = true
        setTimeout(() => {
          this.top = 0
        }, 100)
      },
      
      changePage(page){
        this.pages.forEach(item => {
          item.chose = (item.code === page.code)
        })
        this.search(this.order.orderid, page.code)
      },

			publish(){
			  service('publishTakOrder', {
					uuid: this.order.uuid,
					orderid: this.order.orderid
        }, rs => {
			    mui.alert('发布成功')
          this.close()
        })
      },
      
      calTotal(category){
        if(category.amount2 && category.price && (!isNaN(category.amount2)) && (!isNaN(category.price))){
          let price = parseFloat(category.amount2) * parseFloat(category.price)
          category.total = price.toFixed(2)
        }
      },

			closeIpt(category, name){
      	category[name] = ''
      },
      
      search(takid){
        service('getAccecptConfirmDetail', {
					takid
        }, rs => {
          this.categorys = []
          rs.items && rs.items.forEach((category, idx) => {
            let _category = new CategoryBo(category)
            _category.price = category.confirm.price || ''
            _category.total = category.confirm.total || ''
            _category.amount2 = category.confirm.amount
            _category.chose2 = true
            _category.uuid = _category.uuid
            CategoryBo.setSpecs.call(_category, category.specs)
            this.categorys.push(_category)
          })
        })
      },
      
      setScroller(){},
      
      close(){
        this.categorys = []
        plus.webview.currentWebview().close('slide-out-bottom', 200)
      },
      
      closeMasker(){
        this.top = 250
        setTimeout(() => {
          this.showMasker = false
        }, 200)
      }
		},
    
    computed: {
      totalMoney(){
        let price = 0
        this.categorys && this.categorys.forEach(category => {
          if(category.amount2 && category.price && category.total){
            price = parseFloat(price) + parseFloat(category.total)
          }
        })
        return price.toFixed(2)
      }
    }
	}
</script>

<style lang="scss" type="text/scss">
	@import '@/assets/style/main.scss';
  
  #businessCategoryListContainer{
    @include box-vert-left-top;
    background: rgba(0, 0, 0, .7);
    height: 100%;
    padding: 15px 0 50px 0;
    font-size: 14px;
    
    .category-list-case{
      @include box-vert-center-top;
      position: relative;
      background: #fff;
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      
      .order-info-case{
        @include box-hori-left-middle;
        height: 56px;
        background: #74baf3;
        padding: 0 8px;
        position: relative;
        
        .icon-close{
          position: absolute;
          width: 32px;
          height: 32px;
          right: 5px;
          top: 10px;
          font-size: 32px;
          color: rgba(255, 255, 255, .6);
        }
        
        .icon-order{
          text-align: center;
          line-height: 34px;
          width: 36px;
          font-size: 21px;
          height: 36px;
          color: #fff;
          border: solid 1px #fff;
          border-radius: 50px;
          margin-left: 5px;
        }
        .order-info{
          @include box-vert-left-top;
          color: #fff;
          padding: 5px 0 8px 10px;
          
          h3{
            height: auto;
            font-size: 14px;
          }
          
          time{
            height: auto;
          }
        }
      }
      
      .tip-case{
        @include box-hori-center-middle;
        height: 36px;
        background: url("../../../../assets/img/header-bg.png") top left/100% 100% repeat-y;
      }
      
      .page-frame-case{
        @include box-hori-left-top;
        width: 100%;
        
        .pages-case{
          @include box-vert-left-top;
          width: 65px;
          height: auto;
          
          .page-case{
            @include box-hori-left-middle;
            width: 100%;
            height: auto;
            font-size: 12px;
            padding: 10px 5px;
            line-height: 18px;
  
            &.page-case-true{
              background: #fff;
            }
            &.page-case-false{
              background: #e8e8e8;
            }
          }
        }
        
        .content-case{
          @include box-vert-left-top;
          background: #fff;
          padding: 8px 0;
        }
      }

      .info-case{
        @include box-vert-left-top;
        height: auto;
        padding-right: 80px;
        padding-left: 16px;
        position: relative;
        
      }

      h1{
        @include box-hori-left-top;
        text-align: center;
        height: 18px;
        font-size: 18px;

        .icon-yinhao-left{
          line-height: 10px;
        }
        .icon-yinhao-right{
          line-height: 10px;
        }
      }
      
      .time-counter-case{
        @include box-hori-left-top;
        height: 40px;
        color: #666;
        
        .icon-clock{
          width: auto;
          font-size: 18px;
          color: #61a9e4;
        }
      }
      
      .category-scroller{
        position: relative;
        margin-bottom: 55px;
        overflow: hidden;
        padding-left: 10px;
        
        .category-inner-list-case{
          @include box-vert-left-top;
          
          .category-item-case{
            @include box-vert-left-top;
            height: auto;
            background: #ccc;
            border-bottom: solid 1px #e1e1e1;
            
            &:last-child{
              border: none;
            }
            
            .category-item-inner-case{
              @include box-hori-left-top;
              padding: 15px 0 5px 0;
              height: auto;
              background: #fff;
              position: relative;
              width: 100%;
              
              .operation-btn{
                @include box-hori-center-middle;
                height: 100%;
                position: absolute;
                top: 0;
                font-size: 16px;
  
                &.icon-price{
                  width: 25%;
                  background: #caad5f;
                  color: #644f1b;
                  right: -25%;
                }
                &.icon-refuse{
                  width: 20%;
                  background: #DF6158;
                  color: #fff;
                  right: -45%;
                }
              }
  
              .category-photo-case{
                width: 64px;
                height: 64px;
                margin-right: 10px;
                border: solid 2px #999;
                border-radius: 7px;
              }
              .category-info-case{
                @include box-vert-left-top;
                height: auto;
                padding-right: 15px;
    
                h3{
                  margin: 0;
                  font-weight: bold;
                  font-size: 18px;
                  padding: 2px 0 0 0;
      
                  label{
                    font-size: 14px;
                    font-weight: normal;
                    color: #787878;
                  }
                }
    
                h4{
                  margin: 0;
                  font-size: 14px;
                  color: #787878;
                  padding: 6px 0 3px 0;
                }
    
                .spec-case{
                  @include box-hori-left-top;
                  margin: 2px 0 3px 0;
                  min-height: 20px;
                  height: auto;
                  padding-left: 40px;
                  position: relative;
                  font-size: 12px;
                  color: #999;
      
                  .spec-name{
                    line-height: 14px;
                    width: 34px;
                    position: absolute;
                    left: 0;
                    top: 3px;
                    border: solid 1px #74baf3;
                    border-radius: 2px;
                    height: 16px;
                    color: #74baf3;
                    text-align: center;
                    padding: 0;
                    margin: 0;
        
                    &.spec-name-no{
                      border-color: #e77c6e;
                      width: 110px;
                      color: #e77c6e;
                    }
                  }
      
                  .spec-value-case{
                    @include box-vert-left-top;
                    height: auto;
                  }
      
                  .spec-item{
                    @include box-hori-left-middle;
                    width: 100%;
                    height: 20px;
                  }
                }
                
                .my-price-case{
                  @include box-vert-left-top;
                  margin: 0 0 6px 0;
                  min-height: 20px;
                  height: auto;
                  position: relative;
                  font-size: 12px;
                  color: #999;
                  
                  .price-value-case{
                    font-size: 14px;
                    
                    li label{
                      color: #DF6158;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  
    .footer-case{
      @include box-hori-center-middle;
      height: 50px;
      position: fixed;
      bottom: 0;
      left: 0;
      font-size: 14px;
      z-index: 100;
      color: #fff;
      background: #008de1;
    
      .submit-btn{
        @include box-hori-center-middle;
        height: 50px;
        font-size: 16px;
        padding: 0 0 0 10px;
      }
      
      .price-tip{
        @include box-hori-center-middle;
        height: 32px;
        background: #FFFAD7;
        position: absolute;
        top: -32px;
        left: 0;
        color: #666;
      }
    
      .icon-send{
        @include box-hori-center-middle;
        width: auto;
        padding: 2px 20px 0;
        //border-radius: 7px;
        height: 50px;
        background: #008de1;
        font-size: 18px;
        text-decoration: none;
      
        span{
          font-size: 16px;
        }
      }
  
      &:active{
        opacity: .8;
      }
    }
    
    .masker-case{
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .5);
      z-index: 500;
      
      .price-case{
        @include box-vert-left-top;
        height: 250px;
        background: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        transition: transform .2s;
        
        .title-case{
          @include box-hori-center-middle;
          height: 50px;
          border-bottom: solid 1px #dedede;
          position: relative;
          font-size: 18px;
          
          .icon-close{
            position: absolute;
            left: 0;
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 32px;
            color: #999;
          }
        }
        
        .price-detail-case{
          @include box-hori-left-top;
          padding: 10px;
  
          .price-category-photo{
            width: 100px;
            height: 100px;
            position: relative;
            
            span{
              @include box-hori-center-middle;
              width: 100%;
              height: auto;
              left: 0;
              bottom: 0;
              background: rgba(0, 0, 0, .5);
              color: #fff;
              font-size: 12px;
              padding: 10px;
            }
          }
          .price-inner-case{
            @include box-vert-left-top;
            padding: 0 5px 0 15px;
  
            .price-ipt-case{
              @include box-hori-left-middle;
              height: 30px;
              width: 100%;
              position: relative;
              border-bottom: solid 1px #ccc;
              margin-bottom: 5px;
              padding: 0;
    
              .closer{
                line-height: 16px;
                text-align: center;
                width: 16px;
                height: 16px;
                background: rgba(0, 0, 0, .1);
                border-radius: 18px;
                color: #fff;
                position: absolute;
                right: 20px;
                top: 7px;
                font-weight: bold;
                font-size: 10px;
              }
    
              .ipt{
                margin-top: 13px;
                padding: 0 5px;
                height: 18px;
                line-height: 16px;
                border: none;
      
                &::-webkit-input-placeholder{
                  color:#999;
                  font-size:14px;
                }
              }
            }
          }
        }
        
        .btn-case{
          @include box-vert-center-top;
          height: 50px;
          padding: 0 10px;
          
          button{
            width: 100%;
            color: #fff;
            text-align: center;
            font-size: 16px;
            height: 40px;
            background: #008de1;
            border-radius: 4px;
          }
        }
      }
    }
  }
  
  @keyframes down_arr {
    0%{
      padding-top: 0;
      opacity: 1;
    }
    100%{
      padding-top: 20px;
      opacity: 0;
    }
  }
</style>
