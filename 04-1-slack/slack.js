const express = require("express");
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");
console.log(namespaces);

const app = express();

app.use(express.static(__dirname + "/public"));

const server = app.listen(9000);

const io = socketio(server);

io.on("connection", socket => {
  socket.emit("messageFromServer", { data: "Welcome to the socketio server" });
  socket.on("messageToServer", dataFromClient => {
    console.log(dataFromClient);
  });
  socket.join("level1");
  io.of("/")
    .to("level1")
    .emit("joined", `${socket.id} says I have joined the level 1 room`);
});

io.of("/admin").on("connection", socket => {
  console.log("admin_namespace");
  io.of("/admin").emit("welcome", "Welcome to the admin channel!");
});
