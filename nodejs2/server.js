var WebSocketServer = require('websocket').server;
var http = require('http');
var funk = require('./serfunk.js');

// Create standard http server
var server = http.createServer(function(request, response) {});
server.listen(9999, function() {});

// Use library to implement it into a websocket server
wsServer = new WebSocketServer({httpServer: server});
wsServer.on('request', function(request) {
	funk.onopen(request)
});


//handle console input
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
	process.stdout.write('data: ' + chunk);
	if(cnn){
		cnn.sendUTF(chunk);
	}
});