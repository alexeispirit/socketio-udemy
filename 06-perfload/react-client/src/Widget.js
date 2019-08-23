import React from "react";
import Cpu from "./Cpu";
import Mem from "./Mem";
import Info from "./Info";

import "./widget.css";

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
      mac,
      isActive
    } = this.props.data;

    const cpuWidgetId = `cpu-widget-${mac}`;
    const memWidgetId = `mem-widget-${mac}`;

    const cpu = { cpuLoad, cpuWidgetId };
    const mem = { memWidgetId, totalMem, usedMem, memUsage, freeMem };
    const info = { mac, osType, upTime, cpuModel, cpuSpeed, numCores };

    let notActiveDiv = null;
    if (!isActive) notActiveDiv = <div className="not-active">Offline</div>;

    return (
      <div className="widget col-sm-12">
        {notActiveDiv}
        <Cpu cpuData={cpu} />
        <Mem memData={mem} />
        <Info infoData={info} />
      </div>
    );
  }
}

export default Widget;
