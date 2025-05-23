// server.js
let players = {};
let bullets = [];

io.on('connection', socket => {
  players[socket.id] = {
    id: socket.id,
    x: 400,
    y: 300,
    angle: 0,
    turretAngle: 0,
    hp: 100,
  };

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('move', data => {
    if (players[socket.id]) {
      players[socket.id] = { ...players[socket.id], ...data };
      socket.broadcast.emit('updatePlayer', players[socket.id]);
    }
  });

  socket.on('shoot', () => {
    if (!players[socket.id]) return;
    const p = players[socket.id];
    bullets.push({
      id: socket.id,
      x: p.x,
      y: p.y,
      angle: p.turretAngle,
      speed: 7,
      from: socket.id,
    });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('removePlayer', socket.id);
  });
});

// Обработка пуль (10 раз в секунду)
setInterval(() => {
  bullets.forEach((b, i) => {
    b.x += Math.cos(b.angle) * b.speed;
    b.y += Math.sin(b.angle) * b.speed;

    for (let id in players) {
      if (id !== b.from) {
        const p = players[id];
        const dx = p.x - b.x;
        const dy = p.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20) {
          p.hp -= 20;
          if (p.hp <= 0) {
            p.hp = 100;
            p.x = Math.random() * 800;
            p.y = Math.random() * 600;
          }
          bullets.splice(i, 1);
        }
      }
    }
  });

  io.emit('updateBullets', bullets);
}, 100);
