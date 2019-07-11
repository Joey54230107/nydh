<template>
	<normal-layout class="task-page" :loaded="loaded">
		<normal-header title="我的任务" />
		<hori-scroller class="pageframe-case" :resource="pages" @handler="searchOrders" :selected="st" />
    <ul class="task-type-list-case">
      <li class="tipper">筛选任务类型：</li>
      <li v-for="code in codes" class="task-type-item-case" :class="'task-type-item-case-' + code.chose" @tap="changeType(code)">
        <span class="circle">{{code.value.substring(0, 1)}}</span>
        <h3 class="task-name">{{code.value}}任务</h3>
      </li>
    </ul>
		<div class="auto-fill task-case">
      <hori-scroller class="pageframe-case2" :resource="pages2" @handler="searchOrders2" :selected="st3" />
			<scroller class="auto-fill task-container" :status="status">
        <div class="task-container-inner">
          <ul class="task-list">
            <li v-for="task in tasks" class="task-item-case" @tap.stop="detail(task)">
              <div class="task-user-info-case">
                <image-loader :src="task.partner.url" class="user-photo" :defaultCls="'photo-' + ((task.partner.sex == '025001') ? 'man' : 'woman') + '-case'" />
                <ul class="info-case auto-fill">
                  <label>发布人：{{task.partner.nickname}}</label>
                  <div class="remark">任务描述：<span>{{task.content || '无'}}</span></div>
                </ul>
              </div>
              <div class="oper-case">
                <span class="btn-case accept-case auto-fill" @tap="respones(task, 1)" v-if="task.st == '0' && st == '0' && st3 == '0'">接受任务</span>
                <span class="btn-case no-accept-case auto-fill" @tap="respones(task, 0)" v-if="task.st == '0' && st == '0' && st3 == '0'">拒绝</span>
              </div>
            </li>
          </ul>
        </div>
			</scroller>
		</div>
	</normal-layout>
</template>

<script>
	import config from '../../../../../config/address.js'
  import scroller from '@/components/comm/Scroller'
  import normalLayout from '@/components/layout/Layout'
	import normalHeader from '@/components/comm/NormalHeader'
	import utils from '@/plugins/utils'
	import horiScroller from '@/components/comm/HoriScroller'
	import service from '@/api/service'
  import imageLoader from '@/components/comm/ImageLoader'

	export default {
	  created(){
			mui.plusReady(() => {
				plus.webview.currentWebview().show('pop-in', 300)
			})
    },
    
		components: {
      scroller,
			normalHeader,
      normalLayout,
			horiScroller,
      imageLoader
		},

		data(){
			return {
        loaded: true,
				pages: [
					{name: '我收到的任务', chose: true, code: '0'},
					{name: '我发布的任务', chose: false, code: '1'}
				],
        pages2: [
          {name: '待接受', code: '0'},
          {name: '已接受', code: '1'},
          {name: '已拒绝', code: '2'}
        ],
				st: '0',
        st2: '',
        st3: '0',
        status: '1',
        codes: [],
        tasks: []
      }
		},
    
    mounted(){
			mui.plusReady(() => {
				this.getCodes()
			})
    },
    
    methods: {
      changeType(item){
        this.codes.forEach(code => {
          code.chose = (code.code == item.code)
        })
        this.st2 = item.code
        this.search()
      },
      
      getCodes(){
        service('getCode', {
          code: '029'
        }, rs => {
          let data = rs[0].children, codes = []
          data && data.forEach((item, idx) => {
            item.children && item.children.forEach(code => {
              code.chose = false
              codes.push(code)
            })
          })
          codes[0].chose = true
          this.st2 = codes[0].code
          this.codes = codes
          this.search()
        })
      },
      
    	search(){
    	  this.status = '1'
    		service('searchTasks', {
					userid: utils.getLocalUser().userid,
			    st: this.st,
          workkind: this.st2,
          st: this.st3
        }, rs => {
          this.tasks = rs.items || []
          this.status = this.tasks.length > 0 ? '2' : '0'
		    }, err => {
          this.status = '0'
        })
	    },
  
      respones(task, resp){
    	  service('responseTask', {
          userid: utils.getLocalUser().userid,
          items: [{
            workid: task.workid,
            workkind: task.workkind,
            groupid: task.groupid,
            st: task.st,
            resp: resp
          }]
        }, rs => {
    	    if(resp == '1'){
    	      task.st = '1'
          }else if(resp == '0'){
            task.st = '2'
          }
          utils.toast('操作成功')
        })
      },
  
      searchOrders(item){
        this.st = item.code
        this.search()
      },
  
      searchOrders2(item){
        this.st3 = item.code
        this.search()
      },
      
      detail(task){
        switch(task.workkind){
          case '029001001': {
            plus.webview.create(config.CDN_ADDRESS + '/taskOrderDetail', 'taskOrderDetail', {}, {
              tradeid: task.tradeid,
              invoiceid: task.invoiceid,
              workkind: task.workkind,
              status: this.st3, //任务本身的状态（0=待响应、1=已响应、2=拒绝）
              workid: task.workid,
              groupid: task.groupid
            })
          }
        }
      }
    }
	}
