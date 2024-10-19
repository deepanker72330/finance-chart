import React from "react";
import "./NewApp.css";
import BasicTabs from "./components/Menu";
// import FinancialChart from "./components/FinancialChart";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <h1>
          63,179.72<sup className="usd-sup">USD</sup>
        </h1>
        <p className="profit-line">+2,161.42 (3.54%)</p>
      </div>
      {/* <div className="menu">
        <button>Summary</button>
        <button>Chart</button>
        <button>Statistics</button>
        <button>Analysis</button>
        <button>Settings</button>
      </div> */}
      {/* <div className="chart-container">
        <FinancialChart />
      </div> */}
      <BasicTabs />
    </div>
  );
}

export default App;
