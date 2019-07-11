<template>
  <div class="order-search-category-page">
    <normal-header title="搜索品类" :hide="true" />
    <div class="search-body-case" :style="scrollerLinkedStyle">
      <form onsubmit="return false" @submit="searchSubmit" class="search-category-case">
        <span class="iconfont icon-search"></span>
        <input ref="searchIpt" id="searchId" type="search" placeholder="直接输入品类名称进行搜索" class="search-category-ipt" v-model="searchContent" />
        <span v-show="searchContent" class="iconfont icon-close" @tap.stop="clearTxt"></span>
      </form>
    </div>
    <div class="result-case auto-fill">
      <!--历史搜索记录-->
      <div class="history-case" v-if="historySearchs.length > 0">
        <h3 @tap="openOrClose">
          历史品类记录
          <span v-if="historySearchs.length > 0" class="iconfont icon-delete" @tap.stop="clearAllHistory"></span>
          <span class="iconfont" :class="(showHistory) ? 'icon-up-arr' : 'icon-down-arr'"></span>
        </h3>
        <ul class="history-rs-case auto-fill" v-if="showHistory">
          <li v-for="historySearch in historySearchs" class="history-item-case" @tap="choseHistory(historySearch)">
            {{historySearch}}
            <span class="iconfont icon-close"></span>
          </li>
          <li v-if="historySearchs.length == 0" class="no-history">无历史搜索记录</li>
        </ul>
      </div>
      <scroller class="search-scroller" @scrollerHandler="scrollerHandler" :status="status">
        <!--查询结果-->
        <ul class="search-results-case" v-if="searchType == '0'">
          <li v-for="category in categoryResouts.items" class="category-item-case" @tap="setCategory(category)" style="color:#666;">
            {{category.ctname}}
          </li>
        </ul>
      </scroller>
    </div>
  </div>
</template>

