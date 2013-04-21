var WebSocketServer = require('websocket').server;
var funk = require('./serfunk.js');
var conn = require('connect');


var options = {};
options.host = "134.7.210.145";
options.port = 80;

var server = conn.createServer(options,conn.static(__dirname+"/../")).listen(80);

// Use library to implement it into a websocket server
wsServer = new WebSocketServer({httpServer: server});

wsServer.on('request', function(request) {
	funk.addUser(request)
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