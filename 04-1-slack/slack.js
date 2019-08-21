const express = require("express");
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");

const app = express();

app.use(express.static(__dirname + "/public"));

const server = app.listen(9000);

const io = socketio(server);

io.on("connection", socket => {
  // build an array to send back with the img and endpoint for each NS
  let nsData = namespaces.map(ns => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    };
  });

  // send nsData back to the client.
  // we need to use socket, not io, because we want it
  // to go to just this client
  socket.emit("nsList", nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on("connection", nsSocket => {
    console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
    // a socket has connected to one of our chatgroup namespaces
    // send that ns group info back
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      nsSocket.join(roomToJoin);
      io.of("/wiki")
        .in(roomToJoin)
        .clients((err, clients) => {
          numberOfUsersCallback(clients.length);
        });
    });

    nsSocket.on("newMessageToServer", msg => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "Alex",
        avatar: "https://via.placeholder.com/30"
      };
      // Send this message to all the sockets that are in the room that this socket is in
      // how to find out what rooms this socket is in?
      // the user will be in the 2nd room in the object list (nsSocket.rooms)
      // this is because the socket always joins its own room on connections
      // get the keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      io.of("/wiki")
        .to(roomTitle)
        .emit("messageToClients", fullMsg);
    });
  });
});
