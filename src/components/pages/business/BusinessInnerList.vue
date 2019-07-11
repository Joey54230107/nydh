<template>
  <div id="orderInnerListContainer" class="mui-content mui-scroll-wrapper page">
    <span class="search-pointer">今天</span>
    <span class="search-pointer" style="bottom: 150px;">周</span>
    <span class="search-pointer" style="bottom: 100px;">月</span>

    <ul class="mui-scroll auto-fill">
      <h3 class="total-report">生意圈中共有{{count}}张报价单</h3>
      <li class="order-item-case" v-for="order in orders" @tap="more(order)">
        <div class="sys-user">
          <image-loader :src="order.user.url" class="photo-case" :defaultCls="'photo-' + ((order.user.sex == '025001') ? 'man' : 'woman') + '-case'" />
          <span class="iconfont icon-vip"></span>
          <span class="user-name">{{order.user.name}}</span>
        </div>
        <div class="info-pop auto-fill">
          <i></i>
          <span class="iconfont icon-order">
            <label class="order-title">{{order.title}}</label>
          </span>
          <time class="date">发布日期：{{order.createtime}}</time>
          <time class="date" style="margin-bottom: 3px;">离过期还有：<time-counter :time="order.latestime" /></time>
          <label class="amount">该报价单下共有{{order.itemcount}}种品类</label>
          <ul class="category-list-case">
            <li class="category-item-case" v-for="category in order.categorys">
              <span class="cate-photo">
                <ring percent=".32" bgColor="rgba(0, 0, 0, .1)" size="6" color="#e77c6e" width="50" height="50">
                  <label class="num">{{category.taked}}<a>人</a></label>
                </ring>
              </span>
              <div class="cate-info auto-fill">
                <h3>{{category.ctname}}</h3>
                <h4>需{{category.limit}}位供应商、{{category.taked == 0 ? '尚无人接单' : '已有' + category.taked + '人接单'}}</h4>
              </div>
            </li>
            <li class="more-case" v-if="order.itemcount > 3" @tap.stop="all(order)">
              <span class="iconfont icon-down-arr3"></span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
	</div>
</template>

