function joinNs(endpoint) {
  const nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on("nsRoomLoad", nsRooms => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach(room => {
      let glyph = room.privateRoom ? "lock" : "globe";
      roomList.innerHTML += `<li class="room">
      <span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}
    </li>`;
    });

    // add a click listener to each room
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach(el => {
      el.addEventListener("click", e => {
        console.log(e.target.innerText);
      });
    });
  });

  nsSocket.on("messageToClients", msg => {
    document.querySelector("#messages").innerHTML += `<li>${smg.text}</li>`;
  });

  document.querySelector(".message-form").addEventListener("submit", e => {
    e.preventDefault();
    const newMessage = document.querySelector("#user-message").nodeValue;
    nsSocket.emit("newMessageToServer", { text: newMessage });
  });
}
