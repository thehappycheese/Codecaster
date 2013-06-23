/* Code examples:

fileList = libFs.readdirSync(folder);
var con = request.accept(null, request.origin);
con.on('close', (function(libConnectection){
this.con.on('message', (function(message){
	message.utf8Data
}).bind(this));
con.sendUTF(str);
*/
var WebSocketServer = require('websocket').server;
var libConnect 	= require('connect');
var libFs 		= require("fs");

var server = {};
server.files = [];
server.idcnt = 0;

// USE THE 'CONNECT' LIBRARY TO CREATE A BASIC HTTP SERVER -----------------------
server.httpServer = libConnect.createServer(libConnect.static(__dirname)).listen(80);

// USE THE 'WEBSOCKET' LIBRARY TO AUGMENT THE SERVER -----------------------------
server.wsServer = new WebSocketServer({httpServer: server.httpServer});




// HANDLE CLIENT INITIATED EVENTS ------------------------------------------------------
server.clients = [];
server.clientcnt = 0;
server.wsServer.on('request', function(request) {
	console.log("User Connected");
	
	var newClient = request.accept(null, request.origin) 
	newClient.id = server.clientcnt++;
	// ---------- ON CLOSE
	newClient.on("close",(function (e){
		console.log("Closed: "+e);
	}).bind(newClient));
	// ---------- ON MESSAGE
	newClient.on("message"	,(function (e){
		try{
			var evt = JSON.parse(e.utf8Data);
			evt.d.client = this;
			events[evt.f](evt.d);
		}catch(err){
			console.log("Client Text: "+e.utf8Data);
		}
	}).bind(newClient));
	// ---------- ON ERROR
	newClient.on("error"		,(function (e){
		console.log("Error: "+e+" client id: "+this.id);
	}).bind(newClient));
	
	server.clients.push(newClient);
	
});
server.openFile = function(path){
	var file = libFs.readFile(path,"utf8",function(err,data){
		if(err){
			console.log(err);
		}else{
			server.files.push({name:path,id:server.idcnt,data:data});
			server.sendEvent(null,"takeFile",{name:path,id:server.idcnt++,data:data});
		}
	});
}

// HANDLE CONSOLE INPUT ----------------------------------------------------------
process.stdin.resume();
process.stdin.setEncoding('utf8');// libFs.existsSync(
process.stdin.on('data', function (chunk) {
	filename = chunk.slice(1,chunk.length-3);
	server.openFile(filename);
});

// HANDLE INCOMMING COMMANDS ---------------------------------------------------------

server.sendEvent(user,eventName, eventData){
	if(user==null){
		for(var i = 0; i < server.clients.length;i++){
			server.clients[i].sendUTF(JSON.stringify({f:eventName,d:eventData}));
		}
	}else{
		user.sendUTF(JSON.stringify({f:eventName,d:eventData}));
	}
}

// SERVER STATE MACHINE --------------------------------------------------------------


// CLIENT EVENTS
var events = [];
events.modifyFile 	= function(e){
	//e.id
	//e.diffData
	console.log("TODO: modifyFile");
}
events.replaceFile 	= function(e){
	//e.id
	//e.data
	console.log("TODO: replaceFile");
}
events.closeFile 	= function(e){
	//e.id
	console.log(e);
	for(var i=0; i<server.files.length; i++){
		server.files[i].id == e.id;
		server.files.splice(i,1);
		console.log("File Closed: " + server.files[i].name);
	}
	
}
events.saveFile 	= function(e){
	// TODO: use diff algorithim
}
events.refreshMe 	= function(e){
	// TODO: use diff algorithim
	e.client.sendUTF("FUCK YOU!"+e.id)
}




