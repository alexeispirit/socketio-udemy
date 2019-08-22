import React from "react";
import "./App.css";
import socket from "./utilities/socketConnection";
import Widget from "./Widget";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      performanceData: {}
    };
  }

  componentDidMount() {
    socket.on("data", data => {
      // inside this callback we got new data
      const currentState = { ...this.state.performanceData };
      currentState[data.mac] = data;
      this.setState({ performanceData: currentState });
    });
  }

  render() {
    let widgets = [];
    const data = this.state.performanceData;
    Object.entries(data).forEach(([key, value]) => {
      widgets.push(<Widget key={key} data={value} />);
    });

    return <div className="App">{widgets}</div>;
  }
}

export default App;
