<template>
  <div class="order-detail-category-page">
    <error-pop :msg="errMsg" />
    <div class="masker-left" @tap="hide"></div>
    <div class="masker-right">
      <div class="category-case auto-fill">
        <scroller class="category-scroller auto" @setScroller="setScroller">
          <div class="category-inner-case">
            <div class="category-img" :class="category.url ? '' : 'iconfont icon-image'">
              <header class="category-title">
                <span class="iconfont icon-close" @tap="close"></span>
                {{category.ctname}}
              </header>
            </div>
            <ul class="spec-inner-case" v-if="type == '0'">
              <li class="title">请填写该品类基本信息</li>
              <li class="spec-case">
                <input-text textColor="#fff" type="tel" placeholder="请填写需求品类数量" iptId="firstInput" v-model="category.amount">需求数量：</input-text>
              </li>
              <li class="spec-case">
                <input-text type="tel" textColor="#fff" placeholder="请填写最大限制报价人数" v-model="category.limit">报价人数：</input-text>
              </li>
            </ul>
            
            <ul class="spec-inner-case" v-if="type == '0'">
              <li class="title">隐私设置</li>
              <li class="spec-case spec-left-case" v-for="privacy in privacies" @tap="chosePrivacy(privacy)">
                <span class="chose iconfont icon-check" :class="'chose-' + !!privacy.chose"></span>
                <div class="spec-text">{{privacy.name}}</div>
              </li>
            </ul>
  
            <ul class="spec-inner-case" v-if="type == '1'">
              <li class="title">请填写该品类基本信息</li>
              <li class="spec-case">
                <div class="spec-text"><span>必填</span>需求数量<label>/株</label>：</div>
                <div class="input-case auto-fill">
                  <input type="tel" class="spec-ipt" v-model="category.amount" />
                </div>
              </li>
              <li class="spec-case">
                <div class="spec-text"><span>必填</span>需求单价<label>/元</label>：</div>
                <div class="input-case auto-fill">
                  <input type="tel" class="spec-ipt" v-model="category.price" />
                </div>
              </li>
              <li class="spec-case">
                <div class="spec-text"><span>必填</span>需求总价<label>/元</label>：</div>
                <div class="input-case auto-fill">
                  <input type="tel" class="spec-ipt" v-model="category.total" />
                </div>
                <!--<error-pop class="err-pop" :offset="18">请录入品类数量</error-pop>-->
              </li>
            </ul>
            
            <ul class="spec-inner-case">
              <li class="title">
                <span class="auto-fill">请输入规格</span>
                <button class="blue-btn" @tap="addSpec">添加规格</button>
              </li>
              <li v-for="(spec, idx) in category.specs" class="spec-case2">
                <div class="spec-text" style="font-size: 16px;">
	                <a>
                    {{spec.name}}
                    <span v-if="spec.stand != 1" class="def-spec-tip">自定义</span>
                  </a>
	                <label>/米</label>
                </div>
                <div class="input-case auto-fill" style="margin-top: 3px;">
                  <input type="tel" class="spec-ipt" v-model="spec.min" :placeholder="'最低'" />
                  <span class="spliter"> ～ </span>
                  <input type="tel" class="spec-ipt" v-model="spec.max" :placeholder="'最高'" />
                </div>
  
                <div v-if="spec.stand != 1" class="spec-editor-case">
                  <span class="modify" @tap="modifySpec(spec)">修改</span>
                  <span class="delete" @tap="removeSpec(idx)">删除</span>
                </div>
              </li>
            </ul>
            
            <h2 class="title" v-if="type == '0'">
              <span class="auto-fill">请选择供应商</span>
              <button class="blue-btn" @tap="matching">系统匹配</button>
              <button class="blue-btn" @tap="addFriend">添加</button>
            </h2>
            <ul class="suppliers-inner-case" v-if="type == '0'">
              <li class="suppliers-case" v-if="category.suppliers.length > 0">
                <ul class="supplier-case">
	                <h3 class="tip-case" :style="{'opacity': showTip ? '1' : '0'}">系统为您自动匹配了{{auto_matching}}位供应商</h3>
                  <li class="supplier-item-case" v-for="(supplier, idx) in category.suppliers" :key="idx">
                    <image-loader class="user-photo-case" :src="supplier.user.url" :defaultCls="'photo-' + ((supplier.user.sex == '025001') ? 'man' : 'woman') + '-case'" />
                    <div class="auto-fill supplier-info">
                      <h3>
                        <label>{{supplier.user.isrealname != '005002' ? supplier.user.name : supplier.user.nickname}}</label>
                        <span class="iconfont icon-vip" v-if="supplier.user.isrealname == '1'"></span>
	                      <strong v-if="supplier.autoMatching" class="auto-matching">自动匹配</strong>
                      </h3>
                      <div class="price-info-case auto-fill" v-if="flag == 3">
                        <label>报价：<a>500.00</a>&nbsp;&nbsp;元 (1000株)</label>
                        <label>总报价：<a>5000.00</a>&nbsp;&nbsp;元</label>
                      </div>
                      <div class="amount-case auto-fill" v-if="flag != 3">
                        <input-text textColor="#fff" type="tel" placeholder="请输入分配数" :cancelShow="false" v-model="supplier.amount"></input-text>
                      </div>
                    </div>
	                  <div class="remove-case iconfont icon-close2" @tap.stop="removeSupplier(supplier, idx)"></div>
                  </li>
                </ul>
              </li>
            </ul>
            <h2 class="title">您可以添加最多3张说明图片</h2>
            <div class="category-pics-case">
              <div class="pic-inner-case" v-for="pic in category.imgs">
                <div class="masker-photo iconfont icon-zhaoxiangji" @tap="openMenu(pic)" :style="{'background': 'url(' + pic.path + ') center center/cover no-repeat'}"></div>
              </div>
            </div>
          </div>
        </scroller>
        <footer class="btn-case">
          <button class="comm-btn comm-blue-btn save-btn" @tap.stop="save">&nbsp;{{type == '0' ? '保存该品类' : '确定添加'}}</button>
        </footer>
      </div>
  
      <!--<div class="search-exit-case" v-if="show">
        <button class="red-btn">退出搜索</button>
      </div>-->
    </div>
  
    <masker-dialog :show="isOpen" :size="openType == 'friend' ? (screen_height - 15) : (screen_height * .5)" @closeHandler="closeMasker">
	    <div class="friend-case" v-if="openType == 'friend'">
		    <header class="header-case">
			    <label class="auto-fill">从好友中选择供应商</label>
          <span class="iconfont icon-close closer" @tap.stop="closeMasker"></span>
		    </header>
		    <scroller class="friend-list-case auto-fill">
          <div class="friend-inner-case">
            <div v-for="friend in friends" class="friend-item-case" @tap.stop="choseFriend(friend)">
              <div class="photo-case">
                <image-loader class="user-photo" :src="friend.friend.url" :defaultCls="'photo-' + ((friend.sex == '025001') ? 'man' : 'woman') + '-case'" />
              </div>
              <label class="auto-fill">{{friend.name}}</label>
              <span class="chose iconfont icon-check" :class="'chose-' + friend.chose"></span>
            </div>
          </div>
		    </scroller>
        <footer>
          <span class="chose-save" @tap.self="confirmChose">确定选择</span>
        </footer>
	    </div>

	    <div class="def-spec-case" v-if="openType == 'spec'">
		    <header class="header-case">
			    <label class="auto-fill">自定义规格</label>
			    <span class="iconfont icon-close closer" @tap.stop="closeMasker"></span>
		    </header>
		    <ul class="auto-fill">
			    <li>
            <input-text :must="true" placeholder="请输入规格名称" v-model="defaultSpec.name">规格名称：</input-text>
			    </li>
			    <li>
            <input-text placeholder="请输入最小限制规格" v-model="defaultSpec.min">最小规格：</input-text>
			    </li>
			    <li>
            <input-text placeholder="请输入最大限制规格" v-model="defaultSpec.max">最大规格：</input-text>
			    </li>
		    </ul>
		    <footer>
			    <span @tap="saveSpec" class="save-spec-btn">保存自定义规格</span>
		    </footer>
	    </div>
    </masker-dialog>
  </div>
