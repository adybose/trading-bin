const api = require('binance');
const express = require('express');

const app = express();
const server = app.listen('4000', () => console.log('Kline data socket server running on port 4000...'));

const socket = require('socket.io');
const io = socket(server, {
    cors: {
        origin: '*',
    }
});

/*
 * WebSocket API
 *
 * Each call to onXXXX initiates a new websocket for the specified route, and calls your callback with
 * the payload of each message received.  Each call to onXXXX returns the instance of the websocket
 * client if you want direct access(https://www.npmjs.com/package/ws).
 */
const binanceWS = new api.BinanceWS(true); // Argument specifies whether the responses should be beautified, defaults to true
 
// binanceWS.onDepthUpdate('BNBBTC', data => {
//     console.log(data);
// });

const bws = binanceWS.onKline('BTCUSDT', '1m', data => {
    // console.log(data);
    io.sockets.emit('KLINE', {
                        time: Math.round(data.kline.startTime/1000),
                        open: parseFloat(data.kline.open),
                        high: parseFloat(data.kline.high),
                        low: parseFloat(data.kline.low),
                        close: parseFloat(data.kline.close)
                        }
                    )
});
