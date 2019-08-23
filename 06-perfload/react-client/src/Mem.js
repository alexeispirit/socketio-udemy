import React from "react";
import drawCircle from "./utilities/canvasLoadAnimation";

function Mem(props) {
  const { totalMem, usedMem, memUsage, freeMem } = props.memData;
  const canvas = document.querySelector(".memCanvas");
  drawCircle(canvas, memUsage * 100);
  const totalMemGB = Math.floor((totalMem / 1073741824) * 100) / 100;
  const freeMemGB = Math.floor((freeMem / 1073741824) * 100) / 100;
  return (
    <div className="col-sm-3 mem">
      <h3>Memory usage</h3>
      <div className="canvas-wrapper">
        <canvas className="memCanvas" width="200" height="200" />
        <div className="mem-text">{memUsage * 100}%</div>
      </div>
      <div>Total Memory: {totalMemGB}GB</div>
      <div>Free Memory: {freeMemGB}GB</div>
    </div>
  );
}

export default Mem;
