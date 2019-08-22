// main sockets
const io = require("../servers").io;

const Orb = require("./classes/orb");
const Player = require("./classes/player");
const PlayerConfig = require("./classes/playerConfig");
const PlayerData = require("./classes/playerData");
const {
  checkForOrbCollisions,
  checkForPlayerCollisions
} = require("./checkCollisions");

let orbs = [];
let players = [];

let settings = {
  defaultOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000
};

initGame();

// issue a message to every connected socket 30fps
setInterval(() => {
  if (players.length > 0) {
    io.to("game").emit("tock", {
      players
    });
  }
}, 33);

io.sockets.on("connect", socket => {
  let player = {};
  // a player has connected
  socket.on("init", data => {
    // add player to game namespace
    socket.join("game");
    // make a playerConfig object
    let playerConfig = new PlayerConfig(settings);
    // make a playerData object
    let playerData = new PlayerData(data.playerName, settings);
    // make a master player object to hold both
    player = new Player(socket.id, playerConfig, playerData);

    // issue a message to this client with location 30fps
    setInterval(() => {
      socket.emit("tickTock", {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY
      });
    }, 33); // there are 30 33s in 1000 milliseconds or 1/30th of a second, or 1 of 30fps

    socket.emit("initReturn", { orbs });
    players.push(playerData);

    // client sent over a tick. that means we know what direction to move the player
    socket.on("tick", data => {
      speed = player.playerConfig.speed;
      // update the playerConfig object with new direction in data
      // and the same time create a local variable for this callback readability
      xV = player.playerConfig.xVector = data.xVector;
      yV = player.playerConfig.yVector = data.yVector;

      if (
        (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
        (player.playerData.locX > settings.worldWidth && xV > 0)
      ) {
        player.playerData.locY -= speed * yV;
      } else if (
        (player.playerData.locY < 5 && yV > 0) ||
        (player.playerData.locY > settings.worldHeight && yV < 0)
      ) {
        player.playerData.locX += speed * xV;
      } else {
        player.playerData.locX += speed * xV;
        player.playerData.locY -= speed * yV;
      }

      // ORB COLLISION
      let capturedOrb = checkForOrbCollisions(
        player.playerData,
        player.playerConfig,
        orbs,
        settings
      );
      capturedOrb
        .then(data => {
          // a collision happened
          // emit to all sockets the orb to replace
          const orbData = {
            orbIndex: data,
            newOrb: orbs[data]
          };
          // every socket needs to know the leader board has changed
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
          io.sockets.emit("orbSwitch", orbData);
        })
        .catch(() => {
          // no collision
        });

      // PLAYER COLLISION
      let playerDeath = checkForPlayerCollisions(
        player.playerData,
        player.playerConfig,
        players,
        player.socketId
      );
      playerDeath
        .then(data => {
          // every socket needs to know the leader board has changed
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
          // a player was absorbed. let everybody know
          io.sockets.emit("playerDeath", data);
        })
        .catch(() => {
          // no collision
        });
    });
  });

  socket.on("disconnect", data => {
    // find out who just left... which player in players
    if (player.playerData) {
      players.forEach((curPlayer, i) => {
        if (curPlayer.uid === player.playerData.uid) {
          players.splice(i, 1);
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        }
      });
      // update stats in database if needed
    }
  });
});

function getLeaderBoard() {
  // sort players in desc order
  players.sort((a, b) => b.score - a.score);
  let leaderBoard = players.map(curPlayer => {
    return {
      name: curPlayer.name,
      score: curPlayer.score
    };
  });
  return leaderBoard;
}

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