<script>
	import config from '../../../../config/address.js'
	import normalLayout from '@/components/layout/Layout'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import OrderBo from '@/model/bo/Order'
  import UserBo from '@/model/bo/User'
  import CategoryBo from '@/model/bo/Category'
  import ring from '@/components/comm/Ring'
  import timeCounter from '@/components/comm/TimeCounter'
  import imageLoader from '@/components/comm/ImageLoader'

	export default {
		components: {
			normalLayout,
      ring,
      timeCounter,
      imageLoader
		},
    
    created(){
      mui.init({
        pullRefresh: {
          container: '#orderInnerListContainer',
          down: {
            callback: this.searchOrders
          }
        }
      })
  
      window.addEventListener('init', (e) => {
        this.init(e.detail.state)
      })
    },

		data(){
			return {
        loaded: true,
        curpage: 1,
        pagesize: 10,
        count: 0,
        orders: []
			}
		},

		methods: {
      searchOrders(){
        this.search(() => {
          mui('#orderInnerListContainer').pullRefresh().endPulldownToRefresh()
        })
      },
      
      init(){
        this.search()
      },
      
      search(callback){
        this.orders = []
        let user = utils.getLocalUser(), geolocation = utils.getLocalItem('geolocation')
        geolocation && (geolocation = JSON.parse(geolocation))
        service('businessList', {
          userid: user.userid || '0',
          province: geolocation.province,
          city: geolocation.city,
          curpage: this.curpage,
          pagesize: this.pagesize
        }, rs => {
          this.count = rs.count
          rs.items && rs.items.forEach(item => {
            let categorys = [], order = new OrderBo(item)
            order.user = new UserBo(item.owner)
            item.items && item.items.forEach(category => {
              categorys.push(new CategoryBo(category))
            })
            order.categorys = categorys
            this.orders.push(order)
          })
          callback && callback()
        })
      },
      
      all(order){
        let user = utils.getLocalUser(), geolocation = utils.getLocalItem('geolocation')
        geolocation && (geolocation = JSON.parse(geolocation))
        service('businessCategoryList', {
          userid: user.userid || 0,
          orderid: order.orderid,
          curpage: '1',
          pagesize: order.itemcount
        }, rs => {
          rs.items && rs.items.forEach((category, idx) => {
            order.categorys.push(new CategoryBo(category))
          })
        })
      },
      
      more(order){
        utils.masker(true)
        plus.webview.create(config.CDN_ADDRESS + '/businessOrderCategoryList', 'businessOrderCategoryList', {}, {order})
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
	@import '@/assets/style/main.scss';
  
  .mui-pull-loading{
    margin-top: 21px;
  }
  .mui-pull-caption{
    font-weight: normal;
    font-size: 14px;
  }
  .mui-pull{
    overflow: visible;
  }
  .mui-pull-top-pocket, .mui-pull-bottom-pocket{
    height: 70px;
  }
  .mui-pull-caption{
    margin-top: 3px;
  }
  
  #orderInnerListContainer{
    @include box-vert-left-top;
    height: auto;
    overflow: visible;
    background: #e9e9e9;

    .mui-scroll{
      @include box-vert-center-top;
      padding-top: 5px;
      
      .total-report{
        @include box-hori-center-middle;
        height: 22px;
        width: auto;
        background: #74baf3;
        font-size: 12px;
        color: #fff;
        padding: 0 12px;
        border-radius: 20px;
      }
    }

    .search-pointer{
      @include box-hori-center-middle;
      position: fixed;
      width: 40px;
      height: 40px;
      color: #fff;
      background: rgba(0, 0, 0, .7);
      opacity: .8;
      font-size: 12px;
      right: 6px;
      bottom: 200px;
      z-index: 500;
      border-radius: 50px;
      border: solid 3px #aaa;

      &:active{
        opacity: 1;
      }
    }
    
    .order-item-case{
      @include box-hori-left-top;
      height: auto;
      padding: 10px;
      
      .sys-user{
        position: relative;
        margin-top: 4px;
        width: 50px;
        height: 50px;
        font-size: 12px;
        text-align: center;
        color: #666;
        
        .photo-case{
          width: 50px;
          height: 50px;
          border-radius: 0 50px 50px 50px;
          overflow: hidden;
          padding: 1px;
          border: solid 1px #fff;
        }
        
        .user-name{
          overflow: hidden;
          width: 50px;
          height: auto;
          position: absolute;
          top: 56px;
          left: 0;
          color: #666;
          text-align: center;
          line-height: 16px;
        }

        .icon-vip{
          width: 16px;
          height: 16px;
          color: #333;
          font-size: 12px;
          position: absolute;
          left: -2px;
          top: -4px;
        }
      }

      .photo-man-case{
        background: url("../../../assets/img/man.png") center center/cover no-repeat;
      }
      .photo-woman-case{
        background: url("../../../assets/img/woman.png") center center/cover no-repeat;
      }
      
      .info-pop{
        margin-left: 12px;
        height: auto;
        background: #fff;
        border-radius: 15px;
        position: relative;
        padding: 8px 0 8px 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .05);
        
        i{
          width: 0;
          height: 0;
          border: solid 10px transparent;
          border-right-color: #fff;
          position: absolute;
          top: 15px;
          left: -18px;
        }
        
        .date{
          @include box-hori-left-middle;
          width: 100%;
          color: #666;
          
          time{
            color: #e77c6e;
            font-size: 16px;
          }
        }

        .icon-order{
          color: #008DE0;

          .order-title{
            margin-left: 4px;
          }
        }
        
        .amount{
          color: #787878;
          background: #e6e6e6;
          border-radius: 5px;
          padding: 2px 7px;
          font-size: 12px;
        }
        
        .category-list-case{
          @include box-vert-left-top;
          //flex-wrap: wrap;
          margin-top: 6px;
          
          .category-item-case{
            @include box-hori-left-middle;
            width: 100%;
            border-top: solid 1px rgba(0, 0, 0, .07);
            height: auto;
            overflow: hidden;
            background-size: cover;
            padding: 6px 0 6px 2px;
            
            .cate-photo{
              width: 50px;
              height: 50px;
              //border-radius: 8px;
              position: relative;
              
              .num{
                @include box-hori-center-bottom;
                position: absolute;
                width: 50px;
                height: 20px;
                color: #666;
                top: 15px;
                left: 0;
                text-align: center;
                white-space: nowrap;
                font-size: 18px;
                
                a{
                  color: #999;
                  height: 20px;
                  line-height: 24px;
                  font-size: 10px;
                }
              }
            }
            
            .cate-info{
              @include box-vert-left-top;
              height: 50px;
              padding: 0 6px;
              
              h3{
                color: #333;
                font-weight: bold;
                font-size: 16px;
              }
              
              h4{
                color: #999;
                font-size: 12px;
              }
            }
          }
          
          .more-case{
            @include box-hori-center-middle;
            height: 20px;
            color: #666;

            .icon-down-arr3{
              font-size: 24px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>
