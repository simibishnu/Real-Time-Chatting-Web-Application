document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('send_button').addEventListener('click', send)
    document.addEventListener('keydown', handleKeyDown)
    document.getElementById('connect_button').addEventListener('click', connect)
    document.getElementById('clear_button').addEventListener('click',clear)
  
  })