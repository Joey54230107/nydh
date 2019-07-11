import UserBo from '@/model/bo/User'
import config from '../../config/address'
import '@/assets/libs/mui.js'

/**
 * 工具函数
 */

/*从本地手机中获取参数值*/
function getLocalItem(key){
	return key ? (plus.storage.getItem(key) || '') : ''
}

/*将参数值设置到本地手机中*/
function setLocalItem(key, val = ''){
	mui.plusReady(() => {
		if(typeof val !== 'string'){
			try{
				val = (typeof val == 'object') ? JSON.stringify(val) : val
			}catch(e){
				val = ''
			}
		}
		key && plus.storage.setItem(key, val)
	})
}

/*移除本地手机中的参数*/
function removeLocalItem(key){
	key && plus.storage.removeItem(key)
}

function getLocalUser(){
  let localUser = getLocalItem('user'), user
  try{
    user = localUser ? JSON.parse(localUser) : new UserBo()
  }catch(e){
    user = new UserBo()
  }
  return user
}

function hasLogin(){
  return !!(getLocalItem('user') || '')
}

function printO(obj){
	for(let attr in obj){
		console.log(attr, obj[attr])
	}
}

function masker(display){
  display ? plus.nativeUI.showWaiting() : plus.nativeUI.closeWaiting()
	/*return ;
	if(display){
		plus.webview.getWebviewById('waiting').show('fade-in', 200)
	}else{
		plus.webview.getWebviewById('waiting').hide('fade-out', 100)
	}*/
}

function photoChose(serverUrl, callBack){
  if(mui.os.plus){
    let menus = [
      {title: '拍照'},
      {title: '从相册中选择'}
    ]
    plus.nativeUI.actionSheet({
      cancel: "取消",
      buttons: menus
    }, ev => {
      if(ev.index == 1){
        takePhoto(serverUrl, callBack)
      }
    })
  }
}

/*拍照并上传到服务器*/
function takePhoto(serverUrl, callBack){
	let cam = plus.camera.getCamera()
  if(cam){
    cam.captureImage(path => {
      plus.io.resolveLocalFileSystemURL(path, (entry) => {
        let imgSrc = entry.toLocalURL() + "?version=" + new Date().getTime()
        console.log('开始上传')
        let task = plus.uploader.createUpload(
          serverUrl + '?filename=' + imgSrc,
          {method: "POST"},
          (rs, status) => {
            console.log('rs', rs, 'status', status)
            callBack && callBack(rs, status)
          }
        )
        task.addFile(imgSrc, {key: imgSrc})
        task.start()
      }, function(e) {
        plus.nativeUI.closeWaiting()
        console.log("读取拍照文件错误：" + e.message)
      })
    }, err => {
      plus.nativeUI.closeWaiting()
      console.log('取消拍照')
    }, {
      resolution: cam.supportedImageResolutions[0],
      format: cam.supportedImageFormats[0]
    })
  }else{
    toast('调用摄像头失败')
  }
}

function loadImage(path, callback){
  if(path){
    let img = new Image()
    img.src = path
    img.onload = callback
  }
}

function setChose(obj){
	obj && (obj.chose = false)
	return obj
}

function formatTime(str, spliter = '/'){
	function _autofix(str){
		str = str + ''
		if(str && str.length == 1){
			return '0' + str
		}
		return str
	}
	if(str){
	  str = parseInt(str)
		let date = new Date(str)
		return date.getFullYear() + spliter + _autofix(date.getMonth() + 1) + spliter + _autofix(date.getDate()) + ' ' + _autofix(date.getHours()) + ':' + _autofix(date.getMinutes()) + ':' + _autofix(date.getSeconds())
	}
	return ''
}

function formatDate(str, spliter = '/'){
	function _autofix(str){
		str = str + ''
		if(str && str.length == 1){
			return '0' + str
		}
		return str
	}
	if(str){
		let date = new Date(str)
		return date.getFullYear() + spliter + _autofix(date.getMonth() + 1) + spliter + _autofix(date.getDate())
	}
	return ''
}

function getUuid(){
	var s = []
	var hexDigits = "0123456789abcdef"
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
	}
	s[14] = "4"
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
	s[8] = s[13] = s[18] = s[23] = ""
	return s.join("")
}

function getAppKey(){
  return '9dbfae083a67375b650cdc08127e7a30'
}

function openImageDetailWin(imgUrl){
  let win = plus.webview.getWebviewById('imageDetail')
  win || (win = plus.webview.create(config.CDN_ADDRESS + '/imageDetail', 'imageDetail'))
  win.show('fade-in', 200, () => {
    mui.fire(win, 'detail', {
      imgUrl
    })
  })
}

function openLocationWin(winId){

  plus.webview.create(config.CDN_ADDRESS + '/location', 'location', {}, {winId})
  /*let win = plus.webview.getWebviewById('location')
  win || (win = plus.webview.create(config.CDN_ADDRESS + '/location', 'location'))

  win.show('pop-in', 200, () => {
    mui.fire(win, 'init', {
      winId
    })
  })*/
}

/*打开用户信息窗口（区分自己还是别人）*/
function openUserCard(userid){
  plus.webview.create(config.CDN_ADDRESS + '/personInfo', 'personInfo', {}, {
    userid
  })
}

