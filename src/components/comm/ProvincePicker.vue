<template>
  <div class="c-province-picker-case" v-show="showWin">
    <div class="masker-case" @tap="close"></div>
    <div class="block-case" :style="{'transform': 'translateY(' + translateY + ')'}">
      <div class="title-case">请选择 <label @tap.stop="blank">清空</label><span class="iconfont icon-close" @tap.stop="close"></span></div>
      <scroller class="content-case auto-fill" @setScroller="setScroller" :status="status">
        <ul class="content-case">
          <li v-for="(item, id) in resource" class="item-case" :class="'item-case-' + (item.id === code)" @tap.stop="choseItem(item)" :key="item.code">{{item.name}}</li>
        </ul>
      </scroller>
    </div>
  </div>
</template>

<script>
	import scroller from '@/components/comm/Scroller'
	import utils from '@/plugins/utils'
	import service from '@/api/service'
  import list from '@/components/comm/List'
  import Dao from '@/model/bo/Dao'

	export default {
		components: {
			scroller,
			list
    },

		props: {
      open: {
        type: Boolean,
        default: false
      },
      
      code: {
        type: [String, Number],
        default: ''
      },

			openType: {
      	type: String,
        default: 'province'
      },

			provinceId: {
      	String: [String, Number],
        default: ''
      }
    },

    data(){
			return {
				showWin: false,
				translateY: '100%',
        scroller: null,
				resource: [],
				status: '1'
      }
    },

    watch: {
			open(newVal, oldVal){
				if(newVal === true){
					this.resource && this.resource.splice(0, 10000)
					this.showWin = true
          this.setResource()
					setTimeout(() => {
						this.translateY = '0'
					}, 150)
				}else if(newVal === false){
					this.translateY = '100%'
					setTimeout(() => {
						this.showWin = false
					}, 250)
				}
      }
    },
    
    methods: {
    	close(){
				this.$emit('choseHandler')
      },

      blank(){
				this.$emit('choseHandler', {id:'', name:''})
      },
  
      setScroller(scroller){
    	  this.scroller = scroller[scroller.length - 1]
      },

      choseItem(item){
    		this.$emit('choseHandler', item)
      },

      setResource(){
				this.scroller.scrollTo(0, 0, 0)
				this.status = '1'
      	if(this.openType == 'province'){
					let strs = utils.getLocalItem('LOCAL_PROVINCES')
					if(strs){
						_inner.call(this, JSON.parse(strs))
					}else{
						service('getProvincesOrCitys', {
							type: 0,
							provid: 0,
							cityid: 0
						}, rs => {
							utils.setLocalItem('LOCAL_PROVINCES', JSON.stringify(rs))
							_inner.call(this, rs)
						}, err => {
							this.status = '0'
						})
					}
        }else if(this.openType == 'city'){
					service('getProvincesOrCitys', {
						type: 1,
						provid: this.provinceId,
						cityid: 0
					}, rs => {
						_inner.call(this, rs)
					}, err => {
						this.status = '0'
          })
        }else if(this.openType == 'prov'){
          _inner.call(this, [
            {name:'京', id:'1'},
            {name:'津', id:'2'},
            {name:'沪', id:'3'},
            {name:'渝', id:'4'},
            {name:'冀', id:'5'},
            {name:'豫', id:'6'},
            {name:'云', id:'7'},
            {name:'辽', id:'8'},
            {name:'黑', id:'9'},
            {name:'湘', id:'10'},
            {name:'皖', id:'11'},
            {name:'鲁', id:'12'},
            {name:'新', id:'13'},
            {name:'苏', id:'14'},
            {name:'浙', id:'15'},
            {name:'赣', id:'16'},
            {name:'鄂', id:'17'},
            {name:'桂', id:'18'},
            {name:'甘', id:'19'},
            {name:'晋', id:'20'},
            {name:'蒙', id:'21'},
            {name:'陕', id:'22'},
            {name:'吉', id:'23'},
            {name:'闽', id:'24'},
            {name:'贵', id:'25'},
            {name:'粤', id:'26'},
            {name:'青', id:'27'},
            {name:'藏', id:'28'},
            {name:'川', id:'29'},
            {name:'宁', id:'30'},
            {name:'琼', id:'31'},
            {name:'临', id:'32'}
          ])
        }else if(this.openType == 'car'){
          _inner.call(this, [
            {name:'A', id:'1'},
            {name:'B', id:'2'},
            {name:'C', id:'3'},
            {name:'D', id:'4'},
            {name:'E', id:'5'},
            {name:'F', id:'6'},
            {name:'G', id:'7'},
            {name:'H', id:'8'},
            {name:'I', id:'9'},
            {name:'J', id:'10'},
            {name:'K', id:'11'},
            {name:'L', id:'12'},
            {name:'M', id:'13'},
            {name:'N', id:'14'},
            {name:'O', id:'15'},
            {name:'P', id:'16'},
            {name:'Q', id:'17'},
            {name:'R', id:'18'},
            {name:'S', id:'19'},
            {name:'T', id:'20'},
            {name:'U', id:'21'},
            {name:'V', id:'22'},
            {name:'W', id:'23'},
            {name:'X', id:'24'},
            {name:'Y', id:'25'},
            {name:'Z', id:'26'}
          ])
        }

        function _inner(rs){
					let list = rs, h = 0
					list.forEach((item, idx) => {
						if(item.id == this.code){
							item.chose = true
							h = (idx == 0) ? 0 : (0 - (idx-1) * 42)
						}else{
							item.chose = false
						}
					})
					this.resource = list
          if((list.length == 0)){
						this.status = '0'
						this.scroller.scrollTo(0, 0, 0)
          }else{
						this.status = '2'
						this.scroller.scrollTo(0, h, 0)
          }
        }
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-province-picker-case{
    @include box-vert-left-top;
    position: fixed;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 20000;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);

    .masker-case{
      width: 100%;
      height: 50%;
      background: transparent;
    }

    .block-case{
      @include box-vert-left-top;
      height: 50%;
      position: absolute;
      left: 0;
      bottom: 0;
      background: #fff;
      transition: transform .2s;
      border-radius: 7px 7px 0 0;
      overflow: hidden;

      .title-case{
        @include box-hori-left-middle;
        height: 50px;
        background: #fff;
        font-size: 18px;
        border-bottom: solid 1px #f1f1f1;
        color: #666;
        font-weight: bold;
        padding: 0 20px;
        position: relative;

        label{
          width: auto;
          height: auto;
          margin-top: -3px;
          font-size: 14px;
          color: #f85959;
          font-weight: normal;
          margin-left: 10px;
          border-bottom: solid 1px #f85959;
        }

        .icon-close{
          line-height: 48px;
          width: 32px;
          height: 50px;
          position: absolute;
          right: 0;
          top: 0;
          font-size: 24px;
          color: #999;
        }
      }

      .content-case{
        @include box-vert-left-top;
        position: relative;

        .item-case{
          @include box-hori-center-middle;
          height: 42px;
          color: #787878;
          font-size: 16px;

          &:active{
            background: #f1f1f1;
            color: #008de1;
          }
          
          &.item-case-true{
            background: #008de1;
            color: #fff;
            font-weight: bold;
          }
        }
      }
    }

  }
</style>
