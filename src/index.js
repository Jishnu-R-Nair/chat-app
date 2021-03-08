const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDirectory));

io.on('connection', () => {
  console.log('New WebSocket connection');
});

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