</script>

<style lang="scss" type="text/scss" scoped>
  @import '@/assets/style/main.scss';
  
  .task-page{
    @include box-vert-left-top;
	  background: $normalBgColor;
  
    .pageframe-case{
      background: #fff;
      margin-top: 50px;
    }
  
    .pageframe-case2{
      background: #fff;
    }
    
    .task-type-list-case{
      @include box-hori-left-top;
      height: auto;
      background: #fff;
      padding: 35px 10px 15px;
      margin-top: 10px;
      position: relative;

	    .tipper{
		    @include box-hori-left-bottom;
		    height: 20px;
		    font-size: 12px;
		    color: $textColor;
		    position: absolute;
		    top: 8px;
		    left: 15px;
		    font-weight: bold;
	    }
      
      .tipper{
        @include box-hori-left-top;
        position: absolute;
        top: 8px;
        left: 15px;
        color: $textColor;
        font-size: 12px;
        font-weight: bold;
      }
      
      .task-type-item-case{
        @include box-vert-center-top;
        height: auto;
        width: 75px;
        
        .circle{
          @include box-hori-center-middle;
          width: 50px;
          height: 50px;
          border-radius: 50px;
          font-size: 21px;
        }
        
        .task-name{
          @include box-hori-center-top;
          margin-top: 10px;
          width: 100%;
          font-size: 12px;
          color: $textLessColor;
        }
  
        &.task-type-item-case-true{
    
          .circle{
            border: solid 1px $blue;
            color: $blue;
          }
          
          .task-name{
            color: $blue
          }
        }
  
        &.task-type-item-case-false{
    
          .circle{
            border: solid 1px #dedede;
            color: $textLessColor;
          }
  
          .task-name{
            color: $textLessColor
          }
        }
      }
    }

	  .task-case{
		  @include box-vert-left-top;
      margin-top: 1px;
      
      .task-container-inner{
        @include box-vert-left-top;
        transition: transform .3s, opacity .3s;
        margin-top: 1px;
        padding: 10px;
  
        .task-list{
          @include box-vert-left-top;
          height: auto;
    
          .task-item-case{
            @include box-vert-left-middle;
            height: auto;
            background: #fff;
            border-radius: 9px;
            overflow: hidden;
            margin-bottom: 8px;
      
            .task-user-info-case{
              @include box-hori-left-middle;
              height: auto;
              padding: 10px 12px;
        
              .user-photo{
                width: 42px;
                height: 42px;
                border-radius: 9px;
              }
        
              .info-case{
                @include box-vert-left-top;
                height: auto;
                padding-left: 10px;
          
                label{
                  font-size: 16px;
                  color: #666;
                  font-weight: bold;
                }
          
                .remark{
                  color: #999;
                  font-size: 12px;
                  padding-top: 3px;
                }
              }
            }
      
            .oper-case{
              @include box-hori-center-top;
              border-top: solid 1px $normalBgColor;
        
              .btn-case{
                @include box-hori-center-middle;
                text-align: center;
                height: 42px;
                font-weight: bold;
                font-size: 16px;
          
                &.accept-case{
                  color: $blue;
                }
          
                &.no-accept-case{
                  color: $red;
                  border-left: solid 1px $normalBgColor;
            
                  &:first-child{
                    border-left: none;
                  }
                }
              }
        
              .accepted-case{
                text-align: center;
                width: 40px;
                font-weight: bold;
                color: #008de1;
                height: 30px;
                font-size: 12px;
              }
        
              .no-accepted-case{
                text-align: center;
                width: 40px;
                font-weight: bold;
                color: #f85959;
                height: 30px;
                font-size: 12px;
              }
            }
      
            &:last-child{
              border: none;
            }
      
            &:active{
              background: rgba(0, 0, 0, .03);
            }
          }
        }
      }
	  }
  }
</style>
