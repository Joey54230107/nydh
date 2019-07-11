import utils from '@/plugins/utils'

function Message({id = ''}){
  this.id = id
  this.messages = []
  this.connection = null
  this.init()
}

Message.prototype.init = function(){
  if(this.id){
    let messages = utils.getLocalItem('CHAT_MSG_' + this.id)
    if(messages){
      this.messages = JSON.parse(messages)
    }else{
      this.messages = []
      utils.setLocalItem('CHAT_MSG_' + this.id, this.messages)
    }
    //this.connection =
    return true
  }
  return false
}

Message.prototype.addMessage = function({msg = '', type = 't', id = ''}){
  console.log('msg', msg)
  if(msg.trim()){
    this.messages.push({
      id,
      m: msg,
      t: type
    })
    utils.setLocalItem('CHAT_MSG_' + this.id, this.messages)
  }
}

export default Message