<script>
  import service from '@/api/service'
  import config from '../../../../../config/address.js'
  import searchCategoryHeader from '@/components/comm/header/SearchCategoryHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import OrderBo from '@/model/bo/Order'
  import CategoryBo from "@/model/bo/Category"
  import PageResultBo from '@/model/PagedResult'
  import utils from '@/plugins/utils'
  import normalHeader from '@/components/comm/NormalHeader'
  import inputText from '@/components/comm/Input'
  
  export default {
    components: {
      scroller,
      normalLayout,
      searchCategoryHeader,
      normalHeader,
      inputText
    },
    
    created(){
      window.addEventListener('init', (e) => {
        this.init()
      })
      window.addEventListener('hideWin', (e) => {
        this.closeImmediately()
      })
      window.addEventListener('setType', (e) => {
        this.setType(e.detail.type)
      })
      window.addEventListener('setOpenerId', (e) => {
        this.setOpenerId(e.detail.openerId)
      })
    },
    
    data(){
      return {
				searchResouts: new PageResultBo(),
				categoryResouts: new PageResultBo(),
				searchType: '1',  //搜索类型: 0=直接搜索, 1=从询价单, 2=从报价单, 3=求购单
				searchContent: '',
        historySearchs: [],
        showFooter: false,
        showHistory: true,
        scrollerLinkedStyle: {
					height: '50px',
          opacity: 1
        },
        status: '',
        type: 0, //搜索来源，0=编辑品类界面调用搜索、1=临时添加品类界面调用搜索
        openerId: ''  //记录调用搜索窗口的父窗体的id
      }
    },

    mounted(){
			mui.plusReady(() => {
				this.historySearchs = this.getHistorySearchs()
			})
    },
    
    methods: {
      init(){
        this.searchResouts.clear()
        this.showHistory = true
        
        setTimeout(() => {
          utils.openSoftKeyborad('searchId')
        }, 300)
      },
  
      setType(type){
        this.type = type
      },
  
      setOpenerId(openerId){
        this.openerId = openerId
      },

			scrollerHandler(scroller){
        if(scroller.y < -50){
      		Object.assign(this.scrollerLinkedStyle, {
      			height: 0,
            opacity: 0
          })
        }else{
					Object.assign(this.scrollerLinkedStyle, {
						height: '50px',
						opacity: 1
					})
        }
      },
  
      clearTxt(){
        this.searchContent = ''
      },
  
      clearAllHistory(){
        utils.confirm('清除所有历史查询记录', () => {
          utils.setLocalItem('historySearchs', '')
          this.historySearchs = []
          this.showHistory = false
        })
      },
  
      openOrClose(){
        this.showHistory = !this.showHistory
      },
      
      getHistorySearchs(){
        let searchs = utils.getLocalItem('historySearchs')
        return searchs ? searchs.split(',').slice(0, 8) : []
      },
      
      setHistorySearchs(str){
        let searchs = this.getHistorySearchs()
        //防止重复保存历史记录
        if(!(searchs.indexOf(str) > -1)){
          str && searchs.unshift(str)
          utils.setLocalItem('historySearchs', searchs.join(','))
          this.historySearchs = searchs.slice(0, 8)
        }
      },
  
      choseHistory(item){
        this.searchContent = item
        this.searchSubmit()
      },
  
      choseCategory(category){
        category.chose = !category.chose
      },
      
      setCategory(category){
        if(this.openerId == 'goods'){
          mui.fire(plus.webview.getWebviewById(this.openerId), 'setCategory', {
            category
          })
          plus.webview.getWebviewById('searchCateory').hide('pop-out', 300)
        }else{
          console.log(JSON.stringify(category))
          plus.webview.create(config.CDN_ADDRESS + '/categoryDetail', 'categoryDetail', {
            'background': 'transparent'
          }, {
            category,
            flag: 0,
            type: this.type,
            openerId: this.openerId
          })
        }
      },

			searchCancel(){
      	this.searchContent = ''
      },

			showCategory(order){
				service('searchCategory', {}, rs => {
					if(rs.items){
						for(let i=0; i<rs.items.length; i++){
						  let category = new CategoryBo(rs.items[i])
              category.chose = false
							rs.items[i] = category
            }
            this.categoryResouts.setDatas(rs)
						this.searchResouts.items && this.searchResouts.items.forEach(item => {
							item.chose = (order.id == item.id)
						})
          }
        })
      },

      clear(){
      	mui.confirm('清除当前历史搜索记录么？', '请选择', ['否','是'], e => {
      		if(e.index == 1){
      			this.historySearchs.splice(0, 100)
            utils.removeLocalItem('historySearchs')
          }
        })
      },
  
      searchSubmit(){
      	if(this.searchContent == ''){
      		mui.toast('请输入查询内容！')
          return ;
        }
        this.status = '1'
        this.searchType = 0
        this.$refs.searchIpt.blur()
        this.categoryResouts.items.splice(0, 1000)
        service('searchCategory', {
        	name: this.searchContent,
          currPage: this.categoryResouts.currPage,
          pagesize: 20
        }, rs => {
        	let list = rs.items
					list.forEach((category, idx) => {
            let _category = new CategoryBo(category)
						_category.chose = false
            rs.items[idx] = _category
          })
          this.categoryResouts.setDatas(rs)
          if(rs.items.length > 0){
            //this.showHistory = false
            //只有查到结果了, 才记录到历史查询记录中去
						this.setHistorySearchs(this.searchContent)
          }
          this.status = (list.length > 0) ? '2' : '0'
        }, err => {
          this.status = '0'
        })
      },

			searchFromInquiry(){
				service('searchCategoryFromInquiry', {
					userid: utils.getLocalUser().userid
        }, rs => {
					if(rs.items){
						for(let i=0; i<rs.items.length; i++){
							rs.items[i] = new OrderBo(rs.items[i])
            }
						this.searchResouts.setDatas(rs)
          }
				}, true)
      },
  
      searchMore(){
        this.searchResouts.more = false
        let page = this.searchResouts.currPage + 1
        service('searchCategory', {
          currPage: page
        }, rs => {
          this.searchResouts.setDatas(rs, true, page)
        })
      },
  
      choseUser(user){
        user.chose = !user.chose
      },
      
      close(){
        plus.webview.currentWebview().setStyle({
          left: '100%',
          transition: {
            duration: 300
          }
        })
        this.showHistory = true
        window.setTimeout(() => {
          plus.webview.currentWebview().hide('none', 0)
          //this.searchResouts = new PageResultBo()
        }, 350)
      },
      
      closeImmediately(){
        window.removeEventListener('refresh')
        window.removeEventListener('hideWin')
        window.setTimeout(() => {
          plus.webview.currentWebview().hide('fade-out', 200)
          //this.searchResouts = new PageResultBo()
        }, 350)
      }
    },
    
    computed: {
      computeSearchHistorys(){
        let searchs = this.historySearchs
        if(searchs.length % 2 != 0 && searchs.length != 0){
          searchs.push('')
        }
        return searchs
      },
      
      chosedCategory(){
        let arr = []
        this.categoryResouts.items && this.categoryResouts.items.forEach(category => {
          category.chose && (arr.push(category))
        })
        return arr
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .order-search-category-page{
    @include box-vert-left-top;
    background: $normalBgColor;
    position: relative;
    
    .search-body-case{
      height: 0;
      opacity: 0;
      margin-top: 50px;
      position: relative;
      transition: height .4s, opacity .4s;
      
      .search-category-case{
        @include box-hori-left-middle;
        height: 50px;
        padding: 0 10px;
        position: relative;

        .icon-search{
          @include box-vert-center-middle;
          position: absolute;
          height: 50px;
          width: 32px;
          color: #333;
          font-size: 16px;
          top: 1px;
        }
        
        .search-category-ipt{
          height: 32px;
          width: 100%;
          border-radius: 3px;
          background: rgba(255, 255, 255, 1);
          text-align: left;
          padding: 0 10px 0 30px;
  
          &::-webkit-input-placeholder{
            font-size: 14px;
            color: $textLessColor;
          }
        }
        
        .icon-close{
          text-align: left;
          padding-right: 3px;
          font-size: 24px;
          line-height: 20px;
          width: 18px;
          height: 18px;
          border-radius: 21px;
          //background: linear-gradient(to right, rgba(231, 124, 110, .8), rgba(248, 182, 142, .6));
          position: absolute;
          right: 24px;
          color: #999;
          top: 16px;
        }
      }
    }
    
    .result-case{
      @include box-vert-left-top;
      background: #f1f1f1;
      position: relative;
      //padding-bottom: 10px;

      .chose-btn-case{
        @include box-hori-center-middle;
        height: 100px;
        background: #fff;
        //border-radius: 0 0 400px 400px/0 0 40px 40px;

        .chose-cell{
          @include box-vert-center-top;
          width: 33.33%;
          text-align: center;
          position: relative;
          overflow: visible;

          .iconfont{
            margin-top: 14px;
            width: 50px;
            height: 50px;
            border-radius: 70px;
            line-height: 48px;
            position: relative;
            font-size: 32px;

            &.chose-true{
              background: #E26660;
              color: #eee;
            }
            &.chose-false{
              background: rgba(0, 0, 0, .075);
              color: #999;
            }

            label{
              width: 80px;
              position: absolute;
              left: 50%;
              top: 40px;
              margin: 0 0 0 -40px;
              font-size: 12px;
              height: 45px;
              //font-weight: bold;

              &.chose-true{
                color: #666;
                border-bottom: solid 3px #CE7369;
              }
              &.chose-false{
                color: #9e9e9e;
                border-bottom: solid 3px transparent;
              }
            }
          }
        }
      }

      .history-case{
        @include box-vert-left-top;
        background: rgba(255, 255, 255, 1);
        height: auto;
        padding: 15px 0 3px 0;
        overflow: hidden;
        //margin-bottom: 10px;

        h3{
          height: 28px;
          position: relative;
          padding: 0 10px;
          color: #666;

          .iconfont{
            position: absolute;
            font-size: 18px;
            top: 0;
            right: 10px;

            &.icon-delete{
              width: 16px;
              left: 100px;
              height: 25px;
              line-height: 14px;
              color: #DF6158;
            }
          }
        }

        .history-rs-case{
          padding: 5px 10px 3px;
          overflow: hidden;
          border-top: solid 1px #f1f1f1;

          .no-history{
            @include box-hori-center-middle;
            height: 50px;
            color: #999;
            width: 100%;
            font-size: 16px;
          }

          .history-item-case{
            display: block;
            float: left;
            width: auto;
            height: 22px;
            background: rgba(0, 0, 0, .08);
            border-radius: 5px;
            color: #666;
            padding: 0 32px 0 8px;
            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 8px;
            position: relative;
            
            .icon-close{
              @include box-vert-left-middle;
              width: 24px;
              height: 22px;
              font-size: 18px;
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }

      .search-scroller{
        position: relative;
        overflow: hidden;
        margin-top: 10px;
        //background: rgba(0, 0, 0, .03);

        .search-results-case{
          @include box-vert-left-top;
          height: auto;

          .inquiry-item-case{
            height: auto;
            background: #fff;
            padding-left: 12px;
            overflow: hidden;
            margin-bottom: 1px;

            .xjd-item-inner-case{
              @include box-vert-left-middle;
              width: 100%;
              height: 64px;
              padding-right: 10px;
              position: relative;

              &:first-child{
                border-top: none;
              }

              .title-case{
                position: relative;
                width: auto;
                font-size: 18px;
                color: #454545;
                padding: 2px 0;
                height: 64px;
                line-height: 36px;

                .msg{
                  width: 100%;
                  height: auto;
                  font-size: 12px;
                  color: #787878;
                  white-space: nowrap;
                  font-style: normal;
                  left: 0;
                  position: absolute;
                  top: 30px;
                }
              }

              .date-case{
                @include box-hori-left-middle;
                position: absolute;
                width: 100px;
                height: 36px;
                color: #ffb000;
                border-left: solid 1px #dedede;
                line-height: 36px;
                font-size: 24px;
                right: 20px;
                padding-left: 10px;
                top: 14px;
                
                .unit{
                  color: #999;
                  font-size: 14px;
                  padding: 3px 0 0 3px;
                }
              }

              .icon-down-arr{
                line-height: 64px;
                height: 64px;
                width: 16px;
                font-size: 24px;
                position: absolute;
                right: 10px;
                color: #999;
                top: 0;
              }
            }

            .category-case{
              @include box-vert-left-top;
              padding-left: 32px;

              .category-item-case{
                @include box-hori-left-middle;
                height: 40px;
                border-bottom: solid 1px #eee;
                position: relative;
                color: #333;

                &:first-child{
                  border-top: solid 1px #eee;
                }
                &:last-child{
                  border: none;
                }
                &:active{
                  background: rgba(0, 0, 0, .05);
                }

                .category-title{
                  height: auto;
                  font-size: 16px;
                  color: #666;
                  padding: 0 10px 0 0;
                }
                
                .category-num{
                  width: auto;
                  position: absolute;
                  height: 40px;
                  line-height: 40px;
                  text-align: right;
                  right: 25px;
                  font-size: 14px;
                  color: #b1b1b1;
                }
              }
            }
          }

          .category-item-case{
            @include box-hori-left-middle;
            height: 40px;
            padding: 0 10px 0 12px;
            margin-bottom: 1px;
            background: #fff;
            position: relative;
            font-size: 16px;
            color: #333;

            &:active{
              background: #f7f7f7;
            }
          }

          .check-case{
            @include box-vert-center-middle;
            width: 50px;
            height: 40px;

            .chose-category{
              width: 18px;
              height: 18px;
              line-height: 18px;
              text-align: center;
              border-radius: 18px;
              border: solid 1px #ccc;

              &.chose-category-true{
                background: #E87A6D;
                border: solid 1px #E87A6D;
                color: #fff;
              }
              &.chose-category-false{
                color: #fff;
              }
            }
          }

          .icon-right-arr{
            width: 20px;
            position: absolute;
            height: 40px;
            line-height: 40px;
            right: 5px;
            font-size: 20px;
            color: #999;
            top: 0;
          }
        }
        
        .no-result{
          @include box-vert-center-top;
          padding-top: 50px;
          opacity: .75;
          
          .ring-case{
            @include box-vert-center-middle;
            position: relative;
            width: 60px;
            background: #fff;
            height: 60px;
            border: solid 8px #999;
            border-radius: 80px;
            
            .ring-inner-case{
              width: 30px;
              height: 30px;
              border-radius: 0 50px 50px 50px;
              border: solid 10px #74baf3;
              animation: no-data-circle 1s linear infinite;
            }
            
            label{
              text-align: center;
              position: absolute;
              top: 60px;
              width: 200px;
              font-size: 12px;
              white-space: nowrap;
              left: 50%;
              color: #666;
              margin-left: -100px;
            }
          }
          
          .icon-nodata3{
            @include box-vert-center-middle;
            width: 128px;
            height: 128px;
            border-radius: 128px;
            //background: rgba(116, 186, 243, .2);
            //border: solid 8px rgba(0, 0, 0, .06);
            font-size: 54px;
            color: #bbb;
            position: relative;
            
            label{
              text-align: center;
              width: 300px;
              height: auto;
              position: absolute;
              left: 50%;
              top: 115px;
              margin-left: -150px;
              font-size: 16px;
              color: #787878;
            }
          }
        }
      }
    }
    
    .search-category-footer{
      @include box-vert-center-middle;
      position: fixed;
      bottom: 0;
      left: 0;
      height: 50px;
      background: #f1f1f1;
  
      .icon-check{
        @include box-hori-center-middle;
        border-radius: 400px 400px 0 0/60px 60px 0 0;
        height: 50px;
        width: 100%;
        color: #999;
        font-size: 32px;
        padding: 2px 0 0 0;
        transition: background .6s;
    
        label{
          font-size: 16px;
          padding-left: 5px;
        }
        
        &.search-category-footer-false{
          background: #ccc;
        }
        &.search-category-footer-true{
          background: #ffd100;
    
          &.icon-check{
            color: #343434;
      
            label{
              font-size: 16px;
              padding-left: 5px;
            }
          }
        }
        
      }
    }
  }
  
  @keyframes no-data-circle {
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
