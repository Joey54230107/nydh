<template>
  <normal-layout class="categorys-page" :loaded="loaded">
    <good-detail-header title="发货单详情" @newCategory="newCategory" />
    <!--<hori-scroller class="pageframe-case" :resource="pages" filter="true" @handler="searchGoods" @openFilter="openFilter" />-->

    <div class="orders-case">
      <div v-if="categorys.length == 0 && nodata" class="p-empty-data-case">
        <span class="icon-case iconfont icon-nodata2"></span>
        <h2>没有查询到任何报价单</h2>
        <h3>您可以试试 <a @tap="createOrder">创建一张报价单</a> 吧 ^_^</h3>
        <div class="other-way-case auto-fill">
          <div class="inner-case">
            <h4><span class="iconfont icon-stars"></span> 或者您也可以从下面的应用中转化成报价单</h4>
            <ul class="auto-fill">
              <li class="way-icon-case iconfont icon-business" @tap="business"><label>生意圈</label></li>
              <li class="way-icon-case iconfont icon-xjd"><label>求购信息</label></li>
              <li class="way-icon-case iconfont icon-bjd"><label>报价信息</label></li>
            </ul>
          </div>
        </div>
      </div>

      <scroller class="categorys-inner-case" v-if="categorys.length > 0">
        <div class="category-inner">
          <div class="category-block-case" v-for="category in categorys">
            <div class="category-blocker" @tap="detail(category)">
              <div class="user-photos-case">
                <photos :urls="category.users" />
              </div>
              <h2><span>¥</span>{{category.total | price}}</h2>
              <h3 class="title">{{category.ctname}}</h3>
              <h4 class="sub-title">共{{category.suppcount}}位供应商</h4>
            </div>
          </div>
        </div>
      </scroller>
    </div>
    
    <footer class="submit-case">发布发货单</footer>
  </normal-layout>
</template>

