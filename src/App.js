// import logo from "./logo.svg";
import "./App.css";

// import Clock from "./components/clock";
// import Page1 from "./components/page1";
import CanvasTool from "./components/canvas";
// import MoveCom from "./components/move";
import "antd/dist/antd.css";
function App() {
  return (
    <div className="App">
      {/* <div className="asdfa">112</div> */}
      {/* <MoveCom></MoveCom> */}
      {/* <Page1></Page1> */}
      {/* <Clock></Clock> */}
      {<CanvasTool />}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
