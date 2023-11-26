const { createAdapter } = require('@socket.io/redis-streams-adapter');
const { createClient } = require('redis');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const { Server } = require('socket.io');
const cors = require('cors');
const redis = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
})
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3000' }));
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
    socket.broadcast.emit('drawing', data);
  });
}

redis.connect().then(() => {
  const io = new Server(http, {
    adapter: createAdapter(redis),
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    },
    cors: {
      origin: 'http://localhost:3000',
      methods: ["GET", "POST"]
    }
  });
  io.on('connection', onConnection);
  process.on('SIGTERM', () => io.close());
});

http.listen(port, () => console.log('listening on port ' + port));
