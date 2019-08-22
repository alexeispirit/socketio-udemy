import React from "react";
import Cpu from "./Cpu";
import Mem from "./Mem";
import Info from "./Info";

class Widget extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      osType,
      upTime,
      freeMem,
      totalMem,
      usedMem,
      memUsage,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad,
      mac
    } = this.props.data;

    const cpu = { cpuLoad };
    const mem = { totalMem, usedMem, memUsage, freeMem };
    const info = { mac, osType, upTime, cpuModel, cpuSpeed, numCores };

    return (
      <div>
        <h1>Widget!!</h1>
        <Cpu cpuData={cpu} />
        <Mem memData={mem} />
        <Info infoData={info} />
      </div>
    );
  }
}

export default Widget;
