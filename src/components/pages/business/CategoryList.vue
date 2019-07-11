<template>
  <div id="businessCategoryListContainer">
    <div class="category-list-case">
      <div class="iconfont icon-down-arr2" @tap="close"></div>
      <scroller class="category-scroller auto-fill" @setScroller="setScroller">
        <ul class="category-inner-list-case">
          <li v-for="category in categorys" class="category-item-case">
            <image-loader class="category-photo-case" :src="category.url" @tapHandler="choseImg(category)">
              <span class="image-check iconfont icon-check" :class="'icon-check-' + category.chose2"></span>
            </image-loader>
            <div class="category-info-case auto-fill">
              <h3>{{category.ctname}}</h3>
              <h4>需要数量 {{category.amount}} 株、{{category.taked == 0 ? '当前尚无人报价' : '已有' + category.taked + '人报价'}}</h4>
              <ul class="spec-case">
                <span class="spec-name">规格</span>
                <li v-for="spec in category.specs" class="spec-item">
                  {{spec.name}}: {{(spec.max && spec.min) ? (spec.min + '米 至 ' + spec.max + '米') : ((spec.max || spec.min) + '米')}}
                </li>
              </ul>
              <div class="price-case">
                <div class="price-ipt-case">
                  <span class="closer iconfont icon-wrong" v-if="category.amount2" @tap.stop="closeIpt(category, 'amount2')"></span>
                  <input type="tel" class="ipt" placeholder="数量" onclick="this.select()" @keyup="calTotal(category)" v-model="category.amount2" /> 株
                </div>
                <div class="price-ipt-case">
                  <span class="closer iconfont icon-wrong" v-if="category.price" @tap.stop="closeIpt(category, 'price')"></span>
                  <input type="text" class="ipt" placeholder="单价" onclick="this.select()" @keyup="calTotal(category)" v-model="category.price" /> 元
                </div>
                <div class="price-ipt-case">
                  <span class="closer iconfont icon-wrong" v-if="category.total" @tap.stop="closeIpt(category, 'total')"></span>
                  <input type="text" class="ipt" placeholder="总价" v-model="category.total" /> 元
                </div>
                <!--<div v-if="category.chose" class="teacher-case iconfont icon-zone">查看地区指导价</div>-->
              </div>
            </div>
          </li>
        </ul>
      </scroller>
    </div>
    <footer class="footer-case">
      <div class="submit-btn auto-fill">
        <div class="user-info auto-fill">
          <image-loader class="user-photo-case" :src="order.user.url" :defaultCls="'photo-' + ((order.user.sex == '025001') ? 'man' : 'woman') + '-case'" />
          <span class="user-oper-case iconfont icon-phone"></span>
          <!--<span class="user-oper-case iconfont icon-sms"></span>-->
          <div class="user-name-case auto-fill">
            {{order.user.name}}
          </div>
        </div>
        <div class="iconfont icon-check" @tap="save">&nbsp;<span>接单</span></div>
      </div>
    </footer>
	</div>
</template>

