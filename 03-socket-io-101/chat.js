const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(__dirname + "/public"));

const server = app.listen(9000);

const io = socketio(server);

io.on("connection", socket => {
  // socket.emit("messageFromServer", { data: "Welcome to socketio server" });
  // socket.on("messageToServer", dataFromClient => {
  //   console.log(dataFromClient);
  // });
  socket.on("newMessageToServer", msg => {
    // console.log(msg);
    io.emit("messageToClients", { text: msg.text });
  });
});
