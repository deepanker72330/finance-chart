import React, { useState, useEffect } from "react";
import "./App.css";
import BasicTabs from "./components/Menu";

// Sample data for demonstration
const fullData = [
  { date: new Date("2024-10-10"), value: 30000 },
  { date: new Date("2024-10-11"), value: 63000 },
  { date: new Date("2024-10-12"), value: 40000 },
  { date: new Date("2024-10-13"), value: 54000 },
  { date: new Date("2024-10-14"), value: 61000 },
  { date: new Date("2024-10-15"), value: 64500 },
  { date: new Date("2024-10-16"), value: 63179.85 },
];

function App() {
  const [lastDataValue, setLastDataValue] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const lastValue = fullData[fullData.length - 1].value;
    const initialProfit = lastValue - fullData[0].value;

    setLastDataValue(lastValue);
    setProfit(initialProfit);
  }, []);

  console.log(profit, lastDataValue, "Main page");

  return (
    <div className="App">
      <div className="App-header">
        <h1>
          {lastDataValue.toLocaleString()}
          <sup className="usd-sup">USD</sup>
        </h1>
        <p className="profit-line">{`${profit.toLocaleString()} (${(
          (profit / (lastDataValue - profit)) *
          100
        ).toFixed(2)}%)`}</p>
      </div>
      <BasicTabs
        onLastDataValueChange={setLastDataValue}
        onProfitChange={setProfit}
      />
    </div>
  );
}

export default App;
