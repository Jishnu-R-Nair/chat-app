const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
  generateMessage,
  generateLocationMessage,
} = require('../src/utils/messages');
const {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser,
} = require('./utils/users');

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const filter = new Filter();

app.use(express.static(publicDirectory));

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser(socket.id, username, room);

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast
      .to(user.room)
      .emit('message', generateMessage(`${user.username} has joined`));
  });

  socket.on('sendMessage', (message, callback) => {
    if (filter.isProfane(message)) return callback('Profanity is not allowed');
    const user = getUser(socket.id);

    if (!user) return callback('User not found');

    io.to(user.room).emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);

    if (!user) return callback('User not found');

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(
        `https://www.google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage(`${user.username} has left!`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
