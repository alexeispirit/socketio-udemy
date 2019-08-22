function socketMain(io, socket) {
  // console.log("A socket connected", socket.id);
  socket.on("clientAuth", key => {
    if (key) {
      // valid nodeClient
      socket.join("clients");
    } else if (key) {
      // valid ui client
      socket.join("ui");
    } else {
      // invalid client
      socket.disconnect(true);
    }
  });

  socket.on("perfData", console.log);
}

module.exports = socketMain;
