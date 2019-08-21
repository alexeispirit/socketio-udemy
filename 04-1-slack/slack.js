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
    // a socket has connected to one of our chatgroup namespaces
    // send that ns group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);

      nsSocket.join(roomToJoin);
      const nsRoom = namespace.rooms.find(
        room => room.roomTitle === roomToJoin
      );
      nsSocket.emit("historyCatchUp", nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin);
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

      // we need to find the Room object for this room
      const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
      nsRoom.addMessage(fullMsg);

      io.of(namespace.endpoint)
        .to(roomTitle)
        .emit("messageToClients", fullMsg);
    });
  });
});

function updateUsersInRoom(namespace, roomToJoin) {
  // send back the number of users in this room to all sockets connected to this room
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((err, clients) => {
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit("updateMembers", clients.length);
    });
}
