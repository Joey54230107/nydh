import UserBo from '@/model/bo/User'

function getLocalItem(key){
	return key ? (plus.storage.getItem(key) || '') : ''
}

function setLocalItem(key, val = ''){
  if(typeof val !== 'string'){
    try{
      val = (typeof val == 'object') ? JSON.stringify(val) : val
    }catch(e){
      val = ''
    }
  }
	key && plus.storage.setItem(key, val)
}

function removeLocalItem(key){
	key && plus.storage.removeItem(key)
}

function openWebview(id, path, style){

}

function hasLogin(){
	return !!(getLocalItem('user') || '')
}

function getLocalUser(){
  let localUser = getLocalItem('user'), user
  try{
    //user = JSON.parse(localUser)
    user = new UserBo()
  }catch(e){
    user = new UserBo()
  }
  return user
}

function getAddresses(){
  let slist = getLocalItem('addresses') || '', list = []
  if(slist){
    try{
      list = JSON.parse(slist)
    }catch(e){}
  }
  return list
}

function showWaitting(display){
  display ? plus.nativeUI.showWaiting() : plus.nativeUI.closeWaiting()
}

function openSoftKeyBroad(){
  var nativeWebview, imm, InputMethodManager
  var initNativeObjects = function() {
    if (mui.os.android) {
      var main = plus.android.runtimeMainActivity()
      var Context = plus.android.importClass("android.content.Context")
      InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager")
      imm = main.getSystemService(Context.INPUT_METHOD_SERVICE)
    } else {
      console.log('ios')
      nativeWebview = plus.webview.currentWebview().nativeInstanceObject()
    }
  };
  var showSoftInput = function() {
    if (mui.os.android) {
      imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED)
    } else {
      nativeWebview.plusCallMethod({
        "setKeyboardDisplayRequiresUserAction": false
      })
    }

  }
  initNativeObjects()
  showSoftInput()
}

export default {
	getLocalItem,
	setLocalItem,
	removeLocalItem,
	hasLogin,
  getLocalUser,
  getAddresses,
  showWaitting,
  openSoftKeyBroad
}
