let express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		port = process.env.port || 3000,
		jobQueue = [	{ guid : '75632464-4b89-4919-af69-da0662140525', jobTitle : 'qqq', jobDescription : 'www', phase : 'firstPhase' },
									{ guid : 'e29890e5-d669-455b-9b93-04c21ba3ea32', jobTitle : 'eee', jobDescription : 'rrr', phase : 'progressPhase' },
									{ guid : '832ab2c6-ad71-47b8-99e3-73ba028b28fa', jobTitle : 'zz', jobDescription : 'xx', phase : 'progressPhase' }];

server.listen(port, function(){
	console.log('Listening port: ' + port);
});

app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on("connection", function(socket){
	console.log('Socket open');
	
	socket.emit('welcome', jobQueue);
	console.log(jobQueue);
	socket.on("newJob", function(data){
		//console.log(data);
		jobQueue.push(data);
		io.emit("addNewJob", data);
	});
	
	socket.on('updateJobPhase', function(data){
		objIndex = jobQueue.findIndex(obj => obj.guid == data.jobGuid);
		jobQueue[objIndex].phase = data.phaseName;
		
		io.emit("sendUpdatedJobPhase", jobQueue[objIndex]);
	});
	
});