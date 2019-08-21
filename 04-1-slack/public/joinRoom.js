function joinRoom(roomName) {
  // Send this roomName to the server
  nsSocket.emit("joinRoom", roomName, newNumberOfMembers => {
    // we want to update the room memver total now that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
  });
}