<script>
	import config from '../../../../config/address.js'
	import imageLoader from '@/components/comm/ImageLoader'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import OrderBo from '@/model/bo/Order'
  import CategoryBo from '@/model/bo/Category'
  import scroller from '@/components/comm/Scroller'
  import timeCounter from '@/components/comm/TimeCounter'

	export default {
	  components: {
      scroller,
      imageLoader,
      timeCounter
    },
    
		data(){
			return {
				order: {
				  user: {}
        },
        curpage: 1,
        categorys: [],
        latestime: '',
        params: null
			}
		},

		mounted(){
			mui.plusReady(() => {
				utils.masker()
				plus.webview.show('businessOrderCategoryList', 'slide-in-bottom', 300)
				let order = plus.webview.currentWebview().order
				this.init(order)
			})
		},

		methods: {
      init(order){
        let user = utils.getLocalUser()
        this.order = order
        this.search(user, order.orderid)
        this.latestime = order.latestime
      },

			choseImg(category){
      	category.chose2 = !category.chose2
      },

			choseAll(isAll){
				this.categorys && this.categorys.forEach(category => {
					category.chose2 = !!isAll
        })
      },
      
      save(){
        let user = utils.getLocalUser()
        if(!this.params){
          this.params = {
            uuid: utils.getUuid(),
            paytype: '013001',
            orderid: this.order.orderid,
            userid: user.userid,
            cityid: user.cityid,
            items: []
          }
        }
        this.categorys.forEach(category => {
          if(category.chose2){
            this.params.items.push({
              itemid: category.id,
              amount: category.amount2,
              total: category.total,
              price: category.price,
              ptype: '034001',
              allotid: category.allotid,
              uuid: category.uuid
            })
          }
        })
        service('saveOrderTakes', this.params, rs => {
          mui.toast('保存成功，请继续操作')
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
      
      search(user, orderid){
        service('businessCategoryList', {
          userid: user.userid || 0,
          orderid,
          curpage: this.curpage
        }, rs => {
          console.log(this.categorys.length)
          console.log(JSON.stringify(rs))
          rs.items && rs.items.forEach((category, idx) => {
          	let _category = new CategoryBo(category)
            _category.price = ''
            _category.total = ''
						_category.amount2 = _category.amount
            _category.chose2 = true
            _category.uuid = utils.getUuid()
						CategoryBo.setSpecs.call(_category, category.specs)
            this.categorys.push(_category)
          })
        })
      },
      
      setScroller(){},
      
      close(){
        plus.webview.currentWebview().close('slide-out-bottom', 200)
      },
      
      setPrice(category){
        category.chose = !category.chose
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
      background: #e8e8e8;
      //border-radius: 300px 300px 0 0/30px 30px 0 0;
      border-radius: 12px 12px 0 0;

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
          margin-right: 6px;
        }
      }

      .icon-down-arr2{
        @include box-vert-center-top;
        height: 32px;
        font-size: 24px;
        line-height: 36px;
        color: #666;
        width: auto;
        //animation: down_arr 2s infinite;
      }
      
      .category-scroller{
        position: relative;
        padding-bottom: 50px;
        overflow: hidden;
        //background: #fff;
        
        .category-inner-list-case{
          @include box-vert-left-top;
          //padding-left: 12px;
          padding: 0 0 8px 0;
          
          .category-item-case{
            @include box-hori-left-top;
            height: auto;
            //border-bottom: solid 1px rgba(0, 0, 0, .1);
            padding: 10px 0 10px 8px;
            background: #fff;
            //border-radius: 7px;
            margin-bottom: 8px;
            
            .category-photo-case{
              width: 72px;
              height: 72px;
              margin-right: 10px;
              border: solid 1px #666;
              
              .image-check{
                text-align: center;
                padding: 4px 0 0 5px;
                position: absolute;
                color: transparent;
                right: 0;
                bottom: 0;
                width: 24px;
                height: 24px;
                border-radius: 24px 0 0 0;
                background: rgba(0, 0, 0, .6);
              }
              
              .icon-check-true{
                color: #fff;
              }
            }
            .category-info-case{
              @include box-vert-left-top;
              height: auto;
              padding-right: 15px;
              
              h3{
                margin: 0;
                font-weight: bold;
                font-size: 16px;
                padding: 2px 0 3px 0;
              }
              
              h4{
                margin: 0;
                font-size: 14px;
                color: #787878;
                padding: 6px 0 3px 0;
              }

              .spec-case{
                @include box-hori-left-top;
                margin: 0 0 6px 0;
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
                  border-radius: 5px;
                  height: 16px;
                  color: #74baf3;
                  text-align: center;
                  padding: 0;
                  margin: 0;
                }

                .spec-item{
                  @include box-hori-left-middle;
                  width: 100%;
                  height: 20px;
                }
              }
              
              .price-case{
                @include box-vert-left-top;
                width: 100%;
                height: auto;
                padding: 0 10px 0 10px;
                position: relative;
              }
  
              .price-ipt-case{
                @include box-hori-left-middle;
                height: 30px;
                width: auto;
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
                  width: 180px;
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
      background: #fff;
      box-shadow: 0 -1px 10px rgba(0, 0, 0, .4);

      .submit-btn{
        //background: #008DE0;
        @include box-hori-left-middle;
        height: 50px;
        font-size: 16px;
        padding: 0 0 0 10px;

        .user-info{
          @include box-hori-left-middle;
          height: 50px;
          color: #999;

          .user-photo-case{
            width: 36px;
            height: 36px;
            border-radius: 36px;
            border: solid 1px #ccc;
            overflow: hidden;
          }

          .user-oper-case{
            text-align: center;
            line-height: 34px;
            width: 36px;
            font-size: 18px;
            height: 36px;
            margin: 0 0 0 8px;
            border-radius: 36px;
            border: solid 1px #ccc;
            overflow: hidden;
          }

          .user-name-case{
            @include box-vert-left-middle;
            height: 100%;
            font-size: 18px;
            color: #666;
            padding-left: 8px;
          }
        }

        .photo-man-case{
          background: url("../../../assets/img/man.png") center center/cover no-repeat;
        }
        .photo-woman-case{
          background: url("../../../assets/img/woman.png") center center/cover no-repeat;
        }

        &:active{
          opacity: .8;
        }
      }
      
      .icon-check{
        @include box-hori-center-middle;
        width: auto;
        padding: 0 15px;
        //border-radius: 7px;
        height: 50px;
        background: #008de1;
        font-size: 16px;
        text-decoration: none;

        span{
          font-size: 14px;
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