</template>

<script>
  /*
    flag: 0=新品类、1=品类详情
    type: 0=报价单中编辑品类、 1=临时添加品类信息
  * */
  import service from '@/api/service'
  import config from '../../../../../config/address.js'
  import orderDetailHeader from '@/components/comm/header/OrderDetailHeader'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
  import OrderBo from '@/model/bo/Order'
  import CategoryBo from "@/model/bo/Category"
  import UserBo from '@/model/bo/User'
  import SupplierBo from '@/model/bo/Supplier'
  import PageResultBo from '@/model/PagedResult'
  import utils from '@/plugins/utils'
  import imageLoader from '@/components/comm/ImageLoader'
  import maskerDialog from '@/components/dialog/MaskerDialog'
  import confirmButton from '@/components/comm/ConfirmButton'
  import errorPop from '@/components/comm/ErrorPop'
  import {price, toInt} from '@/plugins/filter/custom.js'
  import inputText from '@/components/comm/Input'
  
  export default {
    created(){
			mui.plusReady(() => {
				plus.webview.getWebviewById('categoryDetail').show('pop-in', 300)
			})
    },
    
    components: {
      scroller,
      normalLayout,
			orderDetailHeader,
      imageLoader,
      maskerDialog,
			confirmButton,
      errorPop,
      inputText
    },
    
    data(){
      return {
        privacies: [
          {name:'仅好友可见', code:'009002', chose:false},
          {name:'所有人可见', code:'009001', chose:true}
        ],
				sctype: null,
      	flag: null,
        category: {
          suppliers: [],
          specs: []
        },
        type: '',
	      defaultSpec: this.createSpec(),
        errs: [],
        screen_height: window.screen.availHeight,
        isOpen: false,
        friends: [],
				showTip: false,
        errMsg: '',
				auto_matching: 0,
				openType: 'friend'  // openType = 'friend|spec'
      }
    },
    
    mounted(){
			mui.plusReady(() => {
				this.setCategory()
				this.getFriends()
				utils.openSoftKeyborad('firstInput')
			})
    },
    
    computed: {
    },
    
    methods: {
      closeMasker(){
      },
      
      hide(){
        plus.webview.currentWebview().close()
      },

			removeSupplier(supplier, idx){
        utils.confirm('确定移除此供应商', () => {
          this.category.suppliers.splice(idx, 1)
          let i = 0
          for(i; i < this.friends.length; i++){
            let friend = this.friends[i]
            if(friend.friend.userid === supplier.user.userid){
              friend.chose = false
              break ;
            }
          }
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
          stand: 2,
          flag: 1 //1=新增、2=修改
        }
      },
  
      modifySpec(spec){
        spec.flag = 2
			  this.openType = 'spec'
			  this.isOpen = true
        this.defaultSpec = spec
      },
      
      removeSpec(idx){
        utils.confirm('确定移除该自定义规格', () => {
          this.category.specs.splice(idx, 1)
          utils.toast('已移除此规格')
        })
      },

			saveSpec(){
        if(!utils.ruleMust(this.defaultSpec.name)){
          utils.toast('规格名称必须填写', 3000, 'FAILED')
          return ;
        }
				let spec = JSON.parse(JSON.stringify(this.defaultSpec))
        if(spec.flag == 1){
          //新增
          this.category.specs.push(spec)
        }else{
          //修改
          this.category.specs && this.category.specs.forEach(_spec => {
            if(_spec.uuid == spec.uuid){
              _spec = Object.assign({}, _spec, spec)
            }
          })
        }
				this.isOpen = false
			},
  
      confirmChose(){
			  let num = 0
        this.friends.forEach(friend => {
          let exist = false, i = 0;
          for(i; i < this.category.suppliers.length; i++){
            let supplier = this.category.suppliers[i]
            if(supplier.user.userid === friend.friend.userid){
              exist = true
              break ;
            }
          }
          friend.chose && (!exist) && (++ num) && this.category.suppliers.push({
            user: {
              userid: friend.friend.userid,
              name: friend.friend.name,
              url: friend.friend.url
            },
            uuid: utils.getUuid(),
            amount: '',
            chose: friend.chose
          })
        })
        if(num > 0){
          this.isOpen = false
        }else{
          utils.toast('请选择至少一位好友', 2000, 'FAILED')
        }
      },
  
      choseFriend(friend){
        friend.chose = !friend.chose
      },
  
      closeMasker(){
        this.isOpen = false
      },
  
      addFriend(){
      	this.openType = 'friend'
        this.isOpen = true
      },

	    addSpec(){
        this.defaultSpec = this.createSpec()
				this.openType = 'spec'
				this.isOpen = true
	    },
     
			/**
			 * 系统自动根据规格,为用户匹配合适的供应商
			 * 注意: 自动匹配的供应商在加入到品类已有的供应商时, 要去重!
			 */
			matching(){
				let user = utils.getLocalUser()
				let params = CategoryBo.matching.call(this.category, user, 1)
				service('sysMatching', params, rs => {
					let friends = rs.friends.items || [], others = rs.stangers.items || [], suppliers = this.category.suppliers
					let arr = [].concat(friends).concat(others)
					this.showTip = true
					this.auto_matching = friends.length + others.length
					setTimeout(() => {
						this.showTip = false
					}, 1000 * 4)

					suppliers.forEach(supplier => {
						supplier.autoMatching = false
					})

					arr.forEach(item => {
						let hasIn = false
						for(let i=0; i<suppliers.length; i++){
							if(suppliers[i].user.userid == item.userid){
								hasIn = true
								suppliers[i].autoMatching = true
								break ;
							}
						}
						if(!hasIn){
							let supplier = new SupplierBo(item)
							supplier.uuid = utils.getUuid()
							supplier.chose = true
							supplier.autoMatching = true
							supplier.amount = ''
							suppliers.push(supplier)
						}
					})

					/*_suppliers.forEach(item => {
					  let supplier = new SupplierBo(item)
            if(this.flag == '1'){
              let chosed = false
              this.category.suppliers.forEach(_supplier => {
                if(_supplier.user.userid == supplier.user.userid){
                  chosed = true
                }
              })
              supplier.chose = chosed
            }
            suppliers.push(supplier)
          })

          this.category.suppliers = suppliers*/
        })
      },
      
      openMenu(img){
        if(mui.os.plus){
          let menus = [
            {title: '拍照'}
          ]
          plus.nativeUI.actionSheet({
            cancel: "取消",
            buttons: menus
          }, ev => {
            if(ev.index == 1){
            	//直接用摄像头拍照,不允许从相册选(版权)
              let url = config.SERVER_ADDRESS + '/upload'
              utils.takePhoto(url, (rs, status) => {
								rs = JSON.parse(rs.responseText)
								if(status == 200){
									let path = config.SERVER_ADDRESS + rs.data.distPath
									utils.loadImage(path, () => {
										img.path = path
                    alert(path)
									})
								}else{
									mui.toast(rs.message)
								}
							})
            }
          })
        }
      },
  
      chosePrivacy(item){
			  this.privacies.forEach(privacy => {
			    privacy.chose = item.name === privacy.name
        })
        this.category.visib = item.code
      },
      
      /*获取我的好友列表（陌生人和黑名单不算）*/
      getFriends(){
        let user = utils.getLocalUser(), arr = []
        service('getFriends', {
          userid: user.userid,
          relation: '1'
        }, users => {
          users && users.forEach(user => {
            user.chose = false
          })
          this.friends = users || []
        })
      },

      setCategory(){
        let win = plus.webview.getWebviewById('categoryDetail')
        let openerId = win.openerId

				let
					flag = win.flag,  //新增还是修改品类
					category = win.category || {},
					specs = JSON.parse(utils.getLocalItem('code_specs') || '[]'),
					type = win.type,
					user = utils.getLocalUser(),
					orderid = win.orderid

				this.type = type
				this.flag = flag
				if(flag == 0){
					//新增品类
					this.category = Object.assign(new CategoryBo(), {
						ctid: category.ctid,
						ctname: category.ctname,
						url: category.url
					})
					CategoryBo.setSpecs.call(this.category, specs)
					this.category.imgs = [{path:''},{path:''},{path:''}]
					setTimeout(() => {
						utils.masker()
						win.show('pop-in', 200)
					}, 200)
				}else{
					//修改品类
					service('orderCategoryDetail', {
						itemid: category.id,
						orderid: orderid,
						userid: user.userid
					}, rs => {
						let _category = new CategoryBo(rs), suppliers = []
						CategoryBo.setSpecs.call(_category, specs)
						rs.allots && rs.allots.forEach(allot => {
							let supplier = new SupplierBo(allot.supplier)
							supplier.uuid = allot.allot.uuid
							supplier.amount = allot.allot.amount
							suppliers.push(supplier)
						})
						_category.suppliers = suppliers
            _category.amount = toInt(_category.amount)
						_category.chose = true
						this.category = _category
						this.$forceUpdate()
					})
				}
      },
  
      setScroller(scroller){
        this.scroller = scroller
      },
      
      choseUser(supplier){
				supplier.chose = !!!supplier.chose
      },
      
      close(tip){
        plus.webview.currentWebview().close('pop-out', 300)
      },
      
      check(){
        if(!utils.ruleMust(this.category.amount)){
          utils.toast('请输入需求数量', 2000, 'FAILED')
          return false
        }
        if(!utils.ruleNumber(this.category.amount)){
          utils.toast('需求数量必须大于0', 2000, 'FAILED')
          return false
        }
        if(this.type != 0){
          if(!utils.ruleMust(this.category.price)){
            utils.toast('请输入品类单价', 2000, 'FAILED')
            return false
          }
          if(!utils.ruleNumber(this.category.price)){
            utils.toast('品类单价必须大于0', 2000, 'FAILED')
            return false
          }
          if(!utils.ruleMust(this.category.total)){
            utils.toast('请输入品类总价', 2000, 'FAILED')
            return false
          }
          if(!utils.ruleNumber(this.category.total)){
            utils.toast('品类总价必须大于0', 2000, 'FAILED')
            return false
          }
        }
        return true
      },

      /*向订单列表中添加一个品类*/
      save(){
        if(!this.check()){
          return ;
        }
        let openerId = plus.webview.getWebviewById('categoryDetail').openerId || 'orderDetail'
        if(this.type == '0'){
          CategoryBo.filterSuppliers.call(this.category)
          CategoryBo.filterSpecs.call(this.category)
          this.category.sctype = this.sctype
          if(this.flag == '0'){
            mui.fire(plus.webview.getWebviewById(openerId), 'addCategory', {
              category: this.category
            })
          }else if(this.flag == '1'){
            mui.fire(plus.webview.getWebviewById(openerId), 'updateCategory', {
              category: this.category
            })
          }
        }else{
          let category = this.category, specs = []
          category && category.specs.forEach(spec => {
            if(spec.min != '' || spec.max != ''){
              specs.push(spec)
            }
          })
          category.specs = specs
          mui.fire(plus.webview.getWebviewById(openerId), 'addCategory', {
            category
          })
        }
        plus.webview.getWebviewById('searchCateory').hide('fade-out', 300)
        this.close()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .order-detail-category-page{
    @include box-hori-left-top;
    background: transparent;
	  overflow: hidden;
    
    .masker-left{
      width: 25%;
      height: 120%;
      background: rgba(0, 0, 0, .5);
      margin: -10% 0 0 -10%;
      box-shadow: -1px 0 10px rgba(0, 0, 0, .8) inset;
    }
    
    .masker-right{
      @include box-vert-left-top;
      position: relative;
      width: 85%;
      height: 100%;
      //background: url("../../../../assets/img/bg03.jpg") top left/100% 100% no-repeat;
      //background: #303d4d;
      background: #666;
    }

    .category-case{
      @include box-vert-left-top;

      .category-scroller{
        position: relative;
        overflow: hidden;
        
        .category-inner-case{
          @include box-vert-left-top;
          height: auto;
          
          .category-img{
            height: 50px;
            width: 100%;
            position: relative;
  
            .category-title{
              font-size: 18px;
              color: #fff;
              text-align: center;
              height: 50px;
              //background: rgba(0, 0, 0, .6);
              background: #333;
              line-height: 50px;
              position: absolute;
              top: 0;
	            font-weight: bold;
              left: 0;
              width: 100%;
              
              .icon-close{
                width: 40px;
                height: 40px;
                position: absolute;
                line-height: 40px;
                text-align: center;
                font-size: 28px;
                color: rgba(255, 255, 255, .6);
                top: 5px;
                right: 0;
              }
            }
          }

          .icon-image{
            position: relative;
            text-align: center;
            line-height: 110px;
            color: rgba(255, 255, 255, .4);
            font-size: 48px;

            label{
              width: 100%;
              text-align: center;
              font-size: 14px;
              position: absolute;
              top: 48px;
              left: 0;
            }
          }
        }
      }

      .category-pics-case{
        height: auto;
        padding: 10px 10px 30px;
        position: relative;

        .pic-inner-case{
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 6px;
          border: dashed 1px rgba(255, 255, 255, .4);
          display: inline-block;
          margin: 0 5px;

          .masker-photo{
            @include box-hori-center-middle;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #aaa;
            font-size: 24px;
          }
        }
      }

      .spec-inner-case{
        @include box-vert-center-top;
        height: auto;
	      padding-bottom: 30px;

	      .spec-case2{
		      @include box-vert-left-top;
		      height: auto;
		      padding: 5px 0 0 15px;
          position: relative;
          margin-bottom: 5px;

		      .def-spec-tip{
            @include box-hori-center-middle;
            font-size: 10px;
			      width: auto;
			      height: 15px;
			      border-radius: 2px;
			      border: solid 1px #74baf3;
			      color: #74baf3;
			      margin-left: 10px;
			      background: transparent;
		      }
    
          .spec-editor-case{
            @include box-hori-left-top;
            width: auto;
            position: absolute;
            right: 0;
            height: 100%;
            top: 5px;
            
            .modify, .delete{
              height: auto;
              width: auto;
              margin-right: 10px;
              color: #ccc;
              border-bottom: solid 1px #ccc;
            }
      
            .icon-close{
              width: 32px;
              height: auto;
              color: #f85959;
              font-size: 32px;
            }
          }
	      }

        .spec-case{
          @include box-hori-right-middle;
          height: 50px;
          border-top: solid 1px rgba(255, 255, 255, .1);
          transform: translateX(15px);
          padding: 0 20px 0 2px;
          color: #eee;
          position: relative;
          overflow: visible;

          &.spec-left-case{
            @include box-hori-left-middle;
          }

          &:last-child{
            border-bottom: solid 1px rgba(255, 255, 255, .1);
          }
          
          .err-pop{
            width: 100%;
            height: 24px;
            top: 100%;
          }
          
        }
  
        .spec-text{
          @include box-hori-left-middle;
          height: auto;
          width: auto;
          position: relative;
          
          a{
            @include box-hori-center-middle;
            width: auto;
            height: 24px;
            background: #333;
            color: #fff;
            border-radius: 3px;
            padding: 0 5px 1px;
            font-size: 14px;
          }
          
          span{
            @include box-vert-center-middle;
            width: auto;
            height: 16px;
            line-height: 14px;
            padding: 1px 3px 0;
            background: transparent;
            border-radius: 2px;
	          border: solid .5px #008de1;
            font-size: 12px;
            margin-right: 5px;
	          margin-top: 1px;
            color: #008de1;
          }
          
          label{
            width: auto;
            height: auto;
            padding-left: 5px;
            font-size: 12px;
            color: #fff;
          }
        }
  
        .input-case{
          @include box-hori-left-middle;
          padding-right: 10px;
	        border-bottom: solid 1px rgba(255, 255, 255, .2);
	        position: relative;
    
          .spec-ipt{
            @include box-hori-right-middle;
            width: 100px;
            height: 32px;
            color: #fff;
            font-weight: 200;
            font-size: 16px;
            background: transparent;
            border-radius: 2px;
            padding: 0 2px;
            position: relative;
          }
    
          .spliter{
            margin: 0 6px;
            color: #eee;
          }
        }

        .btn-case{
          @include box-hori-center-middle;
          height: 60px;
          padding: 0 10px;

          .special-btn{
            height: 36px;
            width: 100%;
            line-height: 36px;
            background: #6e6e6e;
            border-radius: 3px;
            text-align: center;
            color: #fff;
            font-size: 16px;

            &:active{
              opacity: .7;
            }
          }
        }
      }

      .suppliers-inner-case{
        @include box-vert-left-top;
        height: auto;
        padding-bottom: 35px;

        .suppliy-btn-case{
          @include box-hori-center-middle;
          height: 60px;
          padding: 0 5px;


        }

        .suppliers-case{
          @include box-vert-left-middle;
          height: auto;

          border-bottom: solid 1px rgba(255, 255, 255, .06);
          padding: 0 0 0 15px;
          color: #eee;

          .sub-title{
            @include box-hori-left-middle;
            height: 50px;

            a{
              color: #e77c6e;
              margin: 0 4px;
              font-size: 16px;
            }
          }
          
          .supplier-case{
            @include box-vert-left-top;
            width: 120%;
            height: auto;
            background: rgba(255, 255, 255, .07);
            margin-left: -15px;
            padding-left: 15px;
            padding-top: 10px;
	          position: relative;

	          .tip-case{
		          @include box-hori-center-middle;
		          height: 30px;
		          background: #008de1;
		          color: #fff;
		          position: absolute;
		          width: 100%;
		          z-index: 10;
		          top: 0;
		          left: 0;
		          border-bottom: solid 1px #008de1;
		          transition: opacity .3s;
	          }
            
            .supplier-item-case{
              @include box-hori-left-top;
              height: auto;
              position: relative;
              padding-bottom: 8px;
              margin-top: 8px;
	            border-bottom: solid 1px rgba(255, 255, 255, .1);

              .add-user-photo-case{
                @include box-vert-center-top;
                text-align: center;
                width: 50px;
                height: 50px;
                border-radius: 50px;
                border: dashed 2px rgba(255, 255, 255, .6);
                background: transparent;

                .iconfont{
                  margin-top: 10px;
                  position: static;
                }
                .icon-add-contact{
                  color: rgba(255, 255, 255, .6);
                  font-size: 30px;
                }
              }

              .user-photo-case{
                width: 42px;
                height: 42px;
                border-radius: 50px;
                border: solid 2px rgba(255, 255, 255, 1);

                .user-check{
                  @include box-vert-center-middle;
                  position: absolute;
                  width: 42px;
                  height: 42px;
                  border-radius: 38px;
                  left: -2px;
                  top: -2px;
                  padding-top: 15px;
                  font-size: 24px;
                  background: rgba(0, 0, 0, .4);

                  &.icon-check-true{
                    color: #fff;
                  }
                  &.icon-check-false{
                    color: transparent;
                  }
                }
              }
              
              .default-user-photo{
                background: url("../../../../assets/img/man.png") center center/cover no-repeat;
              }
              
              .supplier-info{
                @include box-vert-left-top;
                padding: 3px 10px 0px 10px;
                color: #fff;
                height: auto;

                h3{
                  @include box-hori-left-middle;
                  height: 20px;

                  label{
                    font-size: 14px;
                    font-weight: bold;
                    width: auto;
                    height: auto;
                    padding-left: 6px;
                  }

	                .auto-matching{
		                @include box-hori-center-middle;
		                width: auto;
		                height: 15px;
		                border: solid 1px #74baf3;
		                border-radius: 2px;
		                color: #74baf3;
		                font-size: 10px;
		                margin-left: 10px;
		                padding: 0 1px;
	                }

                  .icon-vip{
                    @include box-hori-center-middle;
                    padding-top: 1px;
                    border: solid 1px #fff;
                    border-radius: 2px;
                    width: 16px;
                    height: 14px;
                    font-size: 10px;
                    margin-left: 5px;
                  }
                }

                .price-info-case{
                  @include box-vert-left-top;
                }

                .amount-case{
                  @include box-hori-left-middle;
                }

                label{
                  @include box-hori-left-bottom;
                  height: 20px;
                  font-size: 12px;
                  
                  a{
                    font-size: 18px;
                    color: #fbb000;
                    font-weight: 300;
                  }
                }
              }

	            .remove-case{
		            @include box-hori-center-middle;
		            width: 18px;
		            font-size: 18px;
		            margin-top: 12px;
		            margin-right: 55px;
		            color: rgba(248, 89, 89, .5);
	            }

	            &:last-child{
		            border: none;
	            }
            }
          }
        }
      }
  
      .chose{
        line-height: 24px;
        text-align: center;
        width: 22px;
        height: 22px;
        border-radius: 24px;
        margin-right: 10px;
    
        &.chose-true{
          background: #008de1;
          color: #fff;
        }
        &.chose-false{
          background: rgba(255, 255, 255, .15);
          color: rgba(0, 0, 0, .2);
        }
      }

      .btn-case{
        @include box-hori-center-middle;
        background: #008de1;
        height: 50px;
        text-align: center;
        position: relative;
        overflow: visible;

        .save-btn{
          border-radius: 0;
        }
      }

      .title{
        @include box-hori-left-middle;
        font-weight: bold;
        font-size: 16px;
        height: 50px;
        //background: #24323e;
        background: #666;
        line-height: 50px;
        color: #eee;
        padding: 0 5px 0 12px;
        position: relative;
        border-top: solid 1px #555;

        button{
          width: auto;
          text-align: center;
          height: 26px;
          margin: 2px 5px;
          border-radius: 3px;
          line-height: 24px;
          color: #333;
          padding: 0 8px;
          font-size: 12px;

          &.blue-btn{
            color: #ffd100;
            background: transparent;
            border: solid .5px #ffd100;
          }
          &.red-btn{
            background: #666;
          }
          &:active{
            background: #caad5f;
            color: #333;
          }
        }
        
        .add-supplier{
          width: auto;
          height: 20px;
          background: #ff7f66;
          border-radius: 3px;
          line-height: 20px;
          position: absolute;
          right: 10px;
          top: 15px;
          font-size: 14px;
          color: #fff;
          padding: 0 5px;
        }
      }
    }
    
    .friend-case{
      @include box-vert-left-top;
      background: $normalBgColor;
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
      
      .friend-list-case{
        @include box-vert-left-top;
        margin-top: 1px;
        
        .friend-inner-case{
          @include box-vert-left-top;
        }
        
        .friend-item-case{
          @include box-hori-left-middle;
          height: auto;
          padding: 8px 20px 8px 12px;
          border-bottom: solid 1px #f1f1f1;
          font-size: 16px;
          color: #666;
          background: #fff;
          margin-bottom: .5px;
          
          label{
            font-weight: bold;
          }
          
          .photo-case{
            width: 42px;
            height: 42px;
            margin-right: 10px;
            border-radius: 11px;
            overflow: hidden;
          }
          
          .chose{
            @include box-hori-center-middle;
            width: 24px;
            height: 24px;
            border: solid .5px #dedede;
            border-radius: 16px;
            text-align: center;
            padding-top: 2px;
  
            &.chose-true{
              border-color: $blue;
              color: $blue;
            }
            &.chose-false{
              border-color: #ccc;
              color: transparent;
            }
          }
          
          &:active{
            background: #f1f1f1;
          }
        }
      }
      
      footer{
        @include box-vert-center-middle;
        height: 60px;
        padding: 0 10px;
        
        .chose-save{
          @include box-hori-center-middle;
          width: 100%;
          height: 44px;
          background: $blue;
          color: #fff;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }

	  .def-spec-case{
		  @include box-vert-left-top;
		  background: #f7f7f7;
		  height: 100%;
		  border-radius: 7px 7px 0 0;
		  overflow: hidden;

		  ul{
			  @include box-vert-left-top;
			  margin-top: 10px;

			  li{
				  @include box-hori-left-middle;
				  height: 50px;
				  margin-bottom: 1px;
				  padding: 0 15px;
				  background: #fff;

				  label{
					  @include box-hori-right-middle;
					  width: 90px;
					  height: auto;
					  color: #666;
				  }

				  span{
					  font-size: 18px;
					  color: #999;
					  margin-top: 2px;
				  }
			  }
		  }

		  footer{
        @include box-hori-center-top;
			  height: 50px;
			  padding: 0 15px;

			  .save-spec-btn{
          @include box-hori-center-middle;
				  background: #008de1;
				  width: 100%;
				  color: #fff;
				  height: 42px;
				  border-radius: 5px;
				  font-size: 16px;
          font-weight: bold;
          
          &:active{
            opacity: .8;
          }
			  }
		  }
	  }

	  .header-case{
		  @include box-hori-center-middle;
		  height: 50px;
		  padding: 0 10px 0 5px;
		  font-size: 16px;
		  background: #fff;
		  color: #333;
		  width: 100%;
		  position: relative;
      
      label{
        @include box-hori-center-middle;
        font-weight: bold;
        color: $textColor;
      }

		  .closer{
			  @include box-vert-center-middle;
			  width: 50px;
			  height: 50px;
			  font-size: 24px;
			  color: #999;
        position: absolute;
        right: 0;
        top: 0;
		  }
	  }
  }
</style>
