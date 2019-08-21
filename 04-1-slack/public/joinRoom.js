function joinRoom(roomName) {
  // Send this roomName to the server
  nsSocket.emit("joinRoom", roomName, newNumberOfMembers => {
    // we want to update the room memver total now that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
  });

  // get the history of the room
  nsSocket.on("historyCatchUp", history => {
    const messagesUl = document.querySelector("#messages");
    messagesUl.innerHTML = "";
    history.forEach(msg => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  });

  nsSocket.on("updateMembers", numMembers => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerHTML = `${roomName}`;
  });

  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", e => {
    let messages = Array.from(document.getElementsByClassName("message-text"));
    messages.forEach(msg => {
      console.log(msg);
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        // the msg does not contain the user search term
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}
