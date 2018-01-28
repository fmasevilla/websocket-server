var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis').createClient({redis_url:'redis://127.0.0.1:6379'});
var got = require('got');

app.get('/sucket', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

redis.on('message', function(channel, message){
	var info = JSON.parse(message);
	if (channel === 'chat') {
		var new_channel = (channel + "/" + info["message"]["chat_channel_id"]);
		io.sockets.emit(new_channel, info);
	} else if (channel === 'now')  {
		var new_channel = (channel + "/" + info["student_id"]);
		io.sockets.emit(new_channel, info);
	}
});

redis.subscribe('chat');
redis.subscribe('now');

http.listen(8081, function(){
  console.log('listening on *:8081');
});
