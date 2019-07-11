import utils from '@/plugins/utils'
import address from '../../../config/address'

function Message(){
  let user = utils.getLocalUser()
  let msg = new EventSource('http://172.28.157.145:8080/nurserystock/biz/msg/channel/' + user.userid + '?retry=10000')

  msg.onopen = function(){
    console.log('****************eventsource opened!')
  }

  msg.onmessage = function(e){
    console.log('msg', e.data)
  }

  msg.onerror = function(e){
    console.log('open eventsource error', JSON.stringify(e))
  }
  msg.onclose = function(e){
    console.log('closed')
  }

  msg.addEventListener('evt_my', rs => {
    console.log('接收到data', rs.data)
    utils.setLocalItem('evt_my', rs.data || '{}')
  })
}

export default Message
