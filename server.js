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
server.filecnt = 0;

server.clients = [];
server.clientcnt = 0;

// USE THE 'CONNECT' LIBRARY TO CREATE A BASIC HTTP SERVER -----------------------
server.httpServer = libConnect.createServer(libConnect.static(__dirname)).listen(80);

// USE THE 'WEBSOCKET' LIBRARY TO AUGMENT THE SERVER -----------------------------
server.wsServer = new WebSocketServer({httpServer: server.httpServer});




// HANDLE CLIENT INITIATED EVENTS ------------------------------------------------------


server.wsServer.on('request', function(request) {
	console.log("User Connected");
	
	var newClient = new Client(request.accept(null, request.origin),server.clientcnt++); 
	
	server.clients.push(newClient);
	
});

// HANDLE CONSOLE INPUT ----------------------------------------------------------
process.stdin.resume();
process.stdin.setEncoding('utf8');// libFs.existsSync(
process.stdin.on('data', function (chunk) {
	filename = chunk.slice(1,chunk.length-3);
	server.openFile(filename);
});

// HANDLE INCOMMING COMMANDS ---------------------------------------------------------
server.clearDeadClients = function(){
	for(var i=0; i<server.clients.length; i++){
		if(server.clients[i].open==false){
			server.clients.splice(i,1);
			i--;
		}
	}
	console.log("Number of clients: "+server.clients.length);
}
server.broadcast = function(eventName, eventData,except){
	if(except==undefined){
		except={id:null};
	}
	console.log("Broadcasting to all users except: "+except.id);	
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
			server.broadcast("takeFile",{name:path,id:server.filecnt++,data:data});
		}
	});
}
server.closeFile = function(id){
	for(var i=0; i<server.files.length; i++){
		if(server.files[i].id == id){
			console.log("File Closed: " + server.files[i].name);
			server.files.splice(i,1);
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

// SERVER STATE MACHINE --------------------------------------------------------------


// CLIENT CLASS -------------------------------------------------------------
function Client(a_con,a_id){
	this.id = a_id;
	this.con = a_con;
	this.open = true;
	
	
	
	// CONNECTION EVENTS
	this.con.on("close",(function (e){
		console.log("Client Closed: "+e+" id:"+this.id);
		this.open = false;
		server.clearDeadClients();
	}).bind(this));
	
	
	this.con.on("message"	,(function (e){
		try{
			var evt = JSON.parse(e.utf8Data);
		}catch(err){
			console.log("Client Text: "+e.utf8Data);
			return;
		}
		try{
			var func = this[evt.f];
			if(typeof func != "function"){
				throw new Error("");
			}
		}catch(err){
			console.log("Client Tried to call non-existant function: "+evt.f);
			return;
		}
		func(evt.d);
	}).bind(this));
	
	
	this.con.on("error"		,(function (e){
		console.log(e+" id: "+this.id);
	}).bind(this));
	
	
	
	
	// UTILITY FUNCTIONS --------------------------------
	this.send = (function(f,d){
		this.con.sendUTF(JSON.stringify({f:f,d:d}))
	}).bind(this);
	
	
	
	
	// STATE MODIFIERS ---------------------------------
	this.modifyFile 	= function(e){
		//e.id
		//e.diffData
		console.log("TODO: modifyFile");
	}
	
	
	this.replaceFile 	= function(e){
		//e.id
		//e.data
		server.replaceFile(e);
		server.broadcast("replaceFile",{id:e.id,data:e.data},this);
	}
	
	
	this.closeFile 	= function(e){
		//e.id
		server.closeFile(e.id);
		server.broadcast("closeFile",e.id,this);
	}
	
	
	this.saveFile 	= function(e){
		// TODO: use diff algorithim
	}
	
	
	this.refreshMe 	= (function(e){
		// TODO: use diff algorithim
		console.log("Refresh request from client id: " + this.id);
		this.send("cleanClient","");
		for(var i = 0;i<server.files.length;i++){
			this.send("takeFile",server.files[i]);
		}
	}).bind(this);
	
	
	this.thereisnospoon = (function(e){
		server.broadcast("rickRoll","",this);
	}).bind(this);
}