/*动画曲线，dur=每次移动的像素，sec=每次间隔时间（毫秒），total=总距离像素*/
function animationLine(obj, dur, sec, total, convert){
  let times = total % dur == 0 ? parseInt(total/dur) : parseInt(total/dur) + 1, counter = 0, time = 0
  convert && (counter = total);
  (function _ani(){
    setTimeout(() => {
      if(convert){
        counter = counter - dur
        ++ time
        obj.scrollLeft = counter
        if(time < times - 1){
          _ani()
        }else{
          obj.scrollLeft = 0
        }
      }else{
        counter = counter + dur
        ++ time
        obj.scrollLeft = counter
        if(time < times - 1){
          _ani()
        }else{
          obj.scrollLeft = total
        }
      }
    }, sec)
  })()
}

/*打开登录窗口*/
function loginVerificate(handler, payload){
  if(handler && typeof handler === 'function'){
    let user = getLocalUser()
    if(user.userid){
      handler(payload)
    }else{
      plus.webview.getWebviewById('login').show('fade-in', 200)
    }
  }
}

/*预加载窗口（如果已经加载了，直接显示，如果没有就先创建）*/
function preLoad(path, id, style, params){
  let win = plus.webview.getWebviewById(id)
  if(win){
    return win
  }else{
    return plus.webview.create(config.CDN_ADDRESS + path, id, style, params)
  }
}

function openSoftKeyborad(id){
  _setResize()
  var nativeWebview, imm, InputMethodManager;
  var initNativeObjects = function() {
    if (mui.os.android) {
      var main = plus.android.runtimeMainActivity();
      var Context = plus.android.importClass("android.content.Context");
      InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
      imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
    } else {
      nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
    }
  };
  var showSoftInput = function() {
    if (mui.os.android) {
      imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
    } else {
      nativeWebview.plusCallMethod({
        "setKeyboardDisplayRequiresUserAction": false
      });
    }
    if(id){
      setTimeout(function() {
        var inputElem = document.getElementById(id);
        inputElem && inputElem.focus();
      }, 200);
    }
  };
  initNativeObjects()
  showSoftInput()

  function _setResize(){
    if(!window.onresize){
      var originalHeight = document.documentElement.clientHeight || document.body.clientHeight
      window.onresize = function(){
        var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
        if(resizeHeight < originalHeight){
          plus.webview.currentWebview().setStyle({
            height:originalHeight
          })
        }
      }
    }
  }
}

function toast(title = '', time = 1000, type = 'SUCCESS'){
	mui.fire(plus.webview.getWebviewById('toast'), 'toast', {title, time, type})
}

function error(message = '', title = ''){
	mui.fire(plus.webview.getWebviewById('error'), 'error', {message, title})
}

function confirm(message = '', confirm, cancelText, cancel){
  plus.nativeUI.actionSheet({
    cancel: cancelText || "取消",
    buttons: [{title: message}]
  }, ev => {
    if(ev.index == 1){
			confirm && confirm()
    }else{
			cancel && cancel()
		}
  })
}

function simpleTime(str, str2 = '/'){
  if(str){
    let date = new Date(parseInt(str))
    return (date.getFullYear() + '').substring(2) + str2 + date.getMonth() + str2 + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
  }
  return str
}

function formatCreatetime(time){
	let times = (new Date()).getTime() - time, year = 3600*1000*24*365, month = 3600*1000*24*30, day = 3600*1000*24, hour = 3600*1000
	if(times <= hour){
		return '1小时内'
	}else if(times > hour && times <= day){
		return '1天内'
	}else if(times > day && times <= month){
		return parseInt(times / day) + '天前'
	}else if(times > month && times <= month * 6){
		return parseInt(times / month) + '月前'
	}else if(times > month * 6 && times <= year){
		return '半年前'
	}else if(times > year){
		return '1年前'
	}
}

//表单检查调用错误信息显示
function setError(field, msg){
  //this[field] = msg + '_' + Math.random()
}

function preload(url){
  if(!plus.webview.getWebviewById(url)){
    mui.preload({
      id: url,
      url: config.CDN_ADDRESS + '/' + url,
      /*styles: {
        softinputMode: 'adjustPan'
      }*/
    })
  }
}

function ruleMust(str){
  if(!str){
    return false
  }
  str = (str + '').trim()
  return str !== ''
}

function ruleNumber(str){
  if(ruleMust(str)){
    return (!isNaN(str)) && str >= 0
  }
  return false
}

function scrollerLoader(fn, callback){
  this.status = '3'
  fn && fn(callback)
}

export default{
	getLocalItem,
	setLocalItem,
	removeLocalItem,
  getLocalUser,
  hasLogin,
	printO,
	takePhoto,
  loadImage,
  masker,
	setChose,
	formatTime,
	formatDate,
  openUserCard,
  openSoftKeyborad,

  openImageDetailWin,
  openLocationWin,
  animationLine,
  loginVerificate,

	getUuid,
  getAppKey,

  preLoad,
	toast,
  error,
	confirm,

  simpleTime,
	formatCreatetime,

  setError,
  preload,
  ruleMust,
  ruleNumber,

  scrollerLoader
}
