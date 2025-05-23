let bullets = [];

document.addEventListener('keydown', e => {
  if (!me) return;
  if (e.key === 'ArrowUp') me.y -= 5;
  if (e.key === 'ArrowDown') me.y += 5;
  if (e.key === 'ArrowLeft') me.angle -= 0.1;
  if (e.key === 'ArrowRight') me.angle += 0.1;
  if (e.key === 'a') me.turretAngle -= 0.1;
  if (e.key === 'd') me.turretAngle += 0.1;
  if (e.code === 'Space') socket.emit('shoot');

  socket.emit('move', me);
});

function drawTank(player) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);
  ctx.fillStyle = player.id === socket.id ? 'green' : 'blue';
  ctx.fillRect(-15, -10, 30, 20);
  ctx.restore();

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.turretAngle);
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, -5, 30, 10);
  ctx.restore();

  // HP bar
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x - 20, player.y - 30, 40, 5);
  ctx.fillStyle = 'lime';
  ctx.fillRect(player.x - 20, player.y - 30, 40 * (player.hp / 100), 5);
}

function drawBullets() {
  for (let b of bullets) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, -2, 10, 4);
    ctx.restore();
  }
}

socket.on('updateBullets', data => {
  bullets = data;
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    drawTank(players[id]);
  }
  drawBullets();
  requestAnimationFrame(gameLoop);
}
