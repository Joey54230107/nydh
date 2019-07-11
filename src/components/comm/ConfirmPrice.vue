<template>
  <ul class="c-price-case" :style="{'transform':'translateY(' + top + 'px)'}">
    <div class="error-case" v-if="error">
      <span class="iconfont icon-attention2"></span>{{error}}
    </div>
    <li class="title-case">
      <span class="iconfont icon-close" @tap="closeMasker"></span>
      我对{{category.ctname}}的报价
    </li>
    <li class="price-detail-case auto-fill">
      <image-loader class="price-category-photo" :src="category.url">
        <span>{{category.ctname}}</span>
      </image-loader>
      <div class="price-inner-case auto-fill">
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
      </div>
    </li>
    <li class="btn-case">
      <button @tap.stop="savePrice">确定报价</button>
    </li>
  </ul>
</template>

<script>
	import imageLoader from '@/components/comm/ImageLoader'

	export default {
		components: {
			imageLoader
    },

	  props: {
			category: {
				type: Object
      }
    },
    
    data(){
	  	return {
	  		error: '',
        top: 0
      }
    },

    methods: {
			closeIpt(category, name){
				category[name] = ''
			},

			closeMasker(){
				this.error = ''
				this.top = 250
				setTimeout(() => {
					this.$emit('close')
				}, 200)
			},

			calTotal(){
				if(this.category.amount2 && this.category.price && (!isNaN(this.category.amount2)) && (!isNaN(this.category.price))){
					let price = parseFloat(this.category.amount2) * parseFloat(this.category.price)
					this.category.total = price.toFixed(2)
				}
			},

			savePrice(){
				this.$emit('savePrice', this, this.closeMasker)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .c-price-case{
    @include box-vert-left-top;
    height: 250px;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    transition: transform .2s;

    .error-case{
      @include box-hori-left-middle;
      width: 100%;
      height: 40px;
      position: absolute;
      top: -40px;
      left: 0;
      background: #DF6158;
      color: #fff;
      padding: 0 10px;
      animation: down_arr 3 .25s;

      .icon-attention2{
        height: 40px;
        line-height: 40px;
        padding-right: 6px;
      }
    }

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
            font-weight: 300;

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
</style>
