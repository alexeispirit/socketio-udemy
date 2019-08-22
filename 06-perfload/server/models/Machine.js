const mongoose = require("mongoose");

const Machine = new mongoose.Schema({
  mac: String,
  cpuLoad: Number,
  freeMem: Number,
  totalMem: Number,
  usedMem: Number,
  memUsage: Number,
  osType: String,
  upTime: Number,
  cpuModel: String,
  numCores: Number,
  cpuSpeed: Number
});

module.exports = mongoose.model("Machine", Machine);
