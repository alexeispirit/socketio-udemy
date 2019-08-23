// captures local performance data
// req:
// farmhash
// socket.io-client

// performance
// - CPU Load
// - Memory usage
// - free
// - total
// - OS type
// - uptime
// - CPU info
// - type
// - number of cores
// - clock speed

const os = require("os");
const io = require("socket.io-client");

let socket = io("http://127.0.0.1:8181");

socket.on("connect", () => {
  console.log("I connected to sockets server");
  // we need a way to identify this machine to whomever concerned
  const nI = os.networkInterfaces();
  let mac;
  // loop though all the nI for this machine and find a non-internal one
  for (let key in nI) {
    // FOR TESTING ONLY
    mac = Math.floor(Math.random() * 3) + 1;
    break;
    // FOR TESTING ONLY

    if (!nI[key][0].internal) {
      mac = nI[key][0].mac;
      break;
    }
  }

  // client auth with simple key value
  socket.emit("clientAuth", "node");

  performanceData().then(pData => {
    pData.mac = mac;
    socket.emit("initPerfData", pData);
  });

  // start sending data over
  let perfDataInterval = setInterval(() => {
    performanceData().then(pData => {
      pData.mac = mac;
      socket.emit("perfData", pData);
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  });
});

function performanceData() {
  return new Promise(async (resolve, reject) => {
    const cpus = os.cpus();

    const perfData = {
      osType: os.type(),
      upTime: os.uptime(),
      freeMem: os.freemem(),
      totalMem: os.totalmem(),
      usedMem: os.totalmem() - os.freemem(),
      memUsage:
        Math.floor(((os.totalmem() - os.freemem()) / os.totalmem()) * 100) /
        100,
      cpuModel: cpus[0].model,
      numCores: cpus.length,
      cpuSpeed: cpus[0].speed,
      isActive: true
    };

    perfData.cpuLoad = await getCpuLoad();

    resolve(perfData);
  });
}

// cpus is all cores. we need the average of all the cores which
// will give us the cpu average
function cpuAverage() {
  const cpus = os.cpus();
  // get ms in each mode, but this number is since reboot
  // so get it now and get it in 100ms and compare
  let idleMs = 0;
  let totalMs = 0;
  // loop through each core
  cpus.forEach(aCore => {
    for (type in aCore.times) {
      totalMs += aCore.times[type];
    }
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length
  };
}

function getCpuLoad() {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      const percentageCpu =
        100 - Math.floor((100 * idleDifference) / totalDifference);
      resolve(percentageCpu);
    }, 100);
  });
}
