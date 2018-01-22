var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis').createClient({redis_url:'redis://127.0.0.1:6379'});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

redis.on('message', function(channel, message){
	var info = JSON.parse(message);
	io.sockets.emit(channel, info);
});

redis.subscribe('chat');

http.listen(8000, function(){
  console.log('listening on *:8000');
});
