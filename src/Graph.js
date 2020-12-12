import React from 'react';
import { createChart } from "lightweight-charts";


const  Graph = () => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");

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
            prepareChart(chart, ws);
        }
    }, [])

    function prepareChart(chart, ws) {
        var candleSeries = chart.addCandlestickSeries();

        // Fetch binance static chart REST API
        fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const cdata = data.map(d => {
                    return {
                        time: d[0]/1000,
                        open: parseFloat(d[1]),
                        high: parseFloat(d[2]),
                        low: parseFloat(d[3]),
                        close: parseFloat(d[4])
                    }
                });
                candleSeries.setData(cdata);
                console.log("Binance Static Kline REST API called with fetch()");
            })
            .catch(err => console.log(err))
        // If fetch api gives CORS issue, use a node proxy

        // Fetch live data from Binance WS API
        ws.onmessage = evt => {
            const data = JSON.parse(evt.data);
            console.log(data);
            const chartData = {
                time: data.k.t,
                open: data.k.o,
                high: data.k.h,
                low: data.k.l,
                close: data.k.c
            }
            candleSeries.update(chartData);
        }
    }

    return <div ref={chartRef} />;
}

export default Graph;