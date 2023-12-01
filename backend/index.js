const { createAdapter } = require('@socket.io/redis-streams-adapter');
const { createClient } = require('redis');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const { Server } = require('socket.io');
const redis = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
})
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('ok'));

function onConnection(socket) {
  console.log(`Socket is connected`, {
    data: socket.data,
    recovered: socket.recovered,
  });
  socket.on('disconnect', () => {
    console.log('Socket is disconnected');
  });
  socket.on('drawing', (data) => {
    console.log('Socket is broadcasting drawing data', data);
    socket.broadcast.emit('drawing', { ...data, color: socket.data.color });
  });
  socket.on('colorUpdate', (data) => {
    console.log('Socket is saving color', data);
    socket.data.color = data.color;
  });
}

redis.connect().then(() => {
  console.log('Redis is connected');
  const io = new Server(http, {
    adapter: createAdapter(redis),
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });
  io.use((socket, next) => {
    socket.data.color = 'black';
    next();
  });
  io.on('connection', onConnection);
  process.on('SIGTERM', () => {
    console.log('Shutting down')
    io.close(() => console.log('SocketIO server closed'));
  });
});

http.listen(port, () => console.log('listening on port ' + port));
