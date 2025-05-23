const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io();

let players = {};
let me = null;

document.addEventListener('keydown', e => {
  if (!me) return;
  if (e.key === 'ArrowUp') me.y -= 5;
  if (e.key === 'ArrowDown') me.y += 5;
  if (e.key === 'ArrowLeft') me.angle -= 0.1;
  if (e.key === 'ArrowRight') me.angle += 0.1;
  if (e.key === 'a') me.turretAngle -= 0.1;
  if (e.key === 'd') me.turretAngle += 0.1;

  socket.emit('move', me);
});

function drawTank(player) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);
  ctx.fillStyle = 'green';
  ctx.fillRect(-15, -10, 30, 20);
  ctx.restore();

  // башня
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.turretAngle);
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, -5, 30, 10);
  ctx.restore();
}

socket.on('currentPlayers', data => {
  players = data;
  me = players[socket.id];
});

socket.on('newPlayer', player => {
  players[player.id] = player;
});

socket.on('updatePlayer', player => {
  players[player.id] = player;
});

socket.on('removePlayer', id => {
  delete players[id];
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    drawTank(players[id]);
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
