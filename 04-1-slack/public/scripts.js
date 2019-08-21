// const socket = io("http://localhost:9000");
const username = prompt("What is your username");

const socket = io("http://localhost:9000", {
  query: {
    username: username
  }
});

let nsSocket;
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
      joinNs(nsEndpoint);
    });
  });
});
