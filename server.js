const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let players = {};

io.on('connection', socket => {
  console.log(`Player connected: ${socket.id}`);
  players[socket.id] = {
    x: 400,
    y: 300,
    angle: 0,
    turretAngle: 0,
    id: socket.id
  };

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('move', data => {
    if (players[socket.id]) {
      players[socket.id] = { ...players[socket.id], ...data };
      socket.broadcast.emit('updatePlayer', players[socket.id]);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('removePlayer', socket.id);
  });
});

http.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