<script>
  import config from '../../../../../config/address.js'
  import goodDetailHeader from '@/components/comm/header/GoodDetailHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import horiScroller from '@/components/comm/HoriScroller'
  import service from '@/api/service'
  import utils from '@/plugins/utils'
  import orderInnerList from '@/components/pages/my/offer/OrderInnerList'
	import UserBo from '@/model/bo/User'
  import imageLoader from '@/components/comm/ImageLoader'
  import photos from '@/components/comm/Photos'
  
  export default {
    components: {
      scroller,
      normalLayout,
      goodDetailHeader,
			horiScroller,
			orderInnerList,
      imageLoader,
			photos
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
				loadStyle: {
					top: 0,
					opacity: 1
				}
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				let searchWin = plus.webview.getWebviewById('searchCateory')
				utils.masker()
				plus.webview.show('myGoodDetail', 'pop-in', 200, () => {
					this.search()
				})
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
			  this.searchPage && this.searchPage.show('pop-in', 200)
      },

			search(){
			  let user = utils.getLocalUser(), groupid = plus.webview.currentWebview().groupid || ''
				service('getMyGoodDetail', {
          groupid: groupid
        }, rs => {
				  rs.items && rs.items.forEach(item => {
				    let suppliers = item.suppliers ? item.suppliers.split(',') : []
            item.users = []
            suppliers.forEach(supplier => {
              item.users.push(new UserBo({
                url: supplier.split(';')[0],
                isrealname: supplier.split(';')[1],
                sex: supplier.split(';')[3],
                userid: supplier.split(';')[4]
              }))
            })
          })
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
    
    .pageframe-case{
      @include box-hori-left-middle;
      position: absolute;
      z-index: 500;
      overflow: hidden;
      margin-top: 50px;
      background: #fff;
      //box-shadow: 0 3px 10px rgba(0, 0, 0, .1);
      
      .page-item{
        @include box-vert-center-middle;
        width: 50%;
        height: 32px;
        font-size: 14px;
        text-align: center;
        
        .state{
          width: auto;
          padding: 0 8px;
          height: 32px;
          line-height: 30px;
          border-bottom: solid 4px transparent;
          color: #787878;
          transition: border .4s;
          
          &.state-true{
            color: #e77c6e;
            border-bottom: solid 4px rgba(255, 80, 0, .6);
          }
        }
      }
    }

    .orders-case{
      @include box-vert-left-top;
      overflow: hidden;
      padding-top: 50px;
      height: 100%;

      .p-empty-data-case{
        @include box-vert-center-top;
        height: 100%;
        text-align: center;
        color: #343434;
        overflow: hidden;

        .icon-case{
          @include box-vert-center-middle;
          width: 120px;
          margin-top: 50px;
          height: 120px;
          border-radius: 160px;
          font-size: 100px;
          padding-left: 20px;
          //color: rgba(0, 0, 0, .4);
          color: #DF6158;
        }

        h2{
          height: auto;
          margin-top: 36px;
          width: 100%;
          font-size: 18px;
        }

        h3{
          height: auto;
          margin-top: 10px;
          width: 100%;
          color: #787878;
          font-size: 14px;

          a{
            color: #529CD8;
            font-size: 16px;
            text-decoration: underline;
          }
        }

        .other-way-case{
          @include box-vert-center-bottom;
          //padding: 8px 8px 10px;

          .inner-case{
            @include box-vert-center-top;
            height: 110px;
            //border-radius: 15px;
            //background: rgba(116, 186, 243, 1);
            background: rgba(13, 171, 255, .3);
            padding-top: 8px;

            h4{
              @include box-hori-center-top;
              height: 24px;
              font-size: 14px;
              color: #333;

              span{
                color: #e77c6e;
                width: auto;
                height: auto;
                font-size: 14px;
                margin-right: 5px;
              }
            }

            ul{
              @include box-hori-center-top;
              padding: 1px 40px 0;
              justify-content: space-between;

              .way-icon-case{
                width: 50px;
                height: 50px;
                line-height: 50px;
                border-radius: 64px;
                color: #fff;
                position: relative;
                overflow: visible;

                label{
                  position: absolute;
                  top: 56px;
                  height: 15px;
                  line-height: 16px;
                  left: 50%;
                  color: #333;
                  width: 50px;
                  margin-left: -25px;
                  font-size: 10px;
                  border-radius: 20px;
                  //background: rgba(255, 255, 255, .5);
                }

                &.icon-business{
                  background: #fff;
                  font-size: 36px;
                  color: #74baf3;
                }
                &.icon-xjd{
                  background: #fff;
                  font-size: 32px;
                  color: #e77c6e;
                }
                &.icon-bjd{
                  background: #fff;
                  font-size: 36px;
                  color: #ffb000;
                }
              }
            }
          }
        }
      }

      .categorys-inner-case{
        width: 100%;
        position: relative;
        overflow: hidden;
        margin-top: 10px;

        .category-inner{
          @include box-hori-left-top;
          width: 100%;
          padding: 0 10px;
          height: auto;

          .category-block-case{
            @include box-hori-left-top;
            height: 160px;
            width: 50%;

            .category-blocker{
              @include box-vert-center-top;
              width: 100%;
              height: 100%;
              background: rgba(255, 255, 255, .8);
              position: relative;
              padding-bottom: 55px;

              &:active{
                background: #fff;
              }
              
              .user-photos-case{
                width: 80px;
                height: 80px;
              }
              
              h2{
                @include box-hori-center-middle;
                height: 20px;
                color: #DF6158;
                font-size: 18px;
                
                span{
                  padding-top: 3px;
                  font-size: 14px;
                }
              }
              
              h3.title{
                @include box-hori-center-middle;
                width: 100%;
                height: 30px;
                color: #333;
                position: absolute;
                bottom: 25px;
                left: 0;
                font-size: 16px;
              }
              
              h4.sub-title{
                @include box-hori-center-top;
                width: 100%;
                height: 25px;
                color: #999;
                position: absolute;
                bottom: 0;
                left: 0;
                font-size: 12px;
              }
            }

            &:nth-child(odd){
              padding-right: 5px;
            }
            &:nth-child(even){
              padding-left: 5px;
            }
          }
        }
      }
    }
  }
</style>
