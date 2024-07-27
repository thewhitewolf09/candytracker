import React, { useState, useEffect } from "react";
import "./App.css";

const generateInitialState = () => {
  let state = [];
  for (let i = 0; i < 120; i++) {
    let row = [];
    for (let j = 1; j <= 10; j++) {
      row.push({ number: j, result: null, clicked: false });
    }
    state.push(row);
  }
  return state;
};

const App = () => {
  const [trades, setTrades] = useState(() => {
    const storedTrades = localStorage.getItem("trades");
    return storedTrades ? JSON.parse(storedTrades) : generateInitialState();
  });
  const [selectedTrade, setSelectedTrade] = useState({ rowIndex: null, colIndex: null });

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const handleResultChange = (result) => {
    const { rowIndex, colIndex } = selectedTrade;

    if (rowIndex !== null && colIndex !== null) {
      const newTrades = trades.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.map((trade, cIndex) => {
            if (cIndex === colIndex) {
              return { ...trade, result: result, clicked: false };
            }
            return trade;
          });
        }
        return row;
      });
      setTrades(newTrades);
      setSelectedTrade({ rowIndex: null, colIndex: null });
    }
  };

  const handleTradeClick = (rowIndex, colIndex) => {
    const newTrades = trades.map((row, rIndex) =>
      row.map((trade, cIndex) => ({
        ...trade,
        clicked: rIndex === rowIndex && cIndex === colIndex ? true : false,
      }))
    );
    setTrades(newTrades);
    setSelectedTrade({ rowIndex, colIndex });
  };

  const calculateWinningPercentage = () => {
    let totalTrades = 0;
    let wins = 0;

    trades.forEach((row) => {
      row.forEach((trade) => {
        if (trade.result !== null) {
          totalTrades++;
          if (trade.result === "win") {
            wins++;
          }
        }
      });
    });

    return totalTrades === 0 ? 0 : ((wins / totalTrades) * 100).toFixed(2);
  };

  const handleReset = () => {
    localStorage.removeItem("trades");
    setTrades(generateInitialState());
  };

  return (
    <div className="App">
      <h1>Candy Tracker 🍭</h1>
      <div className="trade-container">
        <div className="trades-container-num">
          {trades.map((row, rowIndex) => (
            <div key={rowIndex} className="trade-row">
              <span className="row-number">{rowIndex + 1}</span>
              {row.map((trade, colIndex) => (
                <div
                  key={colIndex}
                  className={`trade-item ${trade.result} ${trade.clicked ? 'clicked' : ''}`}
                  style={{
                    backgroundColor:
                      trade.result === "win"
                        ? "green"
                        : trade.result === "loss"
                        ? "red"
                        : "white",
                  }}
                  onClick={() => handleTradeClick(rowIndex, colIndex)}
                >
                  <span>{trade.number}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="control-panel">
          <div className="button-container">
            <button
              className="win-button"
              onClick={() => handleResultChange("win")}
            >
              Win
            </button>
            <button
              className="loss-button"
              onClick={() => handleResultChange("loss")}
            >
              Loss
            </button>
          </div>
          <div className="percentage-container">
            <h2>Winning Percentage: {calculateWinningPercentage()}%</h2>
          </div>
          <button className="reset-button" onClick={handleReset}>
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
