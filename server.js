const server = require('http').createServer(handler)
const io = require('socket.io')(server)
const fs = require('fs')
const url = require('url');
const PORT = process.argv[2] || process.env.PORT || 3000
const ROOT_DIR = 'html'
const users = {}

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}

server.listen(PORT)

function handler(request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let filePath = ROOT_DIR + urlObj.pathname
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

  fs.readFile(filePath, function(err, data) {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err))
      response.writeHead(404);
      response.end(JSON.stringify(err))
      return
    }
    response.writeHead(200, {
      'Content-Type': get_mime(filePath)
    })
    response.end(data)
  })

}

io.on('connection', function(socket) {

  socket.on('userConnects', function(userName){
    users[socket.id] = userName
    console.log(userName+" has connected")
    socket.emit('broadcastUserName', 'SERVER: You are connected to CHAT SERVER as '+userName)
    console.log("THE USERS:\n")
    console.log(users)
  })

  socket.on('clientSays', function(data) {
    let messageObject = {senderID:socket.id}
    let socketIds = Object.keys(users)
    let recepientCount = 0
    let recepientIds = {}
    
    if(data.recepients!=""){
      
      for(let recepient of data.recepients){
        let recepientId = socketIds.find((socketId)=>users[socketId]===recepient.trim())
        if(recepientId){
          recepientIds[recepientCount] = recepientId
          ++recepientCount
        }
      }
    }
    
    if(recepientCount>0){
      messageObject.messageString= users[socket.id]+": "+data.sentMessage.split(":").slice(1).join(':')
      console.log("the recepients of this message are: "+data.recepients)
      console.log("the message is: "+messageObject.messageString+"\n")
      messageObject.chatType = 'private'
      io.to(socket.id).emit('serverSays',messageObject)
      for(let currentRecepient of Object.keys(recepientIds)){
        io.to(recepientIds[currentRecepient]).emit('serverSays',messageObject)
      }
    }
    else{
        messageObject.messageString = users[socket.id]+": "+data.sentMessage
        console.log("the message is: "+messageObject.messageString+"\n")
        messageObject.chatType = 'public'
        for(let socketId of socketIds){
          io.to(socketId).emit('serverSays',messageObject)
        }
    }
  })

  socket.on('disconnect', function(data) {
    if(users[socket.id]){
      console.log(users[socket.id]+" has disconnected\n")
      delete users[socket.id]
    }
  })
})
console.log(`Server Running at port ${PORT}  CNTL-C to quit`)
console.log(`To Test:`)
console.log(`Open several browsers to: http://localhost:${PORT}/chatClient.html`)
