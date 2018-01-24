var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis').createClient({redis_url:'redis://127.0.0.1:6379'});
var got = require('got');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
//   socket.on('chat', function(msg){
//   	console.log('message: ' + data["message"]);
//     console.log('auth_token: ' + data["auth_token"]);
//     console.log('chat_channel_id: ' + data["chat_channel_id"]);
//   	sendMessage(msg);
//   });
});

redis.on('message', function(channel, message){
	var info = JSON.parse(message);
	var new_channel = (channel + "/" + info["chat_channel_id"]);
	console.log("info: " + info["chat_channel_id"]);
	console.log("channel: " + channel);
	io.sockets.emit(new_channel, info);
});

redis.subscribe('chat');

http.listen(8081, function(){
  console.log('listening on *:8081');
});
