const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:3000' }));
app.get('/', (req, res) => res.send('ok'));

function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
