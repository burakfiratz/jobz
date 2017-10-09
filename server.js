let express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		port = process.env.port || 3000,
		jobQueue = [],
		phaseCount = [	{ phase:'firstPhase', count:0 }, 
										{ phase:'progressPhase', count:0 }, 
										{ phase:'donePhase', count:0 }];
		
server.listen(port, function(){
	console.log('Listening port: ' + port);
});

app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on("connection", function(socket){
	console.log('Socket open');
	
	welcome();
	
	console.log(jobQueue);
	socket.on("newJob", function(data){
		//console.log(data);
		jobQueue.push(data);
		io.emit("addNewJob", data);
		updatePhaseCount()
	});
	
	socket.on('updateJobPhase', function(data){
		objIndex = jobQueue.findIndex(obj => obj.guid == data.jobGuid);
		jobQueue[objIndex].phase = data.phaseName;
		
		io.emit("sendUpdatedJobPhase", jobQueue[objIndex]);
		updatePhaseCount();
	});
	
	function welcome(){
		socket.emit('welcome', jobQueue);
		updatePhaseCount();
	}
	
	function updatePhaseCount(){
		phaseCount = [	{ phase: 'firstPhase', count: jobQueue.filter(obj => obj.phase === 'firstPhase').length }, 
										{ phase: 'progressPhase', count: jobQueue.filter(obj => obj.phase === 'progressPhase').length }, 
										{ phase: 'donePhase', count: jobQueue.filter(obj => obj.phase === 'donePhase').length } ];
		io.emit("updatePhaseCount", phaseCount);
	}
	
});