import * as axios from 'axios'
import utils from '@/plugins/utils'

let options = {
  withCredentials: false,
  headers: {
    post: {
      'Content-Type': 'application/json',
      'Authorization': ''
    },
		'Authorization': ''
  }
}

let axiosInstance = axios.create(options)

axiosInstance.interceptors.request.use(function (config) {

  console.log('url', config.url)
  config.headers['Authorization'] = utils.getLocalItem('token')
  if (config.method === 'get') {
    //config.params = Object.assign({t: +new Date()}, config.params)
  }
  if(config.method == 'get'){
    console.log('==== get params ====', JSON.stringify(config.params))
  }else{
    console.log('==== ' + config.method + ' params ====', JSON.stringify(config.data))
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axiosInstance.interceptors.response.use(function (response){
  let data = JSON.stringify(response.data)
  data = data.replace(/192.168.26.174/g, '192.168.0.101')
  //data = data.replace(/192.168.26.174/g, '192.168.23.114')
  response.data = JSON.parse(data)
  console.log('==== response ====', JSON.stringify(response.data))
  return response
}, function (err) {
  console.log(err)
  // 对响应错误做点什么
  return Promise.reject(err)
})

export default axiosInstance
