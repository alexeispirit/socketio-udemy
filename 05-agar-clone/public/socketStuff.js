let socket = io.connect("http://localhost:8080");

// called when user clicks on the start button
function init() {
  // start drawing the screen
  draw();
  // call the init event when the client is ready for the data
  socket.emit("init", {
    playerName: player.name
  });
}

socket.on("initReturn", data => {
  orbs = data.orbs;
  setInterval(() => {
    socket.emit("tick", {
      xVector: player.xVector,
      yVector: player.yVector
    });
  }, 33);
});

socket.on("tock", data => {
  players = data.players;
});

socket.on("orbSwitch", data => {
  console.log(data);
  orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on("tickTock", data => {
  player.locX = data.playerX;
  player.locY = data.playerY;
});

socket.on("updateLeaderBoard", data => {
  const leaderBoard = document.querySelector(".leader-board");
  leaderBoard.innerHTML = "";
  data.forEach(curPlayer => {
    leaderBoard.innerHTML += `
      <li class="leaderboard-player">${curPlayer.name} - ${curPlayer.score}</li>
    `;
  });
});
