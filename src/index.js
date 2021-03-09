const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const filter = new Filter();

app.use(express.static(publicDirectory));

io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A user has joined');

  socket.on('sendMessage', (message, callback) => {
    if (filter.isProfane(message)) return callback('Profanity is not allowed');

    io.emit('message', message);
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    io.emit(
      'message',
      `https://www.google.com/maps?q=${latitude},${longitude}`
    );
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });
});

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
