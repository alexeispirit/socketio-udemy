const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(__dirname + "/public"));

const server = app.listen(9000);

const io = socketio(server);

io.on("connection", socket => {
  socket.on("newMessageToServer", msg => {
    io.emit("messageToClients", { text: msg.text });
  });
});

io.of("/admin").on("connection", socket => {
  console.log("admin_namespace");
  io.of("/admin").emit("welcome", "Welcome to the admin channel!");
});
