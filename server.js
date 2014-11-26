var app = require('http').createServer(handler),
io = require('socket.io').listen(app, {log:false, origins:'*:*'});

app.listen(8888);


function handler (req, res) {
  res.writeHead(200, {'Access-Control-Allow-Origin' : '*'});
  res.end();
}

io.sockets.on('connection', function (socket) {
  var addr = socket.handshake.address;
  socket.emit('connected');
  console.log('connection from: ' + addr.address);

  socket.on('action', function (data) {
    console.log('action:' + data);
    socket.broadcast.emit('action', data);
  });

  socket.on('command', function (data) {
    console.log('command:' + data);
    socket.broadcast.emit('command', data);
  });


  socket.on('log', function (data) {
    console.log('log:' + data);
    socket.broadcast.emit('log', data);
  });


});
