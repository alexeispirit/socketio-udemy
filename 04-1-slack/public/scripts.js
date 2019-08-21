const socket = io("http://localhost:9000"); // the / endpoint
const socket2 = io("http://localhost:9000/admin"); // the /admin endpoint

socket.on("messageFromServer", dataFromServer => {
  console.log(dataFromServer);
  socket.emit("messageToServer", { data: "Data from client" });
});

socket.on("joined", msg => {
  console.log(msg);
});

socket2.on("welcome", dataFromServer => {
  console.log(dataFromServer);
});

document.querySelector("#message-form").addEventListener("submit", event => {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;

  socket.emit("newMessageToServer", { text: newMessage });
});
