<template>
  <div class="c-hori-scroller-case" :style="{'height': height + 'px'}">
    <slot></slot>
    <div class="hori-scroller-inner-case auto-fill" :style="{'padding-top': (80 - height)*.5 + 'px'}">
      <ul class="hori-slider" :style="{'height': height + 'px'}">
        <li class="item-case" :class="'item-case-' + (item.code == selected)" v-for="item in resource" @tap.stop="handler(item)" :style="{'font-size': fontSize + 'px', 'margin': corner ? '0 13px' : '0 5px'}">
          <span class="num-pointer" v-if="item[corner] > 0">{{item[corner]}}</span>
          {{item.name}}
          <span class="hr" v-if="item.code == selected"></span>
        </li>
      </ul>
    </div>
    <div v-if="filter == 'true'" class="iconfont icon-filter" @tap="openFilter"><span>筛选</span></div>
  </div>
</template>

<script>

	export default {
		name: 'horiscroller',
    
    props: {
		  resource: {
		    type: Array
      },
  
      selected: {
		    type: [String, Number],
        default: ''
      },

			corner: {
		  	type: String,
        default: ''
      },
  
      fontSize: {
        type: String,
        default: '14'
      },
  
      height: {
        type: String,
        default: '44'
      },

			filter: {
		  	type: String,
        default: 'false'
      },

      align: {
		  	type: String,
        default: 'left'
      }
    },
    methods: {
			openFilter(){
				this.$emit('openFilter')
      },

			handler(item){
				this.$emit('handler', item)
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';

  .c-hori-scroller-case{
    @include box-hori-left-middle;
    width: 100%;
    text-align: center;
    padding: 0 0 0 10px;
    position: relative;
    //box-shadow: 0 -2px 10px rgba(0, 0, 0, .15) inset;

    .icon-filter{
      @include box-hori-center-middle;
      width: 60px;
      margin-left: 12px;
      height: auto;
      font-size: 18px;
      border-left: solid 1px #ccc;
      color: #343434;

      span{
        height: auto;
        font-size: 12px;
        width: auto;
        padding-left:4px;
      }
    }

    .hori-scroller-inner-case{
      @include box-vert-center-top;
      height: 80px;
      overflow-x: auto;

      .hori-slider{
        @include box-hori-center-middle;
        width: auto;
        text-align: left;
        flex-shrink: 0;

        .item-case{
          @include box-hori-left-middle;
          width: auto;
          white-space: nowrap;
          padding: 0 5px;
          margin: 0 5px;
          text-align: center;
          position: relative;

          &.item-case-true{
            color: #f85959;
          }
          &.item-case-false{
            color: #333;
          }

          .num-pointer{
            top: 10px;
            left: -5px;
            font-size: 11px;
            position: absolute;
            min-width: 18px;
            width: auto;
            padding: 0 5px;
            color: #fff;
            line-height: 16px;
            text-align: center;
            height: 18px;
            border-radius: 16px;
            overflow: hidden;
            background: linear-gradient(to right, #e77c6e , #f8b68e);
            border: solid 1px #fff;
          }
  
          .hr{
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: 0;
            left: 0;
            background: #f85959;
            border-radius: 0;
          }
        }
      }
    }
  }
</style>
