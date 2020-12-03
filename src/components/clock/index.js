import "./style.css";
import React from "react";
import { init } from "./js";
export default class Clock extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    init();
  }
  render() {
    return (
      <div class="content">
        <canvas id="canvas" width="500" height="500"></canvas>
      </div>
    );
  }
}
