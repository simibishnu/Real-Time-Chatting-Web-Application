function clear(){
    console.log("this user wants to clear")
    document.getElementById('messages').innerHTML = ''
}

function handleKeyDown(event) {
    const ENTER_KEY = 13
    if (event.keyCode === ENTER_KEY) {
      send()
      return false
    }
}

function connect(){
  let userName = document.getElementById('connectBox').value.trim()
  let valid = true

  if(userName===''){
    console.log("invalid user name. try again.")
    document.getElementById('connectBox').value = ''
    valid = false
  }

    for(char in userName){
      if(char == 0){
        if(!(/^[a-zA-Z]/.test(userName))){
          valid = false;
          document.getElementById('connectBox').value = ''
          console.log("invalid user name. try again.")
          break;
        }
      }
      else{
        if(!(/^[a-zA-Z][a-zA-Z0-9]*$/.test(userName))){
          valid = false;
          document.getElementById('connectBox').value = ''
          console.log("invalid user name. try again.")
          break;
        }
      }
    }

    if(valid){
        socket.emit('userConnects',userName)
        document.getElementById('send_button').disabled = false
        document.getElementById('msgBox').disabled = false
        document.getElementById('clear_button').disabled = false
        document.getElementById('connect_button').disabled = true
        document.getElementById('connectBox').disabled = true
    }
}

function send(){
  let message = document.getElementById('msgBox').value.trim()
  if(message === '') return //do nothing
  let recepients = ""

  if(message.includes(":")){
    recepients = message.split(':').shift().split(',')
  }
  
  let messageObject = {sentMessage: message, recepients: recepients, socketId: socket.id}
  socket.emit('clientSays', messageObject)
  
  document.getElementById('msgBox').value = ''
}