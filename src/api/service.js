import api from '@/api/api'
import utils from '@/plugins/utils'
import axios from '@/plugins/axios'

export default function service(apiName, params, success, error, mustLogin){
  console.log('XXXXXXX api name:', apiName)

  let user = utils.getLocalUser()
  if(mustLogin){
    if(!user.userid){
      plus.webview.getWebviewById('login').show('fade-in', 300)
      return ;
    }
  }
  let waitTimer = setTimeout(() => {
    (!params.showMasker) && utils.masker(true)
    let foceTimer = setTimeout(() => {
      utils.masker()
      clearTimeout(foceTimer)
    }, 1000 * 5)
  }, 500), result = api[apiName].call(null, params)

  result.then(rs => {
		clearTimeout(waitTimer)
    utils.masker()
    if(rs.data){
      if(rs.data.code == 200){
				setTimeout(() => {
          success.call(this, rs.data.data)
        }, 0)
      }else{
        //处理服务端返回的错误（非系统性异常）
        //401错误，未登录验证
        if(rs.data.code == 401){
          plus.webview.show('login', 'fade-in', 200)
        }else{
          utils.error(rs.data.message)
        }
      }
    }
  }).catch(err => {
		utils.masker()
    utils.error('系统服务异常500！' + err)
  })
}
