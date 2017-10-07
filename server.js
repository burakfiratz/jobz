let express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		port = process.env.port || 3000,
		jobQueue = [ { jobTitle : 'zz', jobDescription : 'xx' } ];

server.listen(port, function(){
	console.log('Listening port: ' + port);
});

app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on("connection", function(socket){
	console.log('Socket open');
	
	socket.on("newJob", function(data){
		//console.log(data);
		jobQueue.push(data);
		io.emit("addNewJob", data);
	});
	
});