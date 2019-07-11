<template>
  <div class="mui-content p-order-filter-page">
    <div class="auto-fill inner-page">
      <ul class="filter-content">
        <li class="item-case">
          <h3 class="title">时间段</h3>
          <div class="time-zone">
            <input type="date" class="ipt-date">
            <span class="to"> 至 </span>
            <input type="date" class="ipt-date">
          </div>
        </li>
        <li class="item-case">
          <h3 class="title">地区</h3>
          <div class="area-zone">
            <address class="area-item" v-for="item in areas">{{item.name}}</address>
          </div>
        </li>
      </ul>
    </div>
    <div class="btn-case">
      <span class="btn back" @tap="close">
        <a class="iconfont icon-let-arr"></a>返回
      </span>
      <span class="btn search">
        <a class="iconfont icon-search"></a>搜索
      </span>
    </div>
  </div>
</template>

<script>
	import config from '../../../../../config/address.js'

	export default {
		name: 'orderfilter',

		data(){
			return {
				areas: [
					{name: '江浙沪'},{name: '珠三角'},{name: '北京'},{name: '上海'},
					{name: '广州'},{name: '深圳'},{name: '杭州'},{name: '成都'},{name: '厦门'}
        ]
			}
		},

		methods: {
			close(){
				plus.webview.currentWebview().hide('slide-out-bottom', 200)
      }
		}
	}
</script>

<style lang="scss" type="text/scss">
	@import '@/assets/style/main.scss';

  .p-order-filter-page{
    @include box-vert-left-top;
    background: rgba(0,0,0, .8);
    width: 100%;
    height: 100%;
    position: relative;

    .inner-page{
      @include box-vert-left-top;
      padding-top: 50px;

      .filter-content{
        @include box-vert-left-top;
        background: rgba(255, 255, 255, .8);
        border-radius: 6px 6px 0 0;
        padding: 10px;

        .item-case{
          @include box-vert-left-top;
          height: auto;
          border-bottom: solid 1px #aaa;
          position: relative;
          overflow: visible;
          padding: 20px 10px 10px 6px;

          &:after{
            content: '';
            width: 7px;
            height: 7px;
            position: absolute;
            background: #aaa;
            border-radius: 5px;
            bottom: -4px;
            left: 0;
          }

          h3.title{
            width: auto;
            font-size: 18px;
            height: auto;
            margin-bottom: 20px;
            color: #343434;
          }

          .time-zone{
            @include box-hori-left-top;
            height: 50px;

            .ipt-date{
              @include box-hori-center-middle;
              width: 150px;
              height: 30px;
              border-radius: 20px;
              background: #b1b1b1;
              font-size: 14px;
              border: none;
              line-height: 28px;
              margin: 0;
              padding: 0;
              text-align: center;
            }

            .to{
              width: 30px;
              text-align: center;
              height: 30px;
              line-height: 30px;
            }
          }

          .area-zone{

            .area-item{
              @include box-hori-center-middle;
              width: auto;
              font-style: normal;
              padding: 0 10px;
              font-size: 12px;
              height: 21px;
              border-radius: 20px;
              background: #bababa;
              display: inline-block;
              margin: 0 10px 10px 0;
            }
          }
        }
      }
    }

    .btn-case{
      @include box-hori-left-middle;
      position: fixed;
      bottom: 0;
      left: 0;
      height: 50px;

      .btn{
        @include box-hori-center-middle;
        height: 50px;
        width: 50%;
        font-size: 16px;

        &.back{
          background: #bababa;
          color: #666;

          &:active{
            background: #aaa;
          }
        }
        &.search{
          background: #e47e6e;
          color: #fff;

          &:active{
            background: #cc6458;
          }
        }

        .icon-let-arr{
          color: inherit;
          width: 32px;
          height: auto;
          font-size: 18px;
        }
        .icon-search{
          color: inherit;
          width: 32px;
          height: auto;
          font-size: 18px;
        }
      }
    }
  }
</style>
