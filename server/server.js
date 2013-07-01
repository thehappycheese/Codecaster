/* Code examples:

fileList = libFs.readdirSync(folder);
var con = request.accept(null, request.origin);
con.on('close', (function(libConnectection){
this.con.on('message', (function(message){
	message.utf8Data
}).bind(this));
con.sendUTF(str);
*/

var WebSocketServer 	= require('websocket').server;
var libConnect 				= require('connect');
var libFs 						= require("fs");

var server = {};
server.files = [];
server.filecnt = 0;

server.clients = [];
server.clientcnt = 0;

// USE THE 'CONNECT' LIBRARY TO CREATE A BASIC HTTP SERVER -----------------------
//
server.httpServer = libConnect.createServer(libConnect.static("U:\\Nicholas Archer\\GitHub\\Codecaster 2\\client\\",{redirect:"index.htm"})).listen(80);

// USE THE 'WEBSOCKET' LIBRARY TO AUGMENT THE SERVER -----------------------------
server.wsServer = new WebSocketServer({httpServer: server.httpServer});




// HANDLE CLIENT INITIATED EVENTS ------------------------------------------------------


server.wsServer.on('request', function(request) {
	//console.log("cc "+(server.clientcnt)+":");
	var newClient = new Client(request.accept(null, request.origin),server.clientcnt++); 
	server.clients.push(newClient);
	updateClients();
});

// HANDLE INCOMMING COMMANDS ---------------------------------------------------------
server.clearDeadClients = function(){
	for(var i=0; i<server.clients.length; i++){
		if(server.clients[i].open==false){
			server.clients.splice(i,1);
			i--;
		}
	}
	updateClients();
}
server.broadcast = function(eventName, eventData,except){
	if(except==undefined){
		except={id:null};
	}
	for(var i = 0; i < server.clients.length;i++){
		if(server.clients[i].id!=except.id){
			server.clients[i].send(eventName,eventData);
		}
	}
}
server.openFile = function(path){
	// check that file is not already open:
	for(var i = 0; i <server.files.length;i++){
		if(path==server.files[i].name){
			console.log("Error: File is already open!");
			return;
		}
	}
	var file = libFs.readFile(path,"utf8",function(err,data){
		if(err){
			console.log(err);
		}else{
			server.files.push({name:path,id:server.filecnt,data:data});
			updateFiles()
			server.broadcast("addFile",{name:path,id:server.filecnt++,data:data});
		}
	});
}
server.closeFile = function(id){
	for(var i=0; i<server.files.length; i++){
		if(server.files[i].id == id){
			console.log("File Closed: " + server.files[i].name);
			server.files.splice(i,1);
			updateFiles()
			break;
		}
	}
	
}
server.replaceFile = function(e){
	for(var i = 0;i<server.files.length;i++){
		if(e.id==server.files[i].id){
			server.files[i].data = e.data;
			break;
		}
	}
}
