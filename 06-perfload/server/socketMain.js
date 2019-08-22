const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/perfData", { useNewUrlParser: true });

const Machine = require("./models/Machine");

function socketMain(io, socket) {
  let mac;
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

  // a machine has connected, check to see if it is new
  // if it is, add it
  socket.on("initPerfData", async data => {
    // update socket connect function scoped variable
    mac = data.mac;
    // now go check mongo
    const mongooseResponse = await checkAndAdd(data);
    console.log(mongooseResponse);
  });

  socket.on("perfData", console.log);
}

function checkAndAdd(data) {
  return new Promise((resolve, reject) => {
    Machine.findOne({ mac: data.mac }, (err, doc) => {
      if (err) {
        throw err;
      } else if (doc === null) {
        let newMachine = new Machine(data);
        newMachine.save();
        resolve("added");
      } else {
        resolve("found");
      }
    });
  });
}

module.exports = socketMain;
