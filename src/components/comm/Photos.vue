<template>
  <div class="c-photos-case" :style="outStyle">
    <div class="inner-case" v-if="len == 1">
      <image-loader :src="urls[0].url" :style="[photoCase, {'top':'50%', 'left':'50%', 'margin-top':(0 - size*precent*.5)+'px', 'margin-left':(0 - size*precent*.5) + 'px'}]" class="df-photo" :defaultCls="'photo-' + ((urls[0].sex == '025001') ? 'man' : 'woman') + '-case'" />
    </div>
    <div class="inner-case" v-if="len == 2">
      <image-loader :src="urls[0].url" :style="[photoCase, {'top':'0', 'left':'0'}]" class="df-photo" :defaultCls="'photo-' + ((urls[0].sex == '025001') ? 'man' : 'woman') + '-case'" />
      <image-loader :src="urls[1].url" :style="[photoCase, {'bottom':'0', 'right':'0'}]" class="df-photo" :defaultCls="'photo-' + ((urls[1].sex == '025001') ? 'man' : 'woman') + '-case'" />
    </div>
    <div class="inner-case" v-if="len == 3">
      <image-loader :src="urls[0].url" :style="[photoCase, {'top':'0', 'left':'50%', 'margin-left':(0 - size*precent*.5) + 'px'}]" class="df-photo" :defaultCls="'photo-' + ((urls[0].sex == '025001') ? 'man' : 'woman') + '-case'" />
      <image-loader :src="urls[1].url" :style="[photoCase, {'bottom':'0', 'left':'0'}]" class="df-photo" :defaultCls="'photo-' + ((urls[1].sex == '025001') ? 'man' : 'woman') + '-case'" />
      <image-loader :src="urls[2].url" :style="[photoCase, {'bottom':'0', 'right':'0'}]" class="df-photo" :defaultCls="'photo-' + ((urls[2].sex == '025001') ? 'man' : 'woman') + '-case'" />
    </div>
    <div class="inner-case" v-if="len == 4">
      <image-loader :src="urls[0].url" :style="[photoCase, {'top':'0', 'left':'0'}]" class="df-photo" :defaultCls="'photo-' + ((urls[0].sex == '025001') ? 'man' : 'woman') + '-case'" />
      <image-loader :src="urls[1].url" :style="[photoCase, {'top':'0', 'right':'0'}]" class="df-photo" :defaultCls="'photo-' + ((urls[1].sex == '025001') ? 'man' : 'woman') + '-case'" />
      <image-loader :src="urls[2].url" :style="[photoCase, {'bottom':'0', 'left':'0'}]" class="df-photo" :defaultCls="'photo-' + ((urls[2].sex == '025001') ? 'man' : 'woman') + '-case'" />
      <image-loader :src="urls[3].url" :style="[photoCase, {'bottom':'0', 'right':'0'}]" class="df-photo" :defaultCls="'photo-' + ((urls[3].sex == '025001') ? 'man' : 'woman') + '-case'" />
    </div>
  </div>
</template>

<script>
	import imageLoader from '@/components/comm/ImageLoader'

	export default {
		props: {
			size: {
				type: String,
        default: '80'
      },
      
      urls: {
        type: Array
      },

      precent: {
				type: [Number, String],
        default: '0.59'
      }
    },

    components: {
			imageLoader
    },

    data(){
			return {
				len: this.urls.length
      }
    },

    computed: {
			outStyle(){
				return {
					width: this.size + 'px',
          height: this.size + 'px'
        }
      },

			photoCase(){
				return {
					width: this.size * this.precent + 'px',
          height: this.size * this.precent + 'px',
          'border-radius': this.size + 'px'
        }
      }
    },
    
    methods: {
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  @import '@/assets/style/main.scss';
  
  .c-photos-case{

    .inner-case{
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .df-photo{
        overflow: hidden;
        opacity: .7;
        position: absolute;
      }
    }
  }
</style>
