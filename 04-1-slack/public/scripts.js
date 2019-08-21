const socket = io("http://localhost:9000");

// listen for nsList, which is a list of all namespaces
socket.on("nsList", nsData => {
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach(ns => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${
      ns.endpoint
    }><img src="${ns.img}" /></div>`;
  });

  // add a click listener for each NS
  Array.from(document.getElementsByClassName("namespace")).forEach(el => {
    el.addEventListener("click", e => {
      const nsEndpoint = el.getAttribute("ns");
      console.log(nsEndpoint);
    });
  });

  const nsSocket = io("http://localhost:9000/wiki");
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
});
