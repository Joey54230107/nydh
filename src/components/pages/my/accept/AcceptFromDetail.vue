<template>
  <div id="businessCategoryListContainer">
    <div class="category-list-case">
      <div class="user-info-case">
        <image-loader class="user-photo" :defaultCls="'photo-' + ((order.user.sex == '1') ? 'man' : 'woman') + '-case'" :src="order.user.url" />
        <span class="iconfont icon-close" @tap="close"></span>
        <div class="user-info auto-fill">
          <h3>
            {{order.user.name}}
            <div class="iconfont icon-vip" :class="order.user.isrealname == '1' ? 'vip-true' : 'vip-false'"></div>
          </h3>
        </div>
      </div>
      <div class="tip-case">
        <!--请注意过期时间：{{order.latestime}}-->
        <h3>{{order.title}}</h3>
        <h4>{{order.createtime}} 共{{order.catecount}}种品类</h4>
      </div>
      <ul class="page-frame-case auto-fill">
        <li class="pages-case">
          <span v-for="page in pages" class="page-case" :class="'page-case-' + page.chose" @tap="changePage(page)">{{page.name}}</span>
        </li>
        <li class="content-case auto-fill">
          <div v-if="categorys.length == 0" class="no-data">
            <span class="iconfont icon-nodata2"></span>
            <h3>该分类下无品类列表数据</h3>
          </div>
          <scroller class="category-scroller auto-fill" @setScroller="setScroller" v-if="categorys.length > 0">
            <ul class="category-inner-list-case">
              <slider-blocker v-for="(category, idx) in categorys" class="category-item-case" :item="category" :id="idx" :key="idx" sliderWidth="60">
                <div class="category-item-inner-case" @tap="price(category)">
                  <div class="operation-btn icon-price" @tap.stop="price(category, true)">报价</div>
                  <div class="operation-btn icon-refuse" @tap.stop="remove(order, idx, $event)">拒绝报价</div>
                  
                  <image-loader class="category-photo-case" :src="category.url" />
                  <div class="category-info-case auto-fill">
                    <h3>{{category.ctname}}<label> x{{category.amount}}</label></h3>
                    <h4>{{category.taked == 0 ? '尚无人报价' : '已有' + category.taked + '人报价'}}</h4>
                    <ul class="spec-case">
                      <span class="spec-name" v-if="category.specs.length > 0">规格</span>
                      <div class="spec-value-case">
                        <span class="spec-name spec-name-no" v-if="category.specs.length == 0">该品类未设置规格</span>
                        <li v-for="spec in category.specs" class="spec-item" v-if="category.specs.length > 0">
                          {{spec.name}}: &nbsp;{{(spec.max && spec.min) ? (spec.min + '米 ～ ' + spec.max + '米') : ((spec.max || spec.min) + '米')}}
                        </li>
                      </div>
                    </ul>
                    <ul class="my-price-case" v-if="category.price && category.total">
                      <span class="price-name">报价</span>
                      <div class="price-value-case">
                        <li><label>{{category.price | price}}</label>元 x {{category.amount2 | toInt}}株</li>
                        <li><label>总计 {{category.total | price}}</label>元</li>
                      </div>
                    </ul>
                  </div>
                </div>
              </slider-blocker>
            </ul>
          </scroller>
        </li>
      </ul>
    </div>
    <footer class="footer-case">
      <span class="price-tip">合计 {{totalMoney}} 元</span>
      <div class="submit-btn auto-fill">
        <div class="iconfont icon-send" @tap="publish">&nbsp;<span>发布我的报价信息</span></div>
      </div>
    </footer>
    
    <div class="masker-case" v-if="showMasker">
      <confirm-price :category="category" @savePrice="savePrice" />
    </div>
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
  import confirmPrice from '@/components/comm/ConfirmPrice'

	export default {
	  components: {
      scroller,
      imageLoader,
      timeCounter,
      sliderBlocker,
			confirmPrice
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
        st: 0,

			}
		},

		mounted(){
			mui.plusReady(() => {
				utils.masker()
				plus.webview.show('myAccecptDetail', 'slide-in-bottom', 300)
				let order = plus.webview.currentWebview().order, st = plus.webview.currentWebview().st
				this.init(order, st)
			})
		},

		methods: {
      init(order, st){
        this.order = order
        this.st = st
        this.search(order.orderid)
        this.latestime = order.latestime
      },
      
      savePrice(thisObj, callback){
        if(!(this.category.amount2 && this.category.total && this.category.price)){
          this.error = '数量、单价、总价 必须全部填写'
          return ;
        }
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
        //console.log('*********categoryuuid********', this.category.uuid)
				service('saveOrderTakes', params, rs => {
					callback.call(thisObj)
					mui.toast('保存成功，请继续操作')
          setTimeout(() => {
						this.showMasker = false
          }, 200)
				})
      },


      
      price(category, force){
        let slider = category.slider
        if(slider && slider.scrollLeft > 0){
          let total = parseInt(slider.offsetWidth * .4)
          utils.animationLine(slider, 10, 8, total, true)
          if(!force){
            return ;
          }
        }
        this.category = category
        this.showMasker = true
        this.error = ''
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
      
      search(orderid, alloted = 1){
        let user = utils.getLocalUser()
        service('businessCategoryList', {
          orderid,
          userid: user.userid,
          curpage: this.curpage,
          alloted
        }, rs => {
          this.categorys = []
          rs.items && rs.items.forEach((category, idx) => {
            let _category = new CategoryBo(category)
            _category.price = category.taking.price ? parseFloat(category.taking.price).toFixed(2) : ''
            _category.total = category.taking.total ? parseFloat(category.taking.total).toFixed(2) : ''
            _category.amount2 = category.taking.amount ? Math.floor(category.taking.amount) : ''
            _category.chose2 = true
            _category.uuid = category.taking.uuid || utils.getUuid()
            _category.state = Math.random()
            CategoryBo.setSpecs.call(_category, category.specs)
            this.categorys.push(_category)

            console.log(JSON.stringify(_category))
          })
        })
      },
      
      setScroller(){},

      close(){
        this.categorys = []
        plus.webview.currentWebview().close('slide-out-bottom', 200)
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
    padding: 10px 0 50px 0;
    font-size: 14px;
    
    .category-list-case{
      @include box-vert-center-top;
      position: relative;
      background: #f1f1f1;
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      
      .user-info-case{
        @include box-hori-left-middle;
        height: 56px;
        background: url("../../../../assets/img/header-bg.png") top left repeat-y;
        padding: 0 8px 0 12px;
        position: relative;
        
        .icon-close{
          position: absolute;
          z-index: 100;
          width: 32px;
          height: 32px;
          right: 5px;
          top: 10px;
          font-size: 32px;
          color: rgba(0, 0, 0, .4);
        }

        .photo-man-case{
          border-radius: 100px;
          background: url("../../../../assets/img/man.png") center center/cover no-repeat;
        }
        .photo-woman-case{
          border-radius: 100px;
          background: url("../../../../assets/img/woman.png") center center/cover no-repeat;
        }
        
        .user-photo{
          text-align: center;
          line-height: 34px;
          width: 40px;
          font-size: 21px;
          height: 40px;
          border-radius: 50px;
        }
        
        .user-info{
          @include box-vert-left-middle;
          color: #333;
          padding: 8px 0 8px 10px;
          position: relative;
          
          h3{
            @include box-hori-left-middle;
            height: auto;
            font-size: 16px;
  
            .icon-vip{
              @include box-hori-left-middle;
              width: auto;
              height: 18px;
              //border-radius: 3px;
              font-size: 14px;
              padding: 0 3px;
              margin-left: 0;
              margin-top: 1px;
              
              label{
                font-size: 12px;
              }
  
              &.vip-true{
                background: #ffd100;
                color: #333;
              }
              &.vip-false{
                background: transparent;
                color: #666;
              }
            }
          }
          
          time{
            font-size: 12px;
            padding-top: 3px;
            color: #666;
          }
        }
      }
      
      .tip-case{
        @include box-vert-left-top;
        height: auto;
        padding: 10px 12px 6px;
        background: #f7f7f7;
        border-bottom: solid 1px #eee;

        h3{
          font-size: 20px;
          color: #333;
        }
        h4{
          font-size: 14px;
          color: #787878;
          margin-top: 5px;
        }
      }
      
      .page-frame-case{
        @include box-hori-left-top;
        width: 100%;
        
        .pages-case{
          @include box-vert-left-top;
          width: 80px;
          height: auto;
          
          .page-case{
            @include box-hori-left-middle;
            width: 100%;
            height: auto;
            font-size: 12px;
            padding: 10px;
            line-height: 18px;
  
            &.page-case-true{
              background: #fff;
            }
            &.page-case-false{
              background: #eee;
            }
          }
        }
        
        .content-case{
          @include box-vert-left-top;
          background: #fff;
          padding: 8px 0;
          
          .no-data{
            width: 100%;
            text-align: center;
            padding-top: 50px;
            color: #666;
            
            .icon-nodata2{
              font-size: 80px;
              color: #e77c6e;
              padding-left: 20px;
            }
            
            h3{
              font-size: 14px;
              width: auto;
              color: #666;
              margin-top: 25px;
            }
          }
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
            border-bottom: solid 1px #dedede;
            
            &:last-child{
              border: none;
            }
            
            .category-item-inner-case{
              @include box-hori-left-top;
              padding: 10px 0 10px 0;
              height: auto;
              background: #fff;
              position: relative;
              width: 100%;
              
              .operation-btn{
                @include box-hori-center-middle;
                height: 100%;
                position: absolute;
                top: 0;
                font-size: 18px;
  
                &.icon-price{
                  width: 20%;
                  background: #c5c5c5;
                  color: #fff;
                  right: -20%;
                }
                &.icon-refuse{
                  width: 40%;
                  background: linear-gradient(to right, #DF6158 , #f8b68e);
                  color: #fff;
                  right: -60%;
                }
              }
  
              .category-photo-case{
                width: 64px;
                height: 64px;
                margin-right: 10px;
                //border: solid 2px #999;
                //border-radius: 7px;
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
                    width: 26px;
                    position: absolute;
                    left: 0;
                    top: 3px;
                    border: solid 1px #008de1;
                    border-radius: 2px;
                    height: 15px;
                    color: #008de1;
                    text-align: center;
                    padding: 0;
                    margin: 0;
                    font-size: 10px;
        
                    &.spec-name-no{
                      border-color: #e77c6e;
                      width: auto;
                      padding: 0 1px;
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
                  @include box-hori-left-top;
                  margin: 0 0 6px 0;
                  min-height: 20px;
                  height: auto;
                  padding-left: 40px;
                  position: relative;
                  font-size: 12px;
                  color: #999;
  
                  .price-name{
                    line-height: 14px;
                    width: 34px;
                    position: absolute;
                    left: 0;
                    top: 3px;
                    border: solid 1px #DF6158;
                    border-radius: 2px;
                    height: 16px;
                    color: #fff;
                    background: #DF6158;
                    text-align: center;
                    padding: 0;
                    margin: 0;
    
                    &.spec-name-no{
                      border-color: #e77c6e;
                      width: 110px;
                      color: #e77c6e;
                    }
                  }
                  
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
    }
  }
  
  @keyframes down_arr {
    0%{
      background: #e77c6e;
    }
    50%{
      background: #f8b68e;
    }
    100%{
      background: #e77c6e;
    }
  }
</style>
