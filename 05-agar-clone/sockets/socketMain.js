// main sockets
const io = require("../servers").io;

const Orb = require("./classes/orb");
const Player = require("./classes/player");
const PlayerConfig = require("./classes/playerConfig");
const PlayerData = require("./classes/playerData");

let orbs = [];
let players = [];

let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500
};

initGame();

io.sockets.on("connect", socket => {
  // a player has connected
  socket.on("init", data => {
    // make a playerConfig object
    let playerConfig = new PlayerConfig(settings);
    // make a playerData object
    let playerData = new PlayerData(data.player.name, settings);
    // make a master player object to hold both
    let player = new Player(socket.id, playerConfig, playerData);

    socket.emit("initReturn", { orbs });
    players.push(playerData);
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
