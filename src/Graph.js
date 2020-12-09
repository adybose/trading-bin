import React from 'react';
import io from 'socket.io-client';
import { createChart } from "lightweight-charts";


const  Graph = () => {
    const socket = io("http://127.0.0.1:4000");

    const chartRef = React.useRef(null);
    // TradingView Static Chart
    const chartProperties ={
        width: 1500,
        height: 600,
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        }
    }

    React.useEffect(()=> {
        if(chartRef.current) {
            const chart = createChart(chartRef.current, chartProperties);
            prepareChart(chart);
        }
    }, [])

    function prepareChart(chart) {
        var candleSeries = chart.addCandlestickSeries();

        // Fetch binance static chart
        fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000')
            .then(res => res.json())
            .then(data => {
                const cdata = data.map(d => {
                    return {
                        time:d[0]/1000,
                        open: parseFloat(d[1]),
                        high: parseFloat(d[2]),
                        low: parseFloat(d[3]),
                        close: parseFloat(d[4])
                    }
                });
                candleSeries.setData(cdata);
                console.log("fetch() called");
            })
            .catch(err => console.log(err))
        // If fetch api gives CORS issue, use a node proxy

        // Fetch live data from Binance socket server
        socket.on('KLINE', (payload) => {
            console.log(payload);
            candleSeries.update(payload);
        });
    }
    
    return <div ref={chartRef} />;
}

export default Graph;