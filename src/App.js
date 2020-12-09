import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { createChart } from 'lightweight-charts';
import Graph from './Graph';

function App() {
  
  const socket = io("http://127.0.0.1:4000");
  socket.on('KLINE', (payload) => {
    // console.log(payload);
    // candleSeries.update(payload);
  });

  return (
    <>
      <h1>TradingView+Binance</h1>
      <Graph />
    </>
  );
}

export default App;
