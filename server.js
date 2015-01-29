    // liveLogger server
    // npm install -g connect serve-static socket.io http protractor
    // npm uninstall -g connect serve-static socket.io http protractor
    var pubsub = require('http').createServer(handler);
    var io = require('socket.io').listen(pubsub, {log:false, origins:'*:*'});

    var connect = require('connect');
    var serveStatic = require('serve-static');

    // Front End Runs Here
    // Load via http://localhost:8880
    // Logger Listens Here on this address
    connect().use(serveStatic(__dirname)).listen(8880);
    console.log("Started Frontend on port 8880");
    console.log("Connect your WebSocket logging facility to port 8088");
    pubsub.listen(8088);

    function handler (req, res) {
        res.writeHead(200, {'Access-Control-Allow-Origin' : '*'});
        res.end();
    }

    io.sockets.on('connection', function (socket) {

        console.log('FrontEnd connection from: ' + socket.handshake.headers.host);

        socket.on('action', function (data) {
            console.log(socket.handshake.headers.host, 'action:' + data);
            socket.emit('action', data);
        });

        socket.on('command', function (data) {
            console.log(socket.handshake.headers.host, 'command:' + data);
            socket.emit('command', data);
        });

        socket.on('test', function (data) {
            console.log(socket.handshake.headers.host, 'test:' + data);
            socket.emit('log', {host:"localhost", log: "Response From Backend", caller: "AngularJS"});
        });

        socket.on('log', function (data) {
            console.log(socket.handshake.headers.host, 'log:' + data);
            socket.broadcast.emit('log', {host:"localhost", log:data, caller: "AngularJS"});
        });

    });
