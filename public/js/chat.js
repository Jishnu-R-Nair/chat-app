const socket = io();

const weatherForm = document.querySelector('#message-form');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message);
});

socket.on('message', (message) => {
  console.log(message);
});
