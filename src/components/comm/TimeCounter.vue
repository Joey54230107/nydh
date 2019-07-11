<template>
  <div class="c-timecounter-case">
    <time class="day" v-if="timer.day != 0">{{timer.day}}</time>
    {{timer.day != 0 ? '天' : ''}}
    <time class="hour" v-if="timer.hour != 0">{{timer.hour}}</time>
    {{timer.hour != 0 ? '小时' : ''}}
    <time class="min" v-if="timer.min != 0">{{timer.min}}</time>
    {{timer.min != 0 ? '分钟' : ''}}
    <time class="sec" v-if="timer.sec != 0">{{timer.sec}}</time>
    秒
  </div>
</template>

<script>
	export default {
		name: 'stars',
    
    props: {
		  time: {
		    type: [String, Number],
        default: ''
      }
    },
    
    data(){
		  return {
		    timer: {
		      day: 0,
          hour: 0,
          min: 0,
          sec: 0
        }
      }
    },
    
    mounted(){
      this.counting()
      var _timer = window.setInterval(() => {
        (!this.counting()) ? window.clearInterval(_timer) : ''
      }, 1000)
    },
    
    methods: {
      counting(){
        let t = Math.abs((new Date()).getTime() - this.time), sec = 1000, min = 1000 * 60, hour = 1000 * 3600, day = 1000 * 3600 * 24
        if(t > 0){
          if(t >= day){
            this.timer.day = (t % day == 0) ? t/day : Math.floor(t/day)
            t = t - this.timer.day * day
          }
          if(t >= hour){
            let _hour = (t % hour == 0) ? t/hour : Math.floor(t/hour)
            this.timer.hour = _hour < 10 ? '0' + _hour : _hour
            t = t - this.timer.hour * hour
          }
          if(t >= min){
            let _min = (t % min == 0) ? t/min : Math.floor(t/min)
            this.timer.min = _min < 10 ? '0' + _min : _min
            t = t - this.timer.min * min
          }
          if(t >= sec){
            let _sec = Math.floor(t/sec)
            this.timer.sec = _sec < 10 ? '0' + _sec : _sec
          }
          return true
        }
        return false
      }
    }
	}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .c-timecounter-case{
    @include box-hori-left-middle;
    width: auto;
    
    time{
      width: auto;
      height: auto;
      padding: 0 1px;
      color: inherit;
      font-size: inherit;
    }
  }
</style>
