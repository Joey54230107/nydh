<template>
  <ul :id="id" class="addr-case">
    <li class="addr-inner-case">
      <div class="content-case" @tap="tapHandler" @swipeleft="swipeleft" :class="addr.slider ? 'slider-move' : ''">
        <div class="photo-case" :style="{'background':'url(' + addr.photo + ') center center/100% 100% no-repeat'}">
          <i class="msg" v-if="addr.messages > 0">{{addr.messages}}</i>
        </div>
        <div class="info-case auto-fill">
          <h3>
            {{addr.userName}}
            <time>132123</time>
          </h3>
          <label>拉开到书房里卡师傅教案隆盛科技</label>
        </div>
      </div>
      <div class="addr-rem-case">
        删除
      </div>
    </li>
  </ul>
</template>

<script>
  import address from '../../../config/address.js'
  
  export default {
    name: 'addr-item',
    
    props: {
      resource: {
        type: Object
      }
    },
    
    data(){
      return{}
    },
    
    mounted(){
    },
    
    computed: {
      addr(){
      	let obj = this.resource
        return obj
      }
    },
    
    methods: {
      tapHandler(){
        this.$emit('tapHandler')
        this.$emit('swipeHandler', '')
      },
      
      swipeleft(){
        this.$emit('swipeHandler', this.resource.id)
      }
    }
  }
</script>


<style lang="scss" scoped type="text/scss">
  @import '@/assets/style/common.scss';
  
  .addr-case{
    width: 100%;
    height: 100%;
    padding-left: 10px;
    background: rgba(255, 255, 255, .9);
  
    .addr-inner-case{
      @include box-hori-left-middle;
      width: 200%;
      height: 100%;
      border-bottom: solid 1px #e0e0e0;
      
      .content-case{
        @include box-hori-left-middle;
        width: 50%;
        height: 100%;

        margin-left: 0;
        transition: margin .2s;
        
        &.slider-move{
          margin-left: -60px;
        }
  
        .photo-case{
          width: 54px;
          height: 54px;
          border-radius: 60px 0 60px 60px;
          position: relative;

          .msg{
            min-width: 18px;
            width: auto;
            height: 18px;
            color: #fff;
            text-align: center;
            border-radius: 12px;
            background: #F86E64;
            position: absolute;
            top: 36px;
            left: 36px;
            font-style: normal;
            font-family: arial;
            font-size: 12px;
            line-height: 18px;
            padding: 0 5px;
          }
        }
  
        .info-case{
          height: 64px;
          padding: 5px 10px;
          overflow: hidden;

          h3{
            padding-top: 5px;
            display: block;
            width: 100%;
            font-size: 18px;
            color: #343434;
            height: 50%;
            position: relative;
            padding-right: 100px;

            time{
              width: 100px;
              text-align: right;
              position: absolute;
              right: 0;
              height: 100%;
              font-size: 12px;
              color: #c1c1c1;
            }
          }
          
          label{
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: block;
            padding-top: 5px;
            font-size: 14px;
            color: #999;
            height: 50%;
          }
        }
      }
  
      .addr-rem-case{
        @include box-vert-center-middle;
        width: 60px;
        height: 100%;
        background: #dedede;
        color: #666;
      }
    }
  
    &:active{
      background: #e1e1e1;
    }
  }
</style>
