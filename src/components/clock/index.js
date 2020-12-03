import "./style.css";
import React from "react";
import { init } from "./js";
export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
    };
  }
  componentDidMount() {
    this.state.timer = init();
  }
  componentWillUnmount() {
    window.clearInterval(this.state.timer);
  }
  render() {
    return (
      <div class="content">
        <canvas id="canvas" width="500" height="500"></canvas>
      </div>
    );
  }
}
