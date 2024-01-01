const socket = io()
const users = {}

socket.on('serverSays', function(message) {
  let msgDiv = document.createElement('div')
  msgDiv.textContent = message.messageString

  if(message.chatType === 'public'){
    if(socket.id===message.senderID){
      msgDiv.classList.add('sentBy')
    }
    else{
      msgDiv.classList.add('sentTo')
    }
  }

  if(message.chatType === 'private'){
    msgDiv.classList.add('private')
  }

  document.getElementById('messages').appendChild(msgDiv)
})

socket.on('broadcastUserName',function(serverAcknowledgement){

  let msgDiv = document.createElement('div')
  msgDiv.textContent = serverAcknowledgement
  document.getElementById('messages').appendChild(msgDiv)

})







