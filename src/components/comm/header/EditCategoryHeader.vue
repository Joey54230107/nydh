<template>
  <header class="c-edit-category-header-case">
    <div class="header-icon iconfont icon-let-arr" @tap="back"><label>返回</label></div>
    <div class="header-text-case auto-fill">{{title}}</div>
    <div class="header-icon create">
      <label class="blocker" @tap="save" v-if="!state">保存报价</label>
    </div>
  </header>
</template>

<script>
	import comboxMenu from '@/components/comm/ComboxMenu'

	export default {
		name: 'back-header',

		props: {
			title: {
				type: String,
				default: ''
			},

			state: {
				type: Boolean,
        default: false
      }
		},

		components: {
			comboxMenu
		},

		data(){
			return {
				headerMenus: [
					{name: '新增'},
					{name: '删除'}
				]
			}
		},

		methods: {
			back(){
				plus.webview.currentWebview().hide('pop-out', 300)
      },

			save(){
				this.$emit('save')
			}
		}

	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .c-edit-category-header-case{
    @include box-hori-left-middle;
    height: 50px;
    border-bottom: solid 0px #dcdcdc;
    background: url("../../../assets/img/header-bg.png") top left/100% 100% repeat-y;
    position: fixed;
    top: 0;
    overflow: visible;
    left: 0;
    z-index: 10;
    color: #fff;
    text-align: center;

    .header-icon{
      @include box-hori-center-middle;
      width: auto;
      height: 50px;
      font-size: 20px;
      line-height: 50px;
      overflow: visible;
      position: absolute;
      top: 0;

      &.icon-let-arr{
        left: 5px;
      }
      &.create{
        font-size: 16px;
        right: 10px;
      }

      label{
        margin-top: -1px;
        height: 50px;
        font-size: 16px;
        width: auto;

      }
      
      .blocker{
        height: 26px;
        background: #f85959;
        line-height: 26px;
        padding: 0 10px;
        border-radius: 3px;
        color: #fff;
        font-size: 14px;
      }
    }

    .header-text-case{
      @include box-hori-center-middle;
      height: auto;
      font-size: 18px;
      color: #fff;
    }
  }
</style>
