// ======== DRAWING ============
function draw() {
  // reset translation back to default
  context.setTransform(1, 0, 0, 1, 0, 0);
  // clear screen
  context.clearRect(0, 0, canvas.width, canvas.height);

  // clamp camera to player
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  // translate allows to move canvas around
  context.translate(camX, camY);

  // draw all players
  players.forEach(p => {
    context.beginPath();
    context.fillStyle = p.color;
    context.arc(p.locX, p.locY, p.radius, 0, 2 * Math.PI);
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "rgb(255,255,255)";
    context.stroke();
  });

  // draw orbs
  orbs.forEach(orb => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, 2 * Math.PI);
    context.fill();
  });

  requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", event => {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector;
  player.yVector = yVector;
});
